import produce from "immer"

import {
  fromEvent,
  interval,
  merge,
  pipe,
  asyncScheduler,
  combineLatest
} from "rxjs"
import {
  tap,
  map,
  switchMap,
  scan,
  takeWhile,
  observeOn,
  takeUntil,
  takeLast,
  distinctUntilChanged
} from "rxjs/operators"

import type { State, Setter } from "./model"
import { subject, source, randomXY } from "./model"

import "./style.css"

const app = document.getElementById("app")!
app.innerHTML = /* html */ `
  <div id="timer"></div>
  <div id="dot"></div>
`
const timer = document.getElementById("timer")!
const dot = document.getElementById("dot")!

const randomColor = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16)

type Render = (s: State) => void
const render: Render = state => {
  const { score, count } = state
  const { size, x, y } = state.dot

  dot.style.height = `${size}px`
  dot.style.width = `${size}px`
  dot.style.transform = `translate(${x}px, ${y}px)`

  if (score % 3 === 0) {
    dot.style.backgroundColor = randomColor()
  }

  dot.innerText = score.toString()

  timer.innerText = count.toString()
}

const renderGameOver = () => {
  timer.innerHTML = "ouch!"
}

const { game, gameEvents } = (() => {
  const moveRandom = (i: number): Setter =>
    produce(draft => {
      draft.dot = {
        ...draft.dot,
        ...randomXY[i]
      }
    })
  const addScore: Setter = produce(draft => {
    draft.score++
  })
  const decreaseInterval: Setter = produce(draft => {
    const { score } = draft
    if (score !== 0 && score % 3 === 0) {
      if (draft.interval > 200) draft.interval -= 50
    }
  })
  const smallSize: Setter = produce(draft => {
    draft.dot.size = 5
  })
  const normalSize: Setter = produce(draft => {
    draft.dot.size = 30
  })
  const setCount = (count: number): Setter =>
    produce(draft => {
      draft.count = count
    })

  const mouseover = fromEvent<MouseEvent>(
    dot,
    "mouseover"
  ).pipe(scan(acc => acc + 1, 0))
  const mouseoverEvents = mouseover.pipe(
    map<number, Setter>(i =>
      pipe(
        moveRandom(i),
        addScore,
        decreaseInterval,
        smallSize
      )
    )
  )

  const intervalCount = combineLatest([
    source.pipe(
      map(state => state.interval),
      distinctUntilChanged()
    ),
    mouseover
  ]).pipe(
    tap(s => console.log("interval count", s)),
    switchMap(([i]) =>
      interval(i).pipe(
        map(v => 5 - v),
        map<number, Setter>(count =>
          pipe(normalSize, setCount(count))
        )
      )
    )
  )

  const game = source.pipe(
    takeWhile(state => state.count > 0)
  )
  const gameEvents = merge(
    mouseoverEvents,
    intervalCount
  ).pipe(
    observeOn(asyncScheduler),
    takeUntil(game.pipe(takeLast(1)))
  )

  return { game, gameEvents }
})()

game.subscribe({
  next: render,
  complete: renderGameOver
})
gameEvents.subscribe(setter => {
  console.log("events")
  subject.next(setter)
})
