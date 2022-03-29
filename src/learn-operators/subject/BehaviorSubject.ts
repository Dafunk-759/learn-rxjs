import { BehaviorSubject, fromEvent, timer } from "rxjs"
import { map } from "rxjs/operators"
import {
  normalObserver,
  fromReducer,
  fromState
} from "../../util"

function e1() {
  const numberSource = new BehaviorSubject(123)

  numberSource.subscribe(normalObserver())
  numberSource.subscribe(normalObserver())

  numberSource.next(456)

  numberSource.subscribe(normalObserver())

  numberSource.next(789)
}

function e2() {
  const id = (() => {
    let id = 0
    return () => id++
  })()

  const app = document.getElementById("app") as HTMLElement

  const countId = id()
  app.innerHTML += /* html */ `
    <h1>Count: </h1>
    <p id=${countId}></p>
  `

  const setElementText = (elid: number, text: string) => {
    const el = document.getElementById(elid.toString())
    if (el) {
      el.innerText = text.toString()
    }
  }

  type Coords = {
    id: number
    x: number
    y: number
  }
  const addCircle = ({ id, x, y }: Coords) =>
    (app.innerHTML += /* html */ `
      <div 
        id=${id}
        style="
          position: absolute;
          height: 30px;
          width: 30px;
          text-align: center;
          top: ${y}px;
          left: ${x}px;
          background: silver;
          border-radius: 80%;"
        >
      </div>`)

  type State = {
    count: number
    elmentIds: number[]
  }

  type Action =
    | { t: "setcount"; p: number }
    | { t: "addelemnt"; p: number }

  const { subject, source } = fromReducer<State, Action>(
    (state, action) => {
      switch (action.t) {
        case "setcount":
          return { ...state, count: action.p }
        case "addelemnt":
          return {
            ...state,
            elmentIds: [...state.elmentIds, action.p]
          }
      }
    },
    {
      count: 0,
      elmentIds: []
    }
  )

  source.subscribe(state => {
    setElementText(countId, state.count.toString())
    state.elmentIds.forEach(id => {
      setElementText(id, state.count.toString())
    })
  })

  fromEvent<MouseEvent>(document, "click")
    .pipe(
      map<MouseEvent, Coords>(e => ({
        id: id(),
        x: e.clientX,
        y: e.clientY
      }))
    )
    .subscribe(coords => {
      addCircle(coords)
      subject.next({ t: "addelemnt", p: coords.id })
    })

  timer(0, 1000).subscribe(i =>
    subject.next({ t: "setcount", p: i })
  )
}

e3()
function e3() {
  const id = (() => {
    let id = 0
    return () => id++
  })()

  const app = document.getElementById("app") as HTMLElement

  const countId = id()
  app.innerHTML += /* html */ `
    <h1>Count: </h1>
    <p id=${countId}></p>
  `

  const setElementText = (elid: number, text: string) => {
    const el = document.getElementById(elid.toString())
    if (el) {
      el.innerText = text.toString()
    }
  }

  type Coords = {
    id: number
    x: number
    y: number
  }
  const addCircle = ({ id, x, y }: Coords) =>
    (app.innerHTML += /* html */ `
      <div 
        id=${id}
        style="
          position: absolute;
          height: 30px;
          width: 30px;
          text-align: center;
          top: ${y}px;
          left: ${x}px;
          background: silver;
          border-radius: 80%;"
        >
      </div>`)

  type State = {
    count: number
    elmentIds: number[]
  }
  const { subject, source } = fromState<State>({
    count: 0,
    elmentIds: []
  })
  source.subscribe(state => {
    setElementText(countId, state.count.toString())
    state.elmentIds.forEach(id => {
      setElementText(id, state.count.toString())
    })
  })

  fromEvent<MouseEvent>(document, "click")
    .pipe(
      map<MouseEvent, Coords>(e => ({
        id: id(),
        x: e.clientX,
        y: e.clientY
      }))
    )
    .subscribe(coords => {
      addCircle(coords)
      subject.next(state => ({
        ...state,
        elmentIds: [...state.elmentIds, coords.id]
      }))
    })

  timer(0, 1000).subscribe(i =>
    subject.next(state => ({
      ...state,
      count: i
    }))
  )
}
