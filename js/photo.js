(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var IMAGE_WIDTH = 182;
  var IMAGE_HEIGHT = 182;

  /**
  * @constructor
  * @param {Object} data
  */

  var pictureTemp = document.querySelector('.picture-template');

  var Photo = function(data) {
    this._data = data;
    this._element = null;

    this._onPhotoClick = this._onPhotoClick.bind(this);
  };


  /**
  * @param {Element|DocumentFragment} container
  */

  Photo.prototype.render = function(container, number) {
      var newPictureElem = pictureTemp.content.children[0].cloneNode(true);

      newPictureElem.querySelector('.picture-comments').textContent = this._data['comments'];
      newPictureElem.querySelector('.picture-likes').textContent = this._data['likes'];

      this._data['number'] = number;

      if (this._data['url']) {
        var pictureImage = new Image();
        pictureImage.src = this._data['url'];

        var pictureImageOld = newPictureElem.querySelector('img');

        var imageLoadTimeout = setTimeout(function() {
          newPictureElem.classList.add('picture-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);



        pictureImage.addEventListener('load', function() {
          newPictureElem.querySelector('img').parentNode.replaceChild(pictureImage, pictureImageOld);
          pictureImage.width = IMAGE_WIDTH;
          pictureImage.height = IMAGE_HEIGHT;
          clearTimeout(imageLoadTimeout);
        });

        pictureImage.addEventListener('error', function() {
          newPictureElem.classList.add('picture-load-failure');
        });

      }

      container.appendChild(newPictureElem);

      this._element =  newPictureElem;
      this._element.addEventListener('click', this._onPhotoClick);
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onPhotoClick());
    this._element = null;
  };

  Photo.prototype._onPhotoClick = function(evt) {
    evt.preventDefault();

    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick', {detail: {pictureElement: this}});
      window.dispatchEvent(galleryEvent);
    }
  };

  Photo.prototype.getPhotos = function() {
    return this._data.pictures;
  };


  window.Photo = Photo;
})();
