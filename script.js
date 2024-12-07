document.addEventListener('DOMContentLoaded', () => {
    function tacBoard() {
        const rows = 3;
        const columns = 3;
        const board = [];
    
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Tac());
            }
        }
    
        const getBoard = () => board;
    
        const chooseSquare = (row, column, player) => {
            if (board[row][column].getValue() !== '') return false;
            board[row][column].addTac(player);
            return true;
        };
        
        const checkWin = () => {
            // Check for win in rows
            for (let i = 0; i < 3; i++) {
                if (board[i][0].getValue() !== '' && board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) {
                    return board[i][0].getValue();
                }
            }
            // Check for win in columns
            for (let j = 0; j < 3; j++) {
                if (board[0][j].getValue() !== '' && board[0][j].getValue() === board[1][j].getValue() && board[1][j].getValue() === board[2][j].getValue()) {
                    return board[0][j].getValue();
                }
            }
            // Check for diagonals
            if (board[0][0].getValue() !== '' && board[0][0].getValue() === board[1][1].getValue() &&board[1][1].getValue() === board[2][2].getValue()) {
                return board[0][0].getValue();
            }
            if (board[0][2].getValue() !== '' && board[0][2].getValue() === board[1][1].getValue() &&board[1][1].getValue() === board[2][0].getValue()) {
                return board[0][2].getValue();
            }
            // Check for draw 
            const isBoardFull = board.every(row => row.every(cell => cell.getValue() !== ''));
    
            return isBoardFull ? 'Draw' : null;
        }

        const resetBoard = () => {
            board.forEach(row => row.forEach(cell => cell.resetTac()))
        }
    
        const printBoard = () => {
            console.log('\n Current board:');
            const ticTacToeBoard = board.map((row) => row.map((cell) => cell.getValue()));
            ticTacToeBoard.forEach(row => {
                console.log(row.join(' | '));
                console.log('-'.repeat(9));
            });
        };
    
        return { getBoard, chooseSquare, printBoard, checkWin, resetBoard };
    }
    
    
    function Tac() {
        let value = '';
    
        const addTac = (player) => {
            value = player;
        };

        const resetTac = () => {
            value = '';
        }
    
        const getValue = () => value;
    
        return {
            addTac,
            getValue,
            resetTac
        };
    }
    
    function tacController(playerOneName, playerTwoName) {
        const board = tacBoard();
    
        const players = [
            {
                name: playerOneName,
                token: 'X'
            },
            {
                name: playerTwoName,
                token: 'O'
            }
        ];
    
        let activePlayer = players[0];
    
        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
        const getActivePlayer = () => activePlayer;
    
        const printNewRound = () => {
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn.`)
        };

        const resetGame = () => {
            board.resetBoard();
            activePlayer = players[0];
        }
    
        const playRound = (row, column) => {
            if (column < 0 || column > 2) {
                console.log('Please choose a column between 0 and 2');
                return;
            }
            if (row < 0 || row > 2) {
                console.log('Please choose a row value between 0 and 2');
                return;
            }
    
            const success = board.chooseSquare(row, column, getActivePlayer().token);
    
            if (!success) {
                console.log('That square is full! Try another.');
                return 'That square is full! Try another.';
            }
            console.log(`Player ${getActivePlayer().name} chooses (${row}, ${column})`);

            const winner = board.checkWin();
            if (winner) {
                board.printBoard();
                if (winner === 'Draw') {
                    console.log('its a draw');
                } else {
                    console.log(`${getActivePlayer().name} wins!`);
                }
                return;
            }
    
            switchPlayerTurn();
            printNewRound();
        };
    
        board.printBoard();
        console.log(`\n${getActivePlayer().name}'s turn`)
        
        return {
            playRound,
            getActivePlayer,
            getBoard: board.getBoard,
            winner: board.checkWin,
            resetGame
        };
    }
    
    function ScreenController() {
        let game = null;
        const turn = document.querySelector('.turn');
        const boardUI = document.querySelector('.board');
        const overlay = document.querySelector('#overlay');
        const result = document.querySelector('.result');

        const showOverlay = () => {
            overlay.classList.add('show');
        }

        const hideOverlay = () => {
            overlay.classList.remove('show');
        }

        const initializeGame = (playerOne, playerTwo) => {
            game = tacController(playerOne, playerTwo);
            updateScreen();
        }

        function showNameModal() {
            document.querySelector('#modalOverlay').style.display = 'block';
            document.querySelector('#nameInput').focus();
        }

        function hideModal() {
            document.querySelector('#modalOverlay').style.display = 'none';
            document.querySelector('#nameInput').value = '';
        }

        function startGame() {
            let userNum = 1;
            let userOneName = '';
            let userTwoName = '';
    

    
            function submitName() {
                const nameInput = document.querySelector('#nameInput');
                let userName = nameInput.value.trim();
    
                if (userName) {
                    if (userNum === 2) {
                        userTwoName = userName;
                        console.log(`User ${userNum} name is ${userName}`);
                        userName = 1;
                        hideModal();
                        initializeGame(userOneName, userTwoName);
                    } else {
                        userOneName = userName;
                        console.log(`User ${userNum} name is ${userName}`);
                        userNum++;
                        hideModal();
                        showNameModal();
                    }
                } else {
                    alert('Please enter a valid name');
                }
            }
    
            document.querySelector('#submit').addEventListener('click', submitName);
            document.querySelector('#cancel').addEventListener('click', hideModal);
    
        }
        startGame();

        const updateScreen = (msg) => {
            if (msg) {
                turn.textContent = msg;
                return;
            }
            boardUI.textContent = '';
    
            const board = game.getBoard();
            const winner = game.winner();

            const activePlayer = game.getActivePlayer();
    
            turn.textContent = `${activePlayer.name}'s turn..`
    
            board.forEach((row, rowIndex) => {
                row.forEach((tac, columnIndex) => {
                    const cellDiv = document.createElement('div');
                    cellDiv.classList.add('cell');
                    cellDiv.dataset.row = rowIndex;
                    cellDiv.dataset.column = columnIndex;
                    cellDiv.textContent = tac.getValue();
                    boardUI.appendChild(cellDiv);
                })
            })
            if (winner) {
                showOverlay();
                overlay.addEventListener('click', function() {
                    // Your custom code goes here
                    console.log('Overlay clicked!');
                    
                    // Hide the overlay after click (optional)
                    hideOverlay();
                    game.resetGame();
                    updateScreen();
                  });
                if (winner === 'Draw') {
                    result.textContent = `It's a draw`
                } else {
                    result.textContent = `${game.getActivePlayer().name} wins!`
                }
                return;
            }
        }

        const handleBoardClick = (e) => {
            const selectedRow = e.target.dataset.row;
            const selectedColumn = e.target.dataset.column;
    
            if (!selectedRow || !selectedColumn) return;
    
            const message = game.playRound(selectedRow, selectedColumn);
            updateScreen(message);
        }

        const resetGame = () => {
            game.resetGame();
            hideOverlay();
            updateScreen();
        }

        boardUI.addEventListener('click', handleBoardClick);
        document.querySelector('#reset').addEventListener('click', resetGame);
        document.querySelector('#start').addEventListener('click', () => showNameModal());
    
        //updateScreen();
        return {
            updateScreen,
            showOverlay,
            hideOverlay,
            resetGame
        };
    }
ScreenController();
    
})
