let app = {
    filler : document.querySelector('#filler'),
    background : document.querySelector('#background'),
    char : document.querySelector('#char'),
    dialog : document.querySelector('#dialog'),
    name : document.querySelector('.name'),
    phrase : document.querySelector('.phrase'),
    arrowPrev : document.querySelector('#arrowPrev'),
    arrowNext : document.querySelector('#arrowNext'),
    curFrame : 0,
    curQuote : 0,
    quotes : 0,

    start : function(frames) {
        this.frames = frames;
        this.renderFrame(this.getCurFrame());
    },

    next : function() {
        this.arrowPrev.style.display = 'block';        
        
        if (this.curQuote >= this.quotes) {
            this.curFrame += 1;
            this.renderFrame(this.getCurFrame());
            
            return;
        }

        this.curQuote += 1;

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

    // Reset frames to first or last frame
    resetFrames : function(dir = 'min') {
        if (dir == 'min') {
            this.curFrame = 0;
            this.curQuote = 0;

            return {frame : 0, quote : 0};
        } else if (dir == 'max') {
            this.curFrame = this.frames.length - 2;
            this.curQuote = this.getCurFrame().quotes[-1];

            return {frame : this.getCurFrame(), quote : this.getCurQuote()};
        }

        return false;
    },

    renderFrame : function(frame) {
        this.curQuote = 0;
        this.quotes = frame.quotes.length - 1;
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

app.arrowNext.addEventListener('click', () => app.next());

app.arrowPrev.addEventListener('click', () => app.previous());