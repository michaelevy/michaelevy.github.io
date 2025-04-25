//@ts-check
let canvas, ctx, frame = 0;
let squareSize = 25
let margin = 5
let columnNum = 10
let rowNum = 10
let grid = ['0']
let colours = ['r','g','b','y','m','c']
let events = []
let fps = 5;


var frameCount = 0;
var fpsInterval, startTime, now, then, elapsed;

class SnakeEvent {
    constructor(x,y, type, colour, frame) {
        this.x = x;
        this.y = y;
        this.frame = frame; 
        this.type = type;
        this.colour = colour;
    }
}

function addEvent(grid, event, snake) {
    events.push(event);
    console.log(`Event added: ${event.colour} ${event.type} at frame ${event.frame}`);
}

function handleResize() {
    // Size of canvas not size of drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    columnNum = Math.floor(canvas.width / squareSize);
    rowNum = Math.floor(canvas.height / squareSize);
}

class Snake{
    constructor(x, y, direction, length, colour, id) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.prevDirection = direction;
        this.length = length;
        this.body = [[x, y]];
        this.appendages = [[x,y]];
        this.colour = colour;
        this.dead = false
        this.id = id;
        this.totalScore = 0;
    }

    update(grid, started){
        if(this.dead) return
        if (started) this.move(grid)
        if(this.dead) return
        this.drawSnake(grid)
    }

    move(grid) {
        let newX = this.x;
        let newY = this.y;
        let die = false;

        if (this.direction == 'up') {
            if (this.prevDirection == 'down') {die = true};
            newY -= 1;
        } else if (this.direction == 'down') {
            if (this.prevDirection == 'up') {die = true};
            newY += 1;
        } else if (this.direction == 'left') {
            if (this.prevDirection == 'right') {die = true};
            newX -= 1;
        } else if (this.direction == 'right') {
            if (this.prevDirection == 'left') {die = true};
            newX += 1;
        }

        if (die === true){
            addEvent(grid,new SnakeEvent(newX,newY, 'BACKWARDS MOMENT', this.colour, frame), this)
        }
        else if (newX < 0 || newX >= columnNum || newY < 0 || newY >= rowNum || die) {
            die = true
            addEvent(grid, new SnakeEvent(newX,newY,'WALL', this.colour, frame), this)
        } else {
            if (grid[newX][newY] == 'f'){
                this.length += 1;

                    grid[newX][newY] = this.colour;
                    addEvent(grid, new SnakeEvent(newX,newY,'EATEN', this.colour, frame), this)

            }
            else if (grid[newX][newY] != '0' ) {
                die = true
                addEvent(grid, new SnakeEvent(newX,newY,'SNAKED', this.colour, frame), this)
            }
        }

        if (die || this.dead){
            for (let i = 0; i < this.body.length; i++) {
                let x = this.body[i][0];
                let y = this.body[i][1];
                grid[x][y] = this.id;
            }
            this.dead = true;
            return;
        };


        this.x = newX;
        this.y = newY;
        this.prevDirection = this.direction;

        this.body.unshift([newX, newY]);
        if (this.body.length > this.length) {
            let old =  this.body.pop();
            grid[old[0]][old[1]] = '0';
        }


    }

    drawSnake(grid){
        for (let i = 0; i < this.body.length; i++) {
            let x = this.body[i][0];
            let y = this.body[i][1];
            grid[x][y] = this.colour;
        }

    }

    reset(){
        this.x = Math.floor(Math.random() * columnNum);
        this.y = Math.floor(Math.random() * rowNum);
        this.direction = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
        this.prevDirection = 'none'
        this.length = Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : 3;
        this.body = [[this.x, this.y]];
        this.dead = false
        this.totalScore += this.length;
    }
}

function setup(snake){
    
}

function drawGrid(grid, squareColour) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = squareColour;
    for (let i = 0; i < columnNum; i++) {
        for (let j = 0; j < rowNum; j++) {
            setColour(grid[i][j],squareColour);
            let x = i * squareSize;
            let y = j * squareSize;
            ctx.fillRect(x + (margin/2), y + (margin/2), squareSize - (margin / 2), squareSize - (margin / 2));
        }
    }
    for (let e of events) {
        if (frame - e.frame > 5) continue;
        ctx.fillStyle = setColour(e.colour);
        ctx.font = "48px monospace";
        ctx.fillText(e.type, e.x * squareSize , e.y * squareSize);
    }
}

function setColour(character, squareColour = 'white') {
    if (character== '0') {
        ctx.fillStyle = squareColour;
    } else if (character == 'r') {
        ctx.fillStyle = '#FF0000';
    } else if (character == 'g') {
        ctx.fillStyle = '#00FF00';
    } else if (character == 'b') {
        ctx.fillStyle = '#0000FF';
    } else if (character == 'y') {
        ctx.fillStyle = 'yellow';
    } else if (character == 'm') {
        ctx.fillStyle = 'magenta';
    } else if (character == 'c') {
        ctx.fillStyle = 'cyan';
    } else if (character == '1'){
        ctx.fillStyle = '#770000';
    } else if (character == '2'){
        ctx.fillStyle = '#005500';
    } else if (character == '3'){
        ctx.fillStyle = '#000077';
    } else if (character == '4'){
        ctx.fillStyle = '#777700';
    } else if (character == '5'){
        ctx.fillStyle = '#770077';
    } else if (character == '6'){
        ctx.fillStyle = '#007777';
    } else if (character == 'f'){
        ctx.fillStyle = 'orange';
    }
    else {
        ctx.fillStyle = squareColour;
    }
}

function keyPress(event,snakes){
    console.log(event.key)
    if (event.key == "ArrowUp") {
        snakes[0].direction = 'up';
        event.preventDefault();
    } else if (event.key == "ArrowDown") {
        snakes[0].direction = 'down';
        event.preventDefault();
    } else if (event.key == "ArrowLeft") {
        event.preventDefault();
        snakes[0].direction = 'left';
    } else if (event.key == "ArrowRight") {
        event.preventDefault();
        snakes[0].direction = 'right';
    } else if (event.key == "w") {
        event.preventDefault();
        snakes[1].direction = 'up';
    } else if (event.key == "s") {
        event.preventDefault();
        snakes[1].direction = 'down';
    } else if (event.key == "a") {
        event.preventDefault();
        snakes[1].direction = 'left';
    } else if (event.key == "d") {
        event.preventDefault();
        snakes[1].direction = 'right';
    } else if (event.key == "i") {
        event.preventDefault();
        snakes[2].direction = 'up';
    } else if (event.key == "k") {
        event.preventDefault();
        snakes[2].direction = 'down';
    } else if (event.key == "j") {
        event.preventDefault();
        snakes[2].direction = 'left';
    } else if (event.key == "l") {
        event.preventDefault();
        snakes[2].direction = 'right';
    }
}

function segmentIndexToGridCoords(index){
    switch (index){
        case 0:
            return [[1,0],[0,0],[2,0]]
        case 1:
            return [[2,1],[2,0],[2,2]]
        case 2: 
            return [[2,3], [2,2],[2,4]]
        case 3:
            return [[1,4], [2,4],[0,4]]
        case 4:
            return [[0,2],[0,3],[0,4]]
        case 5:
            return [[0,0],[0,1],[0,2]]
        case 6:
            return [[2,2],[1,2],[0,2]]
        default:
            return [[0,0],[0,0],[0,0]]
    }
}

function numberToSegmentDisplay(number) {
    const segments = {
        0: [1,1,1,1,1,1,0],
        1: [0,1,1,0,0,0,0],
        2: [1,1,0,1,1,0,1],
        3: [1,1,1,1,0,0,1],
        4: [0,1,1,0,0,1,1],
        5: [1,0,1,1,0,1,1],
        6: [1,0,1,1,1,1,1],
        7: [1,1,1,0,0,0,0],
        8: [1,1,1,1,1,1,1],
        9: [1,1,1,0,0,1,1],
    };

    const numStr = String(number);
    let result = [];
  
    for (const digit of numStr) {
        if (segments[digit]) {
            result.push(segments[digit]);
        } else {
            result.push([0, 0, 0, 0, 0, 0, 0]);
        }
    }
    return result;

}  

function drawScore(grid, snake){
    let segments = numberToSegmentDisplay(snake.length);
    let x = 5;
    let y = 5;
    drawSegment(segments, x, y, snake, grid);
}

function drawTotalScore(grid, snake){
    let segments = numberToSegmentDisplay(snake.totalScore);
    let x = grid.length - 15;
    let y = 5;
    drawSegment(segments, x, y, snake, grid);
}


function drawSegment(segments, x, y, snake, grid) {
    segments.forEach((segment, index) => {
        let segmentX = x + (index * 5);
        let segmentY = y + (snake.id * 6);
        ctx.fillStyle = setColour(snake.colour);

        for (let i = 0; i < segment.length; i++) {
            let segmentCoords = segmentIndexToGridCoords(i);

            segmentCoords.forEach(coord => {
                let gridX = coord[0];
                let gridY = coord[1];
                if (segment[i] == 0 && grid[segmentX + gridX][segmentY + gridY] == snake.id) {
                    grid[segmentX + gridX][segmentY + gridY] = '0';
                }

            });
        }

        for (let i = 0; i < segment.length; i++) {
            let segmentCoords = segmentIndexToGridCoords(i);

            segmentCoords.forEach(coord => {
                let gridX = coord[0];
                let gridY = coord[1];
                if (segment[i] == 1) {
                    grid[segmentX + gridX][segmentY + gridY] = snake.id;
                }
            });

        }
    });
}

function init(snakeNum) {
    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");
    ctx.font = "48px serif";
    let started = false;
    handleResize();


    let colour = window.getComputedStyle(document.documentElement).getPropertyValue('--accent');
    let squareColour = window.getComputedStyle(document.documentElement).getPropertyValue('--background-light');
    window.addEventListener("resize", handleResize);

    grid = new Array(columnNum).fill('0').map(() => new Array(rowNum).fill('0'));
    let snakes = []
    for (let i = 0; i < snakeNum; i++) {
        let x = Math.floor(Math.random() * columnNum);
        let y = Math.floor(Math.random() * rowNum);
        let direction = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
        let length = Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : 3;
        let colour = colours[i % (colours.length - 1)];
        snakes.push(new Snake(x, y, direction, length, colour, i+1));
    }
   
    addEventListener("keydown",(e) => {
        if (!started) {
            started = true;
        }
        keyPress(e,snakes)
    }, false);

    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    
    function draw(newtime) {

        requestAnimationFrame(draw);
    
        now = newtime;
        elapsed = now - then;
        if (elapsed > fpsInterval) {
    
            then = now - (elapsed % fpsInterval);

            let liveSnakes = 0;

            snakes.forEach(snake => {
                if (!snake.dead) {liveSnakes++}
                snake.update(grid, started);
                drawScore(grid, snake);
                drawTotalScore(grid, snake);
            });

            if (liveSnakes <= 1){
                started = false;
                snakes.forEach(snake => {
                    snake.reset()
                });
                grid = new Array(columnNum).fill('0').map(() => new Array(rowNum).fill('0'));
            }
    
            if (started && frame % 50 == 0){
                let food = 'f'
                let x = Math.floor(Math.random() * columnNum);
                let y = Math.floor(Math.random() * rowNum);
                grid[x][y] = food;
                addEvent(grid, new SnakeEvent(x,y,'FOOD', food, frame), snakes[0])
            }
    
            drawGrid(grid, squareColour);
    
            frame++;
        }
    }
    draw();

}