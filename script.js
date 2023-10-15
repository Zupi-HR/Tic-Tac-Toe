const GameBoard = (function () {
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];


  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.togglePlayerTurn();

  }

  return { gameboard, placeMarkAt };
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
      }
    })
    GameBoardElement.append(cell);
  }

})();

function createPlayer(name, mark) {
  return { Name: name, Mark: mark };
}








