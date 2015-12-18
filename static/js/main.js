/* Element */
function Element(prnt, elmt) {
    this.element = prnt.querySelector(elmt);
}
Element.prototype.hide = function() {
    this.element.style.display = 'none';
};
Element.prototype.show = function() {
    this.element.style.display = 'block';
};
Element.prototype.setText = function(content) {
    this.element.textContent = content;
};
Element.prototype.setHtml = function(content) {
    this.element.innerHTML = content;
};

/* Loader */
function Loader(parent, elmt, pourcent) {
    Element.call(this, parent, elmt);
    this.total = this.element.getTotalLength();
    this.element.setAttribute('stroke-dasharray', this.total);
    this.set(pourcent);
}
Loader.prototype = Object.create(Element.prototype);
Loader.prototype.constructor = Loader;

Loader.prototype.set = function(pourcent) {
    this.pourcent = pourcent;
    var nb = this.total - (this.total * this.pourcent / 100);
    this.element.setAttribute('stroke-dashoffset', nb);
};
Loader.prototype.get = function() {
    return this.pourcent;
};

/* Button */
function Button(parent, elmt) {
    Element.call(this, parent, elmt);
    this.default = this.element.getAttribute('class');
}
Button.prototype = Object.create(Element.prototype);
Button.prototype.constructor = Button;

Button.prototype.active = function() {
    var attr = this.element.getAttribute('class');
    if (!this.isActive())
        this.element.setAttribute('class', attr + ' is-active');
};
Button.prototype.inactive = function() {
    var attr = this.element.getAttribute('class');
    if (this.isActive())
        this.element.setAttribute('class', attr.replace(' is-active', ''));
};
Button.prototype.isActive = function() {
    var attr = this.element.getAttribute('class');
    return /is-active/.test(attr);
};

/* ButtonLoader */
function ButtonLoader(id, callbacks) {
    this.element = document.getElementById(id);
    this.callbacks = callbacks;
    this.button = new Button(this.element, '.loader-button');
    this.firstLoader = new Loader(this.element, '.loader-bar-first', 0);
    this.secondLoader = new Loader(this.element, '.loader-bar-second', 0);
    this.title = new Element(this.element, '.loader-title');
    this.pourcent = new Element(this.element, '.loader-pourcent');
    this.image = new Element(this.element, '.loader-button image');
    this.input = new Element(this.element, '.loader-input');

    /* button onClick */
    this.button.element.addEventListener('click', function(e) {
        e.preventDefault();
        if (!this.button.isActive())
            this.input.element.click();
    }.bind(this));
    /* input onChange */
    this.input.element.addEventListener('change', function(e) {
        e.preventDefault();
        if (!this.button.isActive())
            this.upload(e.target.files[0]);
    }.bind(this));
    /* button DragOver */
    this.button.element.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.button.active();
    }.bind(this));
    /* button DragLeave */
    this.button.element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.button.inactive();
    }.bind(this));
    /* button Drop */
    this.button.element.addEventListener('drop', function(e) {
        e.preventDefault();
        var files = e.dataTransfer.files;
        if (files.length > 0)
            this.upload(files[0]);
        else
            this.button.inactive();
    }.bind(this));
}

ButtonLoader.prototype.reset = function() {
    this.button.inactive();
    this.image.show();
    this.pourcent.hide();
    this.title.hide();
    this.firstLoader.hide();
    this.secondLoader.hide();
}

ButtonLoader.prototype.upload = function(file) {

    var self = this;
    this.button.active();
    this.firstLoader.show();
    this.secondLoader.show();
    this.title.show();
    this.pourcent.show();
    this.image.hide();

    var req = new XMLHttpRequest();
    req.upload.addEventListener("progress", function(e) {
        var pourcent = e.loaded / e.total * 100;
        self.firstLoader.set(pourcent.toFixed());
        self.secondLoader.set(pourcent.toFixed());
        self.pourcent.setHtml(pourcent.toFixed() + "%");
    });
    req.onreadystatechange = function (e) {
        if (this.readyState == 4) {
            var response = JSON.parse(this.responseText);
            if (this.status == 201) {
                self.callbacks.success(response);
            }
            else {
                self.callbacks.error(response);
            }
        }
    };
    req.open('POST', UPLOAD_URL, true);

    var formData = new FormData();
    formData.append('file', file);
    req.send(formData);
};

function Box(id) {
    this.element = document.getElementById(id);
    this.title = new Element(this.element, '.box-title');
    this.content = new Element(this.element, '.box-inner');
    this.close = new Element(this.element, '.box-close');
    this.closeCallback = function() {};
    this.close.element.addEventListener('click', function(e) {
        e.preventDefault();
        this.hide();
        this.closeCallback();
    }.bind(this));
}
Box.prototype = Object.create(Element.prototype);
Box.prototype.constructor = Box;
Box.prototype.setTitle = function(title) {
    this.title.setHtml(title);
};
Box.prototype.setContent = function(content) {
    this.content.setHtml(content);
};
Box.prototype.setCloseCallback = function(callback) {
    this.closeCallback = callback;
};

/* OnLoad */
window.onload = function() {
    var box = new Box('box');
    var loader = new ButtonLoader('loader', {
        success: function(data) {
            box.setTitle('Success !');
            box.setContent('<input class="autoselect" type="text" value="' + data.file + '" /><br /><br /><a class="btn" href="' + data.file + '">Download the file</a><br />');
            box.setCloseCallback(function() {
                loader.reset();
            });
            box.show();
            document.querySelector('.autoselect').addEventListener("click", function() {
                this.focus();
                this.select();
            });
        },
        error: function(data) {
            box.setTitle('Error ! :(');
            box.setContent(data.error);
            box.setCloseCallback(function() {
                loader.reset();
            });
        }
    });
};
