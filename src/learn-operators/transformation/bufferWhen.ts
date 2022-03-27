import { fromEvent, timer } from "rxjs"
import { bufferWhen } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  // ---c--c--ccc-----c
  // --s--s--s--s--..--s
  // --[]--[c]--[c]--[ccc]

  fromEvent(document, "click")
    .pipe(bufferWhen(() => timer(2000)))
    .subscribe(normalObserver())
}
