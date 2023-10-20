const GameBoard = (function () {
  // Initialize an empty game board
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];

  //place a mark on the board at a specific cell
  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.getActivePlayer();

  }

  // check if there's a winner
  function checkForWin(mark) {
    let foundWinner = false;

    function checkThreeInARow(mark) {
      return gameboard.map((element, index) => {
        if (element === mark) {
          return index;
        }
      }).filter(filteredINdex => filteredINdex !== undefined);
    }

    const indices = checkThreeInARow(mark);


    console.log(indices);

    // all possible winning combinations of Xindices
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];

    //Check for a winning combination
    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length && !foundWinner; i++) {
        if (winningCombination[i].every(element => indices.includes(element))) {
          console.log(`${GameFlowController.getPlayerNames(mark)} has won`);
          foundWinner = true;
        }
      }
    }
    if (foundWinner) {
      return `${GameFlowController.getPlayerNames(mark)}`
    } else {
      return ''
    }
  }


  return { gameboard, placeMarkAt, checkForWin };
})();

const GameFlowController = (function () {
  //Initialize players
  const player1 = createPlayer('Župi', 'X');
  const player2 = createPlayer('Brada', 'O');

  // set current player
  let currentPlayer = player1;

  // get player names for DOM
  function getPlayerNames(mark) {
    return (mark === 'X') ? player1.name : player2.name;
  }

  function getActivePlayer() {
    return currentPlayer.mark;
  }

  // toggle the player's turn 
  function togglePlayerTurn(mark) {
    (mark === 'X') ? currentPlayer = player2 : currentPlayer = player1;
  }

  return { getPlayerNames, getActivePlayer, togglePlayerTurn, }
})();



const DisplayController = (function () {
  //Initialize the DOM elements for player names
  const firstPlayerNameElement = document.querySelector('.firstPlayer');
  firstPlayerNameElement.textContent = GameFlowController.getPlayerNames('X');
  const secondPlayerNameElement = document.querySelector('.secondPlayer');
  secondPlayerNameElement.textContent = GameFlowController.getPlayerNames('O');

  const winnerMessage = document.querySelector('.winner-message');

  //Initialize the game board on the screen
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.gameboard.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    //add click event listener to each cell
    cell.addEventListener('click', function () {
      if (GameBoard.gameboard[i] === null) {
        GameBoard.placeMarkAt(i);
        cell.textContent = GameBoard.gameboard[i];
        GameFlowController.togglePlayerTurn(cell.textContent);
        winnerMessage.textContent = `Winner is: ${GameBoard.checkForWin(cell.textContent)}`;

      }
    })
    GameBoardElement.append(cell);
  }

})();

//create player object
function createPlayer(name, mark) {
  return { name, mark };
}








