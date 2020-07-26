import * as THREE      from 'three'
import * as Animation  from '../utils/animation'
import * as SceneState from './scenestate'
import * as Behaviour  from './behaviour'

export interface IDisplayObject extends Behaviour.IBehaviour {
    rootElement: THREE.Object3D
    elements   : {
        [name: string]: THREE.Object3D
    }
}

export const updateByAnimation = (
    obj         : IDisplayObject,
    sceneState  : SceneState.ISceneState,
    parent      : THREE.Object3D,
    initialState: string,
    globalStore : any,
    store       : any,
    behaviour   : (obj: IDisplayObject, animation: Animation.IAnimationState, globalStore: any, store: any) => void
) => (animation: Animation.IAnimationState): void => {
    switch (obj.state) {
        case 'init':
            parent.add(obj.rootElement)
            obj.state = initialState
            updateByAnimation(obj, sceneState, parent, initialState, globalStore, store, behaviour)(animation)
            return
        case 'terminate':
            parent.remove(obj.rootElement)
            sceneState.objects.delete(obj)
            obj.dispose()
            return
        default:
            behaviour(obj, animation, globalStore, store)
    }
}

export const getTime = (obj: IDisplayObject, animation: Animation.IAnimationState): number =>
    Behaviour.getTime(obj, animation)
