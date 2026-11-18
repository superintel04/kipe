import * as THREE from 'three'
import { dotTexture } from './textures'

/**
 * The dotted Earth used twice on the journey page: as the hero the camera
 * dives into, and as the backdrop to "Let's connect".
 *
 * Land is a 512×256 equirectangular mask (src/assets/land-mask.png, rasterised
 * from Natural Earth's public-domain 110m land polygons). Points are spread
 * evenly over the sphere and kept only where the mask says land, so the
 * continents read as a field of light rather than a texture.
 */

export type LatLon = { lat: number; lon: number }

/** lon 0 faces +z, north is +y — the convention every caller shares. */
export function latLonToVector(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(lat)
  const lambda = THREE.MathUtils.degToRad(lon)
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda),
  )
}

export type LandMask = (lat: number, lon: number) => boolean

const landCache = new Map<string, Promise<LandMask>>()

/** Decoded once per URL — the hero and the closing globe share it. */
export function loadLandMask(src: string): Promise<LandMask> {
  let pending = landCache.get(src)
  if (!pending) {
    pending = decodeLandMask(src)
    landCache.set(src, pending)
    pending.catch(() => landCache.delete(src))
  }
  return pending
}

function decodeLandMask(src: string): Promise<LandMask> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      const element = document.createElement('canvas')
      element.width = image.naturalWidth
      element.height = image.naturalHeight
      const context = element.getContext('2d', { willReadFrequently: true })
      if (!context) {
        reject(new Error('2D canvas unavailable'))
        return
      }
      context.drawImage(image, 0, 0)
      const { data, width, height } = context.getImageData(
        0,
        0,
        element.width,
        element.height,
      )
      resolve((lat, lon) => {
        const x = Math.min(width - 1, Math.floor(((lon + 180) / 360) * width))
        const y = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height))
        return data[(y * width + x) * 4] > 127
      })
    }
    image.onerror = () => reject(new Error('Land mask failed to load'))
    image.src = src
  })
}

const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 world = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-world.xyz);
    gl_Position = projectionMatrix * world;
  }
`

/** Dark body with a blue rim, so the sphere has an edge before any dot loads. */
const BODY_FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
    gl_FragColor = vec4(mix(uBase, uRim, rim), 1.0);
  }
`

/** Soft atmosphere just outside the body, drawn from the back faces. */
const HALO_FRAGMENT = /* glsl */ `
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Back faces: the normal turns toward the viewer near the body's edge
    // and away at the halo's own silhouette, so this fades outward.
    float glow = pow(clamp(-dot(vNormal, vView), 0.0, 1.0), 1.8);
    gl_FragColor = vec4(uRim, glow * 0.75);
  }
`

export type Globe = {
  group: THREE.Group
  /** 0–1: how much of the route is drawn. */
  setRoute(amount: number): void
  /** Spin, pulses. `time` in seconds; pass a constant to hold still. */
  update(time: number): void
  /** Rotation that brings a point on the surface to face the camera (+z). */
  facing(point: LatLon): THREE.Quaternion
  dispose(): void
}

export function createGlobe(
  land: LandMask,
  stops: LatLon[],
  options: { dots?: number; dotSize?: number; dotColor?: string } = {},
): Globe {
  const { dots = 18000, dotSize = 0.018, dotColor = '#d6e2ff' } = options
  const group = new THREE.Group()
  const disposables: { dispose(): void }[] = []

  // ---- Body and atmosphere ------------------------------------------------
  const bodyGeometry = new THREE.SphereGeometry(0.995, 64, 48)
  const bodyMaterial = new THREE.ShaderMaterial({
    vertexShader: RIM_VERTEX,
    fragmentShader: BODY_FRAGMENT,
    uniforms: {
      uBase: { value: new THREE.Color('#05081a') },
      uRim: { value: new THREE.Color('#2a65fe') },
    },
  })
  group.add(new THREE.Mesh(bodyGeometry, bodyMaterial))

  const haloGeometry = new THREE.SphereGeometry(1.12, 64, 48)
  const haloMaterial = new THREE.ShaderMaterial({
    vertexShader: RIM_VERTEX,
    fragmentShader: HALO_FRAGMENT,
    uniforms: { uRim: { value: new THREE.Color('#4d7dff') } },
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  group.add(new THREE.Mesh(haloGeometry, haloMaterial))
  disposables.push(bodyGeometry, bodyMaterial, haloGeometry, haloMaterial)

  // ---- Land dots (Fibonacci sphere, filtered by the mask) -----------------
  const positions: number[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < dots; i++) {
    const y = 1 - (i / (dots - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * i
    const x = Math.cos(theta) * radius
    const z = Math.sin(theta) * radius
    const lat = THREE.MathUtils.radToDeg(Math.asin(y))
    const lon = THREE.MathUtils.radToDeg(Math.atan2(x, z))
    if (land(lat, lon)) positions.push(x * 1.002, y * 1.002, z * 1.002)
  }
  const dotGeometry = new THREE.BufferGeometry()
  dotGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  const sprite = dotTexture()
  const dotMaterial = new THREE.PointsMaterial({
    size: dotSize,
    map: sprite,
    color: dotColor,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  })
  group.add(new THREE.Points(dotGeometry, dotMaterial))
  disposables.push(dotGeometry, dotMaterial, sprite)

  // ---- City pins ------------------------------------------------------------
  const pinGeometry = new THREE.SphereGeometry(0.014, 12, 8)
  const pinMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' })
  const ringGeometry = new THREE.RingGeometry(0.02, 0.026, 40)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: '#6f97ff',
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  disposables.push(pinGeometry, pinMaterial, ringGeometry, ringMaterial)

  const rings: THREE.Mesh[] = []
  for (const stop of stops) {
    const at = latLonToVector(stop.lat, stop.lon, 1.004)
    const pin = new THREE.Mesh(pinGeometry, pinMaterial)
    pin.position.copy(at)
    group.add(pin)

    const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone())
    ring.position.copy(at)
    ring.lookAt(at.clone().multiplyScalar(2))
    group.add(ring)
    rings.push(ring)
    disposables.push(ring.material as THREE.Material)
  }

  // ---- Route arcs -----------------------------------------------------------
  const arcMaterial = new THREE.MeshBasicMaterial({
    color: '#8fb0ff',
    transparent: true,
    opacity: 0.95,
  })
  disposables.push(arcMaterial)
  const arcs: { mesh: THREE.Mesh; count: number }[] = []

  for (let i = 0; i < stops.length - 1; i++) {
    const a = latLonToVector(stops[i].lat, stops[i].lon)
    const b = latLonToVector(stops[i + 1].lat, stops[i + 1].lon)
    const angle = a.angleTo(b)
    const lift = 0.06 + (angle / Math.PI) * 0.42
    const points: THREE.Vector3[] = []
    for (let s = 0; s <= 64; s++) {
      const t = s / 64
      // Spherical interpolation, lifted off the surface in the middle.
      const p = new THREE.Vector3()
        .copy(a)
        .multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle))
        .add(b.clone().multiplyScalar(Math.sin(t * angle) / Math.sin(angle)))
      p.multiplyScalar(1.004 + Math.sin(Math.PI * t) * lift)
      points.push(p)
    }
    const curve = new THREE.CatmullRomCurve3(points)
    const geometry = new THREE.TubeGeometry(curve, 120, 0.0042, 6, false)
    disposables.push(geometry)
    const mesh = new THREE.Mesh(geometry, arcMaterial)
    group.add(mesh)
    arcs.push({ mesh, count: geometry.index ? geometry.index.count : 0 })
  }

  function setRoute(amount: number) {
    const perArc = 1 / Math.max(arcs.length, 1)
    arcs.forEach(({ mesh, count }, index) => {
      const local = THREE.MathUtils.clamp((amount - index * perArc) / perArc, 0, 1)
      // Indices run along the tube, so a draw range draws it from its start.
      const segments = Math.floor((count / 6 / 6) * local) * 6 * 6
      mesh.geometry.setDrawRange(0, segments)
      mesh.visible = local > 0
    })
  }
  setRoute(1)

  function update(time: number) {
    rings.forEach((ring, index) => {
      const phase = (time * 0.6 + index * 0.25) % 1
      ring.scale.setScalar(1 + phase * 2.2)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - phase)
    })
  }

  function facing(point: LatLon): THREE.Quaternion {
    const from = latLonToVector(point.lat, point.lon).normalize()
    return new THREE.Quaternion().setFromUnitVectors(from, new THREE.Vector3(0, 0, 1))
  }

  return {
    group,
    setRoute,
    update,
    facing,
    dispose() {
      disposables.forEach((item) => item.dispose())
    },
  }
}

/** A sparse star field for the dark scenes. */
export function createStars(count = 900): THREE.Points {
  const positions: number[] = []
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 30)
    positions.push(v.x, v.y, v.z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    size: 0.12,
    map: dotTexture(),
    color: '#9fb4e8',
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  })
  return new THREE.Points(geometry, material)
}
