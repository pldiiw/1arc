TODO: Add examples

# Syntax Specification

## What is this document?

This document explains the rules that one must follow when writing a CHIP-8
program interpretable by our implementation.

## Syntax

Raw CHIP-8 is just a sequence of instructions. When interpreted, everything
that is not an instruction is cut out. These cut-out artefacts include
white-spaces and comments.

### White-space and line return insensitivity

Our interpreter is insensitive to white-spaces and line returns, therefore you
can arrange your code however you may want when writing CHIP-8.
You can also use tabs.

### Case insensitivity

Writing an instruction as `ABCD` or `abcd` or even `aBcD` has no difference.

### Comments

Comments help making your code easier to understand. You can use two types of
comments: single-line comments and multi-line comments. We took inspiration
from Lisp comments idioms as they're discrete and versatile.

#### Single-line comments

Single-line comments starts with a semi-colon: `;`. Everything after the
semi-colon until a line return will be counted as a comment.  
A good practice is to use one semi-colon to explain code on the same line as
the comment. Two semi-colons are used to give a description of the state of the
program at that point, or an explanation of the next section of code, and
should start at the same indentation column as the code it documents. Three
semi-colons comments should provide a global explanation and always start at
the left margin.

#### Multi-line comments

Multi-line comments, or block comments, are made by placing text within `#|`
and `|#`. Everything between these two delimiters will be ignored. It should be
used most of the time to comment out large sections of code.
