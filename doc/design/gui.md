# Graphical User Insterface

## What is this document?

The purpose of this document is to describe how is arranged the graphical
interface of our CHIP-8 interpreter and how the user will interact with it.

## Abstract

Let's define what is a GUI and why we need one.

### What is a GUI?

A Graphical User Interface, GUI, is the part of a software that the end user
uses to interact with the back-end of this software. It takes the form of a
suite of data displayed on a screen with a defined layout, with buttons and
text boxes (for instance) to let the user answer back to the data the back-end
throws a him.

### Why a GUI?

We need a visual way to represent our CHIP-8 interpreter, its data, the
ability to interact with the keypad and see the screen in a more vivid manner
than inside the CLI. This is the part of our interpreter where the magic takes
place and the user will feel like he is on a computer with the original
implementation of the interpreter, with a suite of tools to analyze the latter.

## The GUI

Before writing at length on the GUI, here's a wireframe of how it should look
like. We will break it down in the next section.

## Wireframe

![GUI wireframe w/o outline](./resources/gui.png)

![GUI wireframe w/ outline](./resources/gui-with-outline.png)

## Details

### General Outline

The GUI can be decomposed into 5 distinct parts. At the top left corner we have
the menu and engine control section. Just below it we can see the data section.
Aside these two you can find the display. The last two components are located
are the bottom of the screen, from left to right: the memory section and the
keypad section.

Let's examine each of these components.

### Menu and engine control

The menu and engine control section is in charge of giving the user control
over what the engine does. It is composed of 6 buttons:

 * `Load program` - Opens a dialog to let the user load a CHIP-8 program
   contained in a text file.
 * `Load engine` - Opens a dialog to let the user load a previous dump of a
   CHIP-8 engine.
 * `Save engine` - Opens a dialog to let the user choose a file on its computer
   where the current engine state will be dumped into.
 * `Pause` - Pause the engine, no instruction is read whatsoever.
 * `Cycle once` - Run one CHIP-8 engine cycle and pause.
 * `Cycle continuously` - Run engine cycles without pausing, at a normal rate
   of 60Hz.

Note that an active button is highlighted. Here, the engine is paused, so the
`Pause` button is highlighted.

### Display

The display is the visual representation of the engine's `display` value.

### Data

This section takes care of showing to the user the values of the engine's
registers, timers, I register, program counter, stack pointer and stack.

On the upper side, the values of the registers 0 to F are displayed in a two
columns fashion.
Below it lies the others values. As they cannot hold in the box, a scrollbar is
provided if needed.

When clicking on one value, the user should be able to edit it, modifying the
engine's state. If the entered value is incorrect, nothing happens, the
previous value is still there. Note that the value entered has to be in the
same base as the one displayed.

If you look at the top left corner of the Data component, you can see a little
widget with three buttons, each labeled with `2`, `10` or `16`. This widget is
a switch that the user can use to choose in which base the values are
displayed. In the wireframe, we can see that the base `2` is enabled, so all
the values are shown in binary.

### Memory

The memory section keeps track of the state of the engine's memory.

The memory is displayed in little cells that each represent a byte of data.
Each of these cells are composed of two numbers: the value of this byte of
memory and below it the address of the latter in decimal (and only in decimal).

As we cannot display 4096 cells on the screen at once, we provide a scrollbar
to navigate through it.

When clicking on a byte's value, as for the Data section, we can modify the
value of the cell, affecting the engine's memory.

Notice that there is the same little widget on the top left corner that the
Data section has. When used, it changes how the values of the bytes of memory
are displayed. It does not change the addresses below the values, they stays in
decimal.

To further improve the navigation, the cell of memory address the engine's
program counter points to is highlighted. Here the program counter is set
to `0000001000001101`, which is `525` in decimal. You can see that the cell
that represents the 525th byte of memory is highlighted.

### Keypad

The last section concerns the Keypad. It gives a visual representation that the
user can click onto and use as a reference to know which key on the keypad is
mapped to which key on its keyboard.

The keypad is split into the 16 key of the keypad, each containing three
values: the key, the mapped key from the user keybaord and a bit to know
if the key is pressed (the actual value of the key inside the engine).

The user can interact with each of these keys in various ways.

First, he can click onto one the cell. As long as he holds the click, the key
will be pressed. It affects the engine state, and shows that the key is active
in two ways: highlight it and switch the key's bit to `1` (it doesn't switch it
by itself, it only reflects the current value of the `keypad` inside the engine
state).

The user can also press the key by clicking on the bit of the cell. It will
switch it to `1` until a new press on the same key is done.

The last way the user can press a keypad's key is by looking at the character
at the center of the key's cell. If the user presses the same character on its
keyboard, it will also press this keypad's key. If the user clicks with his
mouse on this character, he will be able to edit it and remap it to another
character.  
The default layout should be the one shown in the wireframe, based on an AZERTY
keyboard.

### Bonus

When the user presses his `CTRL` key, the same outline as in the second
wireframe should be shown. It disappears when the user releases the key.
