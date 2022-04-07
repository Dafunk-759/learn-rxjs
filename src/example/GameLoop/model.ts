const boundaries = Object.freeze({
  left: 0,
  top: 0,
  bottom: 300,
  right: 400
})

const bounceRateChanges = Object.freeze({
  left: 1.1,
  top: 1.2,
  bottom: 1.3,
  right: 1.4
})

const baseObjectVelocity = Object.freeze({
  x: 30,
  y: 40,
  maxX: 250,
  maxY: 200
})

export const CONST = Object.freeze({
  boundaries,
  bounceRateChanges,
  baseObjectVelocity
})

type Transformation = Readonly<{
  x: number
  y: number
  width: number
  height: number
}>

type State = Readonly<{
  isPaused: boolean
  toggleColor: string
  color: string
}>

type Velocity = Readonly<{
  x: number
  y: number
}>

type ObjState = Readonly<{
  transformation: Transformation
  state: State
  velocity: Velocity
}>

export type GameState = Readonly<{
  objects: ObjState[]
}>
const small: ObjState = Object.freeze({
  // Transformation Props
  transformation: {
    x: 10,
    y: 10,
    width: 20,
    height: 30
  },
  // State Props
  state: {
    isPaused: false,
    toggleColor: "#FF0000",
    color: "#000000"
  },
  // Movement Props
  velocity: {
    x: baseObjectVelocity.x,
    y: baseObjectVelocity.y
  }
})

const big: ObjState = Object.freeze({
  // Transformation Props
  transformation: {
    x: 200,
    y: 249,
    width: 50,
    height: 20
  },
  // State Props
  state: {
    isPaused: false,
    toggleColor: "#00FF00",
    color: "#0000FF"
  },
  // Movement Props
  velocity: {
    x: -baseObjectVelocity.x,
    y: 2 * baseObjectVelocity.y
  }
})

export const initGameState: GameState = Object.freeze({
  objects: [small, big]
})
