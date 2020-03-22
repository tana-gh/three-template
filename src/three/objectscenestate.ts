import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../utils/animation'
import * as Interaction   from '../utils/interaction'
import * as C             from '../utils/constants'
import * as Random        from '../utils/random'
import * as RendererState from './rendererstate'
import * as SceneState    from './scenestate'
import * as Models        from './models'
import * as Lights        from './lights'

export const create = (
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
) => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera
    (
        C.perspectiveParams.fov,
        aspectObj.value,
        C.perspectiveParams.near,
        C.perspectiveParams.far
    )
    camera.position.set(0.0, 0.0, C.perspectiveParams.z)
    camera.lookAt(0.0, 0.0, 0.0)

    const sceneState: SceneState.ISceneState = {
        scene,
        camera,
        behaviours: new Set(),
        objects   : new Set(),
        render(renderer) {
            render(this, renderer)
        },
        dispose() {
            SceneState.dispose(this)
        }
    }

    Models.create(
        Date.now(),
        animations,
        sceneState,
        scene
    )

    Lights.create(
        Date.now(),
        animations,
        sceneState,
        scene
    )

    return sceneState
}

const render = (
    sceneState: SceneState.ISceneState,
    renderer  : THREE.WebGLRenderer
) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}
