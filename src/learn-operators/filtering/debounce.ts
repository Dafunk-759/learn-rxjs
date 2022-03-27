import { fromEvent, interval } from "rxjs"
import { scan, debounce } from "rxjs/operators"

// It's like delay, but passes only the most recent 
// notification from each burst of emissions.
const clicks = fromEvent(document, "click")
const result = clicks.pipe(
  scan(i => i + 1, 1),
  debounce(i => interval(200 * i))
)
result.subscribe(x => console.log(x))
