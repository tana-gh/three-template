import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../utils/animation'
import * as C             from '../utils/constants'
import * as SceneState    from './scenestate'
import * as DisplayObject from './displayobject'
import * as LightCreator  from './lightcreator'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
) => {
    const lightBone = LightCreator.createLightBone()

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        },
        rootElement: lightBone,
        elements: {
            lightBone
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
            updateByAnimation(lightBone)
        )
    )

    return displayobject
}

const updateByAnimation = (
    lightBone : THREE.Object3D
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            const ph = animation.progress / 1000.0 * 2.0 * Math.PI * C.frequency.lightPhi * C.frequency.coefficient
            lightBone.rotateY(ph)
            return
        default:
            throw 'Invalid state'
    }
}
