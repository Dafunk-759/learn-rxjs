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

type Cat = {
  t: PollingKind.cats
  url: string
}
export const cat = (url: string): Cat => ({
  t: PollingKind.cats,
  url
})

type Meat = {
  t: PollingKind.meats
  content: string
}
export const meat = (content: string): Meat => ({
  t: PollingKind.meats,
  content
})

export enum PollingState {
  start = "start",
  end = "end"
}