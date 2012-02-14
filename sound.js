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

    if(!sounds[sound])
        return;

    var src = chrome.extension.getURL("sounds/" + sounds[sound]);

    audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.autoplay = true;
    audio.src = src;
    audio.load()
    audio.play()
}

function pantsInPage() {
    var cc = document.getElementById('chat_controls');
    var ui = document.createElement('div');
    ui.setAttribute('id', 'soundcamp_sounds');
    ui.setAttribute('class', 'tooltip');
    cc.appendChild(ui);

    var link = document.createElement('a');
    //link.setAttribute('onClick', "playSound('grenade')");
    link.addEventListener('click', function() {
        playSound("grenade");
    }, false);
    link.appendChild(document.createTextNode("play grenade"));
    ui.appendChild(link);
}

//chrome.browserAction.onClicked.addListener(function(tab) {
//    playSound('grenade');
//});

pantsInPage();
