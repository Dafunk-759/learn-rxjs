import { takeWhile } from "rxjs/operators"

import type { State } from "./model"
import {
  CONSTANTS,
  source,
  subject,
  addLetters,
  removeLastLetter,
  levelUp
} from "./model"

import { toIntervals, toKeys, toLevelUp } from "./operators"

const app = document.getElementById("app")!

const renderGame = (state: State) => (
  (app.innerHTML = `Score: ${state.score}, Level: ${state.level} <br/>`),
  state.letters.forEach(
    l =>
      (app.innerHTML +=
        "&nbsp".repeat(l.xPos) + l.letter + "<br/>")
  ),
  (app.innerHTML +=
    "<br/>".repeat(
      CONSTANTS.endThreshold - state.letters.length - 1
    ) + "-".repeat(CONSTANTS.gameWidth))
)

const renderGameOver = () =>
  (app.innerHTML += "<br/>GAME OVER!")

const intervalSub = source
  .pipe(toIntervals)
  .subscribe(i => subject.next(addLetters(i)))

const keySub = source
  .pipe(toKeys)
  .subscribe(_ => subject.next(removeLastLetter))

const levelUpSub = source
  .pipe(toLevelUp)
  .subscribe(_ => subject.next(levelUp))

source
  .pipe(
    takeWhile(
      state => state.letters.length < CONSTANTS.endThreshold
    )
  )
  .subscribe({
    next: renderGame,
    complete: () => {
      renderGameOver()
      intervalSub.unsubscribe()
      keySub.unsubscribe()
      levelUpSub.unsubscribe()
    }
  })
