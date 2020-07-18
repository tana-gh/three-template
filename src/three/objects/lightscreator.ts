import * as THREE      from 'three'
import * as R          from 'ramda'
import * as C          from '../../utils/constants'
import * as Disposable from '../disposable'

export const createLightRoot = (): [ THREE.Object3D, Disposable.IDisposable[] ] => {
    const lights = createLights(C.light.count)
    const root   = new THREE.Bone()
    R.forEach(l => root.add(l), lights)
    
    return [ root, [] ]
}

const createLights = (count: number) => {
    return composit(count)(R.range(0, count))
}

const toHue = (count: number) => (x: number) => R.clamp(0.0, 1.0, x / count)

const toHSL = (hue: number) => [hue, C.light.hsl.s, C.light.hsl.l]

const setHSL = (hsl: number[]) => new THREE.Color().setHSL(hsl[0], hsl[1], hsl[2])

const toLight = (hsl: number[]) => new THREE.PointLight(setHSL(hsl))

const pos = () => (Math.random() * 2.0 - 1.0) * C.light.pos

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
