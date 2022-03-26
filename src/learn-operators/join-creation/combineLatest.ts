import { combineLatest, timer, of } from "rxjs"
import { normalObserver } from "../../util"
import { delay, startWith, map } from "rxjs/operators"

function example1() {
  // - : 1000ms
  // timer1 0--1--2--3--4--
  // timer2 -0--1--2--3--4--

  // -[0, 0]-[1, 0]-[1, 1]-[2, 1]-[2, 2]-

  const sub = combineLatest([
    timer(0, 1000),
    timer(500, 1000)
  ]).subscribe(normalObserver())

  setTimeout(() => {
    sub.unsubscribe()
  }, 2550)
}

function example2() {
  // -: 1000ms
  // a: 0-1
  // b: 0-----5
  // c: 0----------10

  // [0, 0, 0]-[1, 0, 0]----[1, 5, 0]-----[1, 5, 10]

  combineLatest({
    a: of(1).pipe(delay(1000), startWith(0)),
    b: of(5).pipe(delay(5000), startWith(0)),
    c: of(10).pipe(delay(10000), startWith(0))
  }).subscribe(normalObserver())
}

function example3() {
  // 70-72-76-79-75
  const weight = of(70, 72, 76, 79, 75)
  // 1.76-1.77-1.78
  const height = of(1.76, 1.77, 1.78)

  // [75, 1.76]-[75, 1.77]-[75, 1.78]
  combineLatest([weight, height])
    .pipe(
      map(v => {
        console.log(v)
        return v
      }),
      map(([w, h]) => w / (h * h))
    )
    .subscribe(normalObserver())
}

// startWith example
function startWithExample() {
  timer(2000)
    .pipe(
      map(_ => "after 2000 start"),
      startWith("real start")
    )
    .subscribe(normalObserver())
}
