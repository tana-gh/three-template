import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Animation     from '../../utils/animation'
import * as C             from '../../utils/constants'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as Disposable    from '../disposable'
import * as CubesCreator  from './cubescreator'

export const create = (
    timestamp : number,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
): DisplayObject.IDisplayObject => {
    const [ root, bones, disposables ] = CubesCreator.createCubeRootAndBone()

    const store = {}

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {
            R.forEach((d: Disposable.IDisposable) => d.dispose())(disposables)
        },
        rootElement: root,
        elements: {
            root
        },
        updateByAnimation(animation) {
            DisplayObject.updateByAnimation(
                this,
                sceneState,
                parent,
                'main',
                store,
                updateByAnimation(root, bones)
            )(animation)
        }
    }
    sceneState.objects.add(displayobject)

    return displayobject
}

const updateByAnimation = (
    root : THREE.Object3D,
    bones: THREE.Object3D[]
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main': {
            const phi = animation.progress / 1000.0 * 2.0 * Math.PI * C.cube.phi * C.cube.coefficient
            R.forEach(
                (b: THREE.Object3D) => b.rotateZ(phi)
            )(bones)
            return
        }
        default:
            throw 'Invalid state'
    }
}
