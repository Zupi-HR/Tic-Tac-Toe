const GameBoard = (function () {
  const gameboard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  function placeMarkAt(row, cell, player, playerMark) {
    gameboard[row][cell] = playerMark;

  }

  return { gameboard, placeMarkAt };
})();

GameBoard.placeMarkAt(1, 1, 'Neven', 'X');

const DisplayController = (function () {
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.gameboard.length; i++) {
    const row = document.createElement('div');
    row.setAttribute('position', i);
    row.classList.add('row');
    GameBoardElement.append(row);
    for (let j = 0; j < GameBoard.gameboard[i].length; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('position', j);
      cell.classList.add('cell');
      cell.textContent = GameBoard.gameboard[i][j];
      row.append(cell);
    }
  }

})();

