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
    const [ root, bone, disposables ] = CubesCreator.createCubeRootAndBone()

    const store = {}

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {
            R.forEach<Disposable.IDisposable>(d => d.dispose())(disposables)
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
                updateByAnimation(root, bone)
            )(animation)
        }
    }
    sceneState.objects.add(displayobject)

    return displayobject
}

const updateByAnimation = (
    root: THREE.Object3D,
    bone: THREE.Object3D
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main': {
            const th = animation.progress / 1000.0 * 2.0 * Math.PI * C.cube.theta * C.cube.coefficient
            root.rotateX(th)
            const ph = -animation.progress / 1000.0 * 2.0 * Math.PI * C.cube.phi * C.cube.coefficient
            bone.rotateZ(ph)
            return
        }
        default:
            throw 'Invalid state'
    }
}
