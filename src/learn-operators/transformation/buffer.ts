import { fromEvent, interval } from "rxjs"
import { buffer } from "rxjs/operators"
import { normalObserver } from "../../util"

example1()
function example1() {
  interval(1000)
    .pipe(buffer(fromEvent(document, "click")))
    .subscribe(normalObserver())
}
