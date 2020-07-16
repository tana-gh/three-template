import * as State from './state'
import '../assets/scss/style.scss'

declare global {
    interface Window {
        threeState: State.IState
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app')
    if (app) window.threeState = State.load(app)
})
