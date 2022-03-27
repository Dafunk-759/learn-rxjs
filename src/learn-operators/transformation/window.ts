import { fromEvent, interval } from "rxjs"
import { window, mergeAll, map, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(
      window(interval(1000)),
      map(clicks => clicks.pipe(take(2))),
      mergeAll()
    )
    .subscribe(normalObserver())
}
