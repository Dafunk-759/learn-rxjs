import { interval, animationFrames, Observable } from "rxjs"
import {
  map,
  take,
  filter,
  repeat,
  pairwise,
  tap,
  share,
  delay
} from "rxjs/operators"

import "./style.css"

import type { GameState } from "./model"
import { initGameState } from "./model"

const app = document.getElementById("app")!

app.innerHTML = /* html */ `
  <canvas width="400px" height="300px" id="game">
  </canvas>
  <div id="fps"></div>
  <p class="instructions">
    Each time a block hits a wall, it gets faster. You can hit SPACE to pause the boxes. They will change colors to show they are paused.
  </p>
`

const gameArea = document.getElementById(
  "game"
) as HTMLCanvasElement
const fps = document.getElementById("fps")!

/**
 * This is our rendering function.
 * We take the given game state and render the items
 * based on their latest properties.
 */
type Render = (state: GameState) => void
const render: Render = state => {
  const ctx = gameArea.getContext("2d")!
  // Clear the canvas
  ctx.clearRect(
    0,
    0,
    gameArea.clientWidth,
    gameArea.clientHeight
  )

  // Render all of our objects
  // (simple rectangles for simplicity)
  state.objects.forEach(obj => {
    ctx.fillStyle = obj.state.color
    const { x, y, width, height } = obj.transformation
    ctx.fillRect(x, y, width, height)
  })
}

const frames = (() => {
  // If we get sporadic LONG frames
  // (browser was navigated away or
  // some other reason the frame takes a while)
  // we want to throttle that so we don't JUMP
  // ahead in any deltaTime calculations too far.
  const clampTo30FPS = (delta: number) =>
    delta > 1 / 30 ? 1 / 30 : delta

  return animationFrames().pipe(
    pairwise(),
    map(([p1, p2]) => (p2.timestamp - p1.timestamp) / 1000),
    map(clampTo30FPS),
    share()
  )
})()
