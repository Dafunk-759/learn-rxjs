import type { Pipe } from "./monkeyPatch/pipe"

declare global {
  // Here, declare things that go in the global namespace, 
  // or augment
  // existing declarations in the global namespace

  interface Object {
    pipe: Pipe
  }
}