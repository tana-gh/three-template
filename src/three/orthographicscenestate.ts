import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Interaction   from '../utils/interaction'
import * as C             from '../utils/constants'
import * as Random        from '../utils/random'
import * as RendererState from './rendererstate'
import * as SceneState    from './scenestate'

export const create = (
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
): SceneState.ISceneState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        -aspectObj.value * 0.5,
         aspectObj.value * 0.5,
         0.5,
        -0.5,
        C.orthographic.near,
        C.orthographic.far
    )
    camera.position.set(0.0, 0.0, C.orthographic.z)
    camera.lookAt(0.0, 0.0, 0.0)

    const sceneState = SceneState.create(scene, camera)

    return sceneState
}
