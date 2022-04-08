import { fromEvent } from "rxjs"
import { throttleTime, map } from "rxjs/operators"

import "./style.css"

const app = document.getElementById("app")!

app.innerHTML = /* html */ `
  <div id="indication">&nbsp;</div>
    Scroll down!!!
  <div 
    class="app" 
    style="position: absolute; margin-top: 3000px;"
  >
    Boom!
  </div>
`

const scrollIndication =
  document.getElementById("indication")!

const scrolls = fromEvent(document, "scroll").pipe(
  throttleTime(10),
  map(_ => ({
    doc: document.documentElement,
    get winScroll() {
      return this.doc.scrollTop
    },
    get height() {
      return this.doc.scrollHeight - this.doc.clientHeight
    }
  })),
  map(o => (o.winScroll / o.height) * 100),
  map(String)
)

scrolls.subscribe({
  next: width => {
    scrollIndication.style.width = width + "%"
  }
})
