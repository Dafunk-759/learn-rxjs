import { normalObserver } from "../../util"
import { timer, of, interval } from "rxjs"
import { concatMap, takeUntil } from "rxjs/operators"

function example1() {
  timer(3000)
    .pipe(concatMap(_ => of(1, 2, 3)))
    .subscribe(normalObserver())
}

function example2() {
  const currentDate = new Date()
  const startOfNextMinute = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes() + 1
  )

  interval(1000)
    .pipe(takeUntil(timer(startOfNextMinute)))
    .subscribe(normalObserver())
}

function example3() {
  // 立即开始一个 interval
  timer(0, 1000).subscribe(normalObserver())
  // interval 会等第一个 1000ms
  interval(1000).subscribe(normalObserver())
}
