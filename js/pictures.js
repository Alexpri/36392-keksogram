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
		init: function(){
			var self = this;

			self.filterHidden();
			self.create();
			self.filterAdd();
		},

		filterHidden: function(){
			var filters = document.querySelector('.filters');

			filters.classList.add('hidden');
		},

		filterAdd: function(){
			var filters = document.querySelector('.filters');

			filters.classList.remove('hidden');
		},

		create: function() {
            var pictureContainer = document.querySelector('.pictures'),
                gallery = new Gallery(),
                pictures;

              /**
               * @const
               * @type {number}
               */
              var REQUEST_FAILURE_TIMEOUT = 10000;
              var PAGE_SIZE = 12;
              var currentPage = 0;


              var currentPictures;

              /**
               * @type {PicturesCollection}
               */
              var picturesCollection = new PicturesCollection();


              /**
               * @type {Array.<object>}
               */
              var initiallyLoaded = [];

              /**
               * @type {Array.<object>}
               */
              var renderedViews = [];

              /**
               * @param {number} pageNumber
               * @param {boolean=} replace
               */
              function renderPictures(pageNumber, replace) {
                replace = typeof replace !== 'undefined' ? replace : true;
                pageNumber = pageNumber || 0;

                var fragment = document.createDocumentFragment();
                var picturesFrom = pageNumber * PAGE_SIZE;


                var picturesTo = picturesFrom + PAGE_SIZE;

                if (replace) {
                  while (renderedViews.length) {
                    var viewToRemove = renderedViews.shift();

                    pictureContainer.removeChild(viewToRemove.el);
                    viewToRemove.off('galleryclick');
                    viewToRemove.remove();
                  }
                }

                picturesCollection.slice(picturesFrom, picturesTo).forEach(function(model) {
                     var view = new PictureView({model: model});

                     view.render();
                     fragment.appendChild(view.el);
                     renderedViews.push(view);

                    view.on('galleryclick', function() {

                      //gallery.setPhotos(view.model.get('url'));

                      gallery.setPhotos(view.model.get('pictures'));
                      gallery.setCurrentPhoto(0);
                      gallery.show();
                    });
                });

                pictureContainer.appendChild(fragment);
              }


              function showLoadFailture() {
                pictureContainer.classList.add('pictures-failure');
              }


              /**
               * @param {string} filterID
               * return {Array.<object>}
               */
              function filterPictures(filterID) {

                var list = initiallyLoaded.slice(0);

                switch (filterID) {
                  case 'filter-new':
                        picturesCollection.sortBy('new');

                      list.sort(function(a, b) {
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
                      picturesCollection.sortBy('discussed');

                    list.sort(function(a, b) {
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

                picturesCollection.reset(list);
              }

              function initFilters() {
                var filterForm = document.querySelector('.filters');


                /**
                 * SetHash
                 */
                filterForm.addEventListener('click', function(evt) {
                  if (evt.target.classList.contains('filters-radio')) {
                    var clickedFilter = evt.target.id;

                    location.hash = 'filter/' + clickedFilter;
                  }
                });
              }

              window.addEventListener('hashchange', function (){
                parseURL();
              });


              function parseURL () {
                if (location.hash.match(/^#filter\/(\S+)$/)) {

                  var filterArray = location.hash.match(/^#filter\/(\S+)$/);
                  var filterActiveId = filterArray[1];
                  var filterHash = document.querySelector('#' + filterActiveId);
                  filterHash.checked = true;
                }


                currentPictures = filterPictures(filterActiveId);
                currentPage = 0;

                renderPictures(currentPage, true);
                checkNextPage();
              }


              /**
               * @return {number}
               */
              function isNextPageAvailable() {
                return currentPage < Math.ceil(initiallyLoaded.length / PAGE_SIZE);
              }

              /**
               * @return {number}
               */
              function isAtTheBottom () {
                var GAP = 100;
                return pictureContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
              }

              function checkNextPage () {
                if(isAtTheBottom() && isNextPageAvailable()){
                  window.dispatchEvent(new CustomEvent('loadneeded'));
                }
              }

              function initScroll() {
                var someTimeout;

                window.addEventListener('scroll', function() {
                  clearTimeout(someTimeout);
                  someTimeout = setTimeout(checkNextPage, 100);
                });

                window.addEventListener('loadneeded', function() {
                  renderPictures(currentPage++, false);
                });
              }

              picturesCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
                initiallyLoaded = jqXHR.responseJSON;
                initFilters();
                initScroll();
                parseURL();
              }).fail(function() {
                showLoadFailture();
              })
		}
	};

	(function() {
		Template.init();
	})();
});
