import { pipe } from "rxjs"
import produce from "immer"

import { fromState } from "../../util"

export const CONSTANT = (() => {
  const gamesize = 20
  const throttleTime = 10
  const initPlayX = gamesize - 2
  const initPlayY = gamesize / 2 - 1
  const initBallX = gamesize / 2
  const initBallY = gamesize - 3
  const initLives = 3
  const resetBallX = gamesize / 2 - 3

  return Object.freeze({
    gamesize,
    throttleTime,
    initPlayX,
    initPlayY,
    initBallX,
    initBallY,
    resetBallX,
    initLives
  })
})()

type GameObject = Readonly<{
  x: number
  y: number
}>
type Bricks = readonly GameObject[]
type Player = Readonly<
  {
    score: number
    lives: number
  } & GameObject
>
type Ball = Readonly<
  {
    dirX: number
    dirY: number
  } & GameObject
>
export type State = Readonly<{
  player: Player
  ball: Ball
  bricks: Bricks
}>

export type ColKind = "empty" | "plyer" | "bll" | "brick"

const initPlayer: Player = Object.freeze({
  x: CONSTANT.initPlayX,
  y: CONSTANT.initPlayY,
  score: 0,
  lives: CONSTANT.initLives
})

const initBall: Ball = Object.freeze({
  x: CONSTANT.initBallX,
  y: CONSTANT.initBallY,
  dirX: 1,
  dirY: 1
})

const initBricks: Bricks = (() => {
  const ret = []
  for (let r = 1; r < 8; r++) {
    for (
      let c = r % 2 === 0 ? 1 : 0;
      c < CONSTANT.gamesize;
      c += 2
    ) {
      ret.push({ x: r, y: c })
    }
  }
  return Object.freeze(ret) as Bricks
})()

const initState: State = Object.freeze({
  player: initPlayer,
  ball: initBall,
  bricks: initBricks
})

export const { subject, source } = fromState(initState)

type Setter = typeof subject.value

export const moveleft: Setter = produce(draft => {
  draft.player.y -= 1
})

export const moveright: Setter = produce(draft => {
  draft.player.y += 1
})

export const moveBall: Setter = produce(draft => {
  const { ball } = draft
  ball.dirX *= ball.x > 0 ? 1 : -1
  ball.dirY *=
    ball.y > 0 && ball.y < CONSTANT.gamesize - 1 ? 1 : -1
  ball.x += 1 * ball.dirX
  ball.y -= 1 * ball.dirY
})

const addScore: Setter = produce(draft => {
  draft.player.score += 1
})

export type Sign = 1 | -1
export const changeDirx = (sign: Sign): Setter =>
  produce(draft => {
    draft.ball.dirX *= sign
  })

const toggleDirx = changeDirx(-1)

const removeBrick = (i: number): Setter =>
  produce(draft => {
    draft.bricks.splice(i, 1)
  })

export const onCollide = (i: number): Setter =>
  pipe(addScore, toggleDirx, removeBrick(i))

const minusLives: Setter = produce(draft => {
  draft.player.lives -= 1
})

const resetBallX: Setter = produce(draft => {
  draft.ball.x = CONSTANT.resetBallX
})

export const onCrossed: Setter = pipe(
  minusLives,
  resetBallX
)
