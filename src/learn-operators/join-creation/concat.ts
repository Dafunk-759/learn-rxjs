import { concat, interval, range } from "rxjs"
import { take } from "rxjs/operators"

import { normalObserver } from "../../util"

function example1() {
  // -0-1-2-3
  //        {1-10}
  const timer = interval(1000).pipe(take(4))
  const oneToTen = range(1, 10)

  concat(timer, oneToTen).subscribe(normalObserver())
}

function example2() {
  // --0--1--2--3--...--9
  // ----0----1----2----3----...----5
  // -0-1-2-3-4-...-9

  concat(
    interval(1000).pipe(take(10)),
    interval(2000).pipe(take(6)),
    interval(500).pipe(take(10))
  ).subscribe(normalObserver())
}

example3()
function example3() {
  // -0-1
  const timer = interval(1000).pipe(take(2))

  // -0-1-0-1
  concat(timer, timer).subscribe(normalObserver())
}
