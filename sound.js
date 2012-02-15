var sounds = {
    "grenade": "33245__ljudman__grenade.ogg",
}

var audio = null;
var re = /:soundcamp \w+/;

function tellPlaySound(sound) {
    var input = $('#input')[0];
    var copy = input.value;
    input.value = ':soundcamp '+ sound;
    $('#send').click();
    input.value = copy;
}

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

function receivedMessage(e) {
    var t = e.target;
    if (t.tagName.toLowerCase() === 'tr' && t.id === 'message_pending') {
        var msgBody = $(t).find('div.body');
        var msg = msgBody.html();
        var m = re.exec(msg);
        if (m != null) {
            var sound = msg.replace(':soundcamp ', '');
            playSound(sound);
        }
    }
}

function initControls() {
    $('<div>').attr('id', 'soundcamp_sounds').attr('class', 'tooltip').attr('width', '18px').attr('height', '16px').attr('style', 'margin: 2px 5px;').appendTo('#chat_controls');
    $('<img>').attr('src',
    chrome.extension.getURL('images/music.png')).attr('id', 'soundcamp_button').attr('width', '16').attr('height', '15').appendTo('#soundcamp_sounds');

    $('#soundcamp_button').click(function() { tellPlaySound('grenade'); });
}

function initListener() {
    $('#chat').bind('DOMNodeInserted', receivedMessage);
}

initControls();
initListener();
