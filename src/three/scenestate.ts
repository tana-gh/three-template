import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Animation     from '../utils/animation'
import * as Behaviour     from './behaviour'
import * as DisplayObject from './displayobject'

export interface ISceneState {
    scene     : THREE.Scene
    camera    : THREE.Camera
    behaviours: Set<Behaviour.IBehaviour>
    objects   : Set<DisplayObject.IDisplayObject>
    render    : (renderer: THREE.WebGLRenderer, animation: Animation.IAnimationState) => void
    dispose   : () => void
}

export const create = (scene: THREE.Scene, camera: THREE.Camera): ISceneState => {
    return {
        scene,
        camera,
        behaviours: new Set(),
        objects   : new Set(),
        render(renderer, animation) {
            R.forEach(
                (obj: Behaviour.IBehaviour) => obj.updateByAnimation(animation)
            )([ ...this.behaviours, ...this.objects ])
            render(this, renderer)
        },
        dispose() {
            dispose(this)
        }
    }
}

export const setCameraSize = (camera: THREE.Camera, aspect: number): void => {
    if (camera instanceof THREE.OrthographicCamera) {
        camera.left   = -aspect * 0.5
        camera.right  =  aspect * 0.5
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
}

const render = (
    sceneState: ISceneState,
    renderer  : THREE.WebGLRenderer
) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: ISceneState) => {
    R.forEach(
        (obj: Behaviour.IBehaviour) => obj.dispose()
    )([ ...Array.from(sceneState.behaviours), ...Array.from(sceneState.objects) ])
}
