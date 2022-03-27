import { interval } from "rxjs"
import { map, take } from "rxjs/operators"
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
