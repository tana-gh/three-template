import * as THREE        from 'three'
import * as R            from 'ramda'
import * as C            from '../../utils/constants'
import * as Disposable   from '../disposable'
import * as CursorShader from './cursorshader'

export const createCursorRoot = (): [ THREE.Object3D, Disposable.IDisposable[] ] => {
    const geometry = createGeometry()
    const cursor   = createCursor(geometry)
    const root     = new THREE.Bone()
    
    root.add(cursor)

    return [ root, [ geometry ] ]
}

const createGeometry = () => {
    const geometry = new THREE.PlaneBufferGeometry(C.cursor.width, C.cursor.height)
    const coords   = new Float32Array(
        R.pipe(
            R.splitEvery(3),
            R.map((vec: number[]) => [Math.sign(vec[0]), Math.sign(vec[1])]),
            R.unnest
        )(Array.from(geometry.attributes.position.array))
    )

    geometry.setAttribute('coord', new THREE.BufferAttribute(coords, 2))

    return geometry
}

const createCursor = (geometry: THREE.BufferGeometry) => new THREE.Mesh(geometry, getMaterial())

const getMaterial = () => {
    const material = new THREE.ShaderMaterial({
        vertexShader  : CursorShader.vertex,
        fragmentShader: CursorShader.fragment,
        uniforms      : C.cursorUniforms
    })

    material.blending      = THREE.CustomBlending
    material.blendEquation = THREE.AddEquation
    material.blendSrc      = THREE.SrcAlphaFactor
    material.blendDst      = THREE.OneMinusSrcAlphaFactor

    return material
}
    
