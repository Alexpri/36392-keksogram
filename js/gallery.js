'use strict';

define([
    'views/photo-preview'
], function(GalleryPicture) {

    var Key = {
        ESC: 27,
        LEFT: 37,
        RIGHT: 39
    };

    /**
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * @cunstructor
     */
    var Gallery = function () {
        this._photos = new Backbone.Collection();

        this.element = document.body.querySelector('.gallery-overlay');
        this.closeButton = this.element.querySelector('.gallery-overlay-close');
        this._pictureElement = this.element.querySelector('.gallery-overlay-preview');

        this._currentPhoto = 0;

        this._onCloseClick = this._onCloseClick.bind(this);
        this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    };

    /**
     *@private
     */
    Gallery.prototype.show = function () {
        this.element.classList.remove('invisible');
        this.closeButton.addEventListener('click', this._onCloseClick);
        document.body.addEventListener('keydown', this._onDocumentKeyDown);

        this._showCurrentPhoto();
    };

    /**
     *@private
     */
    Gallery.prototype.hide = function () {
        this.element.classList.add('invisible');

        this.closeButton.removeEventListener('click', this._onCloseClick);
        document.body.removeEventListener('keydown', this._onDocumentKeyDown);

        this._photos.reset();
        this._currentPhoto = 0;
    };

    /**
     *@private
     */
    Gallery.prototype._showCurrentPhoto = function () {
        this._pictureElement.innerHTML = '';

        var imageElement = new GalleryPicture({model: this._photos.at(this._currentPhoto)});
        imageElement.render();

        this._pictureElement.appendChild(imageElement.el);
    };

    /**
     *@private
     */
    Gallery.prototype._onCloseClick = function (evt) {
        evt.preventDefault();

        this.hide();
    };

    /**
     * @param {Event} evt
     * @private
     */
    Gallery.prototype._onDocumentKeyDown = function (evt) {

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
        }
    };


    /**
     * @param {Array.<string>} photos
     */
    Gallery.prototype.setPhotos = function (photos) {

        this._photos.reset(photos.map(function (photoSrc) {
            return new Backbone.Model({
                url: photoSrc
            });
        }));
    };

    /**
     * @param {number} index
     */
    Gallery.prototype.setCurrentPhoto = function (index) {
        index = clamp(index, 0, this._photos.length - 1);

        if (this._currentPhoto === index) {
            return;
        }

        this._currentPhoto = index;
        this._showCurrentPhoto();
    };


    return Gallery;
});
