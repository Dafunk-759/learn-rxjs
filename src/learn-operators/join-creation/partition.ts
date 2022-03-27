import { of, partition, concat } from "rxjs"
import { normalObserver } from "../../util"

example1()
function example1() {
  const [even, odd] = partition(
    of(1, 2, 3, 4, 5),
    value => value % 2 === 0
  )
  
  // 2 4 1 3 5 done.
  concat(even, odd).subscribe(normalObserver())
}
