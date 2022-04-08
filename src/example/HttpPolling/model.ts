export const URLS = Object.freeze({
  cat: (w: number, h: number) =>
    `https://placekitten.com/g/${w}/${h}`,
  meat: `https://baconipsum.com/api/?type=meat-and-filler`
})

export const CONST = Object.freeze({
  // ms
  pollingDuration: 3000
})

export enum PollingKind {
  cats = "cats",
  meats = "meats"
}

export type Cat = {
  t: PollingKind.cats
  url: string
}

export type Meat = {
  t: PollingKind.meats
  content: string
}

export enum PollingState {
  start = "start",
  end = "end"
}
