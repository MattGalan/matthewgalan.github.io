export default class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    multiply(val) {
        return new Vector(this.x * val, this.y * val);
    }

    normalize() {
        const length = Math.pow(this.x * this.x + this.y * this.y, .5);
        return new Vector(this.x / length, this.y / length);
    }
}
