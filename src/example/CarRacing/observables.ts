import type { Observable } from "rxjs"
import { fromEvent, interval, asapScheduler } from "rxjs"
import {
  map,
  switchMap,
  distinctUntilChanged,
  filter,
  takeUntil,
  takeWhile,
  takeLast,
  observeOn
} from "rxjs/operators"

import { source, CONS } from "./model"

export const game = source.pipe(
  takeWhile(state => state.globalState.lives > 0)
)
const gameover = game.pipe(takeLast(1))

const keyup = fromEvent<KeyboardEvent>(
  document,
  "keyup"
).pipe(map(e => e.code))

const playerY = game.pipe(
  map(state => state.player.y),
  distinctUntilChanged()
)

export const arrowleft = playerY.pipe(
  switchMap(
    y =>
      keyup.pipe(
        filter(code => code === "ArrowLeft" && y > 0)
      ) as Observable<"ArrowLeft">
  ),
  takeUntil(gameover)
)

export const arrowright = playerY.pipe(
  switchMap(
    y =>
      keyup.pipe(
        filter(
          code =>
            code === "ArrowRight" && y < CONS.gameWidth - 1
        )
      ) as Observable<"ArrowRight">
  ),
  takeUntil(gameover)
)

/**
 * `state.globalState.interval` 发生改变的流
 *
 * emit: interval
 */
const gamespeed = game.pipe(
  map(state => state.globalState.interval),
  distinctUntilChanged()
)

/**
 * `road` 是和`gamespeed`对应的 interval 计时器流
 *
 * emit: intervalIndex(number)
 */
export const road = gamespeed.pipe(
  switchMap(i => interval(i)),
  takeUntil(gameover)
)

/**
 * `scoreIncrese` 和 `collisions`
 * 共同依赖与第一个`car`没有`scored`
 * 当碰撞或得分时都会将`cars`的第一个
 * 的`scored`标记成`true`
 *
 * 如果不依赖与这个
 *
 * 就会表现于无限加分或无限减生命
 */
const topOneNotScored = game.pipe(
  filter(state => !state.road.cars[0].scored)
)

/**
 * `scoreIncrese` 是得分的事件流.
 *
 * emit: state
 */
export const scoreIncrease = topOneNotScored.pipe(
  filter(
    ({ road, player }) =>
      road.cars[0].y !== player.y &&
      road.cars[0].x === CONS.gameHeight - 1
  ),
  observeOn(asapScheduler)
)

/**
 * `collisions` 是碰撞的事件流.
 *
 * emit: state
 */
export const collisions = topOneNotScored.pipe(
  filter(
    ({ road, player }) =>
      road.cars[0].x === CONS.gameHeight - 1 &&
      road.cars[0].y === player.y
  ),
  observeOn(asapScheduler)
)

/**
 * 每当score改变时 `speedUp` 会emit当前的score.
 */
export const speedUp = game.pipe(
  map(state => state.globalState.score),
  distinctUntilChanged(),
  observeOn(asapScheduler)
)

export const needLevelUp = game.pipe(
  filter(state => state.globalState.duration < 0),
  observeOn(asapScheduler)
)
