//@ts-check
let canvas, ctx, colour, stage, shape, frame = 0;
let dir = {x:0,y:1}
let margin = 100
let compassSize = 100
let randomAmount = 0.5
let squareEnds = false
let random = true

function handleResize() {
    // Size of canvas not size of drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    margin = Math.max(canvas.width / 5, 500)
}

function randomise(input){
    if (!random) return input
    let percentage = Math.random() * randomAmount - (randomAmount / 2)
    return input + (input * percentage)
}

class Drop {
    /**
     * @param {number} x
     * @param {number} y
     * @param {object} layer
     */
    constructor(x, y, layer, colour) {
        this.x = x;
        this.y = y;
        this.dropSize = randomise(layer.size);
        this.speed = randomise(layer.speed);
        this.length = randomise(layer.length);
        this.tailStep = layer.tailStep;
        this.colour = colour
        this.positions = [{x:x,y:y}];
    }

    /**
     * @param {{ x: number; y: number; }} p
     */
    addPosition(p) {
        this.positions.unshift(p);
        if (this.positions.length > this.length) {
            this.positions.pop();
        }
    }

    move() {
        ctx.fillStyle = colour;

        this.y += dir.y * this.speed;
        this.x += dir.x * this.speed;

        // tail
        if (frame % this.tailStep === 0) {
            this.addPosition({ x: this.x, y: this.y });
        }

        let oldX = this.positions[this.positions.length-1].x
        let oldY = this.positions[this.positions.length-1].y

        // wrap around
        if ((this.x - margin) > canvas.width && dir.x > 0) {
            this.x = 0;
            this.y = canvas.height - this.y;
            this.positions = [{x:this.x,y:this.y}]; 
        } else if ((this.x + margin) < 0 && dir.x < 0) {
            this.x = canvas.width;
            this.y = canvas.height - this.y;
            this.positions = [{x:this.x,y:this.y}]; 
        }
        if ((this.y - margin) > canvas.height && dir.y > 0) {
            this.y = 0;
            this.x = canvas.width - this.x;
            this.positions = [{x: this.x,y:this.y}]; 
        } else if ((this.y + margin) < 0 && dir.y < 0) {
            this.y = canvas.height; 
            this.x = canvas.width - this.x; 
            this.positions = [{x: this.x,y:this.y}]; 
        }
        
        oldX = this.positions[this.positions.length-1].x
        oldY = this.positions[this.positions.length-1].y
        let newY = this.positions[0].y
        let newX = this.positions[0].x

        let gradient = ctx.createLinearGradient(newX, newY, oldX, oldY);

        gradient.addColorStop(0, this.colour);
        gradient.addColorStop(1, this.colour + '00');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.dropSize
        if (squareEnds) {
            ctx.lineCap = 'butt'
        }
        else {
            ctx.lineCap = 'round'
        }

        ctx.beginPath();
        ctx.moveTo(newX,newY);
        ctx.lineTo(oldX,oldY);
        ctx.stroke();


        // if (frame % 84 ==0){
        //     console.log(this.x,this.positions)
        // }
    }
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onMouseMove(event){
    const rect = canvas.getBoundingClientRect();
    let diffX = event.clientX - (rect.left + rect.width / 2)
    let diffY = event.clientY - (rect.top + rect.height / 2)

    // normalise to +-1
    diffX = (diffX / (rect.width / 2))
    diffY = (diffY / (rect.height / 2))

    // if (frame % 84 ==0){
    //     console.log(diffX,diffY)
    // }

    dir = {x:diffX,y:diffY}
}

function drawCompass(){
    ctx.strokeStyle = '#41365e'
    ctx.lineWidth = 2
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - compassSize, canvas.height / 2 - compassSize, compassSize * 2, compassSize * 2, 20)
    ctx.stroke();
    let x = canvas.width / 2 + ((compassSize - (compassSize / 4)) * dir.x)
    let y = canvas.height / 2 + ((compassSize - (compassSize / 4))* dir.y )

    drawCircle(ctx, x, y, compassSize / 4 - 5, '#41365e33', '#41365e', 1)
}

function init(compass, rainColour, useSquareEnds, useRandom, layers) {
    canvas = document.getElementById("rain");
    ctx = canvas.getContext("2d");
    squareEnds = useSquareEnds
    random = useRandom

    let drops = []

    if (compass){
        window.addEventListener('mousemove', event => {onMouseMove(event)})
    }
    window.addEventListener("resize", handleResize);

    colour = window.getComputedStyle(document.documentElement).getPropertyValue('--accent');

    handleResize();

    layers.forEach(layer => {
        for (let i = 0; i < layer.drops; i++) {
            drops.push(new Drop(
                Math.random() * (canvas.width + margin) - margin / 2,
                Math.random() * (canvas.height + margin) - margin / 2,
                layer,
                rainColour
            ));
        }
    });

    function draw() {
        drawBackground();

        drops.forEach(drop => {
            drop.move();
        })

        if(compass){
            drawCompass()
        }

        frame++;
        requestAnimationFrame(draw);
    }

    draw();
}