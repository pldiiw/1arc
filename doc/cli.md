# Command-line interface

## What is this document?

This document describes how the user will interact with the CHIP-8 interpreter
using the command line tool. This latter one is composed of multiple commands
that directly act on the interpreter engine and we will review each of these
one by one.

## What is the CLI?

CLI stands for the "Command Line Interface". It means that this is a program
that can be used within a terminal emulator, through a shell. Some examples of
such tools are the *nix commands.

## Why a CLI?

## Using the CLI

The CLI program can be found in the `src/cli.js` file. The only purpose of this
script is to interpret what the user asks. It does not contain any CHIP-8
logic. When the user asks something, it calls the subroutines of the file
containing the CHIP-8 interpreter's ones, `src/engine.js`.

It can be invoked like so (`$` reprensents the command prompt):

```
$ ./cli.js [options] <subcommand> [suboptions]
```

## Subcommands and options

### Subcommands

The CLI is subdivised into multiple subcommands that each have a precise role.
Here's the list of all the possible subcommands:

 * `load` - Start interpreter with the given source file. What it really does
   is sanitize the source code -- through removing the text artefacts like
   comments, and looking for unknown or incomplete instructions -- initialize
   the CHIP-8 engine, feed the sanitized source code into the memory and save
   the engine state to a file. Further invocations of the CLI program will look
   into that file and restores the state described into the memory.
 * `cycle` - Run a single engine cycle. In other words, it retrieve the current
   state of the engine, reads the next instruction to be executed in the
   memory, executes it, modifying the engine state accordingly, and dumps the
   new engine state to a file for the later invokations. Some suboptions can
   make this subcommand run multiple cycles before dumping the engine state.
 * `display` - Pretty print the engine display with `■` for transparent pixels.
   It retrieves the current state of the CHIP-8 engine's display and translates
   0 and 1 to respectively `■` and ` `.
 * `input` -
 * `inspect` - This a low-level command. It simply show the bare data of the
   various components of the engine. Like the other commands, it retrieves the
   current state of the engine and prints out the data contained in the
   requested components. For example, you would do `./cli.js inspect memory` to
   get the bare binary data of the engine's memory.
 * `help` - Show the help.

### Suboptions

### Options

