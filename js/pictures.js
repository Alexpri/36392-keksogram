(function() {

	var Template = {
		init: function(){
			self = this;

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
          pictureTemp = document.querySelector('#picture-template'),
          picturesFragment = document.createDocumentFragment();

			var REQUEST_FAILURE_TIMEOUT = 10000;
			var IMAGE_WIDTH = 182;
			var IMAGE_HEIGHT = 182;
      var MONTH = 30 * 24 * 60 * 60 * 1000;

      var ReadyState = {
        'UNSET': 0,
        'OPENED': 1,
        'HEADERS_RECEIVED': 2,
        'LOADING': 3,
        'DONE': 4
      };

      function renderPictures(pictures) {
        pictureContainer.classList.remove('hotels-list-failure');
        pictureContainer.innerHTML = '';

        pictures.forEach(function(picture, i) {
          var newPictureElem = pictureTemp.content.children[0].cloneNode(true);

          newPictureElem.querySelector('.picture-comments').textContent = picture['comments'];
          newPictureElem.querySelector('.picture-likes').textContent = picture['likes'];

          if (picture['url']) {
            var pictureImage = new Image();
            pictureImage.src = picture['url'];

            var pictureImageOld = newPictureElem.querySelector('img');

            var imageLoadTimeout = setTimeout(function() {
              newPictureElem.classList.add('picture-load-failure');
            }, REQUEST_FAILURE_TIMEOUT);



            pictureImage.onload = function() {
              newPictureElem.querySelector('img').parentNode.replaceChild(pictureImage, pictureImageOld);
              pictureImage.width = IMAGE_WIDTH;
              pictureImage.height = IMAGE_HEIGHT;
              clearTimeout(imageLoadTimeout);
            };

            pictureImage.onerror = function() {
              newPictureElem.classList.add('picture-load-failure');
            };

          }

          picturesFragment.appendChild(newPictureElem);
        });

        pictureContainer.appendChild(picturesFragment);
      }


      // Create for XHR self.loadPictures ?

      function showLoadFailture() {
        pictureContainer.classList.add('pictures-failure');
      }

      function loadPictures(callback) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = REQUEST_FAILURE_TIMEOUT;

        xhr.open('get', 'data/pictures.json');
        xhr.send();


        xhr.onreadystatechange = function(evt) {
          var loadedXhr = evt.target;
          switch (loadedXhr.readyState) {
            case ReadyState.OPENED:
            case ReadyState.HEADERS_RECEIVED:
            case ReadyState.LOADING:
              pictureContainer.classList.add('pictures-loading');
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
        };


        xhr.ontimeout = function() {
          showLoadFailture();
        }
      }

      function filterPictures(pictures, filterID) {

        var filteredPictures = pictures.slice(0);

        switch (filterID) {
          case 'filter-new':
            filteredPictures.forEach(function(picture, i){
              var TODAY = Date.parse(new Date()),
                  pictureDate = Date.parse(picture.date);

              lastMonth = (TODAY - MONTH);
              console.log(pictureDate);
              console.log(MONTH);
              if (pictureDate >= lastMonth) {

                console.log(1);

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
              };
            });
            break;

          case 'filter-discussed':
            filteredPictures = filteredPictures.sort(function(a, b) {
              a = parseInt(a.comments);
              b = parseInt(b.comments);

              if (a.comments > b.comments) {
                return -1;
              }

              if (a.comments < b.comments) {
                return 1;
              }

              if (a.comments === b.comments) {
                return 0;
              }
            });
            break;

          default:
            pictures.slice(0);
                break;
        }

        return filteredPictures;
      }

      function initFilters() {
        var filterForm = document.querySelector('.filters'),
            filterElement = filterForm['filter'];

        for (var i = 0, l = filterElement.length; i < l; i++) {
          filterElement[i].onclick = function(evt) {
            var clickedFilter = evt.currentTarget;
            setActiveFilter(clickedFilter.id);

            clickedFilter.checked;

            console.log(clickedFilter);
          }
        }
      }


      function setActiveFilter(filterID) {
        var filteredPictures = filterPictures(pictures, filterID);

        console.log(filteredPictures);

        renderPictures(filteredPictures);
      }

      initFilters();

      loadPictures(function(loadedPictures) {
        pictures = loadedPictures;

        setActiveFilter('filter-popular');
      });
		}
	};

	(function() {
		Template.init();
	})();
})();
