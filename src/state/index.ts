import * as Animation              from '../utils/animation'
import * as Interaction            from '../utils/interaction'
import * as Time                   from '../utils/time'
import * as Random                 from '../utils/random'
import * as C                      from '../utils/constants'
import * as RendererState          from '../three/rendererstate'
import * as PerspectiveSceneState  from '../three/perspectivescenestate'
import * as OrthographicSceneState from '../three/orthographicscenestate'

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

    const globalStore = {}
    
    const perspectiveSceneState  = PerspectiveSceneState .create(interactions, times, random, rendererState.aspectObj, globalStore)
    const orthographicSceneState = OrthographicSceneState.create(interactions, times, random, rendererState.aspectObj, globalStore)

    RendererState.addScenes(rendererState, perspectiveSceneState, orthographicSceneState)

    let total = 0.0
    let count = 0
    const subscription = animations.subscribe(a => {
        rendererState.render(a)
        
        const progress = a.total - total
        count++;
        if (progress >= C.fps.updateDelta) {
            fps.textContent = toFpsText(progress / count)
            total = a.total
            count = 0
        }
    })

    rendererState.renderer.domElement.className = C.classNames.three
    parent.appendChild(rendererState.renderer.domElement)

    const resize = () => rendererState.resize(parent.clientWidth, parent.clientHeight)
    window.addEventListener('resize', resize)

    const fps = document.createElement('p')
    fps.className = C.classNames.fps
    parent.appendChild(fps)

    const dispose = () => {
        subscription.unsubscribe()
        rendererState.dispose()
        window.removeEventListener('resize', resize)
    }

    return { rendererState, dispose }
}

const toFpsText = (progress: number) => {
    return progress === 0.0 ? '' : `${(1000.0 / progress).toFixed(1)} fps`
}
