
const pre = document.querySelector("pre");

document.addEventListener("mousemove", (e) => {
  rotateElement(e, pre);
})
function rotateElement(event, element) {
  const x = event.clientX;
  const y = event.clientY;

  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;
  /*   console.log(x,y) */
  const offsetX = ((x-middleX)/middleX) *50;
  const offsetY = ((y-middleY)/middleY) *50;
/*   console.log(offsetX,offsetY) */

element.style.setProperty("--rotateX", -1*offsetY + "deg");
element.style.setProperty("--rotateY", offsetX + "deg");
}

/* const button = document.querySelector("button");

document.addEventListener("mousemove", (e) => {
  TransformStream(e,button);
})
function TransformStream(event, element) {
  const Bx = event.clientX;
  const By = event.clientY;

  element.style.setProperty("--spanX", Bx + "px");
  element.style.setProperty("--spanY", By + "px");
} */

var button=document.querySelector("button")
        document.addEventListener("mousemove",function(e){
            var x=e.pageX
            var y=e.pageY
            button.style.top=y-55+"px"
            button.style.left=x-55+"px"
        })


/*
this is a function that handles the fake load time -
it takes in a number in ms tha defines how long the fake load will be 
and a url to load, in this case just a reference to the hosono.html file
*/
function loadPageAfterDelay(loadTime, url){
  var x = document.getElementById('AniContainer');
  x.classList.toggle('visible');
  var y = document.getElementById('load-body');
  y.classList.toggle('visible');
  /* the first step is to show the loading bar element */
  // hide link
  document.getElementById("loadLink").style.display = 'none';
  
  // show throbber
 /*  document.getElementById("AniContainer").style.display = 'grid'; */
  
  /* if you want to add or change anything else once link is clicked below here is where you'd do so */
  /* then the second part is actually following the link using a setTimeout() */
  /*
  setTimeout() is a JS method (see modules) that allows us to run some code after a 
  set amount of time - in this case it's running an arrow function (see modules but 
  essentially a function without a name that we want to run once) after time set in
  the loadTime parameter (this is a number that represents ms) 
  */
  setTimeout(() => {
    window.location.href = url;
  }, loadTime);
  
 }  