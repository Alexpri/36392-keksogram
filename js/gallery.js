(function() {

  var Gallery = {

    init: function(){
      var self = this;

      self.pictureContainer = document.querySelector('.pictures');
      self.galleryElement = document.querySelector('.gallery-overlay');
      self.closeBtn = document.querySelector('.gallery-overlay-close');

      self.preview();
    },


    doesHaveParent: function(element, className) {
      do{
        if (element.classList.contains(className)) {
         return !element.classList.contains('picture-load-failure');
        }

        element = element.parentElement;
      } while (element);

      return false;
    },

    preview: function() {
      var self = this;

      self.pictureContainer.addEventListener('click', function(evt) {
        evt.preventDefault();
        if (self.doesHaveParent(evt.target, 'picture')) {
          self.showGallery();
        }
      });
    },

    showGallery: function() {

      this.galleryElement.classList.remove('invisible');
      this.closeBtn.addEventListener('click', this.closeHandler.bind(this));
      document.body.addEventListener('keydown', this.keyHandler.bind(this));
    },

    hideGallery: function() {

      this.galleryElement.classList.add('invisible');
      this.closeBtn.removeEventListener('click', this.closeHandler.bind(this));
      document.body.removeEventListener('keydown', this.keyHandler.bind(this));
    },

    closeHandler: function(evt) {

      evt.preventDefault();
      this.hideGallery();
    },

    keyHandler: function(evt) {
      var self = this;

      key = {
          'ESC': 27,
          'LEFT': 37,
          'RIGHT': 39
      };

      switch (evt.keyCode) {
        case key.LEFT:
              console.log('show prev picture');
              break;
        case key.RIGHT:
          console.log('show next picture');
              break;
        case key.ESC:
          self.hideGallery();
              break;
        default: break;
      }
    }
  };


  (function() {
    Gallery.init();
  })();

})();
