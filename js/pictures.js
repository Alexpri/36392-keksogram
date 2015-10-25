(function() {

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

              var REQUEST_FAILURE_TIMEOUT = 10000;
              var PAGE_SIZE = 12;
              var currentPage = 0;
              var currentPictures;
              var renderedPictures = [];

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
                var fragment = document.createDocumentFragment();
                var picturesFrom = pageNumber * PAGE_SIZE;
                var picturesTo = picturesFrom + PAGE_SIZE;


                replace = typeof replace !== 'undefined' ? replace : true;
                pageNumber = pageNumber || 0;

                if (replace) {
                  while (renderedViews.length) {
                    var viewToRemove = renderedViews.shift();

                    pictureContainer.removeChild(viewToRemove.el);
                    viewToRemove.off('galleryclick');
                    viewToRemove.remove;

                  }
                }


                picturesCollection.slice(picturesFrom, picturesTo).forEach(function(model) {
                     var view = new PictureView({model: model});


                     view.render();
                     fragment.appendChild(view.el);
                     renderedViews.push(view);

                    view.on('galleryclick', function() {
                      console.log(view.model.get('url'));
                      gallery.setPhotos(view.model.get('pictures'));
                      gallery.setCurrentPhoto(0);
                      gallery.show();
                    });
                });

                /*picturesToRender.forEach(function(pictureData, number) {
                  var newPictureElem = new Photo(pictureData);
                  newPictureElem.render(picturesFragment, number);
                  renderedPictures.push(newPictureElem);
                });*/


                pictureContainer.appendChild(fragment);
              };


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
                localStorage.setItem('filterID', filterID);
              }

              function initFilters() {
                var filterForm = document.querySelector('.filters');


                filterForm.addEventListener('click', function(evt) {
                  var clickedFilter = evt.target;

                  setActiveFilter(clickedFilter.id);
                });
              }


              function setActiveFilter(filterID) {
                currentPictures = filterPictures(filterID);
                currentPage = 0;

                renderPictures(currentPage, true);
                checkNextPage();
            }

            /*function setActiveFilter(filterID) {
                currentPictures = filterPictures(filterID);
                currentPage = 0;

                console.log(currentPictures, currentPage);

                renderPictures(currentPictures, currentPage, true);
                checkNextPage();
            }*/

              function isNextPageAvailable() {
                return currentPage < Math.ceil(initiallyLoaded.length / PAGE_SIZE);
              }


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

              /*function initGallery() {
                window.addEventListener('galleryclick', function(evt) {
                  gallery.setPhotos(currentPictures);

                  gallery.setCurrentPhoto(evt.detail.pictureElement._data.number);
                  gallery.show();
                })
              }*/


              //initGallery();

              picturesCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
                initiallyLoaded = jqXHR.responseJSON;
                initFilters();
                initScroll();
                setActiveFilter(localStorage.getItem('filterID') || ('filter-popular'));
               /* if (localStorage.getItem('filterID')) {
                  var filterStorage = document.querySelector('#' + localStorage.getItem('filterID'));
                  filterStorage.checked = true;
                }*/
              }).fail(function() {
                showLoadFailture();
              })
		}
	};

	(function() {
		Template.init();
	})();
})();
