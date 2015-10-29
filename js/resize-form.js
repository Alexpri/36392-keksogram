(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
/*      resizeX = resizeForm["resize-x"],
      resizeY = resizeForm["resize-y"],
      resizeSize = resizeForm["resize-size"];*/

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  window.addEventListener('resizerchange', function(){

    console.log(resizer._image.width, resizer._image.height);

    if (resizer.getConstraint().side > resizer._image.width || resizer.getConstraint().side < 0) {
      resizer.setConstraint(0, 0, resizer._image.width);
      console.log(1);
    }

    if (resizer.getConstraint().x > resizer._image.width || resizer.getConstraint().x < 0) {
      resizer.setConstraint(resizer._image.height - resizer.getConstraint().x, resizer.getConstraint().y, resizer.getConstraint().side);
      console.log(2);
    }

    if (resizer.getConstraint().y > resizer._image.height || resizer.getConstraint().y < 0) {
      resizer.setConstraint(resizer.getConstraint().x, resizer._image.height - resizer.getConstraint().y, resizer.getConstraint().side);
      console.log(3);
    }

  })



  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    filterForm.elements['filter-image-src'] = resizer.exportImage().src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
