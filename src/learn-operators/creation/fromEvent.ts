import { fromEvent } from "rxjs"
import { normalObserver } from "../../util"

example1()
function example1() {
  fromEvent(document, "click")
    .subscribe(normalObserver())
}