import * as THREE       from 'three'
import * as Rx          from 'rxjs'
import * as Animation   from '../../utils/animation'
import * as Interaction from '../../utils/interaction'
import * as C           from '../../utils/constants'
import * as SceneState  from '../scenestate'
import * as Behaviour   from '../behaviour'

export const create = (
    timestamp   : number,
    sceneState  : SceneState.ISceneState,
    interactions: Rx.Observable<Interaction.IInteraction>,
    root        : THREE.Object3D
): Behaviour.IBehaviour => {
    let store = { x: 0.0, y: 0.0 }

    const subscription =
        interactions
            .subscribe(
                i => store = i.button1 ? { x: i.movement.x, y: i.movement.y } : { x: 0.0, y: 0.0 }
            )

    const behaviour: Behaviour.IBehaviour = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        },
        updateByAnimation(animation) {
            Behaviour.updateByAnimation(
                this,
                sceneState,
                'main',
                store,
                updateByAnimation(root)
            )(animation)
        }
    }
    sceneState.behaviours.add(behaviour)

    return behaviour
}

const updateByAnimation = (
    root: THREE.Object3D
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main': {
            const theta = C.interactiveRotation.theta * C.interactiveRotation.coefficient
            const { x, y } = store
            const dir      = new THREE.Vector3(-y, x, 0.0)
            const axis     = dir.clone().normalize()
            root.rotateOnWorldAxis(axis, theta * dir.length())
            return
        }
        default:
            throw 'Invalid state'
    }
}
