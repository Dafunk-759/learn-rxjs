import { generate } from "rxjs"
import { normalObserver } from "../../util"

example()
function example() {
  generate({
    initialState: 0,
    condition: x => x <= 20,
    iterate: x => x + 2
  })
  .subscribe(normalObserver())
}
