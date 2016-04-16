'use strict';

define([
    'views/photo-preview',
    'views/video-preview'
], function(GalleryPicture, GalleryVideo) {

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
        this._videos = new Backbone.Collection();

        this.element = document.body.querySelector('.gallery-overlay');
        this.closeButton = this.element.querySelector('.gallery-overlay-close');
        this._pictureElement = this.element.querySelector('.gallery-overlay-preview');
        this._videoElement = this.element.querySelector('.gallery-overlay-preview');

        this._currentPhoto = 0;
        this._currentVideo = 0;

        this._onCloseClick = this._onCloseClick.bind(this);
        this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    };

    /**
     *@private
     */
    Gallery.prototype.show = function () {
        this.element.classList.remove('invisible');
        this.closeButton.addEventListener('click', this._onCloseClick);

      if (this._photos.length) {
        document.body.addEventListener('keydown', this._onDocumentKeyDown);
        this._showCurrentPhoto();
      }

      if (this._videos.length) {
        this._showCurrentVideo();
      }
    };

    /**
     *@private
     */
    Gallery.prototype.hide = function () {
        this.element.classList.add('invisible');

        this.closeButton.removeEventListener('click', this._onCloseClick);

        if (this._photos.length) {
          document.body.removeEventListener('keydown', this._onDocumentKeyDown);
          this._photos.reset();
          this._currentPhoto = 0;
        }

        if (this._videos.length) {
          this._videos.reset();
          this._currentVideo = 0;
          this._videoElement.innerHTML = '';
        }
    };

    Gallery.prototype._showCurrentPhoto = function () {
      this._pictureElement.innerHTML = '';

      var imageElement = new GalleryPicture({model: this._photos.at(this._currentPhoto)});
      imageElement.render();

      this._pictureElement.appendChild(imageElement.el);
    };



    /**
     *@private
     */
    Gallery.prototype._showCurrentVideo = function () {
        this._videoElement.innerHTML = '';

        var videoElement = new GalleryVideo({model: this._videos.at(this._currentVideo)});
        videoElement.render();

        this._videoElement.appendChild(videoElement.el);
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
                this.setCurrentFrames(this._currentPhoto - 1);
                break;
            case Key.RIGHT:
                this.setCurrentFrames(this._currentPhoto + 1);
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
     * @param {Array.<string>} videos
     */
    Gallery.prototype.setVideos = function (videos) {

      this._videos.reset(videos.map(function (videoSrc) {
        return new Backbone.Model({
          url: videoSrc
        });
      }));
    };

    /**
     * @param {number} index
     */
    Gallery.prototype.setCurrentFrames = function (index) {
      if(this._photos.length) {
        index = clamp(index, 0, this._photos.length - 1);

        if (this._currentPhoto === index) {
            return;
        }

        this._currentPhoto = index;
        this._showCurrentPhoto();
      }

      if(this._videos.length) {
        this._showCurrentVideo();
      }
    };


    return Gallery;
});
