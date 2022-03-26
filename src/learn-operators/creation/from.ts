import { from, asyncScheduler, scheduled } from "rxjs"
import { take } from "rxjs/operators"
import { normalObserver } from "../../util"

function example1() {
  from([10, 20, 30]).subscribe(normalObserver())
}

function example2() {
  function* genfrom(from: number) {
    while (true) {
      yield from
      from = from * 2
    }
  }

  from(genfrom(1)).pipe(take(5)).subscribe(normalObserver())
}

example3()
function example3() {
  // scheduled 和 from 类似, 区别是第二个参数可以传 scheduler
  scheduled([10, 20, 30], asyncScheduler).subscribe(
    normalObserver()
  )
  console.log("end")
}
