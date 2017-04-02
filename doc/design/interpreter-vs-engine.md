# The difference between Interpreter and Engine

Throughout the documentation, we will use the term `interpreter` and `engine`,
although they can be thought as interchangeable, they're not. They address two
very different things.

What we chose to call the `interpreter` is our entire project, all of its
modules, including the `engine`.

The latter, the `engine`, is only a module of our project. The central one,
actually. It takes care of creating a data structure and medorate how CHIP-8
instructions will be able to manipulate it. This what actually _interpret_ the
CHIP-8 code.
