import { fromEvent } from "rxjs"
import { filter } from "rxjs/operators"

const clicks = fromEvent<MouseEvent>(document, "click")
const clicksOnDivs = clicks.pipe(
  filter(ev => ev.clientX > 500)
)
clicksOnDivs.subscribe(x => console.log(x))
