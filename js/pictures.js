(function() {

	var Template = {
		init: function(){
			self = this;

			self.filterHiddem();

			self.create();
		},

		filterHiddem: function(){
			var filters = document.querySelector('.filters');

			filters.classList.add('hidden');
		},

		create: function() {
			var pictureTemp = document.querySelector('#picture-template'),
				pictureContainer = document.querySelector('.pictures');

			var picturesFragment = document.createDocumentFragment();

			var IMAGE_FAILURE_TIMEOUT = 10000;
			var IMAGE_WIDTH = 182;
			var IMAGE_HEIGHT = 182;

			pictures.forEach(function(picture, i) {
				var newPictureElem = pictureTemp.content.children[0].cloneNode(true);

				newPictureElem.querySelector('.picture-comments').textContent = picture['comments'];
				newPictureElem.querySelector('.picture-likes').textContent = picture['likes'];


				if (picture['url']) {
					var pictureImage = new Image();

					pictureImage.src = picture['url'];

					var pictureImageOld = newPictureElem.querySelector('img');

					newPictureElem.querySelector('img').parentNode.replaceChild(pictureImage, pictureImageOld);


					var imageLoadTimeout = setTimeout(function() {
						newPictureElem.classList.add('picture-load-failure');
					}, IMAGE_FAILURE_TIMEOUT);

					pictureImage.onload = function() {
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
	};

	(function() {
		Template.init();
	})();
})();