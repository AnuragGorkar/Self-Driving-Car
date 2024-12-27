class TrafficCar extends BaseCar {
    constructor(x, y, width, height) {
        super(x, y, width, height, 2);
    }

    update() {
        super.update();
    }

    draw(ctx) {
        super.draw(ctx, "red");
    }
}
