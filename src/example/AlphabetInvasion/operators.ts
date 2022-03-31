import { interval, fromEvent, asapScheduler } from "rxjs"
import {
  map,
  distinctUntilChanged,
  switchMap,
  startWith,
  filter,
  observeOn
} from "rxjs/operators"

import { source, CONSTANTS } from "./model"

type Source = typeof source

/**
 *  s 表示 `source`
 *  i 表示 `interval`
 *
 *  source: s---s---s---s---...---s
 *
 *  1. map i1---i1---i2---i2---...---in
 *
 *  2. distinctUntilChanged i1------i2------...---in
 *
 *  3. switchMap 0-1-2-3-4-5-6-0-1-2-3-4-5...---0-1-2-3-...
 */
export const toIntervals = (source: Source) =>
  source.pipe(
    map(state => state.intrvl),
    distinctUntilChanged(),
    switchMap(intrvl => interval(intrvl))
  )

const toFilteredKeypress = (lastLetter: string) =>
  fromEvent<KeyboardEvent>(document, "keydown").pipe(
    map(e => e.key),
    startWith(""),
    filter(key => key === lastLetter)
  )

/**
 *  s 表示 `source`
 *
 *  l(a-z) 表示 `letter`
 *
 *  k(a-z) 表示 `key`
 *
 *  source: s---s---s---s---...---s
 *
 *  1. map la---la---lb---lb---...---lz
 *
 *  2. distinctUntilChanged la------lb------...---lz
 *
 *  3. toFilteredKeypress ka------------...---kz
 */
export const toKeys = (source: Source) =>
  source.pipe(
    map(
      state =>
        state.letters[state.letters.length - 1]?.letter
    ),
    distinctUntilChanged(),
    switchMap(toFilteredKeypress)
  )

/**
 *  source: s------s------s------s------...------s
 * 
 *  needLevelUp: ------s------------s------...------
 * 
 * 这里要使用 asapScheduler (as soon as possible),
 * 因为要保证 subject.next(...) 必须是的异步.
 */
export const toLevelUp = (source: Source) =>
  source.pipe(
    filter(
      state =>
        state.score > 0 &&
        state.score % CONSTANTS.levelChangeThreshold === 0
    ),
    observeOn(asapScheduler)
  )
