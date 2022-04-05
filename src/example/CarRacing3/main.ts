import type { GameState, ColKind } from "./model"
import { CONS, subject } from "./model"
import { game, gameEvents } from "./observables"

import "./style.css"

const app = document.getElementById("app")!

// template
const _ = (() => {
  app.innerHTML = /* html */ `
    <div class="road">
      <div class="dotted" style="margin-left: 0px;"></div>
      <div class="dotted" style="margin-left: 9px;"></div>
      <div class="dotted" style="margin-left: 18px;"></div>
      <div class="dotted" style="margin-left: 27px;"></div>
      <div class="dotted" style="margin-left: 36px;"></div>
      <div class="dotted" style="margin-left: 45px;"></div>
      <div class="dotted" style="margin-left: 54px;"></div>
    </div>
    <div id="game"></div>
  `
})()

const carColor: Record<ColKind, string> = {
  car: "green",
  player: "blue",
  destroyed: "white"
}

type CreateCar = (col: ColKind) => HTMLDivElement
const createCar: CreateCar = col => {
  const el = document.createElement("div")
  el.style.display = "inline-block"
  el.style.marginLeft = "3px"
  el.style.height = "12px"
  el.style.width = "6px"
  el.style.borderRadius = "40%"
  el.style.backgroundColor = carColor[col]

  return el
}

const gameContainer = document.getElementById("game")!

type Render = (gamestate: GameState) => void
const render: Render = ({ globalState, road, player }) => {
  const cars = Array.from<void, ColKind[]>(
    { length: CONS.gameHeight },
    () =>
      Array.from(
        { length: CONS.gameWidth },
        () => "destroyed"
      )
  )

  road.cars.forEach(c => (cars[c.x][c.y] = "car"))

  gameContainer.innerHTML = `
    Score: ${globalState.score} 
    Lives: ${globalState.lives} 
    Level: ${globalState.level}  
  `

  cars[CONS.gameHeight - 1][player.y] = "player"

  cars.forEach(r => {
    const rowContainer = document.createElement("div")
    r.forEach(c => rowContainer.appendChild(createCar(c)))
    gameContainer.appendChild(rowContainer)
  })
}

const renderGameOver = () => {
  gameContainer.innerHTML += `
    <br/>GAME OVER!!!
  `
}

game.subscribe({
  next: state => {
    render(state)
  },
  complete: renderGameOver
})

gameEvents.subscribe(setter => {
  subject.next(setter)
})
