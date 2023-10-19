
/* 
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))],
      randomString = length => Array.from(Array(length)).map(randomChar).join("");

const card = document.querySelector(".card"),
      letters = card.querySelector(".card-letters");

const handleOnMove = e => {
  const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
        

  letters.style.setProperty("--x", `${x}px`);
  letters.style.setProperty("--y", `${y}px`);

  letters.innerText = randomString(30000);    
}

card.onmousemove = e => handleOnMove(e);

card.ontouchmove = e => handleOnMove(e.touches[0]);

 */


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;   


/* setting */
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 0.25;
ctx.fill();


class Particle {
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;

        this.speedModifier = Math.floor(Math.random() * 10 +3)
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 2000 +150);
        this.angle = 0;
        this.timer = this.maxLength * 2;
        this.colors =['#7700FF', '#FF0066', 'cyan', '#FF6CB1', '#5EFFEA', 'white'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    draw(context){
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for(let i = 0; i < this.history.length; i++){
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.strokeStyle = this.color;
        //drawwww it
        context.stroke();
    }


    update(){
        this.timer--;
        if (this.timer >= 1){
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index];
    
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
    
        
            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLength){
                this.history.shift();
            }
        }
        else if (this.history.length >1){
            this.history.shift();
        }
        else{
            this.reset();
        }
    }


    reset(){
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{x: this.x, y: this.y}];
        this.timer = this.maxLength *2;
    }
    
}



 class Effect {
   constructor(canvas){
    this.canvas= canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 2000;
    this.cellSize = 20;
    this.rows;
    this.cols;
    this.flowField = [];
    this.curve = Math.random() * 0.8 +1.6;
    this.zoom = 0.11;
   
    this.debug = false;

    this.mx;
    this.my;

    this.init(); 
//grid debug and responsive window size
    window.addEventListener('keydown', e => {
    if (e.key=='d'){
        this.debug = !this.debug;
    }
    })
    window.addEventListener('resize', e => {
     this.resize(e.target.innerWidth, e.target.innerHeight)
    })
   }

   init(){
    // create flow field
    this.rows = Math.floor(this.height / this. cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++){
        for (let x = 0; x < this.cols; x++){
            let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
            this.flowField.push(angle);
        }
    }
    //initializing the particles
    this.particles = [];

    for (let i=0; i < this.numberOfParticles; i++){
        this.particles.push(new Particle(this)); 
    }
   }
   //debuging the grid, display the layout
   drawGrid(context){
    context.save();
    context.strokeStyle = 'cyan';
      for(let c = 0; c < this.cols; c++){
        context.beginPath();
        context.moveTo(this.cellSize * c, 0);
        context.lineTo(this.cellSize * c, this.height);
        context.stroke();
      }
      for(let r = 0; r < this.rows; r++){
        context.beginPath();
        context.moveTo(0, this.cellSize * r);
        context.lineTo(this.width, this.cellSize * r);
        context.stroke();
      }
      context.restore();
   }
   resize(width, height){
    this.canvas.width = width;
    this.canvas.height = height;

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.init();
   }


   //renderer!
   render(context){
    
    if(this.debug){
        this.drawGrid(context);
    }
    this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
    })
   }
}


const effect = new Effect(canvas);
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();

function remapRange(input, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (input - low1) / (high1 - low1);
}


window.addEventListener('mousemove', e => {
    document.body.style.backgroundColor = "hsl(" + remapRange(e.clientX, 0, window.innerWidth, 250, 340) + " 50% 50%)";
    //cannot link the feTurbulence's value with the mouse position... Might find other way to animate the filter
    /* document.feTurbulence.baseFrequency = remapRange(e.clientY, 0, innerHeight, 0.1, 1); */
}) 
