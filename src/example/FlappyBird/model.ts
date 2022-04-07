export const CONST = Object.freeze({
  size: 10
})

export type PipePoint = Readonly<{
  x: number
  y: number
}>

export type Pipe = Readonly<{
  points: PipePoint[]
  checked: boolean
}>

export type PointKind = "empty" | "solid" | "player"

export type State = Readonly<{
  pipes: Pipe[]
  birdX: number
  lives: number
  score: number
}>
