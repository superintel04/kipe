import * as THREE from 'three'

/**
 * The little propeller plane that flies the route, in the site accent. Built
 * nose-forward along +x so a heading is a rotation about y.
 */
export type Plane = {
  group: THREE.Group
  /** Propeller spin, seconds. */
  update(time: number): void
  dispose(): void
}

export function createPlane(): Plane {
  const group = new THREE.Group()
  const disposables: { dispose(): void }[] = []
  const lambert = (color: string) => {
    const material = new THREE.MeshLambertMaterial({ color })
    disposables.push(material)
    return material
  }
  const body = lambert('#2a65fe')
  const trim = lambert('#ffffff')
  const dark = lambert('#1d2433')

  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
    parent: THREE.Object3D = group,
  ) => {
    disposables.push(geometry)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.rotation.set(...rotation)
    mesh.castShadow = true
    parent.add(mesh)
    return mesh
  }

  // Fuselage: thick at the nose, tapering to the tail.
  add(new THREE.CylinderGeometry(0.62, 0.3, 5.2, 16), body, [0, 0, 0], [0, 0, Math.PI / 2])
  add(new THREE.SphereGeometry(0.62, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), body, [2.6, 0, 0], [0, 0, -Math.PI / 2])
  add(new THREE.ConeGeometry(0.3, 0.9, 16), body, [-3.05, 0, 0], [0, 0, Math.PI / 2])
  // Canopy.
  const canopy = new THREE.MeshLambertMaterial({ color: '#cfe3ff', transparent: true, opacity: 0.85 })
  disposables.push(canopy)
  add(new THREE.SphereGeometry(0.5, 16, 10), canopy, [0.7, 0.42, 0]).scale.set(1.6, 0.8, 0.9)
  // Wings, with white tips.
  add(new THREE.BoxGeometry(1.4, 0.14, 8.4), body, [0.6, -0.15, 0])
  add(new THREE.BoxGeometry(1.42, 0.15, 0.8), trim, [0.6, -0.15, 4.0])
  add(new THREE.BoxGeometry(1.42, 0.15, 0.8), trim, [0.6, -0.15, -4.0])
  // Tail.
  add(new THREE.BoxGeometry(0.9, 0.1, 3), body, [-2.7, 0.1, 0])
  add(new THREE.BoxGeometry(1, 1.3, 0.1), body, [-2.75, 0.75, 0], [0, 0, -0.25])
  add(new THREE.BoxGeometry(0.5, 0.12, 0.12), trim, [-2.9, 1.3, 0])
  // Gear.
  for (const z of [-0.8, 0.8]) {
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6), dark, [0.9, -0.62, z])
    add(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 12), dark, [0.9, -0.92, z], [Math.PI / 2, 0, 0])
  }
  // Spinner and propeller.
  add(new THREE.ConeGeometry(0.22, 0.5, 12), trim, [3.35, 0, 0], [0, 0, -Math.PI / 2])
  const propeller = new THREE.Group()
  propeller.position.set(3.2, 0, 0)
  group.add(propeller)
  add(new THREE.BoxGeometry(0.06, 2.4, 0.22), dark, [0, 0, 0], [0, 0, 0], propeller)
  add(new THREE.BoxGeometry(0.06, 0.22, 2.4), dark, [0, 0, 0], [0, 0, 0], propeller)

  group.scale.setScalar(1.25)

  return {
    group,
    update(time) {
      propeller.rotation.x = time * 40
    },
    dispose() {
      disposables.forEach((item) => item.dispose())
    },
  }
}
