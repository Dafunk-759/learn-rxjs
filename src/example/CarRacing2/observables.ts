import type { Observable } from "rxjs"
import {
  fromEvent,
  interval,
  merge,
  asapScheduler
} from "rxjs"
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

import {
  source,
  CONS,
  playermoveLeft,
  playermoveright,
  onInterval,
  increaseScore,
  decreasePlayerLives,
  levelUp,
  decreaseDuration
} from "./model"

const arrowLeftRight = (() => {
  const keyup = fromEvent<KeyboardEvent>(
    document,
    "keyup"
  ).pipe(map(e => e.code))

  const playerY = source.pipe(
    map(state => state.player.y),
    distinctUntilChanged()
  )

  const arrowleft = playerY.pipe(
    switchMap(
      y =>
        keyup.pipe(
          filter(code => code === "ArrowLeft" && y > 0)
        ) as Observable<"ArrowLeft">
    ),
    map(_ => playermoveLeft)
  )

  const arrowright = playerY.pipe(
    switchMap(
      y =>
        keyup.pipe(
          filter(
            code =>
              code === "ArrowRight" &&
              y < CONS.gameWidth - 1
          )
        ) as Observable<"ArrowRight">
    ),
    map(_ => playermoveright)
  )

  return merge(arrowleft, arrowright)
})()

const road = (() => {
  const gamespeed = source.pipe(
    map(state => state.globalState.interval),
    distinctUntilChanged()
  )

  /**
   * `road`是一个计时器,每当`gamespeed`发生改变时
   * 重新计时.
   */
  const road = gamespeed.pipe(
    switchMap(i => interval(i)),
    map(i => onInterval(i))
  )
  return road
})()

const { scoreIncrease, collisions } = (() => {
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
  const topOneNotScored = source.pipe(
    filter(state => !state.road.cars[0].scored)
  )

  const scoreIncrease = topOneNotScored.pipe(
    filter(
      ({ road, player }) =>
        road.cars[0].y !== player.y &&
        road.cars[0].x === CONS.gameHeight - 1
    ),
    map(_ => increaseScore)
  )

  const collisions = topOneNotScored.pipe(
    filter(
      ({ road, player }) =>
        road.cars[0].x === CONS.gameHeight - 1 &&
        road.cars[0].y === player.y
    ),
    map(_ => decreasePlayerLives)
  )

  return { scoreIncrease, collisions }
})()

const speedUp = source.pipe(
  map(state => state.globalState.score),
  distinctUntilChanged(),
  map(_ => decreaseDuration)
)

const needLevelUp = source.pipe(
  filter(state => state.globalState.duration <= 0),
  map(_ => levelUp)
)

export const game = source.pipe(
  takeWhile(state => state.globalState.lives > 0)
)
const gameover = game.pipe(takeLast(1))

export const gameEvents = merge(
  arrowLeftRight,
  road,
  scoreIncrease,
  collisions,
  speedUp,
  needLevelUp
).pipe(observeOn(asapScheduler), takeUntil(gameover))
