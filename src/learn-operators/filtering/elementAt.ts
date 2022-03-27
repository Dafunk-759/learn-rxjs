import { fromEvent } from "rxjs"
import { elementAt } from "rxjs/operators"

const clicks = fromEvent(document, "click")
const result = clicks.pipe(elementAt(2))
result.subscribe(x => console.log(x))

// Results in:
// click 1 = nothing
// click 2 = nothing
// click 3 = MouseEvent object logged to console
