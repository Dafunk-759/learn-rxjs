import { range, fromEvent } from "rxjs"
import { bufferCount } from "rxjs/operators"

import { normalObserver } from "../../util"

function example() {
  // startBufferEvery = 2
  // 1-2-3-4-5-6
  // 123-345-56

  // startBufferEvery = 1
  // 123-234-345-456
  const startBufferEvery = 1
  range(1, 6)
    .pipe(bufferCount(3, startBufferEvery))
    .subscribe(normalObserver())

  range(1, 6)
    .pipe(bufferCount(3))
    .subscribe(normalObserver())
}

function example1() {
  //Emit the last two click events as an array
  fromEvent(document, "click")
    .pipe(bufferCount(2))
    .subscribe(normalObserver())
}

example2()
function example2() {
  // On every click,
  // emit the last two click events as an array
  fromEvent(document, "click")
    .pipe(bufferCount(2, 1))
    .subscribe(normalObserver())
}
