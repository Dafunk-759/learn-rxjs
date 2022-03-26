import { Observable } from "rxjs"

export function interval(period: number) {
  let index = 0
  return new Observable<number>(subscriber => {
    const timer = setInterval(() => {
      subscriber.next(index)
      index++
    }, period)
    return () => clearInterval(timer)
  })
}

export function range(start: number, end: number) {
  return new Observable<number>(subscriber => {
    try {
      for (let i = start; i <= end; i++) {
        subscriber.next(i)
      }
    } catch (error) {
      subscriber.error(error)
    }
    subscriber.complete()
  })
}
