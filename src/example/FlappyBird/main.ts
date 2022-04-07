import produce from "immer"

import type { Observable } from "rxjs"
import {
  interval,
  fromEvent,
  merge,
  combineLatest
} from "rxjs"
import {
  scan,
  map,
  filter,
  takeWhile,
  tap
} from "rxjs/operators"

import type {
  PointKind,
  State,
  PipePoint,
  Pipe
} from "./model"
import { CONST } from "./model"

const pointColor: Record<PointKind, string> = {
  empty: "white",
  solid: "gray",
  player: "cornflowerblue"
}

type CreatePoint = (pointKind: PointKind) => HTMLDivElement
const createPoint: CreatePoint = point => {
  const elem = document.createElement("div")
  elem.classList.add("board")
  elem.style.display = "inline-block"
  elem.style.marginLeft = "10px"
  elem.style.height = "6px"
  elem.style.width = "6px"
  elem.style.backgroundColor = pointColor[point]
  elem.style.borderRadius = "90%"
  return elem
}

/**
 *  坐标轴
 *  0   y
 *
 *  x
 */
const app = document.getElementById("app")!

type Render = (state: State) => void
const render: Render = ({ birdX, pipes, lives, score }) => {
  const board = Array.from({ length: CONST.size }, () =>
    Array.from({ length: CONST.size }, () => "empty")
  ).pipe(b => {
    pipes.forEach(col =>
      col.points.forEach(v => {
        b[v.x][v.y] = "solid"
      })
    )

    b[birdX][0] = "player"

    return b as PointKind[][]
  })

  app.innerHTML = `
    Lives: ${lives}, Score: ${score} <br />
    按Space跳跃,躲避灰色障碍物!
  `

  board.forEach(row => {
    const rowContainer = document.createElement("div")
    row.forEach(pointKind =>
      rowContainer.appendChild(createPoint(pointKind))
    )
    app.appendChild(rowContainer)
  })
}

type CreatePipe = (y: number) => Pipe
const createPipe: CreatePipe = y =>
  Math.floor(Math.random() * Math.floor(CONST.size)).pipe(
    random =>
      Array.from<void, PipePoint>(
        { length: CONST.size },
        (_, i) => ({
          x: i,
          y
        })
      ).filter(p => p.x < random || p.x > random + 2),
    points => ({
      checked: false,
      points
    })
  )

const pipes = interval(500).pipe(
  scan<number, Pipe[]>(
    acc =>
      (acc.length < 2
        ? [...acc, createPipe(CONST.size)]
        : acc
      )
        .filter(c => c.points.some(e => e.y > 0))
        .map(cols =>
          cols.points
            .map(e => ({
              x: e.x,
              y: e.y - 1
            }))
            .pipe(points => ({
              points,
              checked: false
            }))
        ),
    [createPipe(CONST.size / 2), createPipe(CONST.size)]
  )
)

const flys = fromEvent<KeyboardEvent>(
  document,
  "keydown"
).pipe(
  map(e => e.code),
  filter(code => code === "Space"),
  map(_ => "fly" as const)
)
const falls = interval(300).pipe(map(_ => "fall" as const))

const birdX = merge(flys, falls).pipe(
  scan(
    (xPos, flyOrFall) =>
      ({
        fly: (xPos: number) => (xPos > 0 ? xPos - 1 : xPos),
        fall: (xPos: number) =>
          xPos < CONST.size - 1 ? xPos + 1 : CONST.size - 1
      }[flyOrFall](xPos)),
    CONST.size - 1
  )
)

const game: Observable<State> = combineLatest({
  birdX,
  pipes
}).pipe(
  scan(
    (state, { birdX, pipes }) =>
      produce(state, draft => {
        draft.pipes = pipes
        draft.birdX = birdX

        if (
          !draft.pipes[0].checked &&
          pipes.some(c =>
            c.points.some(
              point => point.y === 0 && point.x === birdX
            )
          )
        ) {
          draft.pipes[0].checked = true
          draft.lives -= 1
        }

        if (
          !draft.pipes[0].checked &&
          pipes[0].points[0].y === 0
        ) {
          draft.pipes[0].checked = true
          draft.score += 1
        }
      }),
    {
      birdX: CONST.size - 1,
      pipes: [],
      lives: 3,
      score: 0
    } as State
  ),
  tap(render),
  takeWhile(state => state.lives > 0)
)

game.subscribe()