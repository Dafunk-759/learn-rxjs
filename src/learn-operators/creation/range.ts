import { range } from "rxjs"
import { normalObserver } from "../../util"
import { range as myrange } from "../../operators/Creation"

example()
function example() {
  range(1, 10).subscribe(normalObserver())
  myrange(11, 20).subscribe(normalObserver())
}
