import { fromEvent, of } from "rxjs"
import { expand, map, delay, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(
      map(_ => 1),
      expand(x => of(2 * x).pipe(delay(1000))),
      take(10)
    )
    .subscribe(normalObserver())
}
