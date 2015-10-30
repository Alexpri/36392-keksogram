(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
      resizeX = resizeForm["resize-x"],
      resizeY = resizeForm["resize-y"],
      resizeSize = resizeForm["resize-size"];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  //Записываем координаты рамки в форму

  window.addEventListener('imageload', function(){
    var x = resizer.getConstraint().x,
        y = resizer.getConstraint().y,
      side = resizer.getConstraint().side;

    console.log(x, y, side);


    resizeX.value = x;
    resizeY.value = y;
    resizeSize.value = side;
  });

  window.addEventListener('resizerchange', function(){
    var x = resizer.getConstraint().x,
        y = resizer.getConstraint().y,
     side = resizer.getConstraint().side,
      photoWidth = resizer._image.width,
      photoHeight = resizer._image.height;


    //Ось Х

    if (x < 0) {
      x = 0;
      resizer.setConstraint(x, y, side);
    }

    if ((x + side) > photoWidth) {
      x = photoWidth - side;
      resizer.setConstraint(x, y, side);
    }

    //Ось Y

    if (y < 0) {
      y = 0;
      resizer.setConstraint(x, y, side);
    }

    if ((y + side) > photoHeight) {
      y = photoHeight - side;
      resizer.setConstraint(x, y, side);
    }

    if (photoWidth < side) {
      side = photoWidth;
      resizer.setConstraint(x, y, side);
    }

    if (photoHeight < side) {
      side = photoHeight;
      resizer.setConstraint(x, y, side);
    }

    console.log(x, y, side);
  });



  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    filterForm.elements['filter-image-src'].src = resizer.exportImage().src;
    document.querySelector('.filter-image-preview').src = resizer.exportImage().src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
