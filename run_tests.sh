#!/bin/bash

# Linting
semistandard src/**/*.js || true
semistandard test/*.js |
  grep -v "'describe' is not defined" |
  grep -v "'test' is not defined" |
  grep -v "'expect' is not defined" || true

# Run JS tests
node --harmony node_modules/jest/bin/jest.js test/

# Run bash tests if found (secondary)
which bats > /dev/null && bats test/*.bats || true
