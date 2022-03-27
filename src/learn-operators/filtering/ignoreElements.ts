import { of } from "rxjs"
import { ignoreElements } from "rxjs/operators"
import { normalObserver } from "../../util"

of("you", "talking", "to", "me")
  .pipe(ignoreElements())
  .subscribe(normalObserver())
// result:
// 'the end'
