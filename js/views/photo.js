/*use strict*/

(function() {

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var IMAGE_WIDTH = 182;
  var IMAGE_HEIGHT = 182;

  /**
   * @type {Element}
   */
  var pictureTemp = document.querySelector('#picture-template');


  /**
   * @constructon
   * @extend {Backbone.View}
   */
  var PictureView = Backbone.View.extend({
    /**
     * @override
     */
    inititalize: function() {
      this._onPhotoClick = this._onPhotoClick.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onModelLike = this._onModelLike.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:liked', this._onModelLike);
    },

    /**
     * @type {string}
     * override
     */
    events: {
      'click': '_onClick'
    },

    /**
     * @type {string}
     * override
     */
    tagName: 'article',


    /**
     * @type {string}
     * override
     */
    className: 'picture',

    /**
     * override
     */
    render: function() {
      this.el.appendChild(pictureTemp.content.cloneNode(true));

      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');
      this.el.querySelector('.picture-likes').textContent =  this.model.get('likes');


      if (this.model.get('url')) {
        var pictureImage = new Image();
        pictureImage.src =  this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        var pictureImageOld = this.el.querySelector('img');

        pictureImage.addEventListener('load', function() {
          this.el.querySelector('img').parentNode.replaceChild(pictureImage, pictureImageOld);
          pictureImage.width = IMAGE_WIDTH;
          pictureImage.height = IMAGE_HEIGHT;
        }.bind(this));

        pictureImage.addEventListener('error', function() {
          this.classList.add('picture-load-failure');
        });

        pictureImage.addEventListener('load', this._onImageLoad.bind(this));
        pictureImage.addEventListener('error', this._onImageFail.bind(this));
        pictureImage.addEventListener('abort', this._onImageFail.bind(this));
      }

      this._updateLike();
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onClick: function(evt) {
      var clickedElement = evt.currentTarget;

      if (clickedElement.classList.contains('picture') &&
          !clickedElement.classList.contains('picture-load-failure')) {
          this.trigger('galleryclick');
      }

      if (evt.target.classList.contains('picture-likes')) {
        if (this.model.get('liked')) {
          this.model.dislike();
        } else {
          this.model.like();
        }
      }
    },


    /**
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = evt.path[0];

      this._cleanupImageListeners(loadedImage);
    },


    /**
     * @private
     */
    _onImageFail: function(evt) {
      var failedImage = evt.path[0];


      this._cleanupImageListeners(failedImage);
      this.el.classList.add('picture-load-failure');
    },


    /**
     * @private
     */
    _onModelLike: function() {
      this._updateLike();
    },


    /**
     * @private
     */
    _updateLike: function() {
      var likeButton = this.el.querySelector('picture-likes');

      if (likeButton) {
        likeButton.classList.toggle('picture-favourite-liked', this.model.get('liked'));
      }
    },


    /**
     * @param {String} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  window.PictureView = PictureView;
})();