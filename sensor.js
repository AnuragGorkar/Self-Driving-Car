class Sensor {
    constructor(car){
        this.car = car;
        this.rayCount = 19;
        this.rayLength = 500;
        this.raySpread = Math.PI;
        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic){
        this.#castRays();
        this.#getSensorIntersections(roadBorders, traffic);
    }

    #getSensorIntersections(roadBorders, traffic){ 
        this.readings = [];
        for(let i=0; i<this.rayCount; i++){ 
            this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
        }
    }

    #castRays(){
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount==1?0.5:i / (this.rayCount - 1)) + + this.car.angle;
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - (Math.sin(rayAngle) * this.rayLength),
                y: this.car.y - (Math.cos(rayAngle) * this.rayLength)
            }
            this.rays.push([start, end]);
        }
    }

    #getReadings(ray, roadBorders, traffic){ 
        this.touches = []
        for(let i=0; i<roadBorders.length; i++){ 
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if(touch) this.touches.push(touch);
        }
        for(let i=0; i<traffic.length; i++){
            const trafficPolygon = traffic[i].polygon;

            for (let j = 0; j < trafficPolygon.length; j++) {
                const touch = getIntersection(
                    ray[0], ray[1], 
                    trafficPolygon[j], trafficPolygon[(j + 1) % trafficPolygon.length]
                );
                if (touch) {
                    this.touches.push(touch);
                }
            }
        }

        if(this.touches.length == 0) return null; 
        else{ 
            let minOffSet = Number.MAX_SAFE_INTEGER;
            let minIntersection = null;
            for(let i=0; i<this.touches.length; i++){
                if(this.touches[i].offSet<minOffSet){
                    minOffSet = this.touches[i].offSet;
                    minIntersection = this.touches[i];
                }
            }  
            return minIntersection;
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1]; 
            if(this.readings[i]){
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}