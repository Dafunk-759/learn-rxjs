import { EMPTY } from "rxjs"
import { normalObserver } from "../../util"

example1()
function example1() {
  EMPTY.subscribe(normalObserver())
}
