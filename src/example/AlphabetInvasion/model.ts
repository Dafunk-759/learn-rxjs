import { fromState } from "../../util"

export const CONSTANTS = Object.freeze({
  levelChangeThreshold: 20,
  speedAdjust: 50,
  endThreshold: 15,
  gameWidth: 30
})

type Letter = {
  letter: string
  xPos: number
}
export type State = {
  score: number
  letters: Letter[]
  level: number
  intrvl: number
}

export type Render = (state: State) => void

const randomLetter = () =>
  String.fromCharCode(
    Math.random() *
      ("z".charCodeAt(0) - "a".charCodeAt(0)) +
      "a".charCodeAt(0)
  )
// 使用假的随机 因为 Setter 一定要是纯函数
// 不然状态不会同步(巨坑)
const randomLetters = Array.from<void, Letter>(
  { length: 100 },
  () => ({
    letter: randomLetter(),
    xPos: Math.floor(Math.random() * CONSTANTS.gameWidth)
  })
)

export const { subject, source } = fromState<State>({
  score: 0,
  letters: [],
  level: 1,
  intrvl: 600
})

// 所有的Setter 必须是纯函数
type Setter = typeof subject.value

const letter = (i: number): Letter => randomLetters[i]
export const addLetters =
  (i: number): Setter =>
  state => ({
    ...state,
    letters: [letter(i), ...state.letters]
  })

export const levelUp: Setter = state => ({
  ...state,
  level: state.level + 1,
  score: state.score + 1,
  letters: [],
  intrvl: state.intrvl - CONSTANTS.speedAdjust
})

const pop: <A>(arr: A[]) => A[] = arr => {
  arr = [...arr]
  arr.pop()
  return arr
}
export const removeLastLetter: Setter = state => ({
  ...state,
  score: state.score + 1,
  letters: pop(state.letters)
})
