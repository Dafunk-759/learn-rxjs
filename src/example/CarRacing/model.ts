import { pipe } from "rxjs"
import produce from "immer"

import { fromState } from "../../util"

type Car = Readonly<{
  x: number
  y: number
  scored: boolean
}>
type Cars = readonly Car[]
type Road = Readonly<{
  cars: Cars
}>

type Player = Readonly<{
  y: number
}>

type GlobalState = Readonly<{
  score: number
  lives: number
  level: number
  duration: number
  interval: number
}>

export type GameState = Readonly<{
  globalState: GlobalState
  road: Road
  player: Player
}>

export type ColKind = "car" | "player" | "destroyed"

export const CONS = (() => {
  const gameHeight = 10
  const gameWidth = 6

  const levelDuration = 500

  return Object.freeze({
    gameHeight,
    gameWidth,
    levelDuration
  })
})()

const initGlobalState: GlobalState = Object.freeze({
  score: 1,
  lives: 3,
  level: 1,
  duration: CONS.levelDuration,
  interval: 200
})

const initPlayer: Player = Object.freeze({ y: 0 })

const randomCars: Cars = (() => {
  const randomY = () =>
    Math.floor(Math.random() * Math.floor(CONS.gameWidth))

  let temp = Array.from({ length: 1000 }, () =>
    Object.freeze({
      x: 0,
      y: randomY(),
      scored: false
    })
  )
  return Object.freeze(temp)
})()
const initRoad: Road = Object.freeze({
  cars: [randomCars[0]]
})

const initState: GameState = Object.freeze({
  globalState: initGlobalState,
  road: initRoad,
  player: initPlayer
})

export const { subject, source } =
  fromState<GameState>(initState)

type Setter = typeof subject.value

export const playermoveLeft: Setter = produce(draft => {
  draft.player.y -= 1
})

export const playermoveright: Setter = produce(draft => {
  draft.player.y += 1
})

const removeCrossedCars: Setter = produce(({ road }) => {
  road.cars = road.cars.filter(
    c => c.x < CONS.gameHeight - 1
  )
})

const moveCars: Setter = produce(({ road }) => {
  road.cars.forEach(c => {
    c.x += 1
  })
})

const addCar = (i: number): Setter =>
  produce(({ road }) => {
    const needAdd = road.cars[0].x === CONS.gameHeight / 2
    if (needAdd) {
      road.cars.push(randomCars[i])
    }
  })

export const onInterval = (i: number): Setter =>
  pipe(removeCrossedCars, moveCars, addCar(i))

export const increaseScore: Setter = produce(
  ({ road, globalState }) => {
    road.cars[0].scored = true
    globalState.score += 1
  }
)

export const decreasePlayerLives: Setter = produce(
  ({ road, globalState }) => {
    road.cars[0].scored = true
    globalState.lives -= 1
  }
)

export const levelUp: Setter = produce(
  ({ globalState }) => {
    globalState.duration =
      CONS.levelDuration * globalState.level
    globalState.level++
    globalState.interval -=
      globalState.interval > 60 ? 20 : 0
  }
)

export const decreaseDuration: Setter = produce(draft => {
  draft.globalState.duration -= 20
})
