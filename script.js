const GameBoard = (function () {
  const gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];
 let Player1Turn = false;
 let Player2Turn = false;

  function placeMarkAt(cell) {
    Player1Turn = !Player1Turn;
    gameboard[cell] = GameFlowController.changePlayerStatus(Player1Turn, Player2Turn);
    Player2Turn = !Player2Turn;
  }

  return { gameboard, placeMarkAt };
})();

const GameFlowController = (function() {

   const Player1 = createPlayer('Župi', 'X');
   const Player2 = createPlayer('Brada', 'O');

   function changePlayerStatus (player1Status, player2status) {
     if (player1Status) {
      return Player1.Mark;
     } else if (player2status) {
      return Player2.Mark;
     }
   }

   return {changePlayerStatus}
})();

console.log(GameFlowController);


const DisplayController = (function () {
  const GameBoardElement = document.querySelector('.gameboard');
  for (let i = 0; i < GameBoard.gameboard.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', function() {
      if(GameBoard.gameboard[i] === null) {
        GameBoard.placeMarkAt(i);
        cell.textContent = GameBoard.gameboard[i];
      }
    })
    GameBoardElement.append(cell);
  }

})();

function createPlayer(name, mark) {
 return {Name: name, Mark: mark};
}








