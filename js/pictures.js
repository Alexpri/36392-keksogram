'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'gallery',
  'models/photos',
  'views/photo',
  // NB! Модули, которые ничего не возвращают, а только исполняют код,
  // тоже можно подключать, но главное делать это в конце списка, чтобы
  // не объявлять им имя в параметрах.
  'resize-form',
  'upload-form',
  'form-validation',
  'filter-form',
  'logo-background'
], function(Gallery, PicturesCollection, PictureView) {
  var Template = {
    init: function () {
      var self = this;

      self.filterHidden();
      self.create();
      self.filterAdd();
      /**
       * @const
       * @type {number}
       */
      self.REQUEST_FAILURE_TIMEOUT = 10000;
      self.PAGE_SIZE = 12;
      self.GAP = 100;
    },

    filterHidden: function () {
      var filters = document.querySelector('.filters');

      filters.classList.add('hidden');
    },

    filterAdd: function () {
      var filters = document.querySelector('.filters');

      filters.classList.remove('hidden');
    },

    create: function () {
      var self = this,
          pictures;

      self.gallery = new Gallery();

      self.pictureContainer = document.querySelector('.pictures');
      self.currentPage = 0;


      /**
       * @type {Array.<object>}
       */
      self.initiallyLoaded = [];

      /**
       * @type {PicturesCollection}
       */
      self.picturesCollection = new PicturesCollection();

      window.addEventListener('hashchange', function () {
        self.parseURL();
      });

      self.picturesCollection.fetch({timeout: self.REQUEST_FAILURE_TIMEOUT}).success(function (loaded, state, jqXHR) {
        self.initiallyLoaded = jqXHR.responseJSON;
        self.initFilters();
        self.initScroll();
        self.parseURL();
      }).fail(function () {
        self.showLoadFailture();
      })
    },

    /**
     * @param {number} pageNumber
     * @param {boolean=} replace
     */
    renderPictures: function (pageNumber, replace) {
      var self = this;

      /**
       * @type {Array.<object>}
       */
      var renderedViews = [];

      replace = typeof replace !== 'undefined' ? replace : true;
      pageNumber = pageNumber || 0;

      var fragment = document.createDocumentFragment();
      var picturesFrom = pageNumber * self.PAGE_SIZE;


      var picturesTo = picturesFrom + self.PAGE_SIZE;

      if (replace) {
        while (renderedViews.length) {
          var viewToRemove = renderedViews.shift();

          self.pictureContainer.removeChild(viewToRemove.el);
          viewToRemove.off('galleryclick');
          viewToRemove.remove();
        }
      }

      self.picturesCollection.slice(picturesFrom, picturesTo).forEach(function (model) {
        var view = new PictureView({model: model});

        view.render();
        fragment.appendChild(view.el);
        renderedViews.push(view);

        view.on('galleryclick', function () {
          self.gallery.setPhotos(view.model.get('pictures'));
          self.gallery.setCurrentPhoto(0);
          self.gallery.show();
        });
      });

      self.pictureContainer.appendChild(fragment);
    },
    showLoadFailture: function () {
      self.pictureContainer.classList.add('pictures-failure');
    },
    initFilters: function () {
      var filterForm = document.querySelector('.filters');

      /**
       * SetHash
       */
      filterForm.addEventListener('click', function (evt) {
        if (evt.target.classList.contains('filters-radio')) {
          var clickedFilter = evt.target.id;

          location.hash = 'filter/' + clickedFilter;
        }
      });
    },
    /**
     * @param {string} filterID
     * return {Array.<object>}
     */
    filterPictures: function (filterID) {
      var self = this;
      self.list = self.initiallyLoaded.slice(0);

      switch (filterID) {
        case 'filter-new':
          self.picturesCollection.sortBy('new');

          self.list.sort(function (a, b) {
            a = Date.parse(a.date);
            b = Date.parse(b.date);

            if (a > b) {
              return -1;
            }

            if (a < b) {
              return 1;
            }

            if (a === b) {
              return 0;
            }
          });
          break;

        case 'filter-discussed':
          self.picturesCollection.sortBy('discussed');

          self.list.sort(function (a, b) {
            a = parseInt(a.comments, 10);
            b = parseInt(b.comments, 10);

            if (a > b) {
              return -1;
            }

            if (a < b) {
              return 1;
            }

            if (a === b) {
              return 0;
            }
          });
          break;
      }

      self.picturesCollection.reset(self.list);
    },

    /**
     * @return {number}
     */

    isNextPageAvailable: function () {
      var self = this;
      return self.currentPage < Math.ceil(self.initiallyLoaded.length / self.PAGE_SIZE);
    },
    checkNextPage: function () {
      var self = this;
      if (self.isAtTheBottom() && self.isNextPageAvailable()) {
        window.dispatchEvent(new CustomEvent('loadneeded'));
      }
    },
    /**
     * @return {boolean}
     */

    isAtTheBottom: function () {
      var self = this;
      return self.pictureContainer.getBoundingClientRect().bottom - self.GAP <= window.innerHeight;
    },

    initScroll: function () {
      var self = this;
      var someTimeout;

      window.addEventListener('scroll', function () {
        clearTimeout(someTimeout);
        someTimeout = setTimeout(self.checkNextPage(), 100);
      });

      window.addEventListener('loadneeded', function () {
        self.renderPictures(self.currentPage++, false);
      });
    },

    parseURL: function() {
      var self = this;
      var filterActiveId = 'filter-popular';

      if (location.hash.match(/^#filter\/(\S+)$/)) {

        var filterArray = location.hash.match(/^#filter\/(\S+)$/);
            filterActiveId = filterArray[1];
        var filterHash = document.querySelector('#' + filterActiveId);
        filterHash.checked = true;
      }


      self.filterPictures(filterActiveId);
      self.currentPage = 0;

      self.renderPictures(self.currentPage, true);
      self.checkNextPage();
    }
  };

  (function() {
    Template.init();
  })();
});
