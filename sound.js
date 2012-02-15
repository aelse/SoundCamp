var sounds = {
    // key : [ label, soundfile, image, text ]
    "grenade": ["Grenade", "33245__ljudman__grenade.ogg", 'grenade.png', 'Fire in the hole!'],
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

function chatSoundHTML(sound) {
    var s = sounds[sound];
    if (!s) {
        return sound;
    }

    var html = '';
    if (s[2]) {
        html += '<span style="padding-left: 5px;"><img src="'+
            chrome.extension.getURL("images/" + s[2]) +
            '" height="15px"></span>';
    }
    if (s[3]) {
        html += '<span style="padding-left: 5px;">'+ s[3] +'</span>';
    }
    if (html === '') {
        html = '<span style="padding-left: 5px;">'+ s[0] +'</span>';
    }
    var snd_img = '<img alt="Sound" height="12" src="/images/sound.png" width="12">';
    return snd_img + html;
}

function playSound(sound) {
    if (audio) {
        audio.pause();
        document.body.removeChild(audio);
        audio = null;
    }

    if(!sounds[sound])
        return;

    var src = chrome.extension.getURL("sounds/" + sounds[sound][1]);

    audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.autoplay = true;
    audio.src = src;
    audio.load()
    audio.play()
}

function processSoundCommand(msgBody, play) {
    var msg = msgBody.html();
    var m = re.exec(msg);
    if (m != null) {
        var sound = msg.replace(':soundcamp ', '');
        //msgBody.replaceWith(sound);
        msgBody.html(chatSoundHTML(sound));
        if (play)
            playSound(sound);
    }
}

function receivedMessage(e) {
    var t = e.target;
    if (t.tagName.toLowerCase() === 'tr' && t.id === 'message_pending') {
        var msgBody = $(t).find('div.body');
        processSoundCommand(msgBody, true);
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
