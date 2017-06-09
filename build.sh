#!/bin/bash

TARGETS='node7-linux,node7-macos,node7-win'
V8_OPTIONS='harmony'

pkg -t $TARGETS -c pkg-cli.json --options $V8_OPTIONS -o bin/1arc-cli src/cli.js
pkg -t $TARGETS -c pkg-gui.json --options $V8_OPTIONS -o bin/1arc-gui src/gui/app.js
