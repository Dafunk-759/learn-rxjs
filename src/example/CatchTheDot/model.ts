import { fromState } from "../../util"

type Dot = Readonly<{
  x: number
  y: number
  size: number
}>

export type State = Readonly<{
  score: number
  interval: number
  count: number
  dot: Dot
}>

export const randomXY = (() => {
  const random = () => Math.random() * 300
  return Array.from({ length: 1000 }, () => ({
    x: random(),
    y: random()
  }))
})()

const initState: State = Object.freeze({
  score: 0,
  interval: 500,
  dotSize: 30,
  count: 5,
  dot: Object.freeze({
    x: 0,
    y: 0,
    size: 30
  })
})

export const { subject, source } =
  fromState<State>(initState)
export type Setter = typeof subject.value
