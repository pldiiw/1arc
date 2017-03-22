#!/bin/bash

set -e

if [ "$1" -a "$2" ]; then
  testnum="$(ls test |
    grep -oE '^[0-9]{2}' |
    uniq |
    wc -l |
    xargs printf '%02d')"
  touch test/$testnum-$1.{$2,expected}
  ${EDITOR:-true} test/$testnum-$1.{$2,expected}
  echo test/$testnum-$1.{$2,expected}
else
  echo "Usage: ./new_test.sh <test-name> <test-ext>"
fi
