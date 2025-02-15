window.onload = () => {
    document.getElementById("start").onclick = init;
};

let canvas;
const canvasWidth = 900;
const canvasHeight = 600;
const blockSize = 30;
let ctx;
const delay = 120;
let snake;
let apple;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;
let score;
let timeout;

class Snake {
    constructor(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
    }

    draw() {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        this.body.forEach(part => drawBlock(ctx, part));
        ctx.restore();
    }

    advance() {
        const nextPosition = this.body[0].slice();
        switch (this.direction) {
            case "left":
                nextPosition[0] -= 1;
                break;
            case "right":
                nextPosition[0] += 1;
                break;
            case "down":
                nextPosition[1] += 1;
                break;
            case "up":
                nextPosition[1] -= 1;
                break;
            default:
                throw ("invalid direction");
        }

        this.body.unshift(nextPosition);
        if (!this.ateApple) {
            this.body.pop();
        } else {
            this.ateApple = false;
        }
    }

    setDirection(newDirection) {
        const allowedDirections = {
            "left": ["up", "down"],
            "right": ["up", "down"],
            "down": ["left", "right"],
            "up": ["left", "right"]
        };

        if (allowedDirections[this.direction].includes(newDirection)) {
            this.direction = newDirection;
        }
    }

    checkCollision() {
        const [headX, headY] = this.body[0];
        const rest = this.body.slice(1);
        const wallCollision = headX < 0 || headX >= widthInBlocks || headY < 0 || headY >= heightInBlocks;
        const snakeCollision = rest.some(part => part[0] === headX && part[1] === headY);

        return wallCollision || snakeCollision;
    }

    isEatingApple(appleToEat) {
        const [headX, headY] = this.body[0];
        return headX === appleToEat.position[0] && headY === appleToEat.position[1];
    }
}

class Apple {
    constructor(position) {
        this.position = position;
    }

    draw() {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        const radius = blockSize / 2;
        const x = this.position[0] * blockSize + radius;
        const y = this.position[1] * blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
    }

    setNewPosition() {
        const newX = Math.round(Math.random() * (widthInBlocks - 1));
        const newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
    }

    isOnSnake(snakeToCheck) {
        return snakeToCheck.body.some(part => part[0] === this.position[0] && part[1] === this.position[1]);
    }
}

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext('2d');
    snake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    apple = new Apple([10, 10]);
    score = 0;
    refreshCanvas();

    document.getElementById("left").onclick = () => snake.setDirection("left");
    document.getElementById("up").onclick = () => snake.setDirection("up");
    document.getElementById("down").onclick = () => snake.setDirection("down");
    document.getElementById("right").onclick = () => snake.setDirection("right");
}

function refreshCanvas() {
    snake.advance();
    if (snake.checkCollision()) {
        gameOver();
    } else {
        if (snake.isEatingApple(apple)) {
            score++;
            snake.ateApple = true;
            drawScore();
            do {
                apple.setNewPosition();
            } while (apple.isOnSnake(snake));
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawScore();
        snake.draw();
        apple.draw();
        timeout = setTimeout(refreshCanvas, delay);
    }
}

function gameOver() {
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    ctx.strokeText("game over", centerX, centerY - 180);
    ctx.fillText("game over", centerX, centerY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("appuyer sur la touche espace pour rejouer", centerX, centerY - 120);
    ctx.fillText("appuyer sur la touche espace pour rejouer", centerX, centerY - 120);
    ctx.restore();
}

function restart() {
    snake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    apple = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
}

function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
}

function drawBlock(ctx, position) {
    const [x, y] = position;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function handleKeyDown(e) {
    const key = e.keyCode;
    const directionMap = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    const newDirection = directionMap[key];
    if (newDirection) {
        snake.setDirection(newDirection);
    } else if (key === 32) {
        restart();
    }
}

document.onkeydown = handleKeyDown;
