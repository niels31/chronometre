//  temps en secondes, la seconde étant l'unité de rafraichissement
const progressTime=20*60;
const pauseTime=1.5*60;

const circle=document.getElementsByTagName("circle")[0];
const timeDisplay=document.getElementsByClassName("time-display")[0];
const docTitle=document.querySelector("head title");

const perimeter=2*Math.PI*80;

let targetTime=progressTime;
let progress=0;

function reset() {
    progress=0;
    targetTime=progressTime;
}

function changePhase() {
    circle.style.stroke="orange";
    progressInterval=setInterval(progressStep, 1000); // mise à jour toutes les secondes
    timeDisplay.removeEventListener("click", changePhase);
    timeDisplay.addEventListener("click", reset);
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
    };
};

progressStep();

let progressInterval=setInterval(progressStep, 1000); // mise à jour toutes les secondes

timeDisplay.addEventListener("click", reset);
