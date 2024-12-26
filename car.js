class Car {
    constructor (x, y, width, height){ 
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;

        this.speed = 0; 
        this.acceleration = 0.2;
        this.maxSpeed = 3; 
        this.friction = 0.05;
        this.angle = 0;
        
        this.controls = new Controls();
    }

    update(){ 
        if(this.controls.forward) 
            this.speed = this.speed>this.maxSpeed ? this.maxSpeed : this.speed+this.acceleration;
           
        if(this.controls.back)
            this.speed = this.speed<-this.maxSpeed ? -this.maxSpeed : this.speed-this.acceleration;
        
        if(this.controls.left)
            this.angle += (this.speed>0 ? 1 : -1) * 0.03;

        if(this.controls.right)
            this.angle -= (this.speed>0 ? 1 : -1) * 0.03;

        if(Math.abs(this.speed)>this.friction)
            this.speed = this.speed<0 ? this.speed+this.friction : this.speed-this.friction;
        else 
            this.speed = 0;
        
        this.y -= Math.cos(this.angle)*this.speed;
        this.x -= Math.sin(this.angle)*this.speed;
    }

    draw(ctx){ 
        ctx.save(); 
        ctx.translate(this.x, this.y); 
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -(this.width/2),
            -(this.height/2),
            this.width, 
            this.height
        )
        ctx.fill();

        ctx.restore();
    }
}