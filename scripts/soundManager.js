let soundVolume = 100;
let sndShoot;
let sndExplode;
let sndSaucer;
let sndMove1;
let sndMove2;
let sndMove3;
let sndMove4;
let sndCannonExplode;

function initSounds()
{
    sndShoot = document.getElementById("sndShoot");
    sndExplode = document.getElementById("sndExplode");
    sndSaucer = document.getElementById("sndSaucer");
    sndMove1 = document.getElementById("sndMove1");
    sndMove2 = document.getElementById("sndMove2");
    sndMove3 = document.getElementById("sndMove3");
    sndMove4 = document.getElementById("sndMove4");
    sndCannonExplode = document.getElementById("sndCannonExplode");
    setSoundsVolume(soundVolume);
}

function playShootSound()
{
    sndShoot.currentTime = 0;
    sndShoot.play();
}

function playExplodeSound()
{
    sndExplode.currentTime = 0;
    sndExplode.play();
}

function playCannonExplodeSound()
{
    sndCannonExplode.currentTime = 0;
    sndCannonExplode.play();
}

function playMoveSound()
{
    window['sndMove' + enemyMovement.moveStep].currentTime = 0;
    window['sndMove' + enemyMovement.moveStep++].play();
}

function playSaucerSound()
{
    sndSaucer.currentTime = 0;
    sndSaucer.play();
}

function setSoundsVolume()
{
    sndShoot.volume = parseFloat(soundVolume / 100);
    sndExplode.volume = parseFloat(soundVolume / 100);
    sndSaucer.volume = parseFloat(soundVolume / 100);
    sndMove1.volume = parseFloat(soundVolume / 100);
    sndMove2.volume = parseFloat(soundVolume / 100);
    sndMove3.volume = parseFloat(soundVolume / 100);
    sndMove4.volume = parseFloat(soundVolume / 100);
    sndCannonExplode.volume = parseFloat(soundVolume / 100);
}
