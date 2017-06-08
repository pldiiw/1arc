# 1ARC Project - CHIP-8 Interpreter

A [CHIP-8] interpreter/emulator written in JavaScript.

## Synopsis

This project was done in the context of the ASc1 cursus at SUPINFO. It involved
the following people:
 * Pierre-Louis DOURNEAU ([@pldiiw])
 * Clément GRIMAUD ([@ehrakis])
 * Ibrahim BAH-SALIFOU ([@silverthoon])
 * Joffrey JANIEC ([@jjaniec])
 * Juan ESTRADA ([@heversio])

(Nicknames were given for reference when browsing the git log)

Here's the pitch:

> The old CEO of an imaginary soda company, "Pota Cola", dies and brings with him
> the secrets of the recipe of their top selling soda. The last way of retrieving
> the recipe seems to be an old floppy disk with CHIP-8 code inside, labelled
> "Confidential".
> As the new CEO wants to get that recipe, he asked us to create a new CHIP-8
> interpreter/emulator (as you wish to call them) to decode this floppy and get
> that freaking recipe back to make the money flow again.

You can find the long version with the requirements in the subject file:
[1ARC.pdf].

## Table of Contents

 * [Project hierarchy](#project-hierarchy)
 * [Used technologies](#used-technologies)
 * [User manual](#user-manual)
 * [License](#license)

## Project hierarchy

The project is split into three subdirectories: `doc`, `src` and `test`.

In the `doc` folder you will find a whole lot of documentation and design
documents. There will be a [README] there to walk you through. Note that the
technical documentation is mainly derived from the comments in the source code.

The `src` folder holds everything that's source code. You will find every
module the documentation talked about: `engine`, `instruction-set`, `utility`,
`cli` and `gui`.

Eventually, the `test` folder. It contains the tests we've written to ensure
that the code we roll out meet our expectations.

## Used technologies

We've gone monoglot, but used many tools to help us leverage all the aspects of
the project.

The source code has been written in [JavaScript]. It was intended to run using
[NodeJS] on Windows, MacOS and Linux and on web browsers.

The CLI and GUI are packaged into executables using [pkg]. The GUI uses
[Express] when packaged to launch a local webserver.

To comment our code and make it useful, we've used [JSDoc], enabling us to
produce a beautiful technical documentation/API reference that is guaranteed to
be up to date as it is tighly coupled with the code.

Also to make the code consistent, we've agreed to follow the [Semistandard]
style guide. Having a tool that can automatically format the code for us is a
huge asset.

Concerning the tests, we end up using [Jest], an open-source testing solution
developped by people at Facebook that got some hype in the last months. It
works right out-of-the-box (conventions over configurations!) and is crazy fast.

Finally, to track changes and guide us through merging the work each person in
the group produces with the least headaches, we used [Git], a version control
system you, I think, surely already know. All of this versioning orbited around
a GitHub repository as a main remote. You may prefer to browse our work using
their interface, as it is more pleasant to navigate from one file to other
without the cumbersome of IDEs and, sometimes, the over-unadornedness of
terminals. Anyway, here's a link if you prefer this mean:
https://github.com/pldiiw/1arc

## User manual

From here, we will explain how to install and use this software.

### What is CHIP-8?

Lets begin with a brief description of what CHIP-8 is and what it looks like.

CHIP-8 is an old programming language that was created in the middle of the
70s, by some guy named Joseph Weisbecker. This is an interpreted language, so
you write code, and you put it into some kind of virtual machine that has the
role to make sense of this code, without compiling to binaries like other
languages like C do.
This is kind of crazy to know that already at that time they had thought of
such technology, and that today we still build on these pillars. Thus,
concerning CHIP-8, it is not _that_ crazy when you look at a timeline and you
see that Smalltalk appeared in 1972, one of the first languages to bring a
very fast code-execute loop using the concept of interpreted languages, and
laying down solid foundations for real object-oriented programming building on
what Simula had done. Compared to Smalltalk, CHIP-8 holds a very mindset.
It doesn't seek these crazy paradigms and reflexions. What CHIP-8 wants is just
to bring an easy way to program little games without too much headaches in a
very simple programming language, and on the edge keep that nerdy feeling of
writing and executing code with hexadecimal digits all around.

Speaking of which, let's crack some CHIP-8. Here's a very simple program:

```
120C ; Jumping to the code

;; Sprites
90 90 F0 90 90 ; Letter 'H'
90 90 60 60 60 ; Letter 'Y'

;;; Code here!
;; Setting our variables
6000 6100 ; Setting the X,Y coordinates for the first letter
6209 6300 ; Setting the X,Y coordinates for the second letter
6413 6500 ; Setting the X,Y coordinates for the third letter
660E ; Setting to draw letter E from built-in font

;; Drawing our text
A202 D015 ; Drawing the first letter
F629 D235 ; Drawing the second letter
A207 D455 ; Drawing the third letter
```

Wow! Don't be overwhelmed, it's _super_ easy, trust me! Actually, you might
have figured it out, if you ran this code, you would get a cute "HEY" drawn
onto your screen.

Let's break it down very fast, after this we will install the interpreter so
you can test this program right away.

As you can see in the code excerpt, all the thing you tell the interpreter to
do, the instructions, are written as a suite of hexadecimal digits. Each
instruction is four digit-long. The code is formatted in a way that may help
you distinguish every instruction from the other. The first instruction you see
is `120C`. It is derived from the instruction `1NNN`, where is `N` is any hex
digit you want. This one is used to jump the _"needle"_ that read our code to
somewhere else. Here we use it to jump over what are labelled as the "sprites",
to the real code, where our processing really begins. To draw things on the
screen in CHIP-8, we use "sprites". These are also suite of hexadecimal digits,
but instead of being grouped by 4, they're grouped as pairs. These "sprites",
when converted into a binary number and put below the previous one, form a kind
a drawing that is the thing we want to draw. Here, for the 'H' letter, we have:

```
90 90 F0 90 90 ; Letter 'H'

90 10010000
90 10010000
F0 11110000
90 10010000
90 10010000
```

Can we see the 'H' in the 0s and 1s? Then you get it! You may be wondering why
are we using only the first half of the numbers? You will your answers soon,
don't panic.

To build on that, let's see what's next: `6000`, `6100`, ... In fact the seven
following instructions are kind of the same, and the comments don't help that
much! You wrote that?
More seriously, these instructions derive from the `6XNN` instruction, with
`X` and `N`s any hex digits. The role of this instructions is to set one of
our variables to a certain value. These variables are called registers. Their
sole purpose is to store numbers, and you have 16 of them in CHIP-8, from `0`
through `F`. Like the hexadecimal digits, easy to remember! Here, in `6000` we
set the register `0` to the hex value `00`. I have to admit that is kind of
useless because when a program begins, all variables are already set to 0
defaults, but this is for the sake of clarity, so bear with me.
This is the same case for `6209`, we fill the register `2` with the value `09`.
If we looked into the virtual machine the CHIP-8 interpreter spins up to run
this program, we would see at that state a list of registers with the 3rd
(0 = 1st) one set to `9`. All these values we're preparing are for giving
coordinates on the display to the part of the code that will draw our shiny
letters.

That's where we reach the last section of our code, the drawing! Here too, you
may see some sort of pattern in the way these instructions are laid out:

```
;; Drawing our text
A202 D015 ; Drawing the first letter
F629 D235 ; Drawing the second letter
A207 D455 ; Drawing the third letter
```

The first half of each these lines tells where the _"needle"_ I've told you
about earlier should be when we will be drawing the text. The second half is
the actual drawing, from the mighty instruction `DXYN` (`X`, `Y`, `N` hex
blabla). `X` and `Y` should be two registers that holds the coordinates of
where we will draw sprite. In the first one we've specified `0` and `1`. We
also could have used `0` for the two, as they're the same, they hold `00`.
That's means that the sprite that we're going to draw will be on the top left
of the screen, beginning at the very first pixel. The `N` is the length of the
sprite we want to draw, its height. Here we draw sprites 5 lines high.

Simple enough? Let's run it now!

### Installation

To install our CHIP-8 interpreter, go to
https://github.com/pldiiw/1arc/releases and download the last version you can
find. Extract it somewhere and then you're done, it's ready to rock.

### Running the code

Before running the code, copy and paste it into a file of your choice. It will
be your source file, the one we will hand out to the interpreter.

From here, you two choices: running the calm Command Line Interface or the full
blown Graphical User Interface.
You will need a terminal to run the CLI, and a browser to run the GUI.

#### CLI

The CLI, people's best friend. Or nerd's one, I don't remember the adage. In
your terminal, go to the directory where the interpreter is installed and run:

```
./bin/cli load <path-to-your-source-file>
```

Where `<path-to-your-source-file>` is, well, your source file.

Executing this command will create a new CHIP-8 virtual machine and feed your
source code into it. This machine is saved as a `.json` file named by default
`.engine_state.chip8.json`. Try to open it with a text editor and explore it a
bit to see how is organized the virtual machine if you wish to!

Now, let's run our code: `./bin/cli cycle 13`. This will run the 13 next
instructions, exactly how many we have in our code. You could put a bigger
number, but that would just be wasting electricity.

Finally, let's see how pretty "HEY": `./bin/cli display`.

Amazing, right?

You can dig a bit more into the CLI by typing `./bin/cli help`. And then
`./bin/cli help <subcommand>` for any particular subcommand you're intrigued
with. Also go read our design document about the CLI to learn every aspect of
it: [cli.md].

#### GUI

For some, a graphical interface may be easier to use. Execute `./bin/gui` to
open it.

Let's load our "hey" program inside it. Just click on the `Load program` button
and select the source code file for our program.

Once done, you may see some changes on the screen. Everything you have in front
of you is every component and value that is inside the CHIP-8 virtual machine.
At the bottom of the screen you can see memory, where values have been written.
Select the `16` that is just above the cell section and scroll to the 512th
cell. Reading the values, you may recognize every instruction of our "hey"
program.

To run the program, click on the button with the fast-forward icon (or press
`Shift+Space`). If many things on the interface happens at once and that our
"HEY" is displayed, that means that it worked. To stop the execution if it
didn't by itself, click on the pause button (or press `Space`).

You can do many things with the GUI. For example, click on one of the pixels of
the display. Did it turned on or off? Awesome!

The GUI let you edit any value in a easy manner, and give a convenient way to
interact with the CHIP-8 virtual machine. Don't hesitate to tinker things at
random to explore the possibilities of the CHIP-8 virtual machine.

#### Going further

You may want to lean more about CHIP-8. Here's some resources to help you.

The first, is an article by Matthew Mikolay that will explain almost everything
you need to know about CHIP-8: [Mastering CHIP-8 by Matthew Mikolay].

We've compiled a CHIP-8 reference that is terser than this article, good for
quick infos: [chip-8.md].

To write CHIP-8 source code that cope with our interpreter, please respect the
syntax described inside this document: [syntax.md].

Try to download some CHIP-8 games from the web and test them!

If you really want to dig it, go read all of our [design documents] to
understand all of the inner workings of our implementation and maybe, if you're
brave enough go read the [technical ones].

## LICENSE

This software is under the MIT license. See [LICENSE] file for more information.

[CHIP-8]: https://en.wikipedia.org/wiki/CHIP-8
[@pldiiw]: https://github.com/pldiiw
[@ehrakis]: https://github.com/ehrakis
[@silverthoon]: https://github.com/silverthoon
[@jjaniec]: https://github.com/jjaniec
[@heversio]: https://github.com/heversio
[1ARC.pdf]: ./1ARC.pdf
[README]: ./doc/README.md
[JavaScript]: https://fr.wikipedia.org/wiki/JavaScript
[NodeJS]: https://nodejs.org/en/
[JSDoc]: http://usejsdoc.org/
[Semistandard]: https://github.com/Flet/semistandard
[Jest]: https://facebook.github.io/jest/
[Git]: https://git-scm.com/
[cli.md]: ./doc/design/cli.md
[Mastering CHIP-8 by Matthew Mikolay]: http://mattmik.com/files/chip8/mastering/chip8.html
[chip-8.md]: ./doc/chip-8.md
[design documents]: ./doc/design/README.md
[technical one]: ./doc/technical/README.md
[syntax.md]: ./doc/design/syntax.md
[LICENSE]: ./LICENSE
[pkg]: https://github.com/zeit/pkg
[Express]: http://expressjs.com/
