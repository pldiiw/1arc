'use strict';

const serializeInstructions = require('interpreter').serializeInstructions;

const goodProgram = '611181107111C1111111A111F11ED111';
console.log(serializeInstructions(goodProgram));

const secondGoodProgram = '811EB111211100EE00E0F129';
console.log(serializeInstructions(secondGoodProgram));

const badProgram = goodProgram + 'F132';
console.log(serializeInstructions(badProgram));

const secondBadProgram = secondGoodProgram + 'FG55';
console.log(serializeInstructions(secondBadProgram));
