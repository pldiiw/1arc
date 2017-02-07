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
instructions interpretation layer.

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

## Environment initialization

## Instructions interpretation
