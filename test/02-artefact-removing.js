'use strict';

const removeArtefacts = require('utility').removeArtefacts;

const program =
`0000 ; comment
;;double comment
1 AbB ;;; triple



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
    c

        DddD`;

log(removeArtefacts(program));
