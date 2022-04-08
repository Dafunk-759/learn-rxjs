import { defer, from, interval, switchMap } from "rxjs"

import {
  PollingKind,
  URLS,
  CONST,
  cat,
  meat
} from "./model"

const randoms = () =>
  [
    Math.round(Math.random() * 200 + 200), // w
    Math.round(Math.random() * 200 + 200) // h
  ] as const

const catPicture = defer(() =>
  randoms().pipe(
    wh => URLS.cat(...wh),
    url =>
      fetch(url)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob) as string)
        .then(cat),
    imageSrcPromise => from(imageSrcPromise)
  )
)

const meatsMessage = defer(() =>
  URLS.meat.pipe(
    url =>
      fetch(url)
        .then(res => res.json() as unknown)
        .then(data => (data as string[])[0])
        .then(meat),
    meatPromise => from(meatPromise)
  )
)

const pollings = {
  [PollingKind.cats]: interval(CONST.pollingDuration).pipe(
    switchMap(_ => catPicture)
  ),
  [PollingKind.meats]: interval(CONST.pollingDuration).pipe(
    switchMap(_ => meatsMessage)
  )
}

export default pollings
