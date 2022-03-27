import { fromEvent, interval } from "rxjs"
import { concatMap, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  // For each click event, tick every second from 0 to 3, 
  // with no concurrency
  fromEvent(document, "click")
    .pipe(concatMap(_ => interval(1000).pipe(take(4))))
    .subscribe(normalObserver())
}
