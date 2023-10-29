const GameBoard = (function () {
  // Initialize an empty game board
  let gameboard = [
    null, null, null,
    null, null, null,
    null, null, null
  ];

  function resetBoard() {
    gameboard = gameboard.map(cell => cell = null);
    console.log(gameboard);
  }

  function getCellValueAtIndex(index) {
    return gameboard[index];
  }

  function getBoardCellCount() {
    return gameboard.length;
  }

  function getBoardState() {
    return gameboard;
  }

  function placeMarkAt(cell) {
    gameboard[cell] = GameFlowController.getCurrentPlayerMark();
  }

  return { resetBoard, getCellValueAtIndex, getBoardCellCount, placeMarkAt, getBoardState };
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
  let _isWinnerFound = false;
  let _isTied = false;

  function resetGameState() {
    _isWinnerFound = false;
    _isTied = false;
    currentPlayer = player1;
  }

  function checkThreeInArow(mark) {
    return GameBoard.getBoardState().map((element, index) => {
      if (element === mark) {
        return index;
      }
    }).filter(filteredIndex => filteredIndex !== undefined);
  }

  function checkForTie() {
    return _isTied = GameBoard.getBoardState().every(cell => cell !== null);

  }

  function checkForWinner(mark) {
    const indices = checkThreeInArow(mark);
    console.log(indices);
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];

    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        _isWinnerFound = winningCombination[i].every(element => indices.includes(element))
        if (_isWinnerFound) {
          console.log(`${GameFlowController.getPlayerNameByMark(mark)} has won`);
          return indices;
        }
      }
    } if (checkForTie() && !_isWinnerFound) {
      console.log('it is tied');
      return;
    }
  }

  function hasWinner() {
    return _isWinnerFound;
  }

  function getTieStatus() {
    return _isTied;
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

  return { resetGameState, getPlayerNameByMark, getCurrentPlayerMark, switchPlayer, hasWinner, checkForWinner, checkForTie, getTieStatus, setPlayerFromInput }
})();



const DisplayController = (function () {
  //get elements
  const GameBoardElement = getElement('.gameboard');
  const winnerAnnouncement = getElement('#winner-message');
  const startGameBTN = getElement('#start_game_BTN');
  const container = getElement('#container');
  const gameboardContainer = getElement('#gameboard_container')
  const playerOneNameElement = getElement('.firstPlayer');
  const playerTwoNameElement = getElement('.secondPlayer');
  const playerNameForm = getElement('#player_name_form');
  const firstPlayerInput = getElement('#first_player_input');
  const secondPlayerInput = getElement('#second_player_input')
  const submitForm = getElement('#submit_form_BTN')
  const playAgainBTN = getElement('#play-again_BTN');


  // functions 
  function createAndSetupBoardCells() {
    for (let i = 0; i < GameBoard.getBoardCellCount(); i++) {
      const cell = document.createElement('div');
      cell.setAttribute('number', i);
      cell.textContent = '';
      addClassToElement(cell, 'cell');
      cell.addEventListener('click', function () {
        if (GameBoard.getCellValueAtIndex(i) === null && !GameFlowController.hasWinner()) {
          GameBoard.placeMarkAt(i);
          if (GameFlowController.getCurrentPlayerMark() === 'X') {
            playerTwoNameElement.classList.remove('activePlayer');
            addClassToElement(playerOneNameElement, 'activePlayer');
          } else {
            playerOneNameElement.classList.remove('activePlayer');
            addClassToElement(playerTwoNameElement, 'activePlayer');
          }
          cell.textContent = GameBoard.getCellValueAtIndex(i);
          GameFlowController.switchPlayer(cell.textContent);
          const winningCells = GameFlowController.checkForWinner(cell.textContent);
          console.log(winningCells);
          if (GameFlowController.hasWinner()) {
            playAgainBTN.style.display = 'block';
            winnerAnnouncement.innerHTML = `Winner is: <span id='winner-message-name'>${GameFlowController.getPlayerNameByMark(cell.textContent)}</span>`;
            (GameFlowController.getCurrentPlayerMark() !== 'X') ? removeClassFromElement(playerOneNameElement, 'activePlayer') : removeClassFromElement(playerTwoNameElement, 'activePlayer');
            colorWinningCells(winningCells);
            return;
          } else if (GameFlowController.getTieStatus()) {
            playAgainBTN.style.display = 'block';
            winnerAnnouncement.textContent = 'The game has ended in a draw. Neither player could claim the victory.';
            winnerAnnouncement.style.color = '#af1bc2';
            (GameFlowController.getCurrentPlayerMark() !== 'X') ? removeClassFromElement(playerOneNameElement, 'activePlayer') : removeClassFromElement(playerTwoNameElement, 'activePlayer');
            return;
          }
        }
      });
      GameBoardElement.append(cell);
    }
  }
  function colorWinningCells(winningCells) {
    if (winningCells.length !== 0) {
      const gameboardCells = document.querySelectorAll('.cell');
      console.log(gameboardCells, 'svi cellovi');
      console.log(winningCells, 'pobjednički');
     

      for (let i = 0; i < winningCells.length; i++) {
        for (let j = 0; j < gameboardCells.length; j++) {
         if(gameboardCells[j].getAttribute('number') == winningCells[i]) {
             gameboardCells[j].classList.add('winningCell');
         }
          
        }
        
      }
    } else {
      return;
    }

  }


  function getElement(element) {
    return document.querySelector(`${element}`);
  }

  function addClassToElement(element, className) {
    element.classList.add(className);
  }

  function removeClassFromElement(element, className) {
    element.classList.remove(className);
  }

  //event listeners
  startGameBTN.addEventListener('click', function () {
    container.style.display = 'block';
    startGameBTN.style.display = 'none';
    playerNameForm.style.display = 'flex';
  })


  submitForm.addEventListener('click', function (event) {
    event.preventDefault();

    let firstPlayerName = firstPlayerInput.value;
    let secondPlayerName = secondPlayerInput.value;

    GameFlowController.setPlayerFromInput(firstPlayerName);
    GameFlowController.setPlayerFromInput(secondPlayerName);


    if (firstPlayerName !== '' && secondPlayerName !== '') {
      playerNameForm.style.display = 'none';
      playerOneNameElement.textContent = firstPlayerName;
      playerTwoNameElement.textContent = secondPlayerName;
      //rendering gameboard container and its content
      gameboardContainer.style.display = 'flex';
      createAndSetupBoardCells();

    }
  })

  playAgainBTN.addEventListener('click', function () {
    GameBoard.resetBoard();
    GameFlowController.resetGameState();
    console.log(GameBoardElement.children);
    while (GameBoardElement.firstElementChild) {
      GameBoardElement.removeChild(GameBoardElement.firstElementChild);
    }
    winnerAnnouncement.textContent = '';
    createAndSetupBoardCells();
  })


})();






