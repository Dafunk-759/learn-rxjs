import { fromEvent } from "rxjs"
import { map } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent<MouseEvent>(document, "click")
    .pipe(map(e => e.clientX))
    .subscribe(normalObserver())
}
