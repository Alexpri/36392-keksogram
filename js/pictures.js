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
          picturesFragment = document.createDocumentFragment(),
          gallery = new Gallery(),
          pictures;

			var REQUEST_FAILURE_TIMEOUT = 10000;
      var PAGE_SIZE = 12;
      var currentPage = 0;
      var currentPictures;
      var renderedPictures = [];

      var ReadyState = {
        'UNSET': 0,
        'OPENED': 1,
        'HEADERS_RECEIVED': 2,
        'LOADING': 3,
        'DONE': 4
      };

      function renderPictures(picturesToRender, pageNumber, replace) {
        replace = typeof replace !== 'undefined' ? replace : true;
        pageNumber = pageNumber || 0;

        if (replace) {
          var el;
          while ((el = renderedPictures.shift())) {
            el.unrender();
          }
        }

        var picturesFrom = pageNumber * PAGE_SIZE;
        var picturesTo = picturesFrom + PAGE_SIZE;
        picturesToRender = picturesToRender.slice(picturesFrom, picturesTo);

        picturesToRender.forEach(function(pictureData) {
          var newPictureElem = new Photo(pictureData);
          newPictureElem.render(picturesFragment);
          renderedPictures.push(newPictureElem);
        });


        pictureContainer.appendChild(picturesFragment);
      };


      function showLoadFailture() {
        pictureContainer.classList.add('pictures-failure');
      }

      function loadPictures(callback) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = REQUEST_FAILURE_TIMEOUT;

        xhr.open('get', 'data/pictures.json');
        xhr.send();


        xhr.addEventListener('readystatechange', function(evt) {
          var loadedXhr = evt.target;
          pictureContainer.classList.add('pictures-loading');
          switch (loadedXhr.readyState) {
            case ReadyState.OPENED:
            case ReadyState.HEADERS_RECEIVED:
            case ReadyState.LOADING:

              break;

            case ReadyState.DONE:
            default:
              if (loadedXhr.status == 200) {
                var data = loadedXhr.response;

                pictureContainer.classList.remove('pictures-loading');
                callback(JSON.parse(data));
              }

              if (loadedXhr.status == 400) {
                showLoadFailture();
              }

              break;
          }
        });


        xhr.addEventListener('timeout', function() {
          showLoadFailture();
        });
      }

      function filterPictures(pictures, filterID) {

        var filteredPictures = pictures.slice(0);

        switch (filterID) {
          case 'filter-new':

                filteredPictures = filteredPictures.sort(function(a, b) {
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
            filteredPictures = filteredPictures.sort(function(a, b) {
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

          default:
            pictures.slice(0);
                break;
        }

        localStorage.setItem('filterID', filterID);

        return filteredPictures;
      }

      function initFilters() {
        var filterForm = document.querySelector('.filters');


        filterForm.addEventListener('click', function(evt) {
          var clickedFilter = evt.target;

          setActiveFilter(clickedFilter.id);
          clickedFilter.checked;
        });
      }


      function setActiveFilter(filterID) {
        currentPictures = filterPictures(pictures, filterID);
        currentPage = 0;

        renderPictures(currentPictures, currentPage, true);
        checkNextPage();
      }

      function isNextPageAvailable() {
        return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
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
          renderPictures(currentPictures, currentPage++, false);
        });
      }

      function initGallery() {
        window.addEventListener('galleryclick', function(evt) {
          gallery.setPhotos(evt.detail.pictureElement.getPhotos());
          gallery.show();
        })
      }

      initFilters();
      initScroll();

      loadPictures(function(loadedPictures) {
        pictures = loadedPictures;
        setActiveFilter(localStorage.getItem('filterID') || ('filter-popular'));
      });
		}
	};

	(function() {
		Template.init();
	})();
})();
