import { fromEvent } from "rxjs"
import {
  timeInterval,
  takeWhile,
  scan,
  repeat,
  map,
  finalize
} from "rxjs/operators"

import produce from "immer"

import type { State } from "./model"
import { initState } from "./model"

const app = document.getElementById("app")!

app.innerHTML = /* html */ `
  <div>How fast can you click?!</div>
`

const texts = [
  "click, click",
  "keep clicking",
  "wow",
  "not tired yet?!",
  "click master!",
  "inhuman!!!",
  "ininhuman!!!"
]

type Render = (state: State) => void
const render: Render = ({ score }) => {
  const level = Math.floor(score / 10)
  const id = "level" + level
  const text = `${texts[level]} \n ${score}`
  const element = document.getElementById(id)

  if (element) {
    element.innerText = text
  } else {
    const elem = document.createElement("div")
    elem.id = id
    elem.style.zIndex = `${level}`
    elem.style.position = "absolute"
    elem.style.height = "150px"
    elem.style.width = "150px"
    elem.style.borderRadius = "10px"
    const position = level * 20
    elem.style.top = position + "px"
    elem.style.left = position + "px"
    const col = 100 + position
    elem.style.background = `rgb(0,${col},0)`
    elem.style.color = "white"
    elem.innerText = text
    elem.style.textAlign = "center"
    elem.style.verticalAlign = "middle"
    elem.style.lineHeight = "90px"
    app.appendChild(elem)
  }
}

const clear = () => {
  app.innerText = ""
}

const clickIntervals = fromEvent(
  document,
  "mousedown"
).pipe(
  timeInterval(),
  map(value => value.interval)
)

const game = clickIntervals.pipe(
  scan<number, State>(
    (state, i) =>
      produce(state, draft => {
        draft.interval = i
        draft.score++
        draft.threshold -= 2
      }),
    initState
  ),
  takeWhile(state => state.interval < state.threshold),
  finalize(() => {
    console.log("finalize")
    clear()
  }),
  repeat()
)

game.subscribe({
  next: render
})
