'use strict';

const removeArtefacts = require('interpreter').removeArtefacts;

const program =
`0000 ; comment
;;double comment
1 ABB ;;; triple



#|
  lots of comments
  AAAA
  BBBB
  CCCC
  #|
   nested!

   9988
  |#
  #|;;;|#
|#
CC ;
    C

        DDDD`;

log(removeArtefacts(program));
