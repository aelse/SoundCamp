// Sorted alphabetically by label (first element of array)
var sounds = {
    // key : [ label, soundfile, image, text ]
    "goat": ["Angry goat", "crazy_goat.ogg", "crazy_goat.png", null],
    "boomstick": ["Boomstick", "aod-boomstick.ogg", "boomstick.png", null],
    "communicate": ["Communicate", "chl-communicate.ogg", null, "What we have here..."],
    "killhumans": ["Kill all humans", "bender_kill_humans.ogg", "bender_kill.png", null],
    "discipline": ["Lack discipline", "arnie_you_lack_discipline.ogg", "arnie.png", null],
    "grenade": ["Grenade", "33245__ljudman__grenade.ogg", "grenade.png", "Fire in the hole!"],
    "groovy": ["Groovy", "aod-groovy.ogg", null, null],
    "hailking": ["Hail", "aod-hailking.ogg", "crown.png", null],
    "dontthinkso": ["I don't think so", "larry_david-no_i_dont_think_so.ogg", "larry_david.jpg", null],
    "jack": ["Jack", "aod-jack.ogg", null, null],
    "nonono": ["No no no...", "no_cat.ogg", "no_cat.png", null],
    "right": ["You're right", "chuck_norris-youre_right.ogg", "chuck_norris.png", null],
}

var audio = null;
var re = /:soundcamp \w+/;
var mre = /message_/;

function tellPlaySound(sound) {
    var input = $('#input')[0];
    var copy = input.value;
    input.value = ':soundcamp '+ sound;
    $('#send').click();
    input.value = copy;
}

function addChatSoundHTML(node, sound) {
    var s = sounds[sound];
    if (!s) {
        node.html('<span class="scMsgUnknown">Unknown sound "'+
            sound +'".</span>');
        return;
    }

    var html = '';
    if (s[2]) {
        html += '<span class="scMsg"><img src="'+
            chrome.extension.getURL("images/" + s[2]) +
            '" height="18px"></span>';
    }
    if (s[3]) {
        html += '<span class="scMsg">'+ s[3] +'</span>';
    }
    if (html === '') {
        html = '<span class="scMsg">'+ s[0] +'</span>';
    }

    var snd_img = $('<img>').attr('alt', "Sound").attr('class',
    'scSndIcon').attr('src', '/images/sound.png');
    $(snd_img).click(function() { playSound(sound); });

    node.html('');
    node.append(snd_img);
    node.append(html);
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
        addChatSoundHTML(msgBody, sound);
        if (play)
            playSound(sound);
    }
}

function receivedMessage(e) {
    var t = e.target;
    if (t.tagName.toLowerCase() === 'tr' && mre.exec(t.id)) {
        var msgBody = $(t).find('div.body');
        processSoundCommand(msgBody, true);
    }
}

function scanAllMessages() {
    $('div.body').each(function() {
        processSoundCommand($(this), false);
    });
}

function initControls() {
    $('<div>').attr('id', 'soundcamp_sounds').attr('class', 'tooltip').appendTo('#chat_controls');
    $('<span>').attr('id', 'soundcampContainer').attr('class', 'tooltip-inner').appendTo('#soundcamp_sounds');
    $('<img>').attr('src',
    chrome.extension.getURL('images/music.png')).attr('id', 'soundcamp_button').attr('width', '16').attr('height', '15').appendTo('#soundcamp_sounds');

    var sound;
    for (sound in sounds) {
        $('#soundcampContainer').append('<a class="sound" data-value="'+
            sound +'">' + (sounds[sound])[0]);
    }

    $(document).click(function (e) {
        if (e.target.id !== 'soundcamp_button' &&
            $('#soundcamp_button').find(e.target).length === 0) {
                $('#soundcampContainer').hide();
        } else {
            $('#soundcampContainer').toggle();
        }
    });

    $('#soundcampContainer').children('.sound').click(function() {
        var sound = this.getAttribute('data-value');
        tellPlaySound(sound);
    });
}

function initListener() {
    $('#chat').bind('DOMNodeInserted', receivedMessage);
}

scanAllMessages();
initControls();
initListener();
