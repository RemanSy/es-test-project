let app = {
    filler : document.querySelector('#filler'),
    background : document.querySelector('#background'),
    char : document.querySelector('#char'),
    choice : document.querySelector('#choice'),
    dialog : document.querySelector('#dialog'),
    name : document.querySelector('.name'),
    phrase : document.querySelector('.phrase'),
    arrowPrev : document.querySelector('#arrowPrev'),
    arrowNext : document.querySelector('#arrowNext'),
    audio : new Audio(''),
    points : {},
    curFrame : 0,
    curQuote : 0,
    quotes : 0,

    start : function(frames) {
        this.renderFrame(this.getFrame());
    },

    loadFrames : function(frames) {
        this.frames = frames;
    },

    loadGroups : function(groups) {
        this.groups = groups;
    },

    confColors : function(colors) {
        this.colors = colors;
    },

    next : function() {
        this.arrowPrev.style.display = 'block';
        this.curQuote += 1;
        this.quotes = this.getFrame().quotes.length - 1;

        if (this.curQuote > this.quotes) {
            this.curFrame += 1;
            this.renderFrame(this.getFrame());
        }

        if ((this.quotes < this.curQuote + 1) && (this.frames.length - 1 < this.curFrame + 1)) {
            this.arrowNext.style.display = 'none';
        }

        this.renderPhrase(this.getQuote());
    },

    previous : function() {
        this.arrowNext.style.display = 'block';
        this.curQuote -= 1;

        if (this.curQuote < 0) {
            this.curFrame -= 1;
            this.renderFrame(this.getFrame());
            this.curQuote = this.quotes;
        }

        if (((this.curQuote - 1 < 0) && (this.curFrame - 1 < 0))) {
            this.arrowPrev.style.display = 'none';
        }

        this.renderPhrase(this.getQuote());
    },

    getFrame : function(num = null) {
        if (num != null && this.frames.length - 1 >= num && num >= 0)
            return this.frames[num];
        else if (this.frames.length - 1 >= this.curFrame)
            return this.frames[this.curFrame];
        else
            return false;
    },

    getQuote : function(num = null) {
        if (num != null && this.quotes >= num && num >= 0)
            return this.getFrame().quotes[num];
        else if (this.quotes >= this.curQuote)
            return this.getFrame().quotes[this.curQuote];
        else
            return false;
    },

    renderFrame : async function(frame) {
        this.curQuote = 0;
        this.quotes = frame.quotes.length - 1;

        if (frame.audio.volume != 0 || frame.audio.volume != 100)
            sleep(300);

        if (frame.audio && new Audio('sound/' + frame.audio).src != this.audio.src) {
            this.audio.smoothPause();
            sleep(100);
            this.audio = new Audio('sound/' + frame.audio);
            this.audio.setAttribute('loop', '');
            this.audio.smoothPlay();
        }

        this.changeBackground(frame.background);
        this.changeChar(frame.character);
        this.renderPhrase(this.getQuote());
    },

    renderPhrase : function(phrase) {
        if (phrase == false) {
            this.next();
            return;
        }

        if (phrase[0] == CHOICE) {
            this.choice.style.display = 'flex';
            this.dialog.style.display = 'none';
            this.chsVarnts = phrase[2];

            for (let key in phrase[2])
                this.choice.querySelector('ul').append(createNode(`<li>${key}</li>`));
                
        } else if (phrase[0] == CONDITION || phrase[0] == ENDCONDITION)
            this.resolveCondition(phrase);
        else if (this.skipQuotes) {
            this.getFrame().quotes.splice(this.curQuote, 1);
            this.curQuote -= 1;
            this.next();
        } else {
            this.name.innerText = phrase[0];
            this.phrase.innerText = phrase[1];
            this.name.style.color = this.colors[phrase[0]] ?? '#fff';
        }
    },

    resolveChoice : function(text) {
        for (let key in this.chsVarnts[text]) {
            if (this.points.hasOwnProperty(key)) this.points[key] += this.chsVarnts[text][key];
            else this.points[key] = this.chsVarnts[text][key];
        }
        this.renderPhrase([this.getQuote()[1], text]);
        this.getFrame().quotes[this.curQuote] = [this.getQuote()[1], text];

        this.choice.querySelector('ul').innerHTML = '';
        this.choice.style.display = 'none';
        this.dialog.style.display = 'block';
    },

    resolveCondition : function(cond) {
        if (cond[0] == ENDCONDITION) {
            this.skipQuotes = false;
            this.getFrame().quotes.splice(this.curQuote, 1);
            this.curQuote -= 1;
            this.next();
            return;
        }

        if (cond[2] != undefined) {
            switch(cond[1][1]) {
                case '>':
                    if (this.points[cond[1][0]] > cond[1][2])
                        this.condTrue(cond);
                    else
                        this.condFalse();
                    break;
    
                case '<':
                    if (this.points[cond[1][0]] < cond[1][2])
                        this.condTrue(cond);
                    else
                        this.condFalse();
                    
                    break;
    
                case '=':
                    if (this.points[cond[1][0]] == cond[1][2])
                        this.condTrue(cond);
                    else
                        this.condFalse();
    
                    break;
            }
        } else {
            this.getFrame().quotes.splice(this.curQuote, 1);
            switch(cond[1][1]) {
                case '>':
                    if (!(this.points[cond[1][0]] > cond[1][2]))
                        this.skipQuotes = true;
                    
                    this.curQuote -= 1;
                    this.next();
                    break;
    
                case '<':
                    if (!(this.points[cond[1][0]] < cond[1][2]))
                        this.skipQuotes = true;
                    
                    this.curQuote -= 1;
                    this.next();
                    break;
    
                case '=':
                    if (!(this.points[cond[1][0]] == cond[1][2]))
                        this.skipQuotes = true;
                    
                    this.curQuote -= 1;
                    this.next();
                    break;
            }
        }
        
    },

    condTrue : function(cond) {
        this.frames.splice(this.curFrame + 1, 10000);
        this.groups[cond[2]].forEach(frame => this.frames.push(frame));
        this.getFrame().quotes.splice(this.curQuote, 1000);
        this.next();
    },

    condFalse : function() {
        this.getFrame().quotes.splice(this.curQuote, 1);
        this.quotes = this.getFrame().quotes.length - 1;
        this.renderPhrase(this.getQuote()); 
    },

    changeBackground : function(path) {
        this.filler.style.backgroundImage = `url('backgrounds/${path}')`;
        this.background.src = 'backgrounds/' + path;
    },

    changeChar : function(path) {
        this.char.src = 'sprites/' + path;
    },

    contain : function({width: imageWidth, height: imageHeight}, {width: areaWidth, height: areaHeight}) {
        const imageRatio = imageWidth / imageHeight;
    
        if (imageRatio >= areaWidth / areaHeight) {
          // longest edge is horizontal
          return {width: areaWidth, height: areaWidth / imageRatio};
        } else {
          // longest edge is vertical
          return {width: areaHeight * imageRatio, height: areaHeight};
        }
    }
}

const CHOICE = 'cniyec19n91438nc1nfc';
const CONDITION = '0n9acponifq42nu8rsih';
const ENDCONDITION = 'p9g7w2vpo4nir2wnipc';

window.onload = () => {
    app.char.width = app.contain({width : 1920, height : 1080}, {width : window.innerWidth, height : window.innerHeight}).width;
    app.char.height = app.contain({width : 1920, height : 1080}, {width : window.innerWidth, height : window.innerHeight}).height;
    app.char.style.top = `calc(50% - ${app.char.height / 2}px)`;
    app.dialog.style.bottom = `calc(${(window.innerHeight - app.char.height) / 2}px + 20px)`;
    app.dialog.style.height = `calc(${app.char.height}px / 3)`;
}

window.addEventListener('resize', () => {
    app.char.width = app.contain({width : 1920, height : 1080}, {width : window.innerWidth, height : window.innerHeight}).width;
    app.char.height = app.contain({width : 1920, height : 1080}, {width : window.innerWidth, height : window.innerHeight}).height;
    app.char.style.top = `calc(50% - ${app.char.height / 2}px)`;
    app.dialog.style.bottom = `calc(${(window.innerHeight - app.char.height) / 2}px + 20px)`;
    app.dialog.style.height = `calc(${app.char.height}px / 3)`;
});

document.querySelector('#start').addEventListener('click', function() {
    this.parentNode.parentNode.parentNode.style.display = 'none';
    app.start();
});

app.arrowNext.addEventListener('click', () => app.next());

app.arrowPrev.addEventListener('click', () => app.previous());

app.choice.addEventListener('click', e => { if (e.target.tagName == 'LI') app.resolveChoice(e.target.innerText) });

function createNode(html) {
    let tmp = document.createElement('template');
    html = html.trim();
    tmp.innerHTML = html;
    return tmp.content.firstChild;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Audio.prototype.smoothPause = async function() {
    try {
        for (let i = 0; i < 98; i++) {
            if (this.volume == 0) break
            await sleep(19);
            this.volume -= 0.01;
        }
    } catch(e) {
        this.volume = 0;
    }

    this.volume = 0;
    this.muted = true;
    this.pause();
}

Audio.prototype.smoothPlay = async function() {
    this.muted = false;
    this.volume = 0.01;
    this.play();
    await sleep(100);
    for (let i = 0; i < 98; i++) {
        if (this.volume == 0) break
        await sleep(28);
        this.volume += 0.01;
    }
    this.volume = 1;
}