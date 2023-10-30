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

  function getCurrentBoard() {
    return gameboard;
  }

  function placePlayerMarkAt(cell) {
    gameboard[cell] = GameFlowController.getCurrentPlayerMark();
  }

  return { resetBoard, getCellValueAtIndex, getBoardCellCount, placePlayerMarkAt, getCurrentBoard };
})();

const GameFlowController = (function () {
  function createPlayer(name, mark) {
    return { name, mark }
  }


  let player1;
  let player2;
  let currentPlayer;

  function initializePlayerFromInput(value) {
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
  let isWinnerDeclared = false;
  let isGameTied = false;

  function resetGameState() {
    isWinnerDeclared = false;
    isGameTied = false;
    currentPlayer = player1;
  }

  function findIndicesOfMark(mark) {
    return GameBoard.getCurrentBoard().map((element, index) => {
      if (element === mark) {
        return index;
      }
    }).filter(filteredIndex => filteredIndex !== undefined);
  }

  function checkForTie() {
    const boardIsFull = GameBoard.getCurrentBoard().every(cell => cell !== null);
    if (boardIsFull && !isWinnerDeclared) {
      console.log('it is tied');
      return isGameTied = true;
    }

  }

  function checkForWinner(mark) {
    const indices = findIndicesOfMark(mark);
    console.log(indices);
    const winningCombination = [[0, 1, 2], [0, 3, 6], [3, 4, 5], [6, 7, 8], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];

    if (indices.length >= 3) {
      for (let i = 0; i < winningCombination.length; i++) {
        let foundWinner = winningCombination[i].every(element => indices.includes(element));
        if (foundWinner) {
          isWinnerDeclared = true;
          console.log(`${GameFlowController.getPlayerNameByMark(mark)} has won`);
          return winningCombination[i];
        }
      }
    }
  }

  function hasWinner() {
    return isWinnerDeclared;
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

  return { resetGameState, getPlayerNameByMark, getCurrentPlayerMark, switchPlayer, hasWinner, checkForWinner, checkForTie, initializePlayerFromInput }
})();



const DisplayController = (function () {
  //get elements
  const GameBoardElement = getDOMElement('.gameboard');
  const winnerAnnouncement = getDOMElement('#winner-message');
  const startGameButton = getDOMElement('#start_game_BTN');
  const mainContainer = getDOMElement('#container');
  const gameboardContainer = getDOMElement('#gameboard_container')
  const playerOneNameElement = getDOMElement('.firstPlayer');
  const playerTwoNameElement = getDOMElement('.secondPlayer');
  const playerNameForm = getDOMElement('#player_name_form');
  const firstPlayerInput = getDOMElement('#first_player_input');
  const secondPlayerInput = getDOMElement('#second_player_input')
  const submitForm = getDOMElement('#submit_form_BTN')
  const playAgainButton = getDOMElement('#play-again_BTN');


  // functions 
  function toggleActivePlayerClass(currentPlayer, playerOneElement, playerTwoElement) {
    if (currentPlayer === 'X') {
      playerTwoElement.classList.remove('activePlayer');
      addClassToElement(playerOneElement, 'activePlayer');
    } else {
      playerOneElement.classList.remove('activePlayer');
      addClassToElement(playerTwoElement, 'activePlayer');
    }
  }

  function handleGameOutcome(cell, winningCells) {
    if (GameFlowController.hasWinner()) {
      playAgainButton.style.display = 'block';
      winnerAnnouncement.innerHTML = `Winner is: <span id='winner-message-name'>${GameFlowController.getPlayerNameByMark(cell.textContent)}</span>`;
      (GameFlowController.getCurrentPlayerMark() !== 'X') ? removeClassFromElement(playerOneNameElement, 'activePlayer') : removeClassFromElement(playerTwoNameElement, 'activePlayer');
      colorWinningCells(winningCells);
      return;
    } else if (GameFlowController.checkForTie()) {
      playAgainButton.style.display = 'block';
      winnerAnnouncement.textContent = 'The game has ended in a draw. Neither player could claim the victory.';
      winnerAnnouncement.style.color = '#af1bc2';
      (GameFlowController.getCurrentPlayerMark() !== 'X') ? removeClassFromElement(playerOneNameElement, 'activePlayer') : removeClassFromElement(playerTwoNameElement, 'activePlayer');
      return;
    }
  }


  function createAndSetupBoardCells() {
    for (let i = 0; i < GameBoard.getBoardCellCount(); i++) {
      const cell = document.createElement('div');
      cell.setAttribute('number', i);
      cell.textContent = '';
      addClassToElement(cell, 'cell');
      cell.addEventListener('click', function () {
        if (GameBoard.getCellValueAtIndex(i) === null && !GameFlowController.hasWinner()) {
          GameBoard.placePlayerMarkAt(i);
          toggleActivePlayerClass(GameFlowController.getCurrentPlayerMark(), playerOneNameElement, playerTwoNameElement);
          cell.textContent = GameBoard.getCellValueAtIndex(i);
          GameFlowController.switchPlayer(cell.textContent);
          const winningCells = GameFlowController.checkForWinner(cell.textContent);
          console.log(winningCells);
          handleGameOutcome(cell, winningCells);
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
          if (gameboardCells[j].getAttribute('number') == winningCells[i]) {
            gameboardCells[j].classList.add('winningCell');
          }
        }
      }
    } else {
      return;
    }

  }


  function getDOMElement(element) {
    return document.querySelector(`${element}`);
  }

  function addClassToElement(element, className) {
    element.classList.add(className);
  }

  function removeClassFromElement(element, className) {
    element.classList.remove(className);
  }

  //event listeners
  startGameButton.addEventListener('click', function () {
    mainContainer.style.display = 'block';
    startGameButton.style.display = 'none';
    playerNameForm.style.display = 'flex';
  })


  submitForm.addEventListener('click', function (event) {
    event.preventDefault();

    let firstPlayerName = firstPlayerInput.value;
    let secondPlayerName = secondPlayerInput.value;

    GameFlowController.initializePlayerFromInput(firstPlayerName);
    GameFlowController.initializePlayerFromInput(secondPlayerName);


    if (firstPlayerName !== '' && secondPlayerName !== '') {
      playerNameForm.style.display = 'none';
      playerOneNameElement.textContent = firstPlayerName;
      playerTwoNameElement.textContent = secondPlayerName;
      //rendering gameboard container and its content
      gameboardContainer.style.display = 'flex';
      createAndSetupBoardCells();

    }
  })

  playAgainButton.addEventListener('click', function () {
    GameBoard.resetBoard();
    GameFlowController.resetGameState();
    console.log(GameBoardElement.children);
    while (GameBoardElement.firstElementChild) {
      GameBoardElement.removeChild(GameBoardElement.firstElementChild);
    }
    winnerAnnouncement.textContent = '';
    createAndSetupBoardCells();
    playAgainButton.style.display = 'none';
  })


})();






