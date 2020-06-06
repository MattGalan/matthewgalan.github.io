import * as PIXI from 'pixi.js';
import anime from "animejs";
import SimplexNoise from 'simplex-noise';
import './style.css';
import Vector from './Vector';

const Graphics = PIXI.Graphics;
const simplex = new SimplexNoise();

const width = window.innerWidth;
const height = window.innerHeight;
const margin = 10;

const noiseScale = 128;
const noiseStrength = 0.01;
const dragCoefficient = 0.005;
const bounceForce = 3;
const mouseGravity = 1.5;

console.log("HIRE ME!");

//Create a Pixi Application
let app = new PIXI.Application({
    width: width,
    height: height,
    antialias: true,
    transparent: false,
});

app.renderer.backgroundColor = 0x1b171f;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgbString) {
    const regex = /\d+/g;
    const found = rgbString.match(regex);
    return "0x" + componentToHex(found[0]) + componentToHex(found[1]) + componentToHex(found[2]);
}

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

const circles = [];

let i;
for (i = 0; i < width * height / 20000; i++) {
    let circle = new Graphics();

    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, 8);
    circle.endFill();

    circle.color = "rgb(76, 53, 92)";
    circle.scale.set(0, 0);

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

window.addEventListener("click", () => {
    const mousePosition = app.renderer.plugins.interaction.mouse.global;

    circles.forEach(circle => {
        const toMouse = Vector.posDiff(mousePosition, circle);
        const mouseDistSq = toMouse.squareMagnitude();
        const push = toMouse.multiply(500).divide(mouseDistSq);
        circle.xVel += push.x;
        circle.yVel += push.y;
    });
});

app.ticker.add(() => {
    const mousePosition = app.renderer.plugins.interaction.mouse.global;
    
    circles.forEach(circle => {
        const noiseAngle = simplex.noise2D(circle.x / noiseScale, circle.y / noiseScale) * 2 * Math.PI;

        // Simplex acceleration
        circle.xVel += Math.cos(noiseAngle) * noiseStrength;
        circle.yVel += Math.sin(noiseAngle) * noiseStrength;

        // Drag
        circle.xVel += getDrag(circle.xVel);
        circle.yVel += getDrag(circle.yVel);

        // Mouse gravity
        const toMouse = Vector.posDiff(circle, mousePosition);
        const mouseDistSq = toMouse.squareMagnitude();
        const pull = toMouse.multiply(mouseGravity).divide(mouseDistSq);
        circle.xVel += pull.x;
        circle.yVel += pull.y;

        // Update positions
        circle.x += circle.xVel;
        circle.y += circle.yVel;

        // Bounce off of other circles
        circles.forEach(other => {
            const toOther = Vector.posDiff(circle, other);
            if (other !== circle && toOther.squareMagnitude() < 64) {
                const bounce = toOther.invert().normalize().multiply(bounceForce);

                circle.xVel = bounce.x;
                circle.yVel = bounce.y;
                circle.color = "rgb(128, 96, 150)";
                circle.size = 1.5;

                anime({
                    targets: circle,
                    color: "rgb(76, 53, 92)",
                    size: 1
                });
            }
        })

        circle.tint = rgbToHex(circle.color);
        circle.scale.set(circle.size, circle.size);

        // Reposition if out of bounds
        if (outOfBounds(circle)) {
            respawnCircle(circle);
        }
    });
})

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
