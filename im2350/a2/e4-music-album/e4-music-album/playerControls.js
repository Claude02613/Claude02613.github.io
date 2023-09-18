/* DEFINITIONS & SETUP */

// first let's retrieve references to all the elements we'll need to use
// this is the audio itself
let playButton = document.getElementById("playButton");
let stopButton = document.getElementById("stopButton");
let audioElement = document.getElementById('audioElement');
let progressBar = document.getElementById("progressBar");
let mutebutton = document.getElementById('muteButton');
let slider = document.querySelector('.slider');
let song1 = document.getElementById('song1');
let song2 = document.getElementById('song2');
let song3 = document.getElementById('song3');
let song4 = document.getElementById('song4');


/* Duration */
/* I chose to not set the time duration on the player as I reckon some times, 
the duration causes distraction in some way, which might lower the immersion of the experience */

audioElement.addEventListener('loadedmetadata', () => {
  progressBar.setAttribute('max', audioElement.duration);
});

audioElement.addEventListener("playing", () => {
  if (!progressBar.getAttribute('max')){
    progressBar.setAttribute('max', audioElement.duration);
  }
});
audioElement.addEventListener("waiting", () => {
  progressBar.classList.add("timeline-loading");
});
audioElement.addEventListener("canplay", () => {
  progressBar.classList.remove("timeline-loading");

});

audioElement.addEventListener("ended", () => {
  playButton.style.backgroundImage = "url('./icons/play.svg')";
});


/* remove the controls which can hide the default player layout */
audioElement.removeAttribute('controls');

/* this section will contain the most function of button and audio resources */
window.onload = function(){

/* Based on the content which is music album, I think it is important to organize the tracks. So I 
put all the songs together here. I set an empty <audio> where I can pick one of the songs from the list 
and play it, I tried link all the resources in html, but as they are all seperated, you can possibly play 
four of them at the same time, which is we don't want it to be */
var tracklist = [
  src="https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/p-hase_Hes.mp3",  
  src="https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/p-hase_Dry-Down-feat-Ben-Snaath.mp3", 
  src="https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/p-hase_Leapt.mp3",
  src="https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/p-hase_Water-Feature.mp3"  
];
/* Additionally, while sudiences listening to an album, it is better to provide the information of the current 
song to them as they might wonder what songs in the album and what song are they listen to at the moment they hit play
or the moment when they recognize the song they like */
var namelist = ["p-hase_Hes","p-hase_Dry-Down-feat-Ben-Snaath", "p-hase_Leapt", "p-hase_Water-Feature"];
/* initialize the playlist. start from 0 whihc is the first one on the list */
let num =0;
/* made a selector to simplify the code */
function fn(name){
  return document.querySelector(name);
}
/* hook the empty <audio> and <div class="musicname"> witht js, make sure there won't be multiple tracks 
playing at the same time */
fn('.audioElement').src = tracklist[num];
fn('.musicname').innerHTML = namelist[num];

/* made a function allow user to click and playback to the previous song */
fn('#pre').onclick = function() {
  num--;
/* as 0 is the first song's num which cannot be minus by 1 anymore. I set a if statement 
where to returen the num back to 3 when it is 0, so when we can jump to the last song which creata a loop*/
  if(num<0){
    num=3;
  }

  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
};
/* similar function as the previous one */
fn('#next').onclick = function() {
  num++;
  
  if(num>3){
    num=0;
  }

  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
};

/* As a music player, I think it could be helpful for user to use by adding a slider where they can 
adjust the volume as different person has differnet preferences on volume */
/* just selected the slider from html and link the audio's volume to the value(length) of the slider */
let volume = fn('.slider');
volume.onchange = function(){
  audioElement.volume = slider.value;

/* adding detail of icon cahnging---- once the slider reach the value of 0, change the backgroundImg of mutebutton 
into unmute */
  if(audioElement.volume){
    document.getElementById('muteButton').style.backgroundImage="url('./icons/mute.svg')";
  }
  else{
    document.getElementById('muteButton').style.backgroundImage="url('./icons/unmute.svg')";
  }
};
/* set a function that can make the songs automatically play the next one when the current one reach the 
state of "ended", using the similar method to make this fucntion, simply using num to organize the range*/
fn('.audioElement').onended = function() {
  num++;

  if(num>3){
    num=0;
  }
  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
};


/* adding mute and unmute feature by using eventlistener 
which is also part of volume adjustment which can enhance the users' experiences and make the player 
could be fit in more occasions */
mutebutton.addEventListener('click', ()=> {
/* if it is muted make the audio unmute, and change the background to match the change */
  if(audioElement.muted){
    audioElement.muted=false;
    document.getElementById('muteButton').style.backgroundImage="url('./icons/mute.svg')";
  }
/* if it is unmute, make it muted */
  else{
    audioElement.muted=true;
    document.getElementById('muteButton').style.backgroundImage="url('./icons/unmute.svg')";
  }
});
/* Besides all the volume adjustment, there cannot miss the function of playing and pausing the tracks */
/* play and pause, which is very similar to mute and unmute, using the if statement to achive the 
feature of toggling between play and pause */
playButton.addEventListener('click', ()=> {
/* because we already have the function of automatically play next track, I want the play&pause Button match 
this feature by commenting out the statement of "audioelement.ended". So if the user don't click pause, the tracks 
will play continually, which make the album more consisted in a way */
  if (audioElement.paused /* || audioElement.ended */) {
/* if the audio is paused, make it play */
fn('.audioElement').src = tracklist[num];
fn('.musicname').innerHTML = namelist[num];
audioElement.play();
/* also change the icon  */
    playButton.style.backgroundImage = "url('./icons/pause.svg')";
  } else {
/* if the audio is playing, pause it */
    audioElement.pause();
/* meanwhile change the background of the button */
    playButton.style.backgroundImage = "url('./icons/play.svg')";
  }
});


/* set the other way to play the tracks by applying eventlistener on the songs section */
song1.addEventListener('click', ()=> {
    num=0;
    fn('.audioElement').src = tracklist[num];
    fn('.musicname').innerHTML = namelist[num];
    audioElement.play();
    playButton.style.backgroundImage = "url('./icons/pause.svg')";
});
song2.addEventListener('click', ()=> {
  num=1;
  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
  playButton.style.backgroundImage = "url('./icons/pause.svg')";
});
song3.addEventListener('click', ()=> {
  num=2;
  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
  playButton.style.backgroundImage = "url('./icons/pause.svg')";
});
song4.addEventListener('click', ()=> {
  num=3;
  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
  playButton.style.backgroundImage = "url('./icons/pause.svg')";
});


/* was trying to put the section of script above together but didn't work out
so I comment it out */
/* var songlist = [
  song1, song2, song3, song4
];
fn('.song').src= songlist[num];
fn('.song').onclick = function() {
  fn('.audioElement').src = tracklist[num];
  fn('.musicname').innerHTML = namelist[num];
  audioElement.play();
} */




};








audioElement.addEventListener('timeupdate', () => {
  // this statement is simple - we update the progress bar's value attribute with the currentTime property of the audio, because timeupdate runs everytime
  // currentTime is changed it'll update both as the audio plays and if we were to skip or stop the audio
  progressBar.value = audioElement.currentTime;
});



function scrubToTime(e){
  // this statement has a lot going on so let's step through each part:
  // the first thing we want to work out is the distance between the left side of the progress bar and the mouses current position - if we were just building 
  // an interaction to work when the mouse is over the bar we could take this from the event, however as we want this to also work when we've held the mouse 
  // down and moved it somewhere else on the page we need to work this out manually
  // e.clientX is the cursors current distance from the left edge of the page
  // we then want to minus (progressBar.getBoundingClientRect().left + window.scrollX) from this distance to account for any gap between the left edge of the 
  // page and the start of the progress bar
  // audioElement.currentTime is the current position in the media file - we are setting it here to change the playback time
  // we then need to find a normalised 0-1 value based on how far along the bar the cursor is - the idea is that if i click the left most side it should return 0
  // and if i click the right most side it should return 1 - we get this value by dividing x by the total width of the progressBar
  // the value is then fed into our clampZeroOne() function - this is accounting for if our mouse is further left or further right than the ends of the progress bar
  // it works by essentially making the value always equal 1 if it is over 1 or always making it 0 if under 0 - this is commonly called a clamp, we're only allowing
  // a value to be in a certain range
  // finally we're using this clamped value to multiply with total duration of our audio thus working out where we should scrub to
  let x = e.clientX - (progressBar.getBoundingClientRect().left + window.scrollX);
  audioElement.currentTime = clampZeroOne(x / progressBar.offsetWidth) * audioElement.duration;
}

progressBar.addEventListener('mousedown', scrubToTime);
progressBar.addEventListener('mousedown', (e) => {
  // the behaviour here is to listen to the mousemove event (fired when the user moves their mouse) when the click is held down but then to stop listening to that 
  // event when the mouse click is released
  window.addEventListener('mousemove', scrubToTime);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', scrubToTime);
  });
});


function clampZeroOne(input){
  return Math.min(Math.max(input, 0), 1);
}

function logEvent(e){
  console.log(e);
}


