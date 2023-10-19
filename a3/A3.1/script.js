//visual ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
//First of all, I was trying to make visual distortion effects by using svg filter, but it not 
//works well as I expected, cuz the distortion I made can only iimpact certain area (like a circle around the cursor), and I cannot find a way to 
//left the distortion effect with a fade out transition after cursor move(like the liquid entropy --- an example from modules). So I dicide to use canvas to achive the the goal.

//Have went through some of the franks laboratory's tutorials of the flow fluid effect. And made several different flow fluid effects after. 
//I recreate one of the flow fluid from tutorial and make it responsive with the mouse movement.

let canvas;
let ctx;
let flowField;
let FlowFieldAni;

window.onload = function() {
canvas = document.getElementById('canvas1');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;   
flowField = new FlowFieldEffect (ctx, canvas.width, canvas.height);
//after console log the deltatime section. The animation stop as the first frame is display as NaN in the console so I manually add it
flowField.animate(0);
}

window.addEventListener('resize', function(){

cancelAnimationFrame(FlowFieldAni);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;  
flowField = new FlowFieldEffect (ctx, canvas.width, canvas.height);
flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (e)=>{
     /* console.log(e) */
     mouse.x = e.x;
     mouse.y = e.y;
})
class FlowFieldEffect {
    //declare private class(cannot be called from outside of this class unless using public 
  // class to hold the value)
    #ctx;
    #width;
    #height;
    //the main console where can adding new features at
    constructor(ctx, width, height) {
        //assign the private class with the public value
        this.#ctx = ctx;
       //decrease the lineWidth to enhance the detail of effects and lower the workload of script
        this.#ctx.lineWidth = 0.7;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 1;
        this.timer = 0;
        this.cellSize = 15;
        this.gradient;
        this.#Gradient();
        this.#ctx.strokeStyle = this.gradient;//grab the gradient from #Gradient
        this.rad = 0;
        this.vr = 0.03;
    }
    #Gradient(){
        //addig gradient by using build-in method 'addColorStop'
       this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);//map the gradient to match the range of the canvas
       this.gradient.addColorStop("0.1", "#fff");
       this.gradient.addColorStop("0.2" , "#9effcb");
       this.gradient.addColorStop("0.4" , "white");
       this.gradient.addColorStop("0.6" , "#ff7aa4");
       this.gradient.addColorStop("0.9", "#bb8aff");
       
       
    }
    #drawLine(angle, x,y){
        //was trying to add a effect attach to cursor but I think it might not work well for the experience so I comment them out
        /* let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx*dx + dy*dy; */
        //using cos() and sin() to make the length change in the same loop as the pattern changing (using the same angle value);
        //which looks more perspective compare to using random number from array.
        const lengthX = 20 * Math.cos(angle);
        const lengthY = 15 * Math.sin(angle);
        //draw the lines
        this.#ctx.beginPath();
        this.#ctx.moveTo(x,y);
        //end point of the lines
        this.#ctx.lineTo(x + Math.cos(angle) *lengthX,
                          y + Math.sin(angle) *lengthY);
        this.#ctx.stroke();
    }
    animate(timeStamp){
        //follow the tutorial added delta time, which can optimize the results of effects on other old laptop
        //can mannually adjusting the frame rate by adjusting the value of interval;
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        
        if (this.timer > this.interval){
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.rad += this.vr;
            //as the lines will overlapse on each other if we let the radius increase infinitely, 
            //I set a value of radius before the pattern be ruined, and invert the value of delta radius,
            //which can keep the value of the radius in a certain range (visually generate a loop animation).
            if(this.rad > 20 || this.rad < -20) {
                this.vr *= -1;
            }
            // loop of x inside of the loop y, generate a grid layout for the canvas to organize the lines
            for (let y = 0; y < this.#height; y += this.cellSize){
                for (let x = 0; x < this.#width; x += this.cellSize){
                    //Adding up cos function and sin function to generate a wavy pattern (adding a ratio in a side can make different shape but it is all like circle shape)
                    const angle = (Math.cos(mouse.x * x * 0.00001) + Math.sin(mouse.y * y * 0.00001)) * this.rad;
                    this.#drawLine(angle, x, y);
                }
            }
            this.timer = 0;
        }
        else{
            this.timer += deltaTime;
        }
        /* console.log(deltaTime) */
        
        
        FlowFieldAni = requestAnimationFrame(this.animate.bind(this));
        //set the animate but the animation does not works (only finished the first loop and stop)
        //as the script will read from top to bottom, left to right, it will firstly look for 'this'
        //so it cannot find the animate loop function again. 
        //we set a blind to "this", which can skip the "this" before the function and let the script find the animation loop again
        
        
    }
}

//remap function 
//will be used to make the background color responsive
function remapRange(input, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (input - low1) / (high1 - low1);
}
//adding responsive background color to enhance the interactive on the mouse movement 
window.addEventListener('mousemove', (e)=>{
       document.body.style.backgroundColor ="rgb(" + remapRange(e.clientX, 0, window.innerWidth, 0, 100) + " " + remapRange(e.clientX, 0, window.innerWidth, 0, 100) + " " + remapRange(e.clientX, 0, window.innerWidth, 0, 100) + ")"; 

    //tried to only using remap function to adjust the alpha of the background color(as a way to optimize the code, because the rgb one up there has three features to calculate)
    //but does not work out...
       /* document.body.style.backgroundColor ="rgb(100 100 100 " + remapRange(e.clientX, 0, window.innerWidth, 0, 1) + " )"; */
      /* document.body.style.opacity = remapRange(e.clientX, 0, window.innerWidth, 0, 100) + "%"; */
//try to link the filter's property with the mouse position but failed
      /* document.getElementById('F').baseFrequency = remapRange(e.clientY, 0, window.innerHeight, 0.1, 10); */
})

// Audio ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//For audio part. Initially, I was thinking add a track to interactive with, but after looked up the audio API on W3 school, I reckon that it will be 
//more solid and experimental if I can only use code to generate the sound and mix them up. So I finally chose to 
//generate audio context by coding instead of using music file.
    //make a new synth 
    const actx = new (AudioContext || webkitAudioContext)();
    //another one 
    const actx1 = new (AudioContext || webkitAudioContext)();
    //one more
    const actx2 = new (AudioContext || webkitAudioContext)();

    if (!actx || !actx1) throw 'Not supported';
    const osc = actx.createOscillator();
    //try add one more synth
    const osc1 = actx1.createOscillator();
    //add one more
    const osc2 = actx2.createOscillator();

    //make gain node
    var gainNode = actx.createGain();
    //the distortion
    var distorNode = actx.createWaveShaper();
    //the biquad filter (mimicking the water drop/ glitching sound effects)
    var biQuadFilter = actx1.createBiquadFilter();
    biQuadFilter.type = 'lowpass';
    //another filter for the third synth (normal biquadfilter to adjust the pass)
    var biquadFilter1 = actx2.createBiquadFilter();
    biquadFilter1.type = 'highpass';
    
    //set the shape as sawtooth which is more easier to see the differences when the value of node change
    //set other two in different type to get different mixing results.
    osc.type = 'sawtooth';
    osc1.type = 'sine';
    osc2.type = 'square';


    //connection console
    osc.connect(gainNode);
    gainNode.connect(distorNode);
    distorNode.connect(actx.destination);//source output

    osc1.connect(biQuadFilter);
    biQuadFilter.connect(actx1.destination);//2nd source output

    osc2.connect(biquadFilter1);
    biquadFilter1.connect(actx2.destination);//3rd source output

    //distortion node. However, for the curve, I cannot figure out how to draw with formula (was trying to use 
    //trigonometric functions but did not get the proper result as I thought)
    //So I refer the math method from stack flow as an example and adjusting some value to lighter the 
    //workload. 

    //the curve of distortion
    function makeDistortionP(amount){
    
        let samples = 512, curve = new Float32Array(samples);
        for (let i = 0 ; i < samples; i++ ) {
            let x = i * 2 / samples - 1;
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }
    distorNode.curve = makeDistortionP(500);

//initial feature and maximum 
// set the frequency between 32Hz (C o1) and 880Hz (A o6), which is not that harsh and sounds acceptable to me
//initial idea was set three different synth as a simple chord but as the the range was remap to the 
//mouse position, I reckon it is hard to make it sounds "right", so I chose to make these three in different shape of waves,
//and different filters attached to, which can make the interaction more dynamic and experimental
    var iniFre = 32;
    var iniFre1 = 2000;
    var iniFre2 = 1000;
    var iniVol = 0.25;
    var iniQ = 0.7;
    var iniQ1 = 0.6;

    var maxFre = 880;
    var maxFre1 = 5000;
    var maxFre2 = 2500;
    var maxVol = 0.50;
    var maxQ = 24;
    var maxQ1 = 26;

//set up the initial value
    osc.frequency.value = iniFre;
    osc1.frequency.value = iniFre1;
    osc2.frequency.value = iniFre2;
    gainNode.gain.value = iniVol;

//mouse position and preparing for mapping
   var x;
   var y;
       
   var width = window.innerWidth;
   var height = window.innerHeight;

   //The first time when I finish the set up, for the responsive part that connect audio and mouse movement
   //I chose to use normal function with a eventlistener listen to mouse-
   //move event, but the synth will continually play without stop, so I change the method
   //to refreshing/reset the page once the event happend
   //this makes there is only single synth playing in the same oscillator.

//once mouse move reset the page
   document.onmousemove = updatePage;

   function updatePage(e) {
//mapping the values
//As I set the background color from black(screen left) to light-grey(screen right),
//and the flow fluid effect will zoom out when cursor move to the right side of the screen.
//I thought map the high frequency on the right side and the low one to the left side could be more 
//feasible as it can illustrate the connection between audio and the visual logically
    x = window.Event
    ? e.pageX 
    : e.clientX +
      (document.documentElement.scrollLeft
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft);
    y = window.Event
    ? e.pageY
    : e.clientY +
      (document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop);

    console.log(e.pageY);

//connect the mouse movement with the value
//first synth
  osc.frequency.value = (x / width) * maxFre;
  gainNode.gain.value = (y / height) * maxVol;

//For these two below, I using different math to map the frequency, just for generating more dynamic sound and feeling.
//second syn
//using trigonometric functions to make a small scope which can frequently change the frequency of the synth
//then can generate kind of glitch-style sound
  biQuadFilter.Q.value = (y/ height) * maxQ;
  osc1.frequency.value = Math.cos(y*x / height*width) * maxFre1;
//third syn
  osc2.frequency.value = (x * y) / maxFre2;
  biquadFilter1.Q.value = (y/ height) * maxQ1;

 }

//I want sound start once user open the web, which from my perspective can enhanve the immersion as 
//there is no gap between play and before
//find out if there is only start() function it will not autoplay the sound when user open the site
//After test several times, there always shows as "AudioContext was not allowed to start" even I move the cursor or clicked the page
//the audio will only play once I refresh the script

//I tried different method below, but did not figure out how to only run the function once after the event happen.

/* let start = true;
if (start){
    osc.start();
    start=false;
} */

/* function touchStarted (){
    getAudioContext().resume();
}
osc.start(); */

//Thus, I chose to make a function to start the synth once user click the page (possibly add text inform the user)
//even though user click the page after the start of the synths, it will call the function again, it still lighter than 
// mousemove event which be called every time cursor move by pixel.
const set = document.body;

    let start = false;
    if (!start){
        set.addEventListener('click', ()=>{
        osc.start();
        osc1.start();
        osc2.start();
    })
        start = true;
    }
   



   



    

