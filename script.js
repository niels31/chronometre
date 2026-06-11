//  temps en secondes, la seconde étant l'unité de rafraichissement
const progressTime=5;
const pauseTime=3;

const circle=document.getElementsByTagName("circle")[0];
const timeDisplay=document.getElementsByClassName("time-display")[0];
const docTitle=document.querySelector("head title");
const bouttonSon=document.getElementById("son");

let audioContext=false;

function handleSound() {
    isOn=bouttonSon.classList.toggle("on");
    if (isOn) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        bouttonSon.innerHTML="&#128266;";
    } else {
        audioContext = false;
        bouttonSon.innerHTML="&#128263;";
    };
}

bouttonSon.addEventListener("click", handleSound);

const perimeter=2*Math.PI*80;

let targetTime=progressTime;
let progress=0;

let continuousBeep;

function playBeep() {

    if (audioContext){

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";      // sine, square, sawtooth, triangle
        oscillator.frequency.value = 1000; // fréquence en Hz

        oscillator.start();

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.2);
    

        oscillator.stop(audioContext.currentTime + 0.2);
        };
}

function reset() {
    progress=0;
    targetTime=progressTime;
}

function changePhase() {
    circle.style.stroke="orange";
    progressInterval=setInterval(progressStep, 1000); // mise à jour toutes les secondes
    timeDisplay.removeEventListener("click", changePhase);
    timeDisplay.addEventListener("click", reset);
    clearInterval(continuousBeep);
};

function progressStep() {
    progress++;
    
    let secondes=progress%60;
    let minutes=Math.floor(progress/60);

    timeDisplay.textContent=`${minutes} : ${secondes}`;
    document.title=`Chronomètre ${minutes} : ${secondes}`

    let visibleLength=(progress/targetTime)*perimeter;
    let hiddenLength=perimeter-visibleLength;
    circle.style.strokeDasharray=`${visibleLength} ${hiddenLength}`;

    if (progress==targetTime) {
        // gérer le changement de chrono
        targetTime = targetTime===progressTime ? pauseTime : progressTime;
        progress=0;
        clearInterval(progressInterval);
        timeDisplay.textContent="START";
        document.title="Chronomètre START"
        circle.style.stroke="green";
        timeDisplay.removeEventListener("click", reset);
        timeDisplay.addEventListener("click", changePhase);
        continuousBeep=setInterval(playBeep, 500);
    };
};

progressStep();

let progressInterval=setInterval(progressStep, 1000); // mise à jour toutes les secondes

timeDisplay.addEventListener("click", reset);
