(function() {
    var Key = {
      ESC: 27,
      LEFT: 37,
      RIGHT: 39
    };

    /*
    * @param {number} value
    * @param {number} min
    * @param {number} max
    * @return {number}
    * */

    function clamp(value, min, max) {
      return Math.max(Math.min(value, min), max);

    }

    /*
    * @cunstructor
    * */


    var Gallery = function() {
      this.element = document.body.querySelector('.gallery-overlay');
      this._closeButton = this.element.querySelector('.gallery-overlay-close');
      this._pictureElement = this.element.querySelector('.gallery-overlay-preview');

      this._currentPhoto = 0;
      this._photos = [];

      this._onCloseClick = this._onCloseClick.bind(this);
      this._onDocumentKeyDown = this._onKeyDown.bind(this);
    };


    Gallery.prototype.show = function() {
      this.element.classList.remove('invisible');
      //this.closeButton.addEventListener('click', this._onCloseClick);
      //document.body.addEventListener('keydown', this._onkeyDown);

      this._showCurrentPhoto();
    };

    Gallery.prototype.hide = function() {
      this.element.classList.add('invisible');

      //this.closeButton.removeEventListener('click', this._onCloseClick);
      //document.body.removeEventListener('keydown', this._onkeyDown);

      this._photos = [];
      this._currentPhoto = 0;
    };

    Gallery.prototype._onCloseClick = function(evt) {
      evt.preventDefault();

      this.hide();
    };


    /*
    *@private
    *
    * */

    Gallery.prototype._showCurrentPhoto = function() {
      this._pictureElement.innerHTML = '';


      var imageElement = new Image();
      imageElement.src = this._photos[this._currentPhoto];
      imageElement.onload = function() {
        this._pictureElement.appendChild(imageElement);
      }.bind(this);
    };

    /**
    * @param {Event} evt
    * @private
    */

    Gallery.prototype._onDocumentKeyDown = function(evt) {

      switch (evt.keyCode) {
        case Key.LEFT:
          this.setCurrentPhoto(this._currentPhoto - 1);
          break;
        case Key.RIGHT:
          this.setCurrentPhoto(this._currentPhoto + 1);
          break;
        case Key.ESC:
          this.hide();
          break;
        default:
          break;
      }
    }


    /*
     * @param {Array.<string>} photos
     * */


    Gallery.prototype.setPhotos = function (photos) {
      this._photos = photos;
    };

    /*
     * @param {number} index
     * */

    Gallery.prototype.setCurrentPhoto = function (index) {
      index = clamp(index, 0, this._photos.length - 1);

      if (this._currentPhoto) {
        return;
      }
    };


    window.Gallery = Gallery;

  })();
