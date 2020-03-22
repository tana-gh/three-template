import * as State from './state'
import '../assets/scss/style.scss'

declare global {
    interface Window {
        threeState: State.IState
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.threeState = State.load(document.getElementById('app')!)
})
