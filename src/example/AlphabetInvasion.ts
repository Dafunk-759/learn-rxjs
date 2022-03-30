import { fromEvent, interval } from "rxjs"
import {
  startWith,
  map,
  distinctUntilChanged,
  switchMap,
  takeWhile
} from "rxjs/operators"
import { fromState } from "../util"

interface Letter {
  letter: String
  xPos: number
}

interface State {
  score: number
  letters: Letter[]
  level: number
  intrvl: number
}

const randomLetter = () =>
  String.fromCharCode(
    Math.random() *
      ("z".charCodeAt(0) - "a".charCodeAt(0)) +
      "a".charCodeAt(0)
  )
const letter = (): Letter => ({
  letter: randomLetter(),
  xPos: Math.floor(Math.random() * gameWidth)
})

const levelChangeThreshold = 20
const speedAdjust = 50
const endThreshold = 15
const gameWidth = 30

const app = document.getElementById("app")!
const renderGame = (state: State) => (
  (app.innerHTML = `Score: ${state.score}, Level: ${state.level} <br/>`),
  state.letters.forEach(
    l =>
      (app.innerHTML +=
        "&nbsp".repeat(l.xPos) + l.letter + "<br/>")
  ),
  (app.innerHTML +=
    "<br/>".repeat(
      endThreshold - state.letters.length - 1
    ) + "-".repeat(gameWidth))
)

const renderGameOver = () =>
  (app.innerHTML += "<br/>GAME OVER!")

const { subject, source } = fromState<State>({
  score: 0,
  letters: [],
  level: 1,
  intrvl: 600
})
type Setter = typeof subject.value

const addLetters: Setter = state => ({
  ...state,
  letters: [letter(), ...state.letters]
})

const levelUp: Setter = state => ({
  ...state,
  level: state.level + 1,
  score: state.score + 1,
  letters: [],
  intrvl: state.intrvl - speedAdjust
})

const pop: <A>(arr: A[]) => A[] = arr => {
  arr = [...arr]
  arr.pop()
  return arr
}

const keyPress =
  (key: string): Setter =>
  state => {
    let lastLetter = state.letters[state.letters.length - 1]
    if (lastLetter && lastLetter.letter === key) {
      return {
        ...state,
        score: state.score + 1,
        letters: pop(state.letters)
      }
    } else {
      return state
    }
  }

source
  .pipe(
    takeWhile(state => state.letters.length < endThreshold)
  )
  .subscribe({
    next: state => {
      renderGame(state)

      let score = state.score
      if (score > 0 && score % levelChangeThreshold === 0) {
        subject.next(levelUp)
      }
    },
    complete: renderGameOver
  })

source
  .pipe(
    map(state => state.intrvl),
    distinctUntilChanged(),
    switchMap(intrvl => interval(intrvl))
  )
  .subscribe(_ => subject.next(addLetters))

fromEvent<KeyboardEvent>(document, "keydown")
  .pipe(
    map(e => e.key),
    startWith("")
  )
  .subscribe(key => subject.next(keyPress(key)))
