import { from, interval } from "rxjs"
import { mergeMap, map, take } from "rxjs/operators"
import { normalObserver } from "../../util"

example()
function example() {
  // -a-a-a-a-a-a-a
  // --b--b--b--b--b
  // ---c---c---c---c
  // -a-ab-ac-ab-a-abc

  from(["a", "b", "c"])
    .pipe(
      mergeMap((s, i) =>
        interval(1000 * (i + 1)).pipe(map(i => `${s}${i}`))
      ),
      take(11)
    )
    .subscribe(normalObserver())
}
