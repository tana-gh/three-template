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
        C.perspective.fov,
        aspectObj.value,
        C.perspective.near,
        C.perspective.far
    )
    camera.position.set(0.0, 0.0, C.perspective.z)
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
