const removeArtefacts = require('../src/utility.js').removeArtefacts;

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

const parsed = '00001ABBCCCDDDD';

test('remove all text artefacts', () => {
  expect(removeArtefacts(program)).toBe(parsed);
});
