#!/bin/bash

shopt -s extglob

cd test || exit
rm -vf +(*.out|*.diff)
