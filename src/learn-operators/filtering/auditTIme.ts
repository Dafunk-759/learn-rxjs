import { fromEvent } from "rxjs"
import { auditTime } from "rxjs/operators"

const clicks = fromEvent(document, "click")
const result = clicks.pipe(auditTime(1000))
result.subscribe(x => console.log(x))
