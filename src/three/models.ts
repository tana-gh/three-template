import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../utils/animation'
import * as C             from '../utils/constants'
import * as SceneState    from './scenestate'
import * as DisplayObject from './displayobject'
import * as ModelCreator  from './modelcreator'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
) => {
    const [ modelRoot, modelBone ] = ModelCreator.createModelRootAndBone()

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        },
        rootElement: modelRoot,
        elements: {
            modelRoot
        }
    }
    sceneState.objects.add(displayobject)

    const store = {}

    const subscription = animations.subscribe(
        DisplayObject.updateByAnimation(
            displayobject,
            sceneState,
            parent,
            'main',
            store,
            updateByAnimation(modelRoot, modelBone)
        )
    )

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
