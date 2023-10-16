const GameBoard = (function () {
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];


  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.togglePlayerTurn();

  }



  function checkForWin() {
    // Step 1: Extract the positions where 'X' marks are placed on the board.
    let indices = gameboard.map((element, index) => {
      if (element === 'X') {
        return index;
      }
    }).filter(filteredINdex => filteredINdex !== undefined);
    console.log(indices);
    // Step 2: Define potential winning combinations
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
    // step 3: Iterate through the potential winning combinations.
    if (indices.length === 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        // step 4:Iterate through the positions in each potential winning combination.
          if (indices.every(val => winningCombination[i].includes(val))) {
            console.log('you won');
            break;
          }
        
      }
    }
   

  }


  return { gameboard, placeMarkAt, checkForWin };
})();

const GameFlowController = (function () {
  let isPlayer1Turn = false;
  let isPlayer2Turn = false;

  const player1 = createPlayer('Župi', 'X');
  const player2 = createPlayer('Brada', 'O');

  function getPlayerNames(mark) {
    if (mark === 'X') return player1.Name;
    else {
      return player2.Name;
    }
  }

  function togglePlayerTurn() {
    isPlayer1Turn = !isPlayer1Turn;
    if (isPlayer1Turn) {
      isPlayer2Turn = !isPlayer2Turn;
      return player1.Mark;
    } else if (isPlayer2Turn) {
      isPlayer2Turn = !isPlayer2Turn;
      return player2.Mark;
    }
  }

  return { getPlayerNames, togglePlayerTurn }
})();



const DisplayController = (function () {
  const firstPlayerNameElement = document.querySelector('.firstPlayer');
  firstPlayerNameElement.textContent = GameFlowController.getPlayerNames('X');
  const secondPlayerNameElement = document.querySelector('.secondPlayer');
  secondPlayerNameElement.textContent = GameFlowController.getPlayerNames('O');
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.gameboard.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', function () {
      if (GameBoard.gameboard[i] === null) {
        GameBoard.placeMarkAt(i);
        cell.textContent = GameBoard.gameboard[i];
        GameBoard.checkForWin();
      }
    })
    GameBoardElement.append(cell);
  }

})();

function createPlayer(name, mark) {
  return { Name: name, Mark: mark };
}










