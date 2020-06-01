import * as PIXI from 'pixi.js';
import './style.css';

console.log("HIRE ME!");

//Create a Pixi Application
let app = new PIXI.Application({
    width: 1024,
    height: 1024,
    antialias: true,
    transparent: false,
});

// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
// app.renderer.resize(window.innerWidth, window.innerHeight);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);