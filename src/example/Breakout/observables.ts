import type { Observable } from "rxjs"
import { fromEvent, interval, asapScheduler } from "rxjs"
import {
  map,
  filter,
  takeWhile,
  takeUntil,
  takeLast,
  throttleTime,
  distinctUntilChanged,
  switchMap,
  observeOn
} from "rxjs/operators"

import type { Sign } from "./model"
import { source, CONSTANT } from "./model"

export const game = source.pipe(
  takeWhile(({ player }) => player.lives >= 0)
)
const gameover = game.pipe(takeLast(1))

const keycode = fromEvent<KeyboardEvent>(
  document,
  "keydown"
).pipe(
  map(e => e.code),
  throttleTime(CONSTANT.throttleTime)
)

const ypos = game.pipe(
  map(({ player }) => player.y),
  distinctUntilChanged()
)

type Left = "ArrowLeft"
export const keyleft = ypos.pipe(
  switchMap(
    y =>
      keycode.pipe(
        filter(code => code === "ArrowLeft" && y > 0)
      ) as Observable<Left>
  ),
  takeUntil(gameover)
)

type Right = "ArrowRight"
export const keyright = ypos.pipe(
  switchMap(
    y =>
      keycode.pipe(
        filter(code => code === "ArrowRight" && y < 20)
      ) as Observable<Right>
  ),
  takeUntil(gameover)
)

export const ballInterval = interval(150).pipe(
  takeUntil(gameover)
)

/**
 * `collide` 是和ball和brick碰撞的事件流.
 *
 * hold的值是被碰brick的下标.
 */
export const collide = game.pipe(
  map(({ ball, bricks }) =>
    bricks.findIndex(e => e.x === ball.x && e.y === ball.y)
  ),
  filter(i => i !== -1),
  observeOn(asapScheduler)
)

/**
 * `catchBall` 是玩家接住球的事件流.
 *
 * 1 和 -1 代表 dirX 的正负号.
 */
export const catchBall: Observable<Sign> = game.pipe(
  map(({ player, ball }) =>
    player.x === ball.x && player.y === ball.y ? -1 : 1
  ),
  distinctUntilChanged(),
  observeOn(asapScheduler)
)

/**
 * `crossed` 是球越界的事件流.
 */
export const crossed = game.pipe(
  filter(({ player, ball }) => ball.x > player.x),
  observeOn(asapScheduler)
)
