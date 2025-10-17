let canvas, ctx, colour, stage, shape, frame = 0;
let dir = { x: 0, y: 1 }
let margin = 100
let compassSize = 100
let randomAmount = 0.5
let squareEnds = false
let random = true


function handleResize(app) {
    // Size of canvas not size of drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    app.renderer.resize(canvas.width, canvas.height);
    margin = Math.max(canvas.width / 5, 500)
}

function randomise(input) {
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
    constructor(x, y, layer, colour, app) {
        this.x = x;
        this.y = y;
        this.dropSize = randomise(layer.size);
        this.speed = randomise(layer.speed);
        this.length = randomise(layer.length);
        this.tailStep = layer.tailStep;
        this.colour = colour
        this.positions = [{ x: x, y: y }];

        this.gradient = new PIXI.FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1},
            colorStops: [
                { offset: 1, color: colour + '00'},
                { offset: 0, color: colour },
            ],
            textureSpace : 'local',
        });
    
        console.log(layer.length)
        this.object = new PIXI.Graphics().rect(0, 0, this.dropSize, 100 + 1);
        app.stage.addChild(this.object);
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
        this.y += dir.y * this.speed;
        this.x += dir.x * this.speed;

        // tail
        if (frame % this.tailStep === 0) {
            this.addPosition({ x: this.x, y: this.y });
        }

        let oldX = this.positions[this.positions.length - 1].x
        let oldY = this.positions[this.positions.length - 1].y

        // wrap around
        if ((this.x - margin) > canvas.width && dir.x > 0) {
            this.x = 0;
            this.y = canvas.height - this.y;
            this.positions = [{ x: this.x, y: this.y }];
        } else if ((this.x + margin) < 0 && dir.x < 0) {
            this.x = canvas.width;
            this.y = canvas.height - this.y;
            this.positions = [{ x: this.x, y: this.y }];
        }
        if ((this.y - margin) > canvas.height && dir.y > 0) {
            this.y = 0;
            this.x = canvas.width - this.x;
            this.positions = [{ x: this.x, y: this.y }];
        } else if ((this.y + margin) < 0 && dir.y < 0) {
            this.y = canvas.height;
            this.x = canvas.width - this.x;
            this.positions = [{ x: this.x, y: this.y }];
        }

        oldX = this.positions[this.positions.length - 1].x
        oldY = this.positions[this.positions.length - 1].y

        //  fill gradient between old and new position using pixi
       
        this.object.x = 0
        this.object.y = 0
        this.object.rotation = 0
        this.object.height = this.length  
        this.object.rotation = Math.atan2(dir.y, dir.x) + Math.PI / 2
        this.object.x = this.x
        this.object.y = this.y
        this.object.fill(this.colour);

    }
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onMouseMove(event) {

    let diffX = event.clientX - (canvas.width / 2)
    let diffY = event.clientY - (canvas.height / 2)

    // normalise to +-1
    diffX = (diffX / (canvas.width / 2))
    diffY = (diffY / (canvas.height / 2))

    // if (frame % 84 ==0){
    //     console.log(diffX,diffY)
    // }

    dir = { x: diffX, y: diffY }
}

function drawCompass() {
    ctx.strokeStyle = '#41365e'
    ctx.lineWidth = 2
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - compassSize, canvas.height / 2 - compassSize, compassSize * 2, compassSize * 2, 20)
    ctx.stroke();
    let x = canvas.width / 2 + ((compassSize - (compassSize / 4)) * dir.x)
    let y = canvas.height / 2 + ((compassSize - (compassSize / 4)) * dir.y)

    drawCircle(ctx, x, y, compassSize / 4 - 5, '#41365e33', '#41365e', 1)
}

async function init(PIXI, compass, rainColour, useSquareEnds, useRandom, layers) {
    const app = new PIXI.Application();
    await app.init({ width: 600, height: 360 });
    canvas = app.canvas
    document.body.appendChild(app.canvas);

    console.log(layers[0].length)

    handleResize(app)

    let drops = []

    if (compass) {
        canvas.addEventListener('mousemove', event => { onMouseMove(event) })
    }
    // window.addEventListener("resize", handleResize);

    // handleResize();

    layers.forEach(layer => {
        for (let i = 0; i < layer.drops; i++) {
            drops.push(new Drop(
                Math.random() * (canvas.width + margin)- margin / 2,
                Math.random() * (canvas.height + margin)- margin / 2,
                layer,
                rainColour,
                app
            ));
        }
    });


    app.renderer.background.color = 0x0e141b

    app.ticker.add((ticker) => {

        drops.forEach(drop => {
            drop.move();
        })

        // if(compass){
        //     drawCompass()
        // }

        // frame++;
        // requestAnimationFrame(draw);
    });
}