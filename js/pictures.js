(function() {
	var pictureTemp = document.querySelector('#picture-template'),
		pictureContainer = document.querySelector('.pictures');

	var picturesFragment = document.createDocumentFragment();

	var IMAGE_FAILURE_TIMEOUT = 10000;

	pictures.forEach(function(picture, i) {
		var newPictureElem = pictureTemp.content.children[0].cloneNode(true);

		newPictureElem.querySelector('.picture-comments').textContent = picture['comments'];
		newPictureElem.querySelector('.picture-likes').textContent = picture['likes'];


		if (picture['url']) {
			var pictureImage = new Image();

			pictureImage.src = picture['url'];

			var pictureImageOld = newPictureElem.querySelector('img');

			pictureImage.parentNode.replaceChild(newChild, oldChild)

			//console.log(pictureImage.src);
			newPictureElem.querySelector('img').src = pictureImage.src;

			var imageLoadTimeout = setTimeout(function() {
					newPictureElem.parentNode.classList.add('picture-load-failure');
				}, IMAGE_FAILURE_TIMEOUT);

			pictureImage.onload = function() {
				clearTimeout(imageLoadTimeout);
			};

			pictureImage.onerror = function() {
				newPictureElem.classList.add('picture-load-failure');
			};

		}
		
		picturesFragment.appendChild(newPictureElem);
	});

	pictureContainer.appendChild(picturesFragment);

})();