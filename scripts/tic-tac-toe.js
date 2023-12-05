(function Game() {
    const startBtn = document.querySelector('button.start-button');
    const resetBtn = document.querySelector('button.reset-button');
    const resultText = document.querySelector('p.result-text');
    const gameContainer = document.querySelector('div.game-container');
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);

    function startGame() {
        // Set GameBoard array
        const GameBoard = (function() {
            const board = [];
            for (let i = 0; i < 9; i++) {
                board.push(null);
            }

            return board;
        })();

        // Set Players object
        const Players = (function() {
            const playerName = prompt("Hi, what's your name?");
            const playerIcon = prompt("Choose an icon: (X or O)", "X");
            const computerIcon = playerIcon === "X" ? "O" : "X";
    
            function createPlayer(name, icon) {
                return {
                    name,
                    icon,
                    status: "undetermined",
                };
            }
            return {
                player: createPlayer(playerName, playerIcon),
                computer: createPlayer('Computer', computerIcon),
            }
        })();

        let currentRound = 0;
        let currentPlayer = Players.player;
        let matchStatus = "in-progress";

        (function startRound() {
            currentRound++;
           
            if (currentPlayer === Players.player) {
                setTimeout(playerPlay, 2000);

            } else {
                setTimeout(computerPlay, 1000);
            }

            function playerPlay() {
                resultText.textContent = "It's your turn! Pick a position."

                let playerChoice = null;
                gameContainer.addEventListener('click', function choosePosition(event) {
                    const triggerContainer = event.target;
                    playerChoice = triggerContainer.dataset.position;
                    event.stopPropagation();

                    if (GameBoard[playerChoice] === null) {
                        GameBoard[playerChoice] = currentPlayer.icon;
                        triggerContainer.textContent = Players.player.icon;
                        gameContainer.removeEventListener('click', choosePosition);

                        checkWinner();
                        checkDraw();

                        if (matchStatus === "in-progress") {
                            // Change turn when game is not over after round
                            currentPlayer = currentPlayer === Players.player ? Players.computer : Players.player;
                            startRound();
                        } 
                    }
                })
            }

            function computerPlay() {
                // Collect positions that's not been chose yet
                let remainingPositions = [];
                for (let i = 0; i < 9; i++) {
                    if (GameBoard[i] === null) {
                        remainingPositions.push(i);
                    }
                }
                // Randomly choose remaining positions
                const computerChoice = remainingPositions[Math.floor(Math.random() * remainingPositions.length)];
                GameBoard[computerChoice] = Players.computer.icon;
                const chosenSquare = document.querySelector(`div[data-position="${computerChoice}"]`);
                chosenSquare.textContent = Players.computer.icon;
                resultText.textContent = "Computer chose a position"

                checkWinner();
                checkDraw();

                // Change turn when game is not over after round
                if (matchStatus === "in-progress") {
                    currentPlayer = currentPlayer === Players.player ? Players.computer : Players.player;
                    startRound();
                }
            }

            function checkWinner() {
                // All winning combinations
                if ((GameBoard[0] !== null && GameBoard[0] === GameBoard[1] && GameBoard[1] === GameBoard[2]) ||
                    (GameBoard[3] !== null && GameBoard[3] === GameBoard[4] && GameBoard[4] === GameBoard[5]) ||
                    (GameBoard[6] !== null && GameBoard[6] === GameBoard[7] && GameBoard[7] === GameBoard[8]) ||
                    (GameBoard[0] !== null && GameBoard[0] === GameBoard[3] && GameBoard[3] === GameBoard[6]) ||
                    (GameBoard[1] !== null && GameBoard[1] === GameBoard[4] && GameBoard[4] === GameBoard[7]) ||
                    (GameBoard[2] !== null && GameBoard[2] === GameBoard[5] && GameBoard[5] === GameBoard[8]) ||
                    (GameBoard[0] !== null && GameBoard[0] === GameBoard[4] && GameBoard[4] === GameBoard[8]) ||
                    (GameBoard[2] !== null && GameBoard[2] === GameBoard[4] && GameBoard[4] === GameBoard[6])) {
                    
                    currentPlayer.status = "winner";

                    // Set other player's status to loser
                    currentPlayer === Players.player ? Players.computer.status = "loser" : Players.player.status = "loser";

                    matchStatus = "end";
                    showResult();
                }
            }
            
            function checkDraw() {
                if (currentRound === 9 && currentPlayer.status === "undetermined") {
                    Players.player.status = "draw";
                    Players.computer.status = "draw";

                    matchStatus = "end";
                    showResult();
                }
            }

            function showResult() {
                if (currentPlayer.status === "winner") {
                    resultText.textContent = `Winner is: ${currentPlayer.name}`; 
                } else if (currentPlayer.status === "draw") {
                    resultText.textContent = `Nobody wins, it's a tie.`; 
                }
            }
        })();
    };

    function resetGame() {
        // Clear the marks in all the containers
        const positionContainers = document.querySelectorAll('.position-container');
        positionContainers.forEach(container => {
            container.textContent = "";
        });
        resultText.textContent = "";

        startGame();
    }
})();