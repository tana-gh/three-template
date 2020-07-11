import * as THREE         from 'three'
import * as Animation     from '../utils/animation'
import * as C             from '../utils/constants'
import * as SceneState    from './scenestate'
import * as DisplayObject from './displayobject'
import * as ModelCreator  from './modelcreator'

export const create = (
    timestamp : number,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
) => {
    const [ modelRoot, modelBone ] = ModelCreator.createModelRootAndBone()

    const store = {}

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {},
        rootElement: modelRoot,
        elements: {
            modelRoot
        },
        updateByAnimation(animation) {
            DisplayObject.updateByAnimation(
                this,
                sceneState,
                parent,
                'main',
                store,
                updateByAnimation(modelRoot, modelBone)
            )(animation)
        }
    }
    sceneState.objects.add(displayobject)

    return displayobject
}

const updateByAnimation = (
    modelRoot: THREE.Object3D,
    modelBone: THREE.Object3D
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            const th = animation.progress / 1000.0 * 2.0 * Math.PI * C.frequency.modelTheta * C.frequency.coefficient
            modelRoot.rotateX(th)
            const ph = -animation.progress / 1000.0 * 2.0 * Math.PI * C.frequency.modelPhi * C.frequency.coefficient
            modelBone.rotateZ(ph)
            return
        default:
            throw 'Invalid state'
    }
}
