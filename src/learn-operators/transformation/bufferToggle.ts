import { fromEvent, interval, EMPTY, timer } from "rxjs"
import { bufferToggle } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  // --o--o--o--o--...--o
  // ---c--c--c--c--c..--c
  // 收集 o到c open到close 这个区间的click事件
  // 在close时 emit这个events[]
  fromEvent(document, "click")
    .pipe(bufferToggle(interval(2000), _ => timer(1000)))
    .subscribe(normalObserver())
}
