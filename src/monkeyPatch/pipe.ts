import type { UnaryFunction } from "rxjs"

function pipe<T, A>(
  this: T,
  fn1: UnaryFunction<T, A>
): A
function pipe<T, A, B>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>
): B
function pipe<T, A, B, C>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>
): C
function pipe<T, A, B, C, D>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>
): D
function pipe<T, A, B, C, D, E>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>
): E
function pipe<T, A, B, C, D, E, F>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>
): F
function pipe<T, A, B, C, D, E, F, G>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>
): G
function pipe<T, A, B, C, D, E, F, G, H>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>
): H
function pipe<T, A, B, C, D, E, F, G, H, I>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
  fn9: UnaryFunction<H, I>
): I
function pipe<T, A, B, C, D, E, F, G, H, I>(
  this: T,
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
  fn9: UnaryFunction<H, I>,
  ...fns: UnaryFunction<any, any>[]
): unknown
function pipe<T>(
  this: T,
  ...fns: ((a: any) => any)[]
) {
  return fns.reduce((acc, fn) => fn(acc), this)
}

Object.prototype.pipe = pipe

export type Pipe = typeof pipe
