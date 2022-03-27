import { fromEvent } from "rxjs"
import { pairwise, map } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  fromEvent<MouseEvent>(document, "click")
    .pipe(
      map(e => [e.clientX, e.clientY] as const),
      pairwise(),
      map(pair => {
        const [x0, y0] = pair[0]
        const [x1, y1] = pair[1]
        return Math.sqrt(
          Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)
        )
      })
    )
    .subscribe(normalObserver())
}
