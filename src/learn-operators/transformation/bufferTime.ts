import { fromEvent } from "rxjs"
import { bufferTime, filter } from "rxjs/operators"

import { normalObserver } from "../../util"

example()
function example() {
  fromEvent(document, "click")
    .pipe(
      bufferTime(1000),
      filter(events => events.length >= 2)
    )
    .subscribe(normalObserver())
}
