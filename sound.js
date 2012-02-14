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

function initControls() {
    $('<div>').attr('id', 'soundcamp_sounds').attr('class', 'tooltip').attr('width', '18px').attr('height', '16px').attr('style', 'margin: 2px 5px;').appendTo('#chat_controls');
    $('<img>').attr('src',
    chrome.extension.getURL('music.png')).attr('id', 'soundcamp_button').attr('width', '16').attr('height', '15').appendTo('#soundcamp_sounds');

    $('#soundcamp_button').click(function() { playSound('grenade'); });
}

initControls();
