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

  function getBoardState() {
    return gameboard;
  }

  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.getCurrentPlayerMark();
  }

  return { getCellValueAtIndex, getTotalBoardCells, placeMarkAt, getBoardState };
})();

const GameFlowController = (function () {
  function createPlayer(name, mark) {
    return { name, mark }
  }


  let player1;
  let player2;
  let currentPlayer;

  function setPlayerFromInput(value) {
    if (value !== '' && !player1) {
      player1 = createPlayer(value, 'X');
      currentPlayer = player1;
      console.log(player1);
    } else if (value !== '' && !player2) {
      player2 = createPlayer(value, 'O');
      console.log(player2);
    }
  }



  // set current player

  let _IsWinnerFound = false;
  let _IsTied = false;

  function checkThreeInArow(mark) {
    return GameBoard.getBoardState().map((element, index) => {
      if (element === mark) {
        return index;
      }
    }).filter(filteredIndex => filteredIndex !== undefined);
  }

  function checkForTie() {
    return _IsTied = GameBoard.getBoardState().every(cell => cell !== null);

  }

  function checkForWinner(mark) {
    const indices = checkThreeInArow(mark);
    console.log(indices);
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];

    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        _IsWinnerFound = winningCombination[i].every(element => indices.includes(element))
        if (_IsWinnerFound) {
          console.log(`${GameFlowController.getPlayerNameByMark(mark)} has won`);
          return _IsWinnerFound;
        }
      }
    } if (checkForTie() && !_IsWinnerFound) {
      console.log('it is tied');
      return;
    }
  }

  function hasWinner() {
    return _IsWinnerFound;
  }

  function getTieStatus() {
    return _IsTied;
  }

  // get player names for DOM
  function getPlayerNameByMark(mark) {
    return (mark === 'X') ? player1.name : player2.name;
  }


  function getCurrentPlayerMark() {
    return currentPlayer.mark;
  }

  // toggle the player's turn 
  function switchPlayer(mark) {
    (mark === 'X') ? currentPlayer = player2 : currentPlayer = player1;
  }

  return { getPlayerNameByMark, getCurrentPlayerMark, switchPlayer, hasWinner, checkForWinner, checkForTie, getTieStatus, setPlayerFromInput }
})();



const DisplayController = (function () {
  //get elements
  const startGameBTN = getElement('#start_game_BTN');
  const container = getElement('#container');
  const gameboardContainer = getElement('#gameboard_container')
  const playerOneNameElement = getElement('.firstPlayer');
  const playerTwoNameElement = getElement('.secondPlayer');
  const playerNameForm = getElement('#player_name_form');
  const firstPlayerInput = getElement('#first_player_input');
  const secondPlayerInput = getElement('#second_player_input')
  const submitForm = getElement('#submit_form_BTN')

  //event listeners
  startGameBTN.addEventListener('click', function () {
    container.style.display = 'block';
    startGameBTN.style.display = 'none';
    playerNameForm.style.display = 'flex';
  })


  submitForm.addEventListener('click', function (event) {
    event.preventDefault();

    let firstPlayer = firstPlayerInput.value;
    let secondPlayer = secondPlayerInput.value;

    GameFlowController.setPlayerFromInput(firstPlayer);
    GameFlowController.setPlayerFromInput(secondPlayer);

    if (firstPlayer !== '' && secondPlayer !== '') {
      playerNameForm.style.display = 'none';
      playerOneNameElement.textContent = firstPlayer;
      playerTwoNameElement.textContent = secondPlayer;
      //rendering gameboard container and its content
      gameboardContainer.style.display = 'flex';
      const GameBoardElement = getElement('.gameboard');
      const winnerAnnouncement = getElement('.winner-message');

      for (let i = 0; i < GameBoard.getTotalBoardCells(); i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', function () {
          if (GameBoard.getCellValueAtIndex(i) === null && !GameFlowController.hasWinner()) {
            GameBoard.placeMarkAt(i);
            cell.textContent = GameBoard.getCellValueAtIndex(i);
            GameFlowController.switchPlayer(cell.textContent);
            GameFlowController.checkForWinner(cell.textContent);
            if (GameFlowController.hasWinner()) {
              winnerAnnouncement.textContent = `Winner is: ${GameFlowController.getPlayerNameByMark(cell.textContent)}`;
              return;
            } else if (GameFlowController.getTieStatus()) {
              winnerAnnouncement.textContent = 'The game has ended in a draw. Neither player could claim the victory.'
              return;
            }
          }
        });
        GameBoardElement.append(cell);
      }
    }
  })

  function getElement(element) {
    return document.querySelector(`${element}`);
  }






})();

//create player object






