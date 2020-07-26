import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as R             from 'ramda'
import * as Animation     from '../../utils/animation'
import * as Interaction   from '../../utils/interaction'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as Disposable    from '../disposable'
import * as CursorCreator from './cursorcreator'

export const create = (
    timestamp   : number,
    sceneState  : SceneState.ISceneState,
    globalStore : any,
    parent      : THREE.Object3D,
    interactions: Rx.Observable<Interaction.IInteraction>
): DisplayObject.IDisplayObject => {
    const [ root, disposables ] = CursorCreator.createCursorRoot()
    
    let store = { x: 0.0, y: 0.0 }

    const subscription =
        interactions
            .subscribe(
                i => { store = { x: i.position.x, y: i.position.y }; console.log(store.y) }
            )

    const displayobject: DisplayObject.IDisplayObject = {
        timestamp,
        state: 'init',
        dispose() {
            R.forEach<Disposable.IDisposable>(d => d.dispose)(disposables)
            subscription.unsubscribe()
        },
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
                globalStore,
                store,
                updateByAnimation(root)
            )(animation)
        }
    }
    sceneState.objects.add(displayobject)

    return displayobject
}

const updateByAnimation = (
    root: THREE.Object3D
) => (
    obj        : DisplayObject.IDisplayObject,
    animation  : Animation.IAnimationState,
    globalStore: any,
    store      : any
) => {
    switch (obj.state) {
        case 'main': {
            const { x, y } = store
            root.position.set(x, y, 0.0)
            return
        }
        default:
            throw 'Invalid state'
    }
}
