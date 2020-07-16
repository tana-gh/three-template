import * as THREE from 'three'
import * as R     from 'ramda'

export const createLightRoot = (): THREE.Object3D => {
    const lights = createLights(12)
    const root   = new THREE.Bone()
    R.forEach(l => root.add(l), lights)
    
    return root
}

const createLights = (count: number) => {
    return composit(count)(R.range(0, count))
}

const toHue = (count: number) => (x: number) => R.clamp(0.0, 1.0, x / count)

const toHSL = (hue: number) => [hue, 0.5, 0.5]

const setHSL = (hsl: number[]) => new THREE.Color().setHSL(hsl[0], hsl[1], hsl[2])

const toLight = (hsl: number[]) => new THREE.PointLight(setHSL(hsl))

const pos = () => Math.random() * 10.0 - 5.0

const axis = () => new THREE.Vector3(pos(), pos(), pos())

const setAttr = (mesh: THREE.Light) => {
    mesh.translateOnAxis(axis(), 1.0)
}

const composit = (count: number) => R.pipe(
    R.map(toHue(count)),
    R.map(toHSL),
    R.map(toLight),
    R.forEach(setAttr)
)
