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

  //place a mark on the board at a specific cell
  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.getCurrentPlayerMark();

  }

  function checkThreeInArow(mark) {
    return gameboard.map((element, index) => {
      if (element === mark) {
        return index;
      }
    }).filter(filteredIndex => filteredIndex !== undefined);
  }

  function isTieCheck() {
    return gameboard.every(cell => cell !== null);
  }
  

  // check if there's a winner
  function checkForWinner(mark) {
    const indices = checkThreeInArow(mark);
    console.log(indices);

    // all possible winning combinations of Xindices
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
    let winState = false;
    let isTied = isTieCheck();
    //Check for a winning combination
    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        winState = winningCombination[i].every(element => indices.includes(element))
        if (winState) {
          GameFlowController.setWinnerState(winState);
          console.log(`${GameFlowController.getPlayerName(mark)} has won`);
          break;
        } 
      }
    } 
    if (indices.length >= 3 && !winState && isTieCheck()) {
      return isTied;
    }
    return GameFlowController.hasWinner();
  }


  return { getCellValueAtIndex, getTotalBoardCells, placeMarkAt, checkThreeInArow, checkForWinner, isTieCheck };
})();

const GameFlowController = (function () {
  //Initialize players
  const player1 = createPlayer('Župi', 'X');
  const player2 = createPlayer('Brada', 'O');

  // set current player
  let currentPlayer = player1;

  let isWinnerFound = false;
  let isTied = false;
  


  function hasWinner() {
    return isWinnerFound;
  }

  function setWinnerState(state) {
    if (state) isWinnerFound = true;
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

  return { getPlayerName, getCurrentPlayerMark, switchPlayer, hasWinner, setWinnerState }
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
        GameBoard.checkForWinner(cell.textContent);
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






