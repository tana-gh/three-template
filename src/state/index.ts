import * as Animation        from '../utils/animation'
import * as Interaction      from '../utils/interaction'
import * as Time             from '../utils/time'
import * as Random           from '../utils/random'
import * as RendererState    from '../three/rendererstate'
import * as ObjectSceneState from '../three/objectscenestate'

export interface IState {
    rendererState: RendererState.IRendererState
    dispose      : () => void
}

export const load = (parent: HTMLElement): IState => {
    const now          = Date.now()
    const animations   = Animation  .create(now)
    const interactions = Interaction.create(animations, parent, window)
    const times        = Time       .create(animations)
    const random       = Random     .create(now)

    const [width, height] = [parent.clientWidth, parent.clientHeight]
    const rendererState   = RendererState.create(width, height)
    
    const objectSceneState = ObjectSceneState.create(interactions, times, random, rendererState.aspectObj)
    
    RendererState.setScenes(rendererState, objectSceneState)

    const subscription = animations.subscribe(a => rendererState.render(a))

    parent.appendChild(rendererState.renderer.domElement)

    const resize = () => rendererState.resize(parent.clientWidth, parent.clientHeight)
    window.addEventListener('resize', resize)

    const dispose = () => {
        subscription.unsubscribe()
        rendererState.dispose()
        window.removeEventListener('resize', resize)
    }

    return { rendererState, dispose }
}
