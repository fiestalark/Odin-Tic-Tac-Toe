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

    const printBoard = () => {
        console.log('\n Current board:');
        const ticTacToeBoard = board.map((row) => row.map((cell) => cell.getValue()));
        ticTacToeBoard.forEach(row => {
            console.log(row.join(' | '));
            console.log('-'.repeat(9));
        });
    };

    return { getBoard, chooseSquare, printBoard };
}


function Tac() {
    let value = '';

    const addTac = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addTac,
        getValue
    };
}

function tacController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
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
            return;
        }
        console.log(`Player ${getActivePlayer().name} chooses (${row}, ${column})`);

        switchPlayerTurn();
        printNewRound();
    };

    console.log('Game started.');
    console.log('Use play.playRound([0-2], [0-2]) to play.');
    board.printBoard();
    console.log(`\n${getActivePlayer().name}'s turn`)
    
    return {
        playRound,
        getActivePlayer
    };
}

const play = tacController();
