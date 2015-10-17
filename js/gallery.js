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
      var self = this;

      self.galleryElement.classList.remove('invisible');
      self.closeBtn.addEventListener('click', self.closeHendler);
      document.body.addEventListener('keydown', self.keyHendler);
    },

    hideGallery: function() {
      var self = this;

      self.galleryElement.classList.add('invisible');
      self.closeBtn.removeEventListener('click', self.closeHendler);
      document.body.removeEventListener('keydown', self.keyHendler);
    },

    closeHendler: function(evt) {
      var self = this;

      evt.preventDefault();
      Gallery.hideGallery();
    },

    keyHendler: function(evt) {
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
          Gallery.hideGallery();
              break;
        default: break;
      }
    }
  };


  (function() {
    Gallery.init();
  })();

})();
