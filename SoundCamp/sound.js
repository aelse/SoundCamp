// Sorted alphabetically by label (first element of array)
var sounds = {
    // key : [ label, soundfile, image, text ]
    "boo": ["ಠ_ಠ", "boohiss.ogg", null, null],
    "alive": ["Alive", "alive.ogg", null, "It's alive!"],
    "alrighty": ["Alrighty then", "alrighty_then.ogg", null, null],
    "goat": ["Angry goat", "crazy_goat.ogg", "crazy_goat.png", null],
    "boomstick": ["Boomstick", "aod-boomstick.ogg", "boomstick.png", null],
    "deadbug": ["Bug fixed", "good_bug_dead_bug.ogg", "dead_bug.png", "Bug solved!"],
    "bug": ["Bug found", "we_have_a_bug.ogg", "bug.png", "We have a bug"],
    "catchaboat": ["Catch a boat", "ricky-catch_a_boat.ogg", "ricky.png", null],
    "espresso": ["Coffee, anyone?", "espresso.ogg", "espresso.png", "Anyone for coffee?"],
    "communicate": ["Communicate", "chl-communicate.ogg", null, "What we have here..."],
    "developers": ["Developers...", "steve_ballmer-developers.ogg", "steve_ballmer.png", null],
    "exterminate": ["Exterminate!", "dalek-exterminate.ogg", "dalek.png", "Exterminate!"],
    "facepalm": ["Facepalm", null, "facepalm.png", "..."],
    "grenade": ["Grenade", "33245__ljudman__grenade.ogg", "grenade.png", "Fire in the hole!"],
    "groovy": ["Groovy", "aod-groovy.ogg", null, null],
    "grumpy": ["Grumpy?", "llgrump.ogg", null, null],
    "hailking": ["Hail to the king", "aod-hailking.ogg", "crown.png", null],
    "hoaah": ["Hoaah", "timmy_hoaah.ogg", "timmy.png", null],
    "hypnotoad": ["Hypnotoad", "hypnotoad.ogg", "hypnotoad.gif", "ALL GLORY TO THE HYPNOTOAD!"],
    "dontthinkso": ["I don't think so", "larry_david-no_i_dont_think_so.ogg", "larry_david.jpg", null],
    "infinity": ["Infinity", "to_inf.ogg", "buzz_lightyear.png", "To infinity! ... or somewhere a bit closer"],
    "trap": ["It's a trap!", null, "images/star_wars_its_a_trap.png", null],
    "jack": ["Jack", "aod-jack.ogg", null, null],
    "jebus": ["Jebus", "jesus_christ.ogg", null, null],
    "killhumans": ["Kill all humans", "bender_kill_humans.ogg", "bender_kill.png", null],
    "discipline": ["Lack discipline", "arnie_you_lack_discipline.ogg", "arnie.png", null],
    "leeroy": ["Leeroy", "leeroy_jenkins.ogg", null, "At least I have chicken."],
    "letsgo": ["Let's go", "idiotmbl.ogg", null, null],
    "livinalie": ["Livin' a lie", "timmy_livinalie.ogg", "timmy.png", "Timmah!"],
    "nonono": ["No no no...", "no_cat.ogg", "no_cat.png", null],
    "sad": ["Sad", "sad.ogg", "buzz_lightyear.png", "Sad..."],
    "ladiesandgents": ["Steve Ballmer", "steve_ballmer-ladies_and_gentleman.ogg", "steve_ballmer.png", null],
    "tardis": ["Tardis", "tardis.ogg", "tardis.png", "wooOOooww wooOOoow wooOOoow" ],
    "final": ["The Final Countdown", "final.ogg", null, "The Final Countdown" ],
    "timmy": ["Timmy!", "timmy.ogg", "timmy.png", null],
    "right": ["You're right", "chuck_norris-youre_right.ogg", "chuck_norris.png", null],
    "wrong": ["You're wrong", "dr_cox-youre_wrong.ogg", "scrubs.png", null],
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
        html += '<span class="scMsg"><img class="scImg" src="'+
            chrome.extension.getURL("images/" + s[2]) +
            '"></span>';
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

function soundEnabled() {
    var img = $('#toggle_sounds_link').find('img');
    var state = $(img).attr('alt');
    if (state == 'Sound-on')
        return true;
    return false;
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
    if (!src)
        return;

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
        if (play && soundEnabled())
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
