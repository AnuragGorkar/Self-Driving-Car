const canvas = document.getElementById("myCanvas")
canvas.width = 400;

const ctx = canvas.getContext("2d")
const laneCount = 4; 
const road = new Road(canvas.width/2, canvas.width*0.9, laneCount)
let laneCenter = road.getLaneCenter(4)
const car = new MainCar(laneCenter, 100, 30, 50)
const traffic = [ 
    new TrafficCar(road.getLaneCenter(2), -100, 30, 50)
]

animate(); 

function animate(){ 
    for(let i=0; i<traffic.length; i++)
        traffic[i].update(road.borders);
    car.update(road.borders, traffic); 
    canvas.height = window.innerHeight;

    ctx.save(); 
    ctx.translate(0, -car.y+canvas.height*0.7);

    road.draw(ctx);
    for(let i=0; i<traffic.length; i++)
        traffic[i].draw(ctx);
    car.draw(ctx); 

    ctx.restore();
    requestAnimationFrame(animate);
}