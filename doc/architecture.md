# CHIP-8 Interpreter Architecture

## What is this document?

This document describes how our CHIP-8 interpreter is built, the steps it takes
to make sense of the various instructions and how the CHIP-8 environment (the
data registers, timers, etc) is managed.

## From source to execution

The process of executing a CHIP-8 involves many steps.  
To achieve this goal, we chose to design our interpretor as a successive suite
of layers, a layer being a rather simple operation done on a given source
code.

Four main layers are involves in order to run CHIP-8 instructions: first we
remove every artefact in the source code that is not an instruction, afterwards
it is passed to the instructions serialization layer, being in charge of
distinguishing every instruction from the other. For our instructions to be
executed, we need to initialize a dedicated environment, including the data
registers and the memory. This is the environment initialization layer. Lastly,
we are now able to run our parsed CHIP-8 program. This happens in the
instruction interpretation layer.

## Artefact removing

This layer is the first one the source code passes through when being
interpreted. Rather simple, it discard every character not being part of an
instruction. This includes white-spaces, line returns, tabulations and
comments.
Here's a before/after example of source code being put into the artefact
removing layer:

Source code:
```
XXXX ; Here's an instruction

;; A section of code
YYYY
  ZZZZ
  AAAA
    BBBB
      CCCC
      ;; Commented instructions
      #|
        DDDD
        EEEE
        FFFF
      |#
GGGG HHHH
III ; There can be incorrect code too, but it is not the place where it is
    ; checked
JJJJKKKK
```

Source code after going through the artefact removing layer:
```
XXXXYYYYZZZZAAAABBBBCCCCGGGGGHHHHIIIJJJJKKKK
```

After this layer, we're left with only a suite of instructions, or more
precisely at this state: a suite of hexadecimal digits.

## Instructions serialization

After the artefact removing layer, the source code goes through the
instructions serialization layer. This is where our suite of hexadecimal digits
will be transformed into a real suite of instructions.

First, before doing any heavy computation, we should make sure that the
number of hexadecimal digits from our source code is divisible per four. An
instruction being composed of 4 hex digits, it is a quick check that our source
code does not contain any incomplete instruction.

Now, the instructions serialization layer will do what it is named after. Our
source code is converted from a bare suite of digits to a list of instructions,
where we can be ensured that each of these instructions is part of the CHIP-8
specification. To reach this goal, we _just_ have to take each set of four
digits in the source code, check that the instruction exists, that its
parameters are correct and start again with the next four digits.

The process to check if one of the provided supposed instructions exists can be
thought as a [Trie][trie-wikipedia]. If our set of digits reaches a leaf, then
this means this is an instruction. An example for instruction `8A34`:

Here's a part of our Trie:

```
R means that a data register is awaited.
N means any hex digit.

...  5    6    7    8  ...
    /    /    /      \
   5R   6R   7R      8R <- a branch
   |    |    |         \
  5RR  6RN  7RN         \
   |    |    |           \
  5RR0 6RNN 7RNN          \
                          8RR
                        ___|___
              _________///||\\\\_____________
             /     ____// || \\\_________    \
            /    /    /   ||  \\_____    \    \
           /    /    /    | \  \_    \    \    \
          /    /    /    /   |   \    \    \    \
         |    |    |    |    |    |    |    |    |
        8RR0 8RR1 8RR2 8RR3 8RR4 8RR5 8RR6 8RR7 8RRE <- a leaf
```

Since our instruction is `8A34`, it begins by an `8`, so we take the `8`
branch. Then, we want a register. `A` is a register, so go on to the next
branch. A register again, and `3` is one, next. We have a `4` now, does we have
a leaf with a `4`? Yes! We have reach a leaf, so our instruction exists. If we
had a `9` instead of our final `4`, then the fact that no corresponding leaf
resides in our Trie means that the instruction `8A39` does not exist.

The advantage of such a structure is that new instructions can added easily.

We can think of this layer as a syntax check for each of our instructions. At
this state we have executable code, but one thing is missing: the environment!

## Environment initialization

Every CHIP-8 instructions acts either on registers, memory or the screen. In
order for our instructions to run, we need to create an environment that
responds to what they request. Knowing that instructions should be stored in
memory, this is a quite vital step!

This environment should be composed of the following components:

 * 16 data registers, named `0` through `F`, and 1 byte long
 * 1 timer register, 1 byte
 * 1 sound register, 1 byte
 * An `I` register, 12 bits long
 * 4096 bytes of memory
 * A memory index which contains the current read memory address by the
   interpreter, 12 bits long, also known as the program counter.
 * The stack and stack pointer (respectively an array of 16 12-bit values and
   a 4 bit value)
 * A 64x32 pixels monochrome display
 * TODO: Input keypad
 * A 60Hz clock

Each register should be initialized at `0x00`, empty. The memory is also
initially filled with `0`s, with the memory index pointing to address `0x200`.
The screen is all black.

After this is initialized, we now have to fill our memory with the instructions
and some utilities.  
First, we should store our built-in CHIP-8 font in the memory. This sprite set
is 80 bytes long. We will store it from the address `0x000` through `0x04F`
included. Now it is time to write our instructions, starting with the first one
written at address `0x200`, and so on.

Afterwards, the program counter should point to the address `0x200`. All values
of the stack are set at `0x000` and the stack pointer at `0x0`.

This is pretty much all the interpreter has to set up to get ready to read the
instrutions.

## Instruction interpretation

Now that we have our sweet environment, we can set everything off and let
our cute code get executed. This is the instruction interpretation layer.

To run it, we initiate our 60Hz clock and for each cycle, we increment our
program counter by two bytes (the size of an instruction), read the next 16
bits opcode (instruction) and run what it wants (arithmetic, jumps, ...). We
conclude our cycle by decrementing by 1 our sound and timer registers. Then
the next cycle can begin if all went right. And so on.

The interpreter stops after reading the last byte of memory (`0xFFF`).

[trie-wikipedia]: https://en.wikipedia.org/wiki/Trie
