import type { Observer } from "rxjs"

export const normalObserver = <A>(): Observer<A> => ({
  next: console.log,
  error: console.error,
  complete: () => console.log("done.")
})
