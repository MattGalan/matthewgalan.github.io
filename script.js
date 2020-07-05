const rainbow = ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D", "#43AA8B", "#577590"]

function remapCoords(coord) {
    return 50 + (coord - 50) * .5;
}

const petals = document.querySelectorAll(".petal-container");

petals.forEach((p, index) => {
    p.style.zIndex = (7 - index);
});

window.onmousemove = event => {
    const x = 100 - 100 * event.clientX / window.innerWidth;
    const y = 100 - 100 * event.clientY / window.innerHeight;

    petals.forEach((p, index) => {
        setTimeout(() => {
            p.style.perspectiveOrigin = `${remapCoords(x)}% ${remapCoords(y)}%`;
        }, (7 - index) * 50);
    });
}

function test(button) {
    const randomInt = Math.floor(Math.random() * Math.floor(7)) + 1;
    button.className = "category button-bkg-" + randomInt;
}