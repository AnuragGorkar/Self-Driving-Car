class MainCar extends BaseCar {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.acceleration = 0.5;
        this.maxSpeed = 5;
        this.friction = 0.15;

        // Update sensor to 19 rays
        this.sensor = new Sensor(this, 19);
        this.controls = new Controls();
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#moveWithControls();
            this.polygon = this._createPolygon();
            this.damaged = this.#detectDamage(roadBorders, traffic);
        }
        this.sensor.update(roadBorders, traffic);
    }

    #moveWithControls() {
        if (this.controls.forward)
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        if (this.controls.back)
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed);

        if (this.controls.left) this.angle += (this.speed >= 0 ? 1 : -1) * 0.03;
        if (this.controls.right) this.angle -= (this.speed >= 0 ? 1 : -1) * 0.03;

        this.speed = Math.abs(this.speed) > this.friction
            ? this.speed - Math.sign(this.speed) * this.friction
            : 0;

        super.update();
    }

    #detectDamage(roadBorders, traffic) {
        const borderCollision = roadBorders.some(border => polyIntersect(this.polygon, border));
        const trafficCollision = traffic.some(traffic => polyIntersect(this.polygon, traffic.polygon));
        return borderCollision || trafficCollision;
    }

    draw(ctx) {
        super.draw(ctx, "black");
        this.sensor.draw(ctx);
    }
}
