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

What's contained in this module is solely the subroutines that acts onto the
engine data structure. So for each possible instruction, you have a function
that should take in parameter the engine data structure and returns a new one
after having applied the effect of calling this instruction.

For instance, the instruction `7XNN`, the instruction that adds the hexadecimal
number `NN` to the data register `X`, can be bound to the function
`addToRegister` that takes as parameter the engine data structure, `X` and
`NN`, and returns a new engine data structure with `NN` added to the data
register `X`.

When importing this module, it should returns a Map with the instructions names
as keys and the corresponding functions as values.
