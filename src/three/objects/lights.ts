import * as THREE         from 'three'
import * as Animation     from '../../utils/animation'
import * as C             from '../../utils/constants'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as LightsCreator from './lightscreator'

export const create = (
    timestamp : number,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
): DisplayObject.IDisplayObject => {
    const root = LightsCreator.createLightRoot()

    const store = {}

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {},
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
                updateByAnimation(root)
            )(animation)
        }
    }
    sceneState.objects.add(displayobject)

    return displayobject
}

const updateByAnimation = (
    root : THREE.Object3D
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main': {
            const ph = animation.progress / 1000.0 * 2.0 * Math.PI * C.frequency.lightPhi * C.frequency.coefficient
            root.rotateY(ph)
            return
        }
        default:
            throw 'Invalid state'
    }
}
