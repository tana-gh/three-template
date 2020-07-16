import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Interaction   from '../utils/interaction'
import * as C             from '../utils/constants'
import * as Random        from '../utils/random'
import * as RendererState from './rendererstate'
import * as SceneState    from './scenestate'
import * as Cubes         from './objects/cubes'
import * as Lights        from './objects/lights'

export const create = (
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
): SceneState.ISceneState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        C.perspectiveParams.fov,
        aspectObj.value,
        C.perspectiveParams.near,
        C.perspectiveParams.far
    )
    camera.position.set(0.0, 0.0, C.perspectiveParams.z)
    camera.lookAt(0.0, 0.0, 0.0)

    const sceneState = SceneState.create(scene, camera)

    Cubes.create(
        Date.now(),
        sceneState,
        scene
    )

    Lights.create(
        Date.now(),
        sceneState,
        scene
    )

    return sceneState
}
