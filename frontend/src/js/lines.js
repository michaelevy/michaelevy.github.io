//@ts-check
let canvas = document.getElementById("lines");
const ctx = canvas.getContext("2d");


let lineNumber = 3;
let ringNumber =  Math.round(300 / lineNumber);
/** @type{Line[][]} */
let rings = new Array(ringNumber);

let insideScale = 1
let outsideScale = 0.5
let inside;
let outside;
let timeDelta = 0.05;
let radiusDelta = 0.5;
let lineLength = 120;
let frame = 0;
let colour = window.getComputedStyle(document.documentElement).getPropertyValue('--accent');
let offset = 800

const setArrays = () => {
    for (let i = 0; i < ringNumber; i++) {
        rings[i] = []
        for (let k = 0; k < lineNumber; k++) {
            rings[i][k] = new Line(
                k * (360 / lineNumber) + ((360 / lineNumber) * i) / ringNumber,
                ((outside - inside) / ringNumber) * i + inside
            );
        }
    }
}

function handleResize() {
    // Size of canvas not size of drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    setBounds();
    setArrays();
}

function lineLengthChange(event){
    lineLength = event.target.value;
}

function insideChange(event){
    insideScale = event.target.value;
    handleResize();
}

function outsideChange(event){
    outsideScale = event.target.value;
    handleResize();
}

document.querySelector("#line-length").addEventListener('input', lineLengthChange);
document.querySelector("#line-length").value = lineLength
document.querySelector("#inside-scale").addEventListener('input', insideChange);
document.querySelector("#inside-scale").value = insideScale
document.querySelector("#outside-scale").addEventListener('input', outsideChange);
document.querySelector("#outside-scale").value = outsideScale

const setBounds = () => {
    // Size of drawing
    outside = canvas.width * outsideScale;
    inside = outside / 2 * insideScale;
    offset = canvas.width / 3
};

/**
 * @param {number} angle
 */
function toRadians (angle) {
    return angle * (Math.PI / 180);
}

class Line {
    /**
     * @param {number} t
     * @param {number} r
     */
    constructor(t, r) {
        // controls the direction of change of the radius
        this.dir = 1;

        this.t = t;
        this.r = r;
        this.x = canvas.width / 2 - r;
        this.y = canvas.height / 2 - r;
    }
    // change the radius by one, dir controls direction
    changeR() {
        this.r += radiusDelta * this.dir;
    }


    move() {
        ctx.strokeStyle = colour;
        // trigonometry makes them go in a circle
        let x1 = this.r * Math.cos(toRadians(this.t)) + canvas.width / 2;
        let y1 = this.r * Math.sin(toRadians(this.t)) + canvas.width / 4;
        let x2 = this.r * Math.cos(toRadians(this.t - lineLength)) + canvas.width / 2;
        let y2 = this.r * Math.sin(toRadians(this.t - lineLength)) + canvas.width / 4;

        ctx.beginPath();
        ctx.moveTo(x1+offset, y1);
        ctx.lineTo(x2+offset, y2);
        ctx.stroke();
        // iterate time
        this.t = this.t + timeDelta;

        // if the radius is greater than 200 or less than zero, change direction.
        if (this.r >= outside || this.r < inside) {
            this.dir = this.dir * -1;
          }
        this.changeR();

        if (this.r >= outside) {
            this.r = outside - 1;
            this.dir = this.dir * -1;
        }

        if (this.r < inside) {
            this.r = inside + 1;
            this.dir = this.dir * -1;
        }
    }
}


function draw() {
    window.addEventListener("resize", handleResize);

    drawBackground();

    if (frame == 0){
        handleResize()
    }

    // for (let i = 0; i < ringNumber; i++) {z``
    //     for (let k = 0; k < lineNumber; k++) {
    //         let ringOffset = ((outside - inside) / ringNumber) * i;
    //         let t = k * (360 / lineNumber) + ((360 / lineNumber) * i) / ringNumber + frame;
    //         rings[i][k].r = ringOffset + inside + Math.abs((outside - inside) - (t % ((outside - inside)) * 2))
    //         console.log(Math.abs((outside - inside) - (t % ((outside - inside)) * 2)))
    //     }
    // }

    for (let i = 0; i < ringNumber; i++) {
        for (let k = 0; k < lineNumber; k++) {
            rings[i][k].move();
        }
    }

    frame++;
    requestAnimationFrame(draw)
}

draw()

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

