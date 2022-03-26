import { normalObserver } from "../../util"
import { throwError, timer, of } from "rxjs"
import { concatMap } from "rxjs/operators"

function example1() {
  let errorCount = 0

  const errorSource = throwError(() => {
    const error: any = new Error(
      `This is error number ${++errorCount}`
    )
    error.timestamp = Date.now()
    return error
  })

  errorSource.subscribe(normalObserver())

  errorSource.subscribe(normalObserver())
}

example2()
function example2() {
  of(1000, 2000, Infinity, 3000) // delays
    .pipe(
      concatMap(ms => {
        if (ms < 10000) {
          return timer(ms)
        } else {
          // overkill 不用 将error装箱
          // return throwError(
          //   () => new Error("invalid delay :" + ms)
          // )
          //直接 throw error
          throw new Error("invalid delay :" + ms)
        }
      })
    )
    .subscribe(normalObserver())
}
