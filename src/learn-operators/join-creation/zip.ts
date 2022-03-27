import { zip, of, interval } from "rxjs"
import { map, take } from "rxjs/operators"
import { normalObserver } from "../../util"

function example() {
  zip(of(1, 2, 3), of("foo", "bar", "baz"))
    .pipe(map(([number, name]) => ({ number, name })))
    .subscribe(normalObserver())
}

function exmaple2() {
  zip(
    interval(1000).pipe(map(_ => "first")),
    interval(1000).pipe(map(_ => "second"))
  ).subscribe(normalObserver())
}

example3()
function example3() {
  // -a-a-a-a-a-a
  // --b--b--b

  // --ab--ab--ab
  zip(
    interval(1000).pipe(
      map(_ => "first"),
      take(6)
    ),
    interval(2000).pipe(
      map(_ => "second"),
      take(3)
    )
  ).subscribe(normalObserver())
}
