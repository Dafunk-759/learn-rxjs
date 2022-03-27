import { fromEvent, of } from "rxjs"
import { map, mergeScan } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(
      map(_ => 1),
      mergeScan((acc, cur) => of(acc + cur), 0)
    )
    .subscribe(normalObserver())
}
