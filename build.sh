#!/bin/bash

TARGETS='node7-linux,node7-macos,node7-win'

pkg -t $TARGETS -c pkg-cli.json -o bin/cli src/cli.js
pkg -t $TARGETS -c pkg-gui.json -o bin/gui src/gui/app.js
