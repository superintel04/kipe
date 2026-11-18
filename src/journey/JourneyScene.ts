import * as THREE from 'three'
import { buildCity, RUNWAY_Z, type City, type CityKind } from './cities'
import { createGlobe, createStars, type Globe, type LandMask, type LatLon } from './globe'
import { createPlane, type Plane } from './plane'
import { gridTexture } from './textures'
import {
  clamp01,
  easeInOut,
  lerp,
  locate,
  smoothstep,
  STOP_COUNT,
} from './timeline'

/**
 * The journey page's WebGL layer: one renderer, two scenes.
 *
 *  - globe  dark, the dotted Earth with the route drawn across it; the camera
 *           turns Hyderabad to face it and dives in
 *  - world  daylight, four cities laid out along x, a plane flying between
 *           runways, clouds in the gaps
 *
 * Everything is a pure function of scroll progress plus a clock for the
 * ambient motion (cars, propeller, pulses). With `animate: false` — the
 * reduced-motion path — the clock stays at zero, so the scene only moves when
 * the visitor scrolls it.
 */

export type JourneyStopGeo = LatLon & { city: CityKind }

/** Distance between cities in world units. */
const GAP = 300
/** Height the plane rests at on a runway (wheels on the strip). */
const REST_Y = 1.6
const CRUISE = 44
/** Where the plane parks, in a city's own x — clear of the card on the left. */
const PARK_X = 12

const SKY_VERTEX = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`
const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  varying vec3 vWorld;
  void main() {
    float h = normalize(vWorld).y;
    gl_FragColor = vec4(mix(uHorizon, uTop, smoothstep(-0.05, 0.6, h)), 1.0);
  }
`

type Pose = { position: THREE.Vector3; rotation: THREE.Euler }

export class JourneyScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly camera = new THREE.PerspectiveCamera(40, 1, 0.5, 4000)
  private readonly globeScene = new THREE.Scene()
  private readonly worldScene = new THREE.Scene()
  private readonly globe: Globe
  private readonly cities: City[] = []
  private readonly plane: Plane
  private readonly sun: THREE.DirectionalLight
  private readonly sky: THREE.Mesh
  private readonly animate: boolean

  private progress = 0
  private frame = 0
  private running = false
  private readonly born = performance.now()
  private introStart = 0
  private aspect = 1

  private readonly tmpTarget = new THREE.Vector3()
  private readonly tmpA = new THREE.Vector3()
  private readonly tmpB = new THREE.Vector3()
  private readonly qSpin = new THREE.Quaternion()
  private readonly qTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, 0))
  private readonly qY = new THREE.Quaternion()
  private readonly qFace: THREE.Quaternion

  constructor(
    canvas: HTMLCanvasElement,
    stops: JourneyStopGeo[],
    land: LandMask,
    options: { animate: boolean },
  ) {
    this.animate = options.animate

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    // ---- Globe scene ----------------------------------------------------------
    this.globeScene.background = new THREE.Color('#000000')
    this.globe = createGlobe(land, stops)
    this.globeScene.add(this.globe.group, createStars())
    this.qFace = this.globe.facing(stops[0])

    // ---- World scene ----------------------------------------------------------
    const horizon = new THREE.Color('#edf2f9')
    this.worldScene.fog = new THREE.Fog(horizon, 240, 760)

    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(1800, 32, 16),
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERTEX,
        fragmentShader: SKY_FRAGMENT,
        uniforms: {
          uTop: { value: new THREE.Color('#a9c6f2') },
          uHorizon: { value: horizon },
        },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    this.sky.renderOrder = -1
    this.worldScene.add(this.sky)

    // Far wider than the route, so its edge is always lost in the fog.
    const span = 6000
    const depth = 3000
    const grid = gridTexture()
    grid.repeat.set(span / 32, depth / 32)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(span, depth),
      new THREE.MeshLambertMaterial({ map: grid }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.set(GAP * (STOP_COUNT - 1) * 0.5, 0, 0)
    ground.receiveShadow = true
    this.worldScene.add(ground)

    this.worldScene.add(new THREE.HemisphereLight('#ffffff', '#c7cfdd', 1.9))
    this.sun = new THREE.DirectionalLight('#fff6e8', 1.7)
    this.sun.castShadow = true
    const small = Math.min(window.innerWidth, window.innerHeight) < 700
    this.sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048)
    const shadowCam = this.sun.shadow.camera
    shadowCam.left = shadowCam.bottom = -95
    shadowCam.right = shadowCam.top = 95
    shadowCam.near = 1
    shadowCam.far = 400
    this.sun.shadow.bias = -0.0006
    this.sun.shadow.normalBias = 0.4
    this.worldScene.add(this.sun, this.sun.target)

    stops.forEach((stop, index) => {
      const city = buildCity(stop.city)
      city.group.position.x = index * GAP
      this.worldScene.add(city.group)
      this.cities.push(city)
    })

    this.plane = createPlane()
    this.worldScene.add(this.plane.group)
    this.worldScene.add(this.buildClouds())

  }

  // ---- Public API -------------------------------------------------------------

  setProgress(p: number) {
    this.progress = clamp01(p)
    if (!this.running) this.render()
  }

  /** Restart the route draw-in — called when the loader lifts. */
  playIntro() {
    this.introStart = this.elapsed()
  }

  resize(width: number, height: number) {
    this.aspect = width / Math.max(height, 1)
    this.camera.aspect = this.aspect
    this.renderer.setSize(width, height, false)
    if (!this.running) this.render()
  }

  start() {
    if (this.running) return
    this.running = true
    const loop = () => {
      if (!this.running) return
      this.render()
      this.frame = requestAnimationFrame(loop)
    }
    this.frame = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.frame)
  }

  dispose() {
    this.stop()
    this.globe.dispose()
    this.cities.forEach((city) => city.dispose())
    this.plane.dispose()
    for (const scene of [this.globeScene, this.worldScene]) {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose?.()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach((m) => m.dispose())
        else material?.dispose?.()
      })
    }
    this.renderer.dispose()
  }

  private elapsed() {
    return (performance.now() - this.born) / 1000
  }

  // ---- Frame ------------------------------------------------------------------

  private render() {
    const time = this.animate ? this.elapsed() : 0
    const { segment, t } = locate(this.progress)

    if (segment.kind === 'globe' || segment.kind === 'dive') {
      this.renderGlobe(time, segment.kind === 'dive' ? t : 0, segment.kind === 'globe' ? t : 1)
      return
    }

    this.cities.forEach((city) => city.update(time))
    this.plane.update(time)

    const portrait = this.aspect < 1
    this.camera.fov = portrait ? 54 : 40
    this.camera.near = 0.5
    this.camera.far = 4000

    const camera = this.tmpA
    const target = this.tmpTarget
    let pose: Pose

    switch (segment.kind) {
      case 'reveal': {
        pose = this.restPose(0)
        const k = easeInOut(t)
        this.holdView(0, -0.22, camera, target)
        camera.set(
          lerp(-40, camera.x, k),
          lerp(300, camera.y, k),
          lerp(160, camera.z, k),
        )
        break
      }
      case 'hold': {
        pose = this.restPose(segment.stop)
        this.holdView(segment.stop, lerp(-0.22, 0.22, t), camera, target)
        break
      }
      case 'fly': {
        const from = segment.from
        pose = this.flightPose(from, t, true)
        this.blendFlight(from, t, pose.position, camera, target)
        break
      }
      case 'outro':
      default: {
        // The plane takes off once more and climbs out of Riyadh; the camera
        // stays put and turns to watch it go.
        const last = STOP_COUNT - 1
        pose = this.flightPose(last, t * 0.75, false)
        this.holdView(last, 0.22, camera, target)
        camera.y += easeInOut(t) * 20
        target.lerp(pose.position, easeInOut(smoothstep(0.05, 0.7, t)))
        break
      }
    }

    this.plane.group.position.copy(pose.position)
    this.plane.group.rotation.copy(pose.rotation)

    this.camera.position.copy(camera)
    this.camera.lookAt(target)
    this.camera.updateProjectionMatrix()
    this.sky.position.copy(this.camera.position)

    // Keep the shadow frustum on whatever we are looking at.
    const focus = segment.kind === 'fly' ? pose.position : target
    this.sun.target.position.set(focus.x, 0, focus.z)
    this.sun.position.set(focus.x + 70, 140, focus.z + 50)

    this.renderer.render(this.worldScene, this.camera)
  }

  private renderGlobe(time: number, dive: number, globeT: number) {
    // Draw the route in over the first couple of seconds after the loader.
    const sinceIntro = time - this.introStart
    const draw = this.animate ? smoothstep(0.3, 2.8, sinceIntro) : 1
    this.globe.setRoute(draw)
    this.globe.update(time)

    // Slow spin, starting with the route's longitudes in view.
    this.qY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-30) + time * 0.07)
    this.qSpin.copy(this.qTilt).multiply(this.qY)
    const turn = easeInOut(smoothstep(0, 0.7, dive))
    this.globe.group.quaternion.slerpQuaternions(this.qSpin, this.qFace, turn)

    // The globe sits clear of the hero copy — to the trailing side on wide
    // screens, above it on a phone — and comes back to centre for the dive.
    const wide = this.aspect > 1.15
    this.globe.group.position.set(wide ? 0.62 * (1 - turn) : 0, wide ? 0 : 0.55 * (1 - turn), 0)

    const start = this.aspect < 0.8 ? 5.4 : 4.3
    const distance =
      lerp(start, start - 0.25, smoothstep(0, 1, globeT)) -
      Math.pow(smoothstep(0.15, 1, dive), 1.6) * (start - 1.39)
    this.camera.fov = 34
    this.camera.near = 0.01
    this.camera.far = 200
    this.camera.position.set(0, 0, Math.max(distance, 1.06))
    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.globeScene, this.camera)
  }

  // ---- Poses and views ----------------------------------------------------------

  private cityX(index: number) {
    return index * GAP
  }

  private restPose(index: number): Pose {
    return {
      position: new THREE.Vector3(this.cityX(index) + PARK_X, REST_Y, RUNWAY_Z),
      rotation: new THREE.Euler(0, 0, 0),
    }
  }

  /** Overview of a city, slowly orbiting with `angle` (radians). */
  private holdView(index: number, angle: number, camera: THREE.Vector3, target: THREE.Vector3) {
    const portrait = this.aspect < 1
    const scale = portrait ? 1.18 : 1
    const radius = 138 * scale
    const height = 84 * scale
    const cx = this.cityX(index)
    // Looking at a point in front of the city lifts it up the frame, clear of
    // the card along the bottom; on wide screens it also nudges the city
    // toward the trailing side, away from the card.
    target.set(portrait ? cx : cx - 14, 8, portrait ? 40 : 20)
    camera.set(cx + Math.sin(angle) * radius, height, target.z + Math.cos(angle) * radius)
  }

  private flightPosition(from: number, t: number, land: boolean, out: THREE.Vector3) {
    const ax = this.cityX(from) + PARK_X
    const bx = this.cityX(from + 1) + PARK_X
    const s = t * t * (3 - 2 * t)
    const climb = smoothstep(0.1, 0.32, t)
    const descend = land ? 1 - smoothstep(0.68, 0.9, t) : 1
    const altitude = land ? CRUISE * climb * descend : (CRUISE + 60 * t) * climb
    out.set(
      lerp(ax, bx, s),
      REST_Y + altitude,
      RUNWAY_Z - Math.sin(Math.PI * Math.min(t, land ? 1 : 0.5)) * 42,
    )
    return out
  }

  private flightPose(from: number, t: number, land: boolean): Pose {
    const position = this.flightPosition(from, t, land, new THREE.Vector3())
    const ahead = this.flightPosition(from, Math.min(t + 0.01, 1), land, this.tmpB.clone())
    const behind = this.flightPosition(from, Math.max(t - 0.01, 0), land, this.tmpB.clone())
    const dir = ahead.clone().sub(behind)
    const horizontal = Math.hypot(dir.x, dir.z) || 1e-6
    const yaw = Math.atan2(-dir.z, dir.x)
    const pitch = THREE.MathUtils.clamp(Math.atan2(dir.y, horizontal), -0.35, 0.35)
    // Bank into the turn: compare heading a little ahead with a little behind.
    const ahead2 = this.flightPosition(from, Math.min(t + 0.03, 1), land, this.tmpB.clone())
    const yawAhead = Math.atan2(-(ahead2.z - position.z), ahead2.x - position.x)
    const bank = THREE.MathUtils.clamp((yawAhead - yaw) * 6, -0.45, 0.45)
    const onGround = position.y < REST_Y + 0.05
    return {
      position,
      rotation: new THREE.Euler(onGround ? 0 : -bank, onGround ? 0 : yaw, onGround ? 0 : pitch, 'YZX'),
    }
  }

  /** Hand the camera from one city's overview to a chase view and back. */
  private blendFlight(
    from: number,
    t: number,
    plane: THREE.Vector3,
    camera: THREE.Vector3,
    target: THREE.Vector3,
  ) {
    const portrait = this.aspect < 1
    // Slightly below and behind, so the plane is seen against sky and cloud.
    const chase = new THREE.Vector3(-34, 3, portrait ? 44 : 30).add(plane)
    const chaseTarget = new THREE.Vector3(22, 5, -8).add(plane)

    const holdCamera = new THREE.Vector3()
    const holdTarget = new THREE.Vector3()
    if (t < 0.5) this.holdView(from, 0.22, holdCamera, holdTarget)
    else this.holdView(from + 1, -0.22, holdCamera, holdTarget)

    const w = easeInOut(smoothstep(0, 0.28, t)) * (1 - easeInOut(smoothstep(0.72, 1, t)))
    camera.copy(holdCamera).lerp(chase, w)
    target.copy(holdTarget).lerp(chaseTarget, w)
  }

  // ---- Clouds -----------------------------------------------------------------------

  private buildClouds(): THREE.InstancedMesh {
    type Puff = { x: number; y: number; z: number; s: number }
    const puffs: Puff[] = []
    let seed = 42
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const cluster = (x: number, y: number, z: number, size: number) => {
      const count = 4 + Math.floor(random() * 4)
      for (let i = 0; i < count; i++) {
        puffs.push({
          x: x + (random() - 0.5) * 9 * size,
          y: y + (random() - 0.5) * 1.6 * size,
          z: z + (random() - 0.5) * 5 * size,
          s: (2.2 + random() * 2.6) * size,
        })
      }
    }

    // In the gaps between cities, around the flight path.
    for (let i = 0; i < STOP_COUNT - 1; i++) {
      for (let c = 0; c < 10; c++) {
        cluster(
          this.cityX(i) + 80 + random() * (GAP - 160),
          24 + random() * 30,
          RUNWAY_Z - 40 + (random() - 0.5) * 140,
          0.8 + random() * 0.8,
        )
      }
    }
    // Sky for the last climb out of Riyadh.
    for (let c = 0; c < 12; c++) {
      cluster(
        this.cityX(STOP_COUNT - 1) + 60 + random() * 320,
        40 + random() * 70,
        RUNWAY_Z - 120 + random() * 160,
        1 + random(),
      )
    }
    // A deck over the first city for the camera to descend through.
    for (let c = 0; c < 16; c++) {
      cluster(-110 + random() * 220, 130 + random() * 40, -40 + random() * 200, 1.4 + random())
    }

    const mesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshLambertMaterial({
        color: '#ffffff',
        emissive: '#dfe8f7',
        emissiveIntensity: 0.45,
        flatShading: true,
      }),
      puffs.length,
    )
    const matrix = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    puffs.forEach((puff, index) => {
      matrix.compose(
        new THREE.Vector3(puff.x, puff.y, puff.z),
        q,
        new THREE.Vector3(puff.s, puff.s * 0.62, puff.s),
      )
      mesh.setMatrixAt(index, matrix)
    })
    return mesh
  }
}
