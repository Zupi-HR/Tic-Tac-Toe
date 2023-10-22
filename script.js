const GameBoard = (function () {
  // Initialize an empty game board
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];

  function getCellValueAtIndex(index) {
    return gameboard[index];
  }

  function getTotalBoardCells() {
    return gameboard.length;
  }

  function getGameBoardArray() {
    return gameboard;
  }

  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.getCurrentPlayerMark();

  }

  return { getCellValueAtIndex, getTotalBoardCells, placeMarkAt, getGameBoardArray };
})();

const GameFlowController = (function () {
  //Initialize players
  const player1 = createPlayer('Župi', 'X');
  const player2 = createPlayer('Brada', 'O');

  // set current player
  let currentPlayer = player1;
  let isWinnerFound = false;
  let isTied = false;

  function checkThreeInArow(mark) {
    return GameBoard.getGameBoardArray().map((element, index) => {
      if (element === mark) {
        return index;
      }
    }).filter(filteredIndex => filteredIndex !== undefined);
  }

  function isTieCheck() {
    isTied = GameBoard.getGameBoardArray().every(cell => cell !== null);
  }

  function checkForWinner(mark) {
    const indices = checkThreeInArow(mark);
    console.log(indices);

    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];

    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        isWinnerFound = winningCombination[i].every(element => indices.includes(element))
        if (isWinnerFound) {
          console.log(`${GameFlowController.getPlayerName(mark)} has won`);
          return;
        }
      }
    }
    if (indices.length >= 3 && !isWinnerFound && isTied) {
      console.log('is tied');
    }

  }

  function hasWinner() {
    return isWinnerFound;
  }

  // get player names for DOM
  function getPlayerName(mark) {
    return (mark === 'X') ? player1.name : player2.name;
  }

  function getCurrentPlayerMark() {
    return currentPlayer.mark;
  }

  // toggle the player's turn 
  function switchPlayer(mark) {
    (mark === 'X') ? currentPlayer = player2 : currentPlayer = player1;
  }

  return { getPlayerName, getCurrentPlayerMark, switchPlayer, hasWinner, checkForWinner, isTieCheck }
})();



const DisplayController = (function () {
  //Initialize the DOM elements for player names
  const playerOneNameElement = document.querySelector('.firstPlayer');
  playerOneNameElement.textContent = GameFlowController.getPlayerName('X');
  const playerTwoNameElement = document.querySelector('.secondPlayer');
  playerTwoNameElement.textContent = GameFlowController.getPlayerName('O');


  const winnerAnnouncement = document.querySelector('.winner-message');
  //Initialize the game board on the screen
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.getTotalBoardCells(); i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    //add click event listener to each cell
    cell.addEventListener('click', function () {
      if (GameBoard.getCellValueAtIndex(i) === null && !GameFlowController.hasWinner()) {
        GameBoard.placeMarkAt(i);
        cell.textContent = GameBoard.getCellValueAtIndex(i);
        GameFlowController.switchPlayer(cell.textContent);
        GameFlowController.isTieCheck();
        GameFlowController.checkForWinner(cell.textContent);
        if (GameFlowController.hasWinner()) {
          winnerAnnouncement.textContent = `Winner is: ${GameFlowController.getPlayerName(cell.textContent)}`;
        }
      }
    });
    GameBoardElement.append(cell);
  }

})();

//create player object
function createPlayer(name, mark) {
  return { name, mark };
}






