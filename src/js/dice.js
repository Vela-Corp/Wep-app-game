// function rollDice() {
//   const dice = [...document.querySelectorAll(".die-list")];
//   dice.forEach((die) => {
//     toggleClasses(die);
//     die.dataset.roll = getRandomNumber(1, 6);
//   });
// }

// function toggleClasses(die) {
//   die.classList.toggle("odd-roll");
//   die.classList.toggle("even-roll");
// }

// function getRandomNumber(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// document.getElementById("roll-button").addEventListener("click", rollDice);
// var elDiceTwo = document.getElementById("dice2");
// var elComeOut = document.getElementById("roll");
// console.log(elComeOut);
// elComeOut.onclick = function () {
//   rollDice();
// };

// function rollDice() {
//   var diceTwo = Math.floor(Math.random() * 6 + 1);

//   for (var k = 1; k <= 6; k++) {
//     elDiceTwo.classList.remove("show-" + k);
//     if (diceTwo === k) {
//       elDiceTwo.classList.add("show-" + k);
//     }
//   }
//   setTimeout(rollDice(), 1000);
// }
