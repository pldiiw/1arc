# Design Documentation

Here lies the documentation that shapes how our CHIP-8 interpreter was
thought.

The design documentation is composed of the following documents:
 * [The distinction between Interpreter and Engine](./interpreter-vs-engine.md) -
   What's the difference between the interpreter and the engine? This is
   answered there.
 * [The Interpreter Architecture](./interpreter-architecture.md) - Defines how
   our interpreter is articulated, what are its core components, modules.
 * [The Engine](./engine.md) - This document describes how the core of our
   interpreter, the CHIP-8 engine, is managed.
 * [The Intructions Set module](./instruction-set.md) - How the instructions
   are defined and their associated subroutines are bound.
 * [The CLI specification](./cli.md) - The specification of our command line
   interface.
 * [The GUI specification](./gui.md) - The specification of our graphical user
   interface.
 * [The Utility module](./utility.md) - Preparing CHIP-8 source code for the
   engine and debugging tools.
 * [Syntax specification](./syntax.md) - The specification that defines how the
   CHIP-8 source code you may want to feed into our interpreter should be
   written.
