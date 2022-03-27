import { race, interval } from "rxjs"
import { map } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  race(
    interval(1000).pipe(map(_ => "first one")),
    interval(2000).pipe(map(_ => "second one")),
    interval(3000).pipe(map(_ => "third one"))
  ).subscribe(normalObserver())
}
