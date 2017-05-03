# CONTRIBUTING GUIDELINES

## What's this document?

This document defines what guidelines we follow when working on the
project. It includes the tools used, the coding style among others.

## Workflow

We try to follow a [DDD]/[TDD] oriented developement. All source code written
must match what's written the documentation and the behaviour described in the
tests.

All the documentation is in the `doc/` directory.
All source code is in the `src/` directory.
All tests lies in the `test/` directory.

To run the tests:

```
npm i # If not done before
npm test
```

This will run the `run_tests.sh` script that will check for code style/syntax
(semistandard), run JavaScript tests (jest) and bash tests (bats).

## Git and GitHub

Tracking our work is essential. To fullfill this requirement we use Git along
GitHub. This brings less friction when working in parallel.

For a short introduction on Git, go to try.github.com.

We follow the [GitHub Flow] and the way
[Chris Beams describes a good commit message].

## Coding Style

The project is written in JavaScript. The coding style we follow is
[Flet' semistandard]. Running the tests will also check for the code style.

## EditorConfig

In order to help to match the style guide, we use [EditorConfig]. It helps to
control how an editor behaves and match how we should write the code without
having to over-configure our text editors.

## JSDoc

Working in group we may encounter situations when we don't know how to use
code written by others. JavaScript does not have type signatures, thus it is
harder to know what a function awaits as arguments. To overcome this issue, we
will use [JSDoc], it will enabling to automatically have an API documentation
of all of our code, also providing a good overview of what we produce.

[DDD]: https://gist.github.com/zsup/9434452
[TDD]: https://en.wikipedia.org/wiki/Test-driven_development
[Flet' semistandard]: https://github.com/Flet/semistandard
[GitHub Flow]: https://guides.github.com/introduction/flow/
[Chris Beams describes a good commit message]: https://chris.beams.io/posts/git-commit/
[JSDoc]: http://usejsdoc.org/
[Jest]: https://facebook.github.io/jest/
[EditorConfig]: http://editorconfig.org/
