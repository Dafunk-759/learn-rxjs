import produce from "immer"

import { animationFrames, fromEvent, merge } from "rxjs"
import {
  map,
  filter,
  pairwise,
  share,
  scan,
  bufferCount,
  take
} from "rxjs/operators"

import "./style.css"

import type { GameState } from "./model"
import { initGameState, CONST } from "./model"

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

const pauses = fromEvent<KeyboardEvent>(
  document,
  "keydown"
).pipe(
  map(e => e.code),
  filter(code => code === "Space")
)

const game = (() => {
  const clampMag = (
    value: number,
    min: number,
    max: number
  ) => {
    let val = Math.abs(value)
    let sign = value < 0 ? -1 : 1
    if (min <= val && val <= max) {
      return value
    }
    if (min > val) {
      return sign * min
    }
    if (max < val) {
      return sign * max
    }

    throw "never"
  }

  const game = merge(frames, pauses).pipe(
    scan(
      (acc, cur) =>
        ({
          string: (state: GameState) =>
            produce(state, draft => {
              draft.objects.forEach(obj => {
                obj.state.isPaused = !obj.state.isPaused
                let newColor = obj.state.toggleColor
                obj.state.toggleColor = obj.state.color
                obj.state.color = newColor
              })
            }),
          number: (state: GameState) =>
            produce(state, draft => {
              const deltaTime = cur as number
              const {
                boundaries,
                bounceRateChanges,
                baseObjectVelocity
              } = CONST

              draft.objects.forEach(obj => {
                if (!obj.state.isPaused) {
                  obj.transformation.x =
                    obj.transformation.x +
                    obj.velocity.x * deltaTime
                  obj.transformation.y =
                    obj.transformation.y +
                    obj.velocity.y * deltaTime

                  let boundaryHit = ""
                  if (
                    obj.transformation.x +
                      obj.transformation.width >
                    boundaries.right
                  ) {
                    boundaryHit = "right"
                    //obj.velocity.x *= - bounceRateChanges.right;
                    obj.transformation.x =
                      boundaries.right -
                      obj.transformation.width
                  } else if (
                    obj.transformation.x < boundaries.left
                  ) {
                    //obj.velocity.x *= -bounceRateChanges.left;
                    boundaryHit = "left"
                    obj.transformation.x = boundaries.left
                  }
                  if (
                    obj.transformation.y +
                      obj.transformation.height >=
                    boundaries.bottom
                  ) {
                    //obj.velocity.y *= -bounceRateChanges.bottom;
                    boundaryHit = "bottom"
                    obj.transformation.y =
                      boundaries.bottom -
                      obj.transformation.height
                  } else if (
                    obj.transformation.y < boundaries.top
                  ) {
                    //obj.velocity.y *= -bounceRateChanges.top;
                    boundaryHit = "top"
                    obj.transformation.y = boundaries.top
                  }

                  if (boundaryHit) {
                    if (
                      boundaryHit === "right" ||
                      boundaryHit === "left"
                    ) {
                      obj.velocity.x *=
                        -bounceRateChanges[boundaryHit]
                    } else {
                      obj.velocity.y *=
                        -bounceRateChanges[
                          boundaryHit as "bottom" | "top"
                        ]
                    }
                  }

                  obj.velocity.x = clampMag(
                    obj.velocity.x,
                    0,
                    baseObjectVelocity.maxX
                  )
                  obj.velocity.y = clampMag(
                    obj.velocity.y,
                    0,
                    baseObjectVelocity.maxY
                  )
                }
              })
            })
        }[typeof cur as "string" | "number"](acc)),
      initGameState
    )
  )

  return game
})()

const fpss = frames.pipe(
  bufferCount(10),
  map(deltatimes =>
    deltatimes
      .reduce((acc, cur) => acc + cur)
      .pipe(total => 1 / (total / deltatimes.length))
  )
)

game.subscribe({
  next: render
})

fpss.subscribe({
  next: f => {
    fps.innerHTML = `fps: ${Math.round(f)}`
  }
})
