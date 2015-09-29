(function() {
	var pictureTemp = document.querySelector('#picture-template'),
		pictureContainer = document.querySelector('.pictures');

	pictures.forEach(function(picture, i) {
		var newPictureElem = pictureTemp.content.children[0].cloneNode(true);

		newPictureElem.querySelector('.picture-comments').textContent = picture['comments'];
		newPictureElem.querySelector('.picture-likes').textContent = picture['likes'];
		newPictureElem.querySelector('.picture-likes').setAttribute = picture['url'];
		

		console.log(picture, newPictureElem);
	});
})();