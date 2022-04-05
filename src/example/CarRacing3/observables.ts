import type { Observable } from "rxjs"
import { fromEvent, interval, merge } from "rxjs"
import {
  map,
  switchMap,
  distinctUntilChanged,
  filter,
  takeUntil,
  takeWhile,
  takeLast
} from "rxjs/operators"

import {
  source,
  CONS,
  playermoveLeft,
  playermoveright,
  onInterval
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

export const game = source.pipe(
  takeWhile(state => state.globalState.lives > 0)
)
const gameover = game.pipe(takeLast(1))

export const gameEvents = merge(arrowLeftRight, road).pipe(
  takeUntil(gameover)
)
