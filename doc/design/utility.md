# Utility

## What is this document?

Here we will explain what is the purpose of the utility module.

## Abstract

The utility module is group of functions that have no place in the other
modules, or that are used in higher modules.

For example, we have enabled people to write CHIP-8 source code based on the
syntax defined in [syntax.md](./syntax.md), thus we need a tool to convert
these texts files into a format that we can hand out to the engine.

The following sections dissect every tool that this module provides.

## Artefact removing

This tool takes care of preparing source code to a format that the engine will
be able to feed into its memory.

Rather simple, it discard every character not being part of an
instruction. This includes white-spaces, line returns, tabulations and
comments. Concerning letter casing, everything is uppercased before returning
the final string of source code. This syntax is defined in the document
[syntax.md](./syntax.md).

Here's a before/after example of source code being put into the artefact
removing tool:

Source code:
```
XXXX ; Here's an instruction

;; A section of code
YYYY
  ZZZZ
  AAAA
    BbBB ; One letter lowercase!
      CCcc ; Half lowercase!
      ;; Commented instructions
      #|
        dddd ; Full lowercase!
        EEEE
        FFFF
      |#
GGGG HHHH
III ; There can be incorrect code too, but it is not the place where it is
    ; checked
JJJJKKKK
```

After:
```
XXXXYYYYZZZZAAAABBBBCCCCGGGGGHHHHIIIJJJJKKKK
```

We're left with only a suite of instructions, or more
precisely at this state: a suite of hexadecimal digits.

## Linting

A linter is a tool that checks for inconsistencies in source code. What it does
in our case is checking that a suite of instructions (see previous section)
contains only instructions that actually exists, rejecting anything else.

Here's how it achieves this:

First, before doing any heavy computation, we should make sure that the
number of hexadecimal digits from our suite of instructions is divisible per
four. An instruction being composed of 4 hex digits, it is a quick check that
our suite does not contain any incomplete instruction.

Now, the linter has to read every instruction and check that it is a correct
one. It retrieves all the possible instructions from the
[instruction set module](./instruction-set.md) and compare each set of four
digits against the provided Map. If the linter can found a key inside the
instruction Map that match this set of four digits, then this is a correct
instruction.

It should also detect sprites.

Any error is reported, but the linting should continue. Any incorrect
instruction will make the linter return a null value after having checked all
the suite.

## Dump engine

The utility module should also provide a `dumpEngine()` function. Given a
CHIP-8 engine data structure instance, it should translate it to a readable
JSON string, with every value the engine is containing written in it.

The JSON file should look like this (here, all values are set to 0):

```
{
  data: [
    0,
    0,
    ...
  ],
  I: 0,
  timer: 0,
  sound: 0,
  memory: [
    0,
    0,
    ...
  ],
  pc: 0,
  pointer: 0,
  stack: [
    0,
    0,
    ...
  ],
  display: [
    [false, false, ...],
    [false, false, ...],
    ...
  ],
  keypad: [
    false,
    false,
    ...
  ]
}
```

## Load engine

If we dump engines, we need a way to reverse the process, restoring
engines from previous dumps. This what the `loadEngine()` function does. It
takes as a parameter a string containing a dumped engine, and manages to
restore our previously dumped engine to an engine instance that is ready to be
used.

## Compare engines

The last tool the utility module implements is the `compareEngines()` function.

Its role is to return a string that contain all the differences between two
given engines (not dumps, data structures).

The format of the returned diff should be:

```
<component>: <engineA value> -> <engineB value>
```

Here's an example:

```
data[2]: 23 -> 243
data[3]: 255 -> 4
data[16]: 1 -> 0
pc: 512 -> 514
memory[200]: 3 -> 120
display[4]: 0000000011110000000000000000000010010000000000000000000000000000
         -> 0000000000001111000000000000000011110000000000000000000111111111
```
