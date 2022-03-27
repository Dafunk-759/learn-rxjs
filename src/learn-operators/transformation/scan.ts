import { of, interval, startWith, concat } from "rxjs"
import { scan, map } from "rxjs/operators"
import { normalObserver, fromInterval } from "../../util"

function example1() {
  of(1, 2, 3)
    .pipe(
      scan((total, cur) => total + cur, 0),
      map((val, i) => val / (i + 1))
    )
    .subscribe(normalObserver())
}

example2()
function example2() {
  const fibs = [0, 1]
  const time = 1000
  const firstTwo = fromInterval(fibs, time)
  const seq = interval(time).pipe(
    scan(([a, b]) => [b, a + b], fibs),
    map(([_, b]) => b)
  )
  concat(firstTwo, seq).subscribe(normalObserver())
}
