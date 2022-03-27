import { merge, fromEvent, interval } from "rxjs"
import { take } from "rxjs/operators"
import { normalObserver } from "../../util"

function example1() {
  merge(
    fromEvent(document, "click"),
    interval(1000)
  ).subscribe(normalObserver())
}

exampl2()
function exampl2() {
  const concurrent = 2
  // --0--1--2--3--...--9
  // ----0----1----2----...----5
  // 先并发前两个stream
  // 第一个结束后 并发后两个
  // 第二个结束后 emit 最后一个
  merge(
    interval(1000).pipe(take(10)),
    interval(2000).pipe(take(6)),
    interval(500).pipe(take(10)),
    concurrent
  ).subscribe(normalObserver())
}
