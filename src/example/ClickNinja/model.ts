export type State = Readonly<{
  score: number
  interval: number
  threshold: number
}>

export const initState: State = Object.freeze({
  score: 0,
  interval: 0,
  threshold: 300
})
