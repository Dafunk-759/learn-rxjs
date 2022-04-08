import "./style.css"

import {
  merge,
  fromEvent,
  combineLatest,
  EMPTY
} from "rxjs"
import {
  map,
  startWith,
  switchMap,
  distinctUntilChanged
} from "rxjs/operators"

import { PollingKind, PollingState } from "./model"

import pollings from "./pollings"

const app = document.getElementById("app")!

// template
app.innerHTML = /* html */ `
  <h1> RxJS Polling Recipe</h1>
  <p> 
    Select Cats or Meats and start polling! 
    The Cats option will request random 
    <a href="https://plackitten.com">
      place kitten
    </a> images, and the meats option will request 
      random blocks of 
    <a href="https://baconipsum.com/json-api/">bacon-ipsum</a>.
  </p>
  <p> Polling Status: 
    <span id="polling-status"> Stopped </span> 
  </p>

  <div>
    <label for="catsCheckbox">Cats</label>
    <input type="radio" name="type" id="catsCheckbox" 
           value="cats" checked />
    <label for="meatsCheckbox">Meats</label>
    <input type="radio" name="type" id="meatsCheckbox" 
           value="meats"/>
  </div>

  <div>
    <button id="start">Start polling</button>
    <button id="stop">Stop polling</button>
  </div>

  <img style="max-width: 400px; max-height: 400px;" 
       id="cat" src="https://placekitten.com/g/205/205" 
       alt="incoming cats!"
  />

  <p id="text">
    Text Will appear here
  </p>
`

const els = (() => {
  const byId = (id: string) => document.getElementById(id)!

  return {
    startButton: byId("start"),
    stopButton: byId("stop"),
    text: byId("text"),
    pollingStatus: byId("polling-status"),
    catsRadio: byId("catsCheckbox"),
    meatsRadio: byId("meatsCheckbox"),
    catImage: byId("cat") as HTMLImageElement
  }
})()

const catsOrMeats = merge(
  fromEvent(els.catsRadio, "change").pipe(
    map(_ => PollingKind.cats)
  ),
  fromEvent(els.meatsRadio, "change").pipe(
    map(_ => PollingKind.meats)
  )
).pipe(startWith(PollingKind.cats))

const startOrEnd = merge(
  fromEvent(els.startButton, "click").pipe(
    map(_ => PollingState.start)
  ),
  fromEvent(els.stopButton, "click").pipe(
    map(_ => PollingState.end)
  )
).pipe(startWith(PollingState.end), distinctUntilChanged())

const state = combineLatest({
  catsOrMeats,
  startOrEnd
}).pipe(
  switchMap(({ catsOrMeats, startOrEnd }) => {
    if (startOrEnd === PollingState.end) {
      return EMPTY
    } else {
      return pollings[catsOrMeats]
    }
  })
)

state.subscribe({
  next: s => {
    console.log("state: ", s)

    switch (s.t) {
      case PollingKind.cats:
        els.catImage.src = s.url
        return
      case PollingKind.meats:
        els.text.innerText = s.content
        return
    }
  }
})
