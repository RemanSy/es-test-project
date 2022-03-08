let app = {
    filler : document.querySelector('#filler'),
    background : document.querySelector('#background'),
    char : document.querySelector('#char'),
    dialog : document.querySelector('#dialog'),
    name : document.querySelector('.name'),
    phrase : document.querySelector('.phrase'),
    arrowPrev : document.querySelector('#arrowPrev'),
    arrowNext : document.querySelector('#arrowNext'),
    audio : new Audio(''),
    curFrame : 0,
    curQuote : 0,
    quotes : 0,

    start : function(frames) {
        this.renderFrame(this.getCurFrame());
    },

    loadFrames : function(frames) {
        this.frames = frames;
    },

    next : function() {
        this.arrowPrev.style.display = 'block';
        this.curQuote += 1;

        if (this.curQuote > this.quotes) {
            this.curFrame += 1;
            this.renderFrame(this.getCurFrame());
        }

        if ((this.quotes < this.curQuote + 1) && (this.frames.length - 1 < this.curFrame + 1)) {
            this.arrowNext.style.display = 'none';
        }

        this.renderPhrase(this.getCurQuote());
    },

    previous : function() {
        this.arrowNext.style.display = 'block';
        this.curQuote -= 1;

        if (this.curQuote < 0) {
            this.curFrame -= 1
            this.renderFrame(this.getCurFrame());
            this.curQuote = this.quotes;
        }

        if ((this.curQuote - 1 < 0) && (this.curFrame - 1 < 0)) {
            this.arrowPrev.style.display = 'none';
        }

        this.renderPhrase(this.getCurQuote());
    },

    getCurFrame : function() {
        if (this.frames.length - 1 >= this.curFrame)
            return this.frames[this.curFrame];
        else
            return false;
    },

    getCurQuote: function() {
        if (this.quotes >= this.curQuote)
            return this.getCurFrame().quotes[this.curQuote];
        else
            return false;
    },

    renderFrame : async function(frame) {
        this.curQuote = 0;
        this.quotes = frame.quotes.length - 1;

        if (frame.audio && new Audio('sound/' + frame.audio).src != this.audio.src) {
            this.audio.smoothPause();
            sleep(100);
            this.audio = new Audio('sound/' + frame.audio);
            this.audio.setAttribute('loop', '');
            this.audio.smoothPlay();
        }
        
        this.changeBackground(frame.background);
        this.changeChar(frame.character);
        this.renderPhrase(this.getCurQuote());
    },

    renderPhrase : function(phrase) {
        this.name.innerText = phrase[0];
        this.phrase.innerText = phrase[1];
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Audio.prototype.smoothPause = async function() {
    for (let i = 0; i < 97; i++) {
        await sleep(21);
        this.volume -= 0.01;
    }
    this.muted = true;
    this.pause();
}

Audio.prototype.smoothPlay = async function() {
    this.muted = false;
    this.volume = 0.01;
    this.play();
    await sleep(700);
    for (let i = 0; i < 98; i++) {
        await sleep(31);
        this.volume += 0.01;
    }
}