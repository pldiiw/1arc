#!/bin/bash

shopt -s extglob
RESET="\e[0m"
BOLD="\e[1m"
RED="\e[91m"
GREEN="\e[92m"

cd test || exit
for test_script in !(*.expected|*.out|*.diff); do
  test_name="${test_script%%.*}"
  test_extension="${test_script##${test_name}}"
  test_expected="${test_name}.expected"
  test_out="${test_name}.out"
  test_diff="${test_name}.diff"

  echo -n "$test_name ... "
  if [ "${test_extension}" = ".js" ]; then
    node "$test_script" > "$test_out"
  elif [ "${test_extension}" = ".sh" ]; then
    bash "$test_script" > "$test_out"
  fi

  echo -ne "${BOLD}"
  if [ "$(diff -q "$test_expected" "$test_out")" ]; then
    diff -y "$test_expected" "$test_out" > "$test_diff"
    echo -ne "${RED}✘"
  else
    echo -ne "${GREEN}✔"
  fi
  echo -e "${RESET}"
done
