import { fromState } from "../../util"

export type State = Readonly<{
  score: number
  interval: number
  threshold: number
}>

const initState: State = Object.freeze({
  score: 0,
  interval: 0,
  threshold: 300
})

export const { subject, source } =
  fromState<State>(initState)

export type Setter = typeof subject.value
