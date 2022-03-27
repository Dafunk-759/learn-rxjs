import { of, interval, fromEvent } from "rxjs"
import { switchMap } from "rxjs/operators"
import { normalObserver } from "../../util"

function example() {
  of(1, 2, 3)
    .pipe(switchMap(x => of(x, x ** 2, x ** 3)))
    .subscribe(normalObserver())
}

function example1() {
  fromEvent(document, "click")
    .pipe(switchMap(_ => interval(1000)))
    .subscribe(normalObserver())
}
