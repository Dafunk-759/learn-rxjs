import { fromEvent, interval } from "rxjs"
import { exhaustAll, map, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(map(_ => interval(1000).pipe(take(5))))
    .pipe(exhaustAll())
    .subscribe(normalObserver())
}
