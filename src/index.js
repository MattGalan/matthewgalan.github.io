import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import './style.css';
import Vector from './Vector';

const Graphics = PIXI.Graphics;
const simplex = new SimplexNoise();

const width = 1024;
const height = 1024;
const margin = 10;

const noiseScale = 128;
const noiseStrength = 0.01;
const dragCoefficient = 0.01;
const bounceForce = 3;

console.log("HIRE ME!");

function respawnCircle(circle) {
    circle.xVel = 0;
    circle.yVel = 0;

    const wall = Math.random();

    // Top wall
    if (wall < .25) {
        circle.x = Math.random() * width;
        circle.y = -margin;
        return;
    }

    // Right wall
    if (wall < .5) {
        circle.x = width + margin;
        circle.y = Math.random() * height;
        return;
    }

    // Bottom wall
    if (wall < .75) {
        circle.x = Math.random() * width;
        circle.y = height + margin;
        return;
    }

    // Left wall
    circle.x = -margin;
    circle.y = Math.random() * height;
}

function outOfBounds(circle) {
    return circle.x < -margin * 2 ||
        circle.x > width + margin * 2 ||
        circle.y < -margin * 2 ||
        circle.y > height + margin * 2;
}

//Create a Pixi Application
let app = new PIXI.Application({
    width: width,
    height: height,
    antialias: true,
    transparent: false,
});

// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
// app.renderer.resize(window.innerWidth, window.innerHeight);

const circles = [];

let i;
for (i = 0; i < 50; i++) {
    let circle = new Graphics();

    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, 8);
    circle.endFill();

    circle.x = Math.random() * width;
    circle.y = Math.random() * height;

    circle.xVel = 0;
    circle.yVel = 0;

    circles.push(circle);
    app.stage.addChild(circle);
}

function getDrag(vel) {
    return -Math.sign(vel) * dragCoefficient * vel * vel / 2
}

app.ticker.add(() => {
    circles.forEach((circle, index) => {
        const noiseAngle = simplex.noise2D(circle.x / noiseScale, circle.y / noiseScale) * 2 * Math.PI;

        // Simplex acceleration
        circle.xVel += Math.cos(noiseAngle) * noiseStrength;
        circle.yVel += Math.sin(noiseAngle) * noiseStrength;

        // Drag
        circle.xVel += getDrag(circle.xVel);
        circle.yVel += getDrag(circle.yVel);

        // Update positions
        circle.x += circle.xVel;
        circle.y += circle.yVel;

        // Bounce off of other circles
        circles.forEach(other => {
            if (other !== circle && Math.pow(circle.x - other.x, 2) + Math.pow(circle.y - other.y, 2) < 64) {
                const bounce = new Vector(circle.x - other.x, circle.y - other.y).normalize().multiply(bounceForce);
                circle.xVel = bounce.x;
                circle.yVel = bounce.y;
            }
        })

        // Reposition if out of bounds
        if (outOfBounds(circle)) {
            respawnCircle(circle);
        }
    });
})

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
