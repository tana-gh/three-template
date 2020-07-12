import * as Rx   from 'rxjs'
import * as RxOp from 'rxjs/operators'

export interface IAnimationState {
    start   : number
    total   : number
    before  : number
    now     : number
    progress: number
}

export const create = (now: number) => {
    const animations = Rx.from((function* () { while (true) yield Date.now() })(), Rx.animationFrameScheduler)
    const start = now

    return Rx.pipe(
        RxOp.pairwise<number>(),
        RxOp.map(animate(start))
    )(animations)
}

const animate = (start: number) =>
([before, now]: [number, number]): IAnimationState => {
    return {
        start,
        total: now - start,
        before,
        now,
        progress: now - before 
    }
}
