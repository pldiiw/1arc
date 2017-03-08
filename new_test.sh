#!/bin/bash

set -e

if [ "$1" -a "$2" ]; then
  touch test/$1.{$2,expected}
  ${EDITOR:-true} test/$1.{$2,expected}
  echo test/$1.{$2,expected}
else
  echo "Usage: ./new_test.sh <test-name> <test-ext>"
fi
