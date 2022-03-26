import { iif, of } from "rxjs"

function example1() {
  let subscribeToFirst = false
  const firstOrSecond = iif(
    () => subscribeToFirst,
    of(1),
    of("second")
  )

  subscribeToFirst = true
  firstOrSecond.subscribe(console.log)

  setTimeout(() => {
    subscribeToFirst = false
    firstOrSecond.subscribe(console.log)
  }, 1000)
}

example2()
function example2() {
  let accessGranted = false
  const observableIfYouHaveAccess = iif(
    () => accessGranted,
    of("It seems you have an access..."), // Note that only one Observable is passed to the operator.
    of()
  )

  accessGranted = true
  observableIfYouHaveAccess.subscribe({
    next: console.log,
    complete: () => console.log("The end")
  })

  accessGranted = false
  observableIfYouHaveAccess.subscribe({
    next: console.log,
    complete: () => console.log("The end")
  })
}
