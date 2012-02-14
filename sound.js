var sounds = {
    "grenade": "33245__ljudman__grenade.ogg",
}

var audio = null;

function playSound(sound) {
    if (audio) {
        audio.pause();
        document.body.removeChild(audio);
        audio = null;
    }

    var src = "sounds/" + sounds[sound];

    audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.autoplay = true;
    audio.src = src;
    audio.load()
}

chrome.browserAction.onClicked.addListener(function(tab) {
    playSound('grenade');
});
