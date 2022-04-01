import type { Render } from "./model"
import {
  CONSTANTS,
  subject,
  addLetters,
  removeLastLetter,
  levelUp
} from "./model"

import {
  intervalLetters,
  keys,
  levelUps,
  game
} from "./obervables"

const app = document.getElementById("app")!
const renderGame: Render = state => {
  app.innerHTML = /* html */ `
    Score: ${state.score}, Level: ${state.level} <br/>
    ${state.letters
      .map(l => "&nbsp".repeat(l.xPos) + l.letter + "<br/>")
      .join("")}
    ${
      "<br/>".repeat(
        CONSTANTS.endThreshold - state.letters.length - 1
      ) + "-".repeat(CONSTANTS.gameWidth)
    }
  `
}
const renderGameOver = () =>
  (app.innerHTML += "<br/>GAME OVER!")

intervalLetters.subscribe(i => subject.next(addLetters(i)))
keys.subscribe(_ => subject.next(removeLastLetter))
levelUps.subscribe(_ => subject.next(levelUp))

game.subscribe({
  next: renderGame,
  complete: renderGameOver
})
