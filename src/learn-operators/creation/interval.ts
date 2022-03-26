import { interval } from "rxjs"
import { take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  interval(1000).pipe(take(4)).subscribe(normalObserver())
}
