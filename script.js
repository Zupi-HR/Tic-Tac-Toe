const GameBoard = (function () {
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];


  function placeMarkAt(cell, player, playerMark) {
    gameboard[cell] = playerMark;
  }

  return { gameboard, placeMarkAt };
})();




const DisplayController = (function () {
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.gameboard.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', function() {
      if(GameBoard.gameboard[i] === null) {
        GameBoard.placeMarkAt(i, 'SomePlayer', 'X');
        cell.textContent = GameBoard.gameboard[i];
      }
    })
    GameBoardElement.append(cell);
  }

})();






