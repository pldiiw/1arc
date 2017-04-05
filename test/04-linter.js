'use strict';

const lint = require('utility').lint;

const goodProgram = '611181107111C1111111A111F11ED111';
console.log(lint(goodProgram));

const secondGoodProgram = '811EB111211100EE00E0F129';
console.log(lint(secondGoodProgram));

const badProgram = goodProgram + 'F132';
console.log(lint(badProgram));

const secondBadProgram = secondGoodProgram + 'FG55';
console.log(lint(secondBadProgram));
