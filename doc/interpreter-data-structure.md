# The interpreter data structure

## What is this document?

This document describes the interpreter data structure.  
Most software works by taking data as input and outputting it in an other
shape. This is the philosophy we try to stick to. As such, we have to model how
our CHIP-8 interpreter will be represented in our programs. This is what we
mean by saying "interpreter data structure".

## The data structure

```
{} # -> Map
[] # -> Array
"" # -> String

interpreter := {
  "data": [
    [ <8 bits> ], # Register 0
    [ <8 bits> ], # Register 1
    [ <8 bits> ], # Register 2
    [ <8 bits> ], # Register 3
    [ <8 bits> ], # Register 4
    [ <8 bits> ], # Register 5
    [ <8 bits> ], # Register 6
    [ <8 bits> ], # Register 7
    [ <8 bits> ], # Register 8
    [ <8 bits> ], # Register 9
    [ <8 bits> ], # Register A
    [ <8 bits> ], # Register B
    [ <8 bits> ], # Register C
    [ <8 bits> ], # Register D
    [ <8 bits> ], # Register E
    [ <8 bits> ]  # Register F
  ],
  "I": [ <12 bits> ],
  "timer": [ <8 bits> ],
  "sound": [ <8 bits> ],
  "memory": [ <4096 bytes> ],
  "pc": [ <12 bits> ],
  "pointer": [ <4 bits> ],
  "stack": [
    [ <12 bits> ] * 16
  ],
  "display": [
    [ <64 bits> ] * 32
  ],
  "keypad": [ <16 bits> ]
}
```
