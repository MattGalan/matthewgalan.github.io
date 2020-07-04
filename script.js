function remapCoords(coord) {
    return 50 + (coord - 50) * .5;
}

const petals = document.querySelectorAll(".petal-container");

window.onmousemove = event => {
    const x = 100 - 100 * event.clientX / window.innerWidth;
    const y = 100 - 100 * event.clientY / window.innerHeight;

    petals.forEach((p, index) => {
        setTimeout(() => {
            p.style.perspectiveOrigin = `${remapCoords(x)}% ${remapCoords(y)}%`;
        }, index * 50);
    });
}

function test() {
    console.log("test");
}