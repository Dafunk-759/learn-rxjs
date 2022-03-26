import { ajax } from "rxjs/ajax"
import { map, catchError } from "rxjs/operators"
import { of } from "rxjs"
import { normalObserver } from "../../util"

function example1() {
  ajax("https://api.github.com/users?per_page=5")
    .pipe(
      map(response => console.log(response)),
      catchError(err => {
        console.log("error", err)
        return of(err)
      })
    )
    .subscribe(normalObserver())
}

function example2() {
  ajax
    .getJSON("https://api.github.com/users?per_page=5")
    .pipe(
      map(response => console.log(response)),
      catchError(err => {
        console.log("error", err)
        return of(err)
      })
    )
    .subscribe(normalObserver())
}

example3()
function example3() {
  ajax({
    url: "https://httpbin.org/delay/2",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "rxjs-custom-header": "Rxjs"
    },
    body: {
      rxjs: "Hello World!"
    }
  }).pipe(
    map(response => console.log("response: ", response)),
    catchError(error => {
      console.log("error: ", error)
      return of(error)
    })
  )
  .subscribe(normalObserver())
}
