# Design Documentation

Here's lies the documentation that shapes how our CHIP-8 interpreter was
thought.

The design documentation is composed of the following documents:
 * [The distinction between Interpreter and Engine][6] - What's the difference
   between the interpreter and the engine? This is answered there.
 * [The Interpreter Architecture][0] - Defines how our interpreter is
   articulated, what are its core components, modules.
 * [The Engine][1] - This document describes how the core of our
   interpreter, the CHIP-8 engine, is managed.
 * [The Engine Data Structure][2] - Defines the data structure that represents
   our CHIP-8 engine. This can be put into the technical part of the
documentation but as it defines a bit how we should think of our engine, it is
here, in the design part.
 * [The Intructions Set module][7] - How the instructions are defined
   and their associated subroutines are bound.
 * [The CLI specification][3] - The specification of our command line
   interface.
 * [The GUI specification][4] - The specification of our graphical user
   interface.
 * [The Utility module][8] - Preparing CHIP-8 source code for the engine and
   debugging tools.
 * [Syntax specification][5] - The specification that defines how the CHIP-8
   source code you may want to feed into our interpreter should be written.

[0]: ./interpreter-architecture.md
[1]: ./engine.md
[2]: ./engine-data-structure.md
[3]: ./cli.md
[4]: ./gui.md
[5]: ./syntax.md
[6]: ./interpreter-vs-engine.md
[7]: ./instruction-set.md
[8]: ./utility.md
