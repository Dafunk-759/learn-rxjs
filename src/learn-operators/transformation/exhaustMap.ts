import { fromEvent, interval } from "rxjs"
import { exhaustMap, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(exhaustMap(_ => interval(1000).pipe(take(5))))
    .subscribe(normalObserver())
}
