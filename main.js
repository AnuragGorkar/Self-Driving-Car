const canvas = document.getElementById("myCanvas");
canvas.width = 400;
const ctx = canvas.getContext("2d");
const laneCount = 4;

const road = new Road(canvas.width / 2, canvas.width * 0.9, laneCount);
let laneCenter = road.getLaneCenter(Math.floor(Math.random() * laneCount) + 1);
const car = new MainCar(laneCenter, 100, 30, 50);

let traffic = [];
let recordingData = []; 
let recordingInterval = null; 
const csvFileName = "car_play_data.csv"; 
let recordedData = false;


function generateTraffic() {
    const minDistance = 150;
    const maxDistance = 350;
    const minWidth = 30;
    const maxWidth = 50;

    const lastCarY = traffic.length > 0 
        ? Math.min(...traffic.map(t => t.y)) 
        : car.y - window.innerHeight;

    const newCarY = lastCarY - (Math.random() * (maxDistance - minDistance) + minDistance);
    
    const maxParallelCars = laneCount - 1;
    const numParallelCars = Math.floor(Math.random() * maxParallelCars) + 1;

    const availableLanes = Array.from({ length: laneCount }, (_, i) => i + 1);
    const selectedLanes = [];
    while (selectedLanes.length < numParallelCars) {
        const randomIndex = Math.floor(Math.random() * availableLanes.length);
        selectedLanes.push(availableLanes.splice(randomIndex, 1)[0]);
    }

    for (const lane of selectedLanes) {
        traffic.push(
            new TrafficCar(
                road.getLaneCenter(lane),
                newCarY,
                Math.random() * (maxWidth - minWidth) + minWidth,
                50
            )
        );
    }
}


for (let i = 0; i < 5; i++) {
    generateTraffic();
}


function startRecording() {
    if (recordingInterval) return; 

    recordingInterval = setInterval(() => {
        if (!car.damaged) 
            recordingData.push(captureData());
        else 
            stopRecording(); 
    }, 10); 
}


function stopRecording() {
    if (recordingInterval && !recordedData) {
        clearInterval(recordingInterval);
        recordingInterval = null;
        saveToCSV(); 
    }
}


function captureData() {
    console.log({
        sensorOffsets: car.sensor.readings.map(reading => (reading ? reading.offSet : 1)), 
        x: car.x,
        speed: car.speed,
        angle: car.angle,
        controls: {
            // forward: car.controls.forward ? 1 : 0,
            // back: car.controls.back ? 1 : 0,
            left: car.controls.left ? 1 : 0,
            right: car.controls.right ? 1 : 0
        }
    });
    return {
        sensorOffsets: car.sensor.readings.map(reading => (reading ? reading.offSet : 1)), 
        x: car.x,
        speed: car.speed,
        angle: car.angle,
        controls: {
            // forward: car.controls.forward ? 1 : 0,
            // back: car.controls.back ? 1 : 0,
            left: car.controls.left ? 1 : 0,
            right: car.controls.right ? 1 : 0
        }
    };
}


function saveToCSV() {
    
    const csvData = recordingData.map(entry => {
        const offsets = entry.sensorOffsets.join(","); 
        const controls = Object.values(entry.controls).join(",");
        return `${offsets},${entry.x},${entry.speed},${entry.angle},${controls}`;
    });

    
    const header = Array.from({ length: 19 }, (_, i) => `Sensor${i + 1}`).join(",") +
                   ",X,Speed,Angle,Left,Right";
    const csvContent = [header, ...csvData].join("\n");

    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv'; 
    link.click();
    recordedData = true; 
}


function animate() {
    if (!recordingInterval) {
        startRecording(); 
    }

    if (car.y < Math.min(...traffic.map(t => t.y)) + window.innerHeight) {
        generateTraffic();
    }

    traffic = traffic.filter(t => t.y < car.y + window.innerHeight);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders);
    }
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}


animate();
