import { fromEvent, timer } from "rxjs"
import { audit } from "rxjs/operators"

fromEvent(document, "click")
  .pipe(audit(_ => timer(1000)))
  .subscribe(console.log)
