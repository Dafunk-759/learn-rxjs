import type { State, ColKind } from "./model"
import {
  subject,
  CONSTANT,
  moveleft,
  moveright,
  moveBall,
  onCollide,
  onCrossed,
  changeDirx
} from "./model"

import {
  game,
  keyleft,
  keyright,
  ballInterval,
  collide,
  catchBall,
  crossed
} from "./observables"

const colKindToColor: Record<ColKind, string> = {
  empty: "white",
  plyer: "cornflowerblue",
  bll: "gray",
  brick: "silver"
}

const app = document.getElementById("app")!

type CE = (col: ColKind) => HTMLDivElement
const createElem: CE = col => {
  const elem = document.createElement("div")
  elem.classList.add("board")
  elem.style.display = "inline-block"
  elem.style.marginLeft = "10px"
  elem.style.height = "6px"
  elem.style.width = "10px"
  elem.style.backgroundColor = colKindToColor[col]
  elem.style.borderRadius = col === "bll" ? "100%" : "0%"
  return elem
}

type Render = (state: State) => void
const render: Render = ({ player, ball, bricks }) => {
  const game = Array.from<void, ColKind[]>(
    { length: CONSTANT.gamesize },
    () =>
      Array.from(
        { length: CONSTANT.gamesize },
        () => "empty"
      )
  )
  game[player.x][player.y] = "plyer"
  game[ball.x][ball.y] = "bll"
  bricks.forEach(b => {
    game[b.x][b.y] = "brick"
  })

  app.innerHTML = `
    Score: ${player.score} Lives: ${player.lives} <br/>
  `
  game.forEach(r => {
    const rowContainer = document.createElement("div")
    r.forEach(c => rowContainer.appendChild(createElem(c)))
    app.appendChild(rowContainer)
  })
}

const renderGameover = () => {
  app.innerHTML += /* html */ `
    <h1>Game Over</h1>
  `
}

game.subscribe({
  next: render,
  complete: renderGameover
})

keyleft.subscribe(_ => {
  // console.log("keyleft")
  subject.next(moveleft)
})
keyright.subscribe(_ => {
  // console.log("keyright")
  subject.next(moveright)
})
ballInterval.subscribe(_ => {
  // console.log("ball interval")
  subject.next(moveBall)
})
collide.subscribe(i => {
  // console.log("collide")
  subject.next(onCollide(i))
})
catchBall.subscribe(sign => {
  // console.log("catchBall")
  subject.next(changeDirx(sign))
})
crossed.subscribe(_ => {
  // console.log("crossed")
  subject.next(onCrossed)
})
