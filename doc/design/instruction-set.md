# Instruction Set

## What is this document?

This document defines what is the "Instrution Set" module and its purpose.

## Abstract

We need a way to defines the possible CHIP-8 instructions of our interpreter
without coupling it with the engine. Why decoupling? Decoupling the
instructions of the engine gives us a way to have a flexible mean of defining
these instructions. They can be extended at any time and the engine will be
able to use them without having to modify it. And as the engine is really the
core, we don't want to touch it too often.

## The module

The main component that this module provides should be the `instruction`
function. This function takes as a parameter a string representing a CHIP-8
instruction, like `'719A'` (the `7XNN` instruction), and returns a new function
that awaits an engine data structure to apply the instruction upon it, deriving
a new engine data structure.

Here's an example:
```js
engine.data[1] = 0x03;
new_engine = instruction('719A')(engine);

engine.data[1]; // => 0x03
new_engine.data[1]; // => 0x9D
```

Under the hood, the `instruction` function decompose the passed string in order
to determine what the instruction is. After being decomposed, it returns the
partially applied related function. Here's an example:

```js
const 719A = instruction('719A');
/*
 * 1. 719A is the 7XNN instruction, with X = 1 and NN = 9A.
 * 2. The 7XNN instruction is implemented as addToRegister(engine, reg, n).
 * 3. Return partial application of addToRegister with reg = X and n = NN.
 */
const engine1 = 719A(engine);
const engine2 = addToRegister(engine, 0x1, 0x9A);

engine1 == engine2 // => true (for demonstration purpose)
```

The module should also provide a Map that binds every instruction with its
related function. `instruction()` uses it to get the appropriate function. It
should look like this:

```js
{
  '6XNN': setRegister,
  '7XNN': addToRegister,
  '8XY0': copyRegister,
  '8XY4': addRegisters,
  ...
}
```

The module should also export each of the instructions' functions, in order to
be able to use it in the tests for instance.
