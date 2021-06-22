document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    let nextRandom = 0;
    let timeId;
    let score = 0;
    let showScore = document.querySelector('#score');
    const Start = document.querySelector('.btns');
    // const Start =  document.getElementsByClassName('.start-button');
    // const Start = document.getElementsByTagName('button');

    // All tetrominoes
    const lShape = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
    const zShape = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tShape = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oShape = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iShape = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];
    const allShape = [lShape, zShape, tShape, oShape, iShape];
    let currentPosition = 4;
    let currentRotation = 0;
    // Randomly selects the tetromino and its first rotation 
    let random = Math.floor(Math.random() * allShape.length);
    let current = allShape[random][currentRotation];

    // Draw the first rotation of the  tetrimonio
    const draw = () => {
        current.forEach((item, index) => {
            squares[currentPosition + item].classList.add('tetrimonio');
        })
    }
    // draw();

    //undraw the tetrimino
    const undraw = () => {
        current.forEach((item, index) => {
            squares[currentPosition + item].classList.remove('tetrimonio');
        })
    }
    // undraw();

    // Working with keycodes
    function keyControls(e) {
        if (e.keyCode === 37) {
            shiftLetf();
        } else if (e.keyCode === 38) {
            // Up
            changeShape();
        } else if (e.keyCode === 39) {
            shiftRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', keyControls);
    // Make the tetrimonio move down every seconds
    // timeId = setInterval(moveDown, 900);
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze function 
    function freeze() {
        if (current.some((item) => squares[currentPosition + item + width].classList.contains('taken'))) {
            current.forEach(item => squares[currentPosition + item].classList.add('taken'));
            // start a new tetrimonio falling 
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * allShape.length);
            current = allShape[random][currentRotation];
            currentPosition = 4;
            draw();
            showMini();
            calScore();
            gameOver();
        }
    }

    // Calculating score
    function calScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(item => squares[item].classList.contains('taken'))) {
                score += 1;
                showScore.innerHTML = score;
                row.forEach(item => {
                    squares[item].classList.remove('taken');
                    squares[item].classList.remove('tetrimonio');
                });
                const squareRemoved = squares.splice(i, width);
                squares = squareRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    //Moving to the left tetrimonio
    function shiftLetf() {
        undraw();
        const isLeftPart = current.some(item => (currentPosition + item) % width === 0);
        if (!isLeftPart) currentPosition -= 1;
        if (current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Moving to the right
    function shiftRight() {
        undraw();
        const ifRightPart = current.some(item => (currentPosition + item) % width === width - 1);
        if (!ifRightPart) currentPosition += 1;
        if (current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }
    // Rotate/Change the shape position 
    function changeShape() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = allShape[random][currentRotation];
        draw();
    }

    // Display mini grids
    const miniSquares = document.querySelectorAll('.show-mini div');
    const miniWidth = 4;
    let miniIndex = 0;
    // All shapes for mini grid
    const miniShapes = [
        [1, miniWidth + 1, miniWidth * 2 + 1, 2],// L Shape
        [0, miniWidth, miniWidth + 1, miniWidth * 2 + 1], // Z Shape
        [1, miniWidth, miniWidth + 1, miniWidth + 2], //T Shape
        [0, 1, miniWidth, miniWidth + 1], // O shape
        [1, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 3 + 1] //I Shape
    ];

    // Display all the shapes into the mini-grid part 
    function showMini() {
        miniSquares.forEach(item => {
            item.classList.remove('tetrimonio');
        });
        miniShapes[nextRandom].forEach(item => {
            miniSquares[miniIndex + item].classList.add('tetrimonio');
        });
    }
    // Add some features to the button
    Start.addEventListener('click', () => {
        if (timeId) {
            clearInterval(timeId);
            timeId = null;
        } else {
            draw();
            timeId = setInterval(moveDown, 900);
            nextRandom = Math.floor(Math.random() * allShape.length);
            showMini();
        }
    });
    function gameOver() {
        if (current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
            showScore.innerHTML = 'Game Over';
            alert('Game over ! Please refresh to restart.')
            clearInterval(timeId);
        }
    }
});