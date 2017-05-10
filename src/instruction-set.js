/**
 * Given a CHIP-8 instruction, it will return a function that represents the
 * effects of this instruction on a CHIP-8 engine.
 * @param {number} inst The instruction from which we will generate the
 * corresponding function.
 * @return {function} The function that the given instruction is linked to, it
 * will only awaits an engine as a parameter.
 */
function instruction (inst) {

  // Determining the instruction
  const stringInstruction = inst.toString(16).padStart(4, '0');
  const allInstructionSchemes = Object.keys(instructions);
  const allInstructionRegexes = allInstructionSchemes
    .map(v => new RegExp(v.replace(/(X|Y|N)/ig, '[0-F]'), 'i'));
  const instructionScheme = allInstructionSchemes
    .filter((v, i) => allInstructionRegexes[i].test(stringInstruction))[0];

  // Determining the arguments
  const X = instructionScheme.indexOf('X');
  const Y = instructionScheme.indexOf('Y');
  const firstN = instructionScheme.indexOf('N');
  const lastN = instructionScheme.lastIndexOf('N');
  const args = [
    stringInstruction[X],
    stringInstruction[Y],
    stringInstruction.slice(firstN, lastN + 1)
  ].filter(v => v !== undefined && v !== '');

  return (engine) => instructions[instructionScheme](engine, ...args);
}

module.exports = {
  instruction: instruction
};
