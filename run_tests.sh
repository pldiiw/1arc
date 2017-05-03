#!/bin/bash

# Linting
semistandard src/**/*.js || exit
semistandard test/*.js |
  grep -v "'test' is not defined" |
  grep -v "'expect' is not defined" || exit

# Run JS tests
jest test/

# Run bash tests if found (secondary)
which bats > /dev/null && bats test/*.bats
