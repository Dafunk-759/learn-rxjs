import { from } from "rxjs"
import { mergeMap, groupBy, reduce } from "rxjs/operators"
import { normalObserver, fromInterval } from "../../util"

type Item = {
  id: number
  name: string
}

const items: Item[] = [
  { id: 1, name: "JavaScript" },
  { id: 1, name: "TypeScript" },
  { id: 2, name: "Parcel" },
  { id: 2, name: "webpack" },
  { id: 3, name: "TSLint" }
]

function example() {
  from<Item[]>(items)
    .pipe(
      groupBy(value => value.id),
      mergeMap(ob =>
        ob.pipe(
          reduce((acc, cur) => [...acc, cur], [] as Item[])
        )
      )
    )
    .subscribe(normalObserver())
}

example2()
function example2() {
  fromInterval(items, 1000)
    .pipe(
      groupBy(value => value.id),
      mergeMap(ob =>
        ob.pipe(
          reduce((acc, cur) => [...acc, cur], [] as Item[])
        )
      )
    )
    .subscribe(normalObserver())
}
