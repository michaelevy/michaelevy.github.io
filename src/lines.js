//@ts-check
let canvas = document.getElementById("lines");
const ctx = canvas.getContext("2d");

/** @type{Line[][]} */
let rings = new Array(ringNumber);
let lineNumber = 3;
let ringNumber =  Math.round(100 / lineNumber);

let inside;
let outside;
let timeDelta = 0.125;
let radiusDelta = 0.5;
let lineLength = 480;
let frame = 0;

let offset = 800


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
        ctx.strokeStyle = `rgb(212,76, 80)`;
        // trigonometry makes them go in a circle
        let x1 = this.r * Math.cos(toRadians(this.t)) + canvas.width / 2;
        let y1 = this.r * Math.sin(toRadians(this.t)) + canvas.height / 2;
        let x2 = this.r * Math.cos(toRadians(this.t - lineLength)) + canvas.width / 2;
        let y2 = this.r * Math.sin(toRadians(this.t - lineLength)) + canvas.height / 2;

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
    const setBounds = () => {
        outside = Math.min(canvas.width, canvas.height) * outsideScale;
        inside = outside / 2 * insideScale;
    };

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
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        setBounds();
        setArrays();
    }
    
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
    ctx.fillStyle = "#0e141b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

