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

It can be invoked like so (`$` reprensents the command prompt, `[]` means
optional and `<>` means mandatory):

```
$ ./cli.js [options] <subcommand> [suboptions] [subparameter]
```

An option is a switch that will have an effect whatever the subcommand is. A
subcommand is a keyword that defines what the call of the program will do. A
suboption is a switch specific to a given subcommand. The subparameter is also
a keyword but it is used to refine what you want from the subcommand.

Here's an example of a call combining them all:

```
$ ./cli.js -s engine_state.txt inspect -f hex memory
```

If we break it down, we have:
 * `-s engine_state.txt` is an option. `-s` is the switch and `engine_state`
   the value passed to it. The `-s` option is used to give the file where the
   current CHIP-8 engine lies. In this case, `engine_state.txt` is in the
   current directory, so we just had to give its name. If this file was located
   in the `/home/chip8/.cache/` directory, then we would have written `-s
   /home/chip8/.cache/engine_state.txt`.
 * `inspect` is the subcommand. In this case, it means that we want to look
   into the values of the current engine state.
 * `-f hex` is a suboption. It is the same syntax as the options, we have a
   switch `-f` that means we want to display the values in a given format, in
   hexadecimal here (`hex`).
 * `memory` is the subparameter. It specifies that we want the `inspect`
   subcommand to only give the current value of the engine memory. It could
   have been designed as a suboption, but having a subparameter gives us a more
   intuitive and cleaner syntax.

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
 * `cycle` - Run a single engine cycle. In other words, it retrieves the
   current state of the engine, reads the next instruction to be executed in
   the memory, executes it, modifying the engine state accordingly, and dumps
   the new engine state to a file for the later invokations. Some suboptions
   can make this subcommand run multiple cycles before dumping the engine
   state.
 * `display` - Pretty print the engine display with `■` for transparent pixels.
   It retrieves the current state of the CHIP-8 engine's display and translates
   0 and 1 to respectively `■` and ` `.
 * `input` - Simulate the input of a keypad's key. For example, running
   `./cli.js input a` would retrieve the current engine state and set the `A`
   key as pressed, concluding the call by saving the engine state back.
 * `inspect` - This a low-level command. It simply show the bare data of the
   various components of the engine. Like the other commands, it retrieves the
   current state of the engine and prints out the data contained in the
   requested components. For example, you would do `./cli.js inspect memory` to
   get the bare binary data of the engine's memory.
 * `help` - Show the help.

### Subparameters

The subparameters are given with their associated subcommand prefixed.

 * `load <source-file>` - `load`'s subparameter is used to specify the source
   code file from which we want to feed our chip-8 instructions to the engine
   memory. This is a mandatory subparameter.
 * `cycle [amount]` - You can choose how many cycles you want to run before
   terminating the command. For instance, `cycle 5` runs 5 cycles before
   dumping the engine state. If not value are passed, it defaults to 1.
 * `display` does not have any subparameter.
 * `input <key>` - Along with `input`, we have to give the key we want to
   simulate the pressure. It can be given in lowercase or uppercase. The
   possible values are: `0 1 2 3 4 5 6 7 8 9 A B C D E F a b c d e f`. This is
   a mandatory parameter.
 * `inspect [component]` - As seen earlier in the document, the `inspect`
   subcommand takes an optional subparameter that indicates what part of the
   engine we want to examine. If no component is given, it is a if we passed
   `all`.  
   The possible values are:
   ```
   data
   data.0 data.1 data.2 data.3 data.4
   data.5 data.6 data.7 data.8 data.9
   data.A data.B data.C data.D data.E
   data.F
   I
   timer
   sound
   memory
   pc
   pointer
   stack
   display
   keypad
   all
   ```
 * `help [subcommand]` - Calling `help` with no subparameter displays the CLI
   syntax and the possible options and the subcommands along with their
   subparameter with a short description of what they does. When passing a
   subparameter, it means that user wants to have more information on a given
   subcommand. It then displays the CLI syntax for the given subcommand,
   explains what this subcommand does, what it is its awaited subparameter and
   its possible values and all of the possible suboptions with a description of
   each. Not giving a subparameter is same as calling `help short`. The
   possible values are: `short load cycle display input inspect`.

### Suboptions

#### Load suboptions

#### Cycle suboptions

#### Display

#### Inspect

#### Help

### Options

