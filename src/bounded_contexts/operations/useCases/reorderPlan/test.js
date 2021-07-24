/*
    Create a function called "Draw" that receives an array and a number n as parameters.

    The function must select n items from the array at random, and return a new array which only contains those items.

    The function can't select the same item twice.

    Example test case 1:
    Draw(["A", "B", "C", "D"], 2) returns ["C", "D"]

    Example test case 2:
    Draw([4, 8, 15, 16, 23, 42], 3) returns [4, 8, 16]
*/

const getRandomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
};

const addRandomItem = (baseArray, firstItem) => {
    const randomItem = getRandomItem(baseArray);
    console.log("Random item: ", randomItem);

    if (!!!randomItem || firstItem === randomItem) {
        addRandomItem(baseArray, firstItem);
    } else {
        console.log("RETORNO: ", randomItem);
        return randomItem;
    }

    // baseArray = [randomItem, ...baseArray];
};

const draw = (baseArray, number) => {
    var finalArray = [];

    for (let i = 0; i < number; i++) {
        const randomItem = addRandomItem(baseArray, finalArray[0]);
        console.log("FOR: ", randomItem);
        finalArray = [randomItem, ...finalArray];
        console.log("Final Array", finalArray);
    }

    return finalArray;
};

console.log(draw(["A", "B", "C", "D"], 2));
