import { interval, BehaviorSubject } from "rxjs"
import { map, take, scan } from "rxjs/operators"
import type { Observer } from "rxjs"

export const normalObserver = <A>(): Observer<A> => ({
  next: console.log,
  error: console.error,
  complete: () => console.log("done.")
})

export function fromInterval<A>(arr: A[], time: number) {
  return interval(time).pipe(
    take(arr.length),
    map(i => arr[i])
  )
}

/**
 * 类似于 useReducer
 *
 * 返回
 * 一个`subject` 可以dispatch消息。
 * 一个`source` 可以作为数据源。
 */
export function fromReducer<State, Action>(
  reducer: (state: State, action: Action) => State,
  initState: State
) {
  const init = Symbol("init")
  type Init = typeof init

  const subject = new BehaviorSubject<Action | Init>(init)
  const source = subject.pipe(
    scan((state, action) => {
      // action 为初始action时 直接返回 initState
      if (action === init) {
        return state
      } else {
        return reducer(state, action)
      }
    }, initState)
  )

  return {
    subject: subject as BehaviorSubject<Action>,
    source
  }
}

export function fromState<State>(initState: State) {
  type Setter = (state: State) => State

  const subject = new BehaviorSubject<Setter>(
    () => initState
  )
  const source = subject.pipe(
    scan((state, setter) => setter(state), initState)
  )

  return {
    subject,
    source
  }
}
