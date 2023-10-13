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
    cell.setAttribute('position', i);
    cell.classList.add('cell');
    cell.addEventListener('click', function() {
      GameBoard.placeMarkAt(parseInt(cell.getAttribute('position')), 'SomePlayer', 'X');
      cell.textContent = GameBoard.gameboard[parseInt(cell.getAttribute('position'))];
    })
    GameBoardElement.append(cell);
  }

})();

