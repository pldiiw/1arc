# CONTRIBUTING GUIDELINES

## What's this document?

This document defines what guidelines we follow when working on the
project. It includes the tools used, the coding style among others.

## Workflow

We try to follow a [DDD]/[TDD] oriented developement. All source code written
must match what's written the documentation and the behaviour described in the
tests.

All the documentation is in the `doc/` directory.
All tests lies in the `test/` directory.
There's two little scripts to help you create the file for a new test and run
the tests.

```
./new_test.sh <test-name> <file-ext>
./run_tests.sh
```

When running `XX-<test-name>.<file-ext>`, its output must match what's inside
`XX-<test-name>.expected`.

For pure JavaScript tests, we use [Jest].
The `run_tests.sh` script will also run the tests written with Jest.

## Git and GitHub

Tracking our work is essential. To fullfill this requirement we use Git along
GitHub. This brings less friction when working in parallel.

For a short introduction on Git, go to try.github.com.

We follow the [GitHub Flow] and the way
[Chris Beams describes a good commit message].


## Coding Style

The project is written in JavaScript. The coding style we follow is
[Flet' semistandard]. A little cli tool is available to automatically check if
the code match the style guide:

```
npm i -g semistandard
semistandard
```

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
