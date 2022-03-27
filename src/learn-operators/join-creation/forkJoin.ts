import { forkJoin, timer, of, from } from "rxjs"
import { normalObserver } from "../../util"

function example1() {
  forkJoin({
    a: of(1, 2, 3),
    b: Promise.resolve(8),
    c: timer(4000)
  }).subscribe(normalObserver())
}

example2()
function example2() {
  forkJoin([
    of(1, 2, 3),
    Promise.resolve(8),
    timer(4000)
  ]).subscribe(normalObserver())
}
