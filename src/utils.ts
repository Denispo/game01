
const diceMap = [
    [2,3,4,5], //1
    [1,3,4,6], //2
    [1,2,5,6], //3
    [1,2,5,6], //4
    [1,3,4,6], //5
    [2,3,4,5], //6
]

export function rollDiceNumber(currentRoledNumber:number, lastRolledNumber:number|undefined = undefined):number {
    if (currentRoledNumber < 1 || currentRoledNumber > 6) {
        currentRoledNumber = 1;
    }
    let newNumber
    do {
        newNumber = diceMap[currentRoledNumber-1][Math.floor(4 * Math.random())];
    } while (newNumber === lastRolledNumber);
    return newNumber;
}

