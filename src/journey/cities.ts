import * as THREE from 'three'
import { flagTexture, type FlagKind } from './textures'

/**
 * The four miniature cities. Each is generated from the same street grid —
 * 16-unit blocks, roads in between — and given its identity by a ground
 * palette, a height profile, water where the real city has it, and one or two
 * landmarks modelled from primitives:
 *
 *   Hyderabad  Charminar, Hussain Sagar with its Buddha, HITEC City glass
 *   New York   Empire State, One World Trade, a park strip, the river, Liberty
 *   Doha       West Bay towers (Tornado, Doha Tower), the bay, dhows, MIA
 *   Riyadh     Kingdom Centre, Al Faisaliah, date palms
 *
 * Layout is seeded, so a city looks the same on every visit.
 */

export type CityKind = 'hyderabad' | 'new-york' | 'doha' | 'riyadh'

export type City = {
  group: THREE.Group
  /** Where the plane waits, in the city's own coordinates. */
  runway: THREE.Vector3
  /** Cars, flag, boats. `time` in seconds. */
  update(time: number): void
  dispose(): void
}

// ---- Grid -------------------------------------------------------------------

const SLAB = 12.6
const COLS = [-48, -32, -16, 0, 16, 32, 48]
const ROWS = [-48, -32, -16, 0, 16, 32]
const EXTENT = { minX: -56, maxX: 56, minZ: -56, maxZ: 40 }
export const RUNWAY_Z = 54

type Role = 'normal' | 'tower' | 'park' | 'plaza' | 'water' | 'empty'

type CityStyle = {
  road: string
  slab: string
  plaza: string
  palette: string[]
  glass: string[]
  heights: [number, number]
  towerHeights: [number, number]
  trees: 'round' | 'palm' | 'mixed'
  cars: string[]
  flag: FlagKind
  flagAt: [number, number]
  role(x: number, z: number): Role
  water?: { minX: number; maxX: number; minZ: number; maxZ: number }
}

const STYLES: Record<CityKind, CityStyle> = {
  hyderabad: {
    road: '#b3b6bd',
    slab: '#f3efe6',
    plaza: '#ecdcc0',
    palette: ['#f6f2ea', '#ece4d4', '#e5dccd', '#f9f9f7', '#dfd5c2', '#f1e3cf'],
    glass: ['#a8c7e6', '#bcd6ef', '#93b6dc'],
    heights: [2, 8],
    towerHeights: [12, 24],
    trees: 'mixed',
    cars: ['#f4c430', '#ffffff', '#d64545', '#3b6fd8', '#2e2e2e', '#4caf50'],
    flag: 'india',
    flagAt: [9, 9],
    water: { minX: -58, maxX: -24, minZ: -58, maxZ: -24 },
    role(x, z) {
      if (x === 0 && z === 0) return 'empty'
      if ((Math.abs(x) === 16 && z === 0) || (x === 0 && Math.abs(z) === 16)) return 'plaza'
      if (x <= -32 && z <= -32) return 'water'
      if (x >= 32 && z <= -32) return 'tower'
      if (x === 32 && z === 16) return 'park'
      return 'normal'
    },
  },
  'new-york': {
    road: '#9ea3ac',
    slab: '#eceef2',
    plaza: '#e3e1db',
    palette: ['#d9dbe0', '#c9ccd3', '#e8e3d9', '#bcc1ca', '#dcd6cb', '#cfc6b8'],
    glass: ['#9fb9d6', '#b4c9e0', '#8aa7c8'],
    heights: [7, 18],
    towerHeights: [18, 32],
    trees: 'round',
    cars: ['#f6c700', '#f6c700', '#f6c700', '#ffffff', '#2e2e2e', '#c0392b'],
    flag: 'usa',
    flagAt: [9, 9],
    water: { minX: 41, maxX: 110, minZ: -80, maxZ: 42 },
    role(x, z) {
      if (x === 0 && z === 0) return 'empty'
      if (x === -32 && z === -32) return 'empty'
      if (x === 48) return 'water'
      if (z === -48 && Math.abs(x) <= 16) return 'park'
      if (Math.abs(x) <= 16 && Math.abs(z) <= 16) return 'tower'
      return 'normal'
    },
  },
  doha: {
    road: '#b5b2aa',
    slab: '#f4eee2',
    plaza: '#efe2c8',
    palette: ['#f2ece0', '#e9dfcc', '#f7f4ee', '#ddd3c0', '#ece2d0'],
    glass: ['#8fb1cf', '#a5c3df', '#7f9bbd', '#9aa9d8'],
    heights: [3, 9],
    towerHeights: [18, 30],
    trees: 'palm',
    cars: ['#ffffff', '#ffffff', '#2e2e2e', '#8a1538', '#c7c7c7'],
    flag: 'qatar',
    flagAt: [-9, 9],
    water: { minX: -110, maxX: 110, minZ: -130, maxZ: -41 },
    role(x, z) {
      if (z === -48) return 'water'
      if (x === 16 && z === -32) return 'empty'
      if (x === 32 && z === -32) return 'empty'
      if (x === 0 && z === 0) return 'plaza'
      if (x >= 16 && z <= -16) return 'tower'
      if (z === -32 && x <= 0) return 'park'
      return 'normal'
    },
  },
  riyadh: {
    road: '#b9b2a4',
    slab: '#f0e7d6',
    plaza: '#ead9b8',
    palette: ['#efe6d4', '#e6dac2', '#f5efe4', '#dccfb6', '#e9dcc4'],
    glass: ['#9db3c8', '#b6c6d6', '#8aa2bb'],
    heights: [2, 7],
    towerHeights: [9, 18],
    trees: 'palm',
    cars: ['#ffffff', '#ffffff', '#2e2e2e', '#c7c7c7', '#8b6b47'],
    flag: 'saudi',
    flagAt: [10, 10],
    role(x, z) {
      if (x === 0 && z === 0) return 'empty'
      if (x === -32 && z === -16) return 'empty'
      if ((Math.abs(x) === 16 && z === 0) || (x === 0 && z === 16)) return 'plaza'
      if (x === 32 && z === 16) return 'park'
      if (x === -16 && z === 16) return 'park'
      if (Math.abs(x) <= 32 && z <= -16) return 'tower'
      return 'normal'
    },
  },
}

// ---- Seeded randomness --------------------------------------------------------

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---- Construction kit ---------------------------------------------------------

/** Collects meshes, caches materials by colour, and owns disposal. */
class Kit {
  readonly group = new THREE.Group()
  private readonly materials = new Map<string, THREE.MeshLambertMaterial>()
  private readonly disposables: { dispose(): void }[] = []

  material(color: string, extra: THREE.MeshLambertMaterialParameters = {}) {
    const key = color + JSON.stringify(extra)
    let found = this.materials.get(key)
    if (!found) {
      found = new THREE.MeshLambertMaterial({ color, ...extra })
      this.materials.set(key, found)
    }
    return found
  }

  track<T extends { dispose(): void }>(item: T): T {
    this.disposables.push(item)
    return item
  }

  mesh(
    geometry: THREE.BufferGeometry,
    color: string | THREE.Material,
    position: [number, number, number],
    options: { rotation?: [number, number, number]; shadow?: boolean; parent?: THREE.Object3D } = {},
  ): THREE.Mesh {
    this.track(geometry)
    const material = typeof color === 'string' ? this.material(color) : color
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    if (options.rotation) mesh.rotation.set(...options.rotation)
    const shadow = options.shadow ?? true
    mesh.castShadow = shadow
    mesh.receiveShadow = true
    ;(options.parent ?? this.group).add(mesh)
    return mesh
  }

  /** Box sitting on `y`, centred on x/z. */
  box(w: number, h: number, d: number, color: string, x: number, y: number, z: number, ry = 0) {
    return this.mesh(new THREE.BoxGeometry(w, h, d), color, [x, y + h / 2, z], {
      rotation: [0, ry, 0],
    })
  }

  /** Cylinder sitting on `y`. */
  cylinder(
    top: number,
    bottom: number,
    h: number,
    color: string,
    x: number,
    y: number,
    z: number,
    segments = 20,
    ry = 0,
  ) {
    return this.mesh(
      new THREE.CylinderGeometry(top, bottom, h, segments),
      color,
      [x, y + h / 2, z],
      { rotation: [0, ry, 0] },
    )
  }

  /** A square beam between two points — for lattices and frames. */
  beam(a: THREE.Vector3, b: THREE.Vector3, thickness: number, color: string) {
    const length = a.distanceTo(b)
    const mesh = this.mesh(
      new THREE.BoxGeometry(thickness, length, thickness),
      color,
      [0, 0, 0],
    )
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    )
    return mesh
  }

  material2(color: string, params: THREE.MeshStandardMaterialParameters) {
    return this.track(new THREE.MeshStandardMaterial({ color, ...params }))
  }

  dispose() {
    this.materials.forEach((material) => material.dispose())
    this.disposables.forEach((item) => item.dispose())
  }
}

// ---- Shared pieces --------------------------------------------------------------

type Lot = { x: number; z: number; w: number; d: number; h: number; color: string }

function buildingsInstanced(kit: Kit, lots: Lot[]) {
  const geometry = kit.track(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0))
  const material = kit.track(new THREE.MeshLambertMaterial({ color: '#ffffff' }))
  const mesh = new THREE.InstancedMesh(geometry, material, lots.length)
  const matrix = new THREE.Matrix4()
  const color = new THREE.Color()
  lots.forEach((lot, index) => {
    matrix.makeScale(lot.w, lot.h, lot.d).setPosition(lot.x, 0.3, lot.z)
    mesh.setMatrixAt(index, matrix)
    mesh.setColorAt(index, color.set(lot.color))
  })
  mesh.castShadow = true
  mesh.receiveShadow = true
  kit.group.add(mesh)
}

type TreeSpot = { x: number; z: number; s: number }

function treesInstanced(kit: Kit, spots: TreeSpot[], kind: 'round' | 'palm') {
  if (spots.length === 0) return
  const matrix = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const scale = new THREE.Vector3()
  const pos = new THREE.Vector3()

  if (kind === 'round') {
    const trunk = new THREE.InstancedMesh(
      kit.track(new THREE.CylinderGeometry(0.14, 0.2, 1, 6).translate(0, 0.5, 0)),
      kit.material('#8a6a4a'),
      spots.length,
    )
    const crown = new THREE.InstancedMesh(
      kit.track(new THREE.IcosahedronGeometry(1, 0)),
      kit.material('#6dbb5c', { flatShading: true }),
      spots.length,
    )
    spots.forEach((spot, i) => {
      matrix.compose(pos.set(spot.x, 0.3, spot.z), q.identity(), scale.set(1, 1.4 * spot.s, 1))
      trunk.setMatrixAt(i, matrix)
      matrix.compose(
        pos.set(spot.x, 0.3 + 1.4 * spot.s + 0.9 * spot.s, spot.z),
        q.identity(),
        scale.setScalar(1.15 * spot.s),
      )
      crown.setMatrixAt(i, matrix)
    })
    trunk.castShadow = crown.castShadow = true
    kit.group.add(trunk, crown)
    return
  }

  const FRONDS = 7
  const trunk = new THREE.InstancedMesh(
    kit.track(new THREE.CylinderGeometry(0.1, 0.17, 1, 6).translate(0, 0.5, 0)),
    kit.material('#9a7b55'),
    spots.length,
  )
  const frond = new THREE.InstancedMesh(
    kit.track(new THREE.BoxGeometry(0.34, 0.05, 1.7).translate(0, 0, 0.85)),
    kit.material('#4f9a52', { flatShading: true }),
    spots.length * FRONDS,
  )
  const euler = new THREE.Euler()
  spots.forEach((spot, i) => {
    const height = 3.2 * spot.s
    matrix.compose(pos.set(spot.x, 0.3, spot.z), q.identity(), scale.set(1, height, 1))
    trunk.setMatrixAt(i, matrix)
    for (let f = 0; f < FRONDS; f++) {
      euler.set(0.5, (f / FRONDS) * Math.PI * 2 + spot.s * 3, 0, 'YXZ')
      q.setFromEuler(euler)
      matrix.compose(pos.set(spot.x, 0.3 + height, spot.z), q, scale.setScalar(spot.s))
      frond.setMatrixAt(i * FRONDS + f, matrix)
    }
  })
  trunk.castShadow = frond.castShadow = true
  kit.group.add(trunk, frond)
}

type Car = {
  axis: 'x' | 'z'
  line: number
  lane: number
  from: number
  length: number
  offset: number
  speed: number
}

function carsInstanced(kit: Kit, cars: Car[], colors: string[], random: () => number) {
  const mesh = new THREE.InstancedMesh(
    kit.track(new THREE.BoxGeometry(1.5, 0.6, 0.78).translate(0, 0.3, 0)),
    kit.track(new THREE.MeshLambertMaterial({ color: '#ffffff' })),
    cars.length,
  )
  const color = new THREE.Color()
  cars.forEach((_, i) => mesh.setColorAt(i, color.set(colors[Math.floor(random() * colors.length)])))
  mesh.castShadow = true
  kit.group.add(mesh)

  const matrix = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const pos = new THREE.Vector3()
  const one = new THREE.Vector3(1, 1, 1)

  return (time: number) => {
    cars.forEach((car, i) => {
      const travelled = (car.offset + time * car.speed) % car.length
      const along = car.speed > 0 ? car.from + travelled : car.from + car.length + travelled
      if (car.axis === 'x') {
        pos.set(along, 0.06, car.line + car.lane)
        q.setFromAxisAngle(up, car.speed > 0 ? 0 : Math.PI)
      } else {
        pos.set(car.line + car.lane, 0.06, along)
        q.setFromAxisAngle(up, car.speed > 0 ? -Math.PI / 2 : Math.PI / 2)
      }
      matrix.compose(pos, q, one)
      mesh.setMatrixAt(i, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }
}

function flag(kit: Kit, kind: FlagKind, x: number, z: number) {
  kit.cylinder(0.09, 0.11, 10, '#d9d9d9', x, 0.3, z, 8)
  const geometry = kit.track(new THREE.PlaneGeometry(4.5, 3, 14, 2).translate(2.25, 0, 0))
  const texture = kit.track(flagTexture(kind))
  const material = kit.track(
    new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide }),
  )
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x + 0.1, 8.7, z)
  mesh.castShadow = true
  kit.group.add(mesh)

  const base = Float32Array.from(geometry.attributes.position.array as Float32Array)
  const position = geometry.attributes.position as THREE.BufferAttribute
  return (time: number) => {
    for (let i = 0; i < position.count; i++) {
      const px = base[i * 3]
      position.setZ(i, Math.sin(px * 1.3 - time * 4) * px * 0.09)
    }
    position.needsUpdate = true
  }
}

function runway(kit: Kit, style: CityStyle) {
  // Apron, strip, centre-line dashes and a small terminal.
  kit.box(112, 0.12, 22, '#e8eaee', 0, 0, RUNWAY_Z, 0).receiveShadow = true
  kit.box(104, 0.14, 7, '#8f949c', 0, 0, RUNWAY_Z, 0).receiveShadow = true
  for (let x = -46; x <= 46; x += 6) kit.box(3, 0.16, 0.3, '#ffffff', x, 0, RUNWAY_Z, 0)
  for (const side of [-1, 1]) {
    for (let i = -2; i <= 2; i++) kit.box(2.4, 0.16, 0.4, '#ffffff', side * 49, 0, RUNWAY_Z + i * 1.1, 0)
  }
  kit.box(14, 3.4, 6, '#dfe8f1', 34, 0, RUNWAY_Z + 8, 0)
  kit.box(14.6, 0.5, 6.6, style.road, 34, 3.4, RUNWAY_Z + 8, 0)
  kit.cylinder(0.8, 1, 7, '#e9e9e9', 44, 0, RUNWAY_Z + 8, 12)
  kit.cylinder(1.6, 1.2, 1.4, '#7ea6d0', 44, 7, RUNWAY_Z + 8, 12)
}

// ---- Landmarks ------------------------------------------------------------------

function charminar(kit: Kit, x: number, z: number) {
  const stone = '#e4cfa6'
  const shade = '#b99b6e'
  kit.box(13, 0.4, 13, '#ead9b8', x, 0.3, z)
  kit.box(8.6, 7, 8.6, stone, x, 0.7, z)
  // An arch on each face: a dark recess with a rounded head.
  const arch = new THREE.Shape()
  arch.moveTo(-1.9, 0)
  arch.lineTo(-1.9, 3.6)
  arch.absarc(0, 3.6, 1.9, Math.PI, 0, true)
  arch.lineTo(1.9, 0)
  arch.closePath()
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    kit.mesh(new THREE.ShapeGeometry(arch, 12), kit.material(shade, { side: THREE.DoubleSide }), [
      x + Math.sin(a) * 4.32,
      0.7,
      z + Math.cos(a) * 4.32,
    ], { rotation: [0, a, 0], shadow: false })
  }
  kit.box(9.4, 0.5, 9.4, stone, x, 7.7, z)
  kit.box(7.6, 2.2, 7.6, stone, x, 8.2, z)
  kit.box(8, 0.35, 8, stone, x, 10.4, z)
  for (const [dx, dz] of [[-4.3, -4.3], [4.3, -4.3], [-4.3, 4.3], [4.3, 4.3]]) {
    kit.cylinder(0.75, 0.85, 16.5, stone, x + dx, 0.7, z + dz, 12)
    for (const ring of [7.4, 10.6, 13.6]) kit.cylinder(1.05, 1.05, 0.3, stone, x + dx, ring, z + dz, 12)
    kit.mesh(new THREE.SphereGeometry(0.9, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), stone, [x + dx, 17.2, z + dz])
    kit.cylinder(0.02, 0.18, 1.4, '#c9a24a', x + dx, 18.1, z + dz, 6)
  }
}

function hussainSagarBuddha(kit: Kit, x: number, z: number) {
  kit.cylinder(2.6, 3, 0.8, '#d9cdb5', x, 0, z, 18)
  kit.box(1.6, 1.4, 1.6, '#cfcfcf', x, 0.8, z)
  kit.cylinder(0.55, 0.9, 3.4, '#f2f2f2', x, 2.2, z, 12)
  kit.mesh(new THREE.SphereGeometry(0.5, 12, 10), '#f2f2f2', [x, 6.1, z])
}

function empireState(kit: Kit, x: number, z: number) {
  const stone = '#d9d3c4'
  const tiers: [number, number, number][] = [
    [11, 6, 9],
    [8.4, 18, 6.6],
    [6.4, 8, 5],
    [4.6, 6, 3.8],
    [3, 3, 2.6],
    [2, 2.2, 1.8],
  ]
  let y = 0.3
  for (const [w, h, d] of tiers) {
    kit.box(w, h, d, stone, x, y, z)
    y += h
  }
  kit.cylinder(0.7, 0.9, 2, '#cfc8b6', x, y, z, 8)
  kit.cylinder(0.05, 0.3, 6, '#bdbdbd', x, y + 2, z, 6)
}

function oneWorldTrade(kit: Kit, x: number, z: number) {
  const glass = kit.material2('#9bbbdc', { metalness: 0.35, roughness: 0.25 })
  kit.box(7, 4, 7, '#c8d3df', x, 0.3, z)
  // Square plan tapering to a square rotated 45°: a 4-sided frustum.
  kit.mesh(new THREE.CylinderGeometry(2.4, 4.9, 34, 4), glass, [x, 4.3 + 17, z], {
    rotation: [0, Math.PI / 4, 0],
  })
  kit.cylinder(0.08, 0.25, 9, '#d0d0d0', x, 38.3, z, 6)
}

function statueOfLiberty(kit: Kit, x: number, z: number) {
  kit.cylinder(6, 6.4, 0.7, '#cfd6c4', x, 0, z, 10)
  kit.mesh(new THREE.CylinderGeometry(3.2, 3.6, 1.2, 10), '#bfa98a', [x, 1.3, z])
  kit.box(2.2, 3.8, 2.2, '#c9b597', x, 1.9, z)
  const copper = '#7fb5a0'
  kit.cylinder(0.55, 1.05, 4.2, copper, x, 5.7, z, 12)
  kit.mesh(new THREE.SphereGeometry(0.5, 12, 10), copper, [x, 10.4, z])
  kit.beam(new THREE.Vector3(x + 0.4, 8.8, z), new THREE.Vector3(x + 0.9, 12.4, z), 0.3, copper)
  kit.cylinder(0.32, 0.12, 0.7, '#e2b23c', x + 0.92, 12.3, z, 8)
}

function tornadoTower(kit: Kit, x: number, z: number) {
  // Hyperboloid: narrow waist, flared ends.
  const profile: THREE.Vector2[] = []
  const H = 30
  for (let i = 0; i <= 24; i++) {
    const y = (i / 24) * H
    const k = (y - H / 2) / (H / 2)
    profile.push(new THREE.Vector2(2.9 + 1.5 * k * k, y))
  }
  const glass = kit.material2('#7d79bf', { metalness: 0.3, roughness: 0.3 })
  kit.mesh(new THREE.LatheGeometry(profile, 28), glass, [x, 0.3, z])
  kit.mesh(new THREE.CircleGeometry(4.4, 28), glass, [x, H + 0.3, z], { rotation: [-Math.PI / 2, 0, 0] })
}

function dohaTower(kit: Kit, x: number, z: number) {
  const skin = kit.material2('#8ea6be', { metalness: 0.25, roughness: 0.45 })
  kit.mesh(new THREE.CylinderGeometry(3.2, 3.3, 28, 28), skin, [x, 14.3, z])
  kit.mesh(new THREE.SphereGeometry(3.2, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), skin, [x, 28.3, z], {
    rotation: [0, 0, 0],
  })
  kit.cylinder(0.1, 0.35, 6, '#cfcfcf', x, 31, z, 6)
}

function museumOfIslamicArt(kit: Kit, x: number, z: number) {
  const stone = '#ece2cd'
  kit.box(18, 0.6, 18, '#e3d8c2', x, 0, z)
  kit.box(10, 5, 10, stone, x, 0.6, z, Math.PI / 4)
  kit.box(7, 3, 7, stone, x, 5.6, z)
  kit.box(4.6, 2.6, 4.6, stone, x, 8.6, z, Math.PI / 4)
  kit.box(3, 1.6, 3, stone, x, 11.2, z)
  kit.mesh(new THREE.SphereGeometry(1.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), stone, [x, 12.8, z])
}

function dhow(kit: Kit, x: number, z: number, ry: number) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)
  group.rotation.y = ry
  kit.group.add(group)

  const hull = new THREE.Shape()
  hull.moveTo(-3, 1.2)
  hull.quadraticCurveTo(-2.2, 0, 0, 0)
  hull.lineTo(2, 0)
  hull.quadraticCurveTo(3.3, 0.4, 3.8, 1.5)
  hull.lineTo(-3, 1.2)
  const hullGeometry = new THREE.ExtrudeGeometry(hull, { depth: 1.6, bevelEnabled: false }).translate(0, 0, -0.8)
  kit.mesh(hullGeometry, '#8b5a2b', [0, 0, 0], { parent: group })
  kit.mesh(new THREE.CylinderGeometry(0.07, 0.09, 5.5, 6), '#6b4423', [0.2, 3.6, 0], { parent: group })
  const sail = new THREE.Shape()
  sail.moveTo(0, 0)
  sail.lineTo(-2.6, 0.4)
  sail.lineTo(0.3, 4.6)
  sail.closePath()
  kit.mesh(new THREE.ShapeGeometry(sail), kit.material('#fbf7ee', { side: THREE.DoubleSide }), [0.3, 1.5, 0.05], {
    parent: group,
  })
  return group
}

function kingdomCentre(kit: Kit, x: number, z: number) {
  // Side profile: tapering tower whose top third opens into an inverted
  // parabola, the two horns joined by the sky bridge.
  const outline = new THREE.Shape()
  outline.moveTo(-5.2, 0)
  outline.lineTo(5.2, 0)
  outline.quadraticCurveTo(4.6, 26, 2.2, 46)
  outline.quadraticCurveTo(0, 22, -2.2, 46)
  outline.quadraticCurveTo(-4.6, 26, -5.2, 0)
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 0.6,
    bevelSize: 0.5,
    bevelSegments: 3,
    curveSegments: 24,
  }).translate(0, 0, -3)
  const glass = kit.material2('#a9bccd', { metalness: 0.45, roughness: 0.25 })
  kit.box(16, 3, 12, '#ddd2bd', x, 0.3, z)
  kit.mesh(geometry, glass, [x, 3.3, z])
  kit.box(4.2, 0.9, 3.4, '#8ea2b6', x, 3.3 + 39.5, z)
}

function alFaisaliah(kit: Kit, x: number, z: number) {
  const skin = kit.material2('#b9c3c9', { metalness: 0.3, roughness: 0.35 })
  kit.box(12, 2.4, 12, '#ddd2bd', x, 0.3, z)
  kit.mesh(new THREE.CylinderGeometry(2.5, 5, 18, 4), skin, [x, 2.7 + 9, z], {
    rotation: [0, Math.PI / 4, 0],
  })
  const top = 2.7 + 18
  const apex = new THREE.Vector3(x, top + 13, z)
  for (const [dx, dz] of [[-1.75, -1.75], [1.75, -1.75], [-1.75, 1.75], [1.75, 1.75]]) {
    kit.beam(new THREE.Vector3(x + dx, top, z + dz), apex, 0.45, '#b9c3c9')
  }
  kit.mesh(new THREE.SphereGeometry(1.75, 24, 16), kit.material2('#e0b44f', { metalness: 0.6, roughness: 0.25 }), [
    x,
    top + 4.6,
    z,
  ])
  kit.cylinder(0.05, 0.25, 6, '#d0d0d0', x, top + 13, z, 6)
}

// ---- City assembly ------------------------------------------------------------------

export function buildCity(kind: CityKind): City {
  const style = STYLES[kind]
  const random = rng(kind.length * 7919 + kind.charCodeAt(0) * 104729)
  const kit = new Kit()
  const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)]
  const range = ([a, b]: [number, number]) => a + random() * (b - a)

  // Road surface under the whole land area; blocks are slabs raised on it.
  const land = new THREE.Mesh(
    kit.track(new THREE.PlaneGeometry(EXTENT.maxX - EXTENT.minX + 4, EXTENT.maxZ - EXTENT.minZ + 4)),
    kit.material(style.road),
  )
  land.rotation.x = -Math.PI / 2
  land.position.set(0, 0.03, (EXTENT.minZ + EXTENT.maxZ) / 2)
  land.receiveShadow = true
  kit.group.add(land)

  if (style.water) {
    const { minX, maxX, minZ, maxZ } = style.water
    const water = new THREE.Mesh(
      kit.track(new THREE.PlaneGeometry(maxX - minX, maxZ - minZ)),
      kit.material2('#8cc2ee', { roughness: 0.35, metalness: 0.05 }),
    )
    water.rotation.x = -Math.PI / 2
    water.position.set((minX + maxX) / 2, 0.36, (minZ + maxZ) / 2)
    water.receiveShadow = true
    kit.group.add(water)
  }

  const lots: Lot[] = []
  const round: TreeSpot[] = []
  const palms: TreeSpot[] = []
  const addTree = (x: number, z: number, s: number) => {
    const kindOfTree =
      style.trees === 'mixed' ? (random() < 0.35 ? 'palm' : 'round') : style.trees
    ;(kindOfTree === 'palm' ? palms : round).push({ x, z, s })
  }

  for (const x of COLS) {
    for (const z of ROWS) {
      const role = style.role(x, z)
      if (role === 'water') continue

      const slabColor = role === 'park' ? '#9fd18a' : role === 'plaza' || role === 'empty' ? style.plaza : style.slab
      const slab = kit.box(SLAB, 0.3, SLAB, slabColor, x, 0, z)
      slab.castShadow = false

      if (role === 'park') {
        for (let i = 0; i < 9; i++) addTree(x + (random() - 0.5) * 10, z + (random() - 0.5) * 10, 0.8 + random() * 0.5)
        continue
      }
      if (role === 'plaza') {
        for (const [dx, dz] of [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]]) addTree(x + dx, z + dz, 0.75)
        continue
      }
      if (role === 'empty') continue

      // Split the block into 1, 2 or 4 lots.
      const split = random()
      const cells: [number, number, number, number][] =
        split < 0.25
          ? [[x, z, 10, 10]]
          : split < 0.55
            ? [[x - 2.9, z, 5, 10.4], [x + 2.9, z, 5, 10.4]]
            : [[x - 2.9, z - 2.9, 5, 5], [x + 2.9, z - 2.9, 5, 5], [x - 2.9, z + 2.9, 5, 5], [x + 2.9, z + 2.9, 5, 5]]

      for (const [cx, cz, w, d] of cells) {
        const isTower = role === 'tower' && random() < 0.75
        let h = isTower ? range(style.towerHeights) : range(style.heights)
        // New York climbs toward the middle; elsewhere the profile stays flat.
        if (kind === 'new-york') h *= 1.25 - Math.hypot(x, z) / 140
        lots.push({
          x: cx,
          z: cz,
          w: w * (0.82 + random() * 0.12),
          d: d * (0.82 + random() * 0.12),
          h,
          color: isTower ? pick(style.glass) : pick(style.palette),
        })
        if (h > 12 && random() < 0.6) {
          lots.push({ x: cx, z: cz, w: w * 0.4, d: d * 0.4, h: h + 1.2, color: '#d6d8dc' })
        }
      }
    }
  }
  buildingsInstanced(kit, lots)

  // ---- Landmarks ------------------------------------------------------------
  const boats: THREE.Group[] = []
  switch (kind) {
    case 'hyderabad':
      charminar(kit, 0, 0)
      hussainSagarBuddha(kit, -41, -41)
      for (let i = 0; i < 10; i++) addTree(-22 + random() * 2, -56 + i * 3.3, 0.8)
      break
    case 'new-york':
      empireState(kit, 0, 0)
      oneWorldTrade(kit, -32, -32)
      statueOfLiberty(kit, 72, -18)
      break
    case 'doha':
      tornadoTower(kit, 32, -32)
      dohaTower(kit, 16, -32)
      museumOfIslamicArt(kit, -30, -56)
      // The Corniche: palms along the waterfront.
      for (let x = -54; x <= 54; x += 5) addTree(x, -40.5, 0.9 + random() * 0.2)
      boats.push(dhow(kit, -4, -60, 0.4), dhow(kit, 22, -72, -0.6), dhow(kit, 48, -58, 2.6), dhow(kit, -50, -76, 1.2))
      break
    case 'riyadh':
      kingdomCentre(kit, 0, 0)
      alFaisaliah(kit, -32, -16)
      for (let z = -56; z <= 40; z += 6) addTree(-58.5, z, 0.95)
      break
  }

  treesInstanced(kit, round, 'round')
  treesInstanced(kit, palms, 'palm')
  runway(kit, style)
  const waveFlag = flag(kit, style.flag, style.flagAt[0], style.flagAt[1])

  // ---- Traffic --------------------------------------------------------------
  const roadsX = [-40, -24, -8, 8, 24, 40] // roads running along x, at these z
  const roadsZ = [-40, -24, -8, 8, 24, 40] // roads running along z, at these x
  const water = style.water
  const cars: Car[] = []
  for (let i = 0; i < 46; i++) {
    const alongX = random() < 0.5
    const line = pick(alongX ? roadsX : roadsZ)
    let from = alongX ? EXTENT.minX : EXTENT.minZ
    let to = alongX ? EXTENT.maxX : EXTENT.maxZ
    // Keep cars off the water.
    if (water) {
      if (alongX && line >= water.minZ && line <= water.maxZ) {
        if (water.minX > 0) to = Math.min(to, water.minX - 1)
        else from = Math.max(from, water.maxX + 1)
      }
      if (!alongX && line >= water.minX && line <= water.maxX) {
        if (water.minZ < -40) from = Math.max(from, water.maxZ + 1)
        else continue
      }
    }
    if (to - from < 20) continue
    const forward = random() < 0.5
    cars.push({
      axis: alongX ? 'x' : 'z',
      line,
      lane: forward ? 0.8 : -0.8,
      from,
      length: to - from,
      offset: random() * (to - from),
      speed: (forward ? 1 : -1) * (5 + random() * 4),
    })
  }
  const moveCars = carsInstanced(kit, cars, style.cars, random)

  const update = (time: number) => {
    moveCars(time)
    waveFlag(time)
    boats.forEach((boat, i) => {
      boat.position.y = 0.2 + Math.sin(time * 1.4 + i) * 0.12
      boat.rotation.z = Math.sin(time * 1.1 + i * 2) * 0.04
    })
  }
  update(0)

  return {
    group: kit.group,
    runway: new THREE.Vector3(-30, 0, RUNWAY_Z),
    update,
    dispose: () => kit.dispose(),
  }
}

