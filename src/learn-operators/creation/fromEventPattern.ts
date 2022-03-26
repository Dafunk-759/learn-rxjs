import { fromEventPattern } from "rxjs"
import { normalObserver } from "../../util"

example1()
function example1() {
  fromEventPattern<MouseEvent>(
    handler => document.addEventListener("click", handler),
    handler =>
      document.removeEventListener("click", handler)
  ).subscribe(normalObserver())
}


