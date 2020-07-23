import * as THREE      from 'three'
import * as R          from 'ramda'
import * as C          from '../../utils/constants'
import * as Disposable from '../disposable'

export const createCursorRoot = (): [ THREE.Object3D, Disposable.IDisposable[] ] => {
    const geometry = createGeometry()
    const planes   = createPlanes(geometry)
    const root     = new THREE.Bone()
    
    R.forEach<THREE.Object3D>(p => root.add(p))(planes)

    return [ root, [ geometry ] ]
}

const createGeometry = () => new THREE.PlaneGeometry(C.cursor.w, C.cursor.h)

const createPlanes = (geometry: THREE.Geometry) => {
    return composit(geometry)(R.range(0, C.cursor.count))
}

const getMaterial = () => new THREE.MeshLambertMaterial(C.cursorMaterial)

const toMesh = (geometry: THREE.Geometry) => (index: number): [ number, THREE.Mesh ] =>
    [ index, new THREE.Mesh(geometry, getMaterial()) ]

const axis = () => new THREE.Vector3(0.0, 1.0, 0.0)

const setAttr = ([ index, mesh ]: [ number, THREE.Mesh ]) => {
    mesh.rotateZ(Math.PI * 0.5 * index)
    mesh.translateOnAxis(axis(), C.cursor.radius)
}

const composit = (geometry: THREE.Geometry) => R.pipe(
    R.map(toMesh(geometry)),
    R.forEach(setAttr),
    R.map<[ number, THREE.Mesh ], THREE.Mesh>(([ i, m ]) => m)
)
