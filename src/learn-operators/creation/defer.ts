import { defer, fromEvent, interval } from "rxjs"
import { normalObserver } from "../../util"

example()
function example() {
  const clickOrIntervel = defer(() => {
    if (Math.random() > 0.5) {
      return fromEvent(document, "click")
    } else {
      return interval(1000)
    }
  })

  clickOrIntervel.subscribe(normalObserver())
}
