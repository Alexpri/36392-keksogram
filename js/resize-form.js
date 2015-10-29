(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

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

    if (resizer.getConstraint().side > resizer._container.width || resizer.getConstraint().side < 0) {
      resizer.setConstraint(0, 0, resizer._container.width);
    }

    if (resizer.getConstraint().x > resizer._container.width || resizer.getConstraint().x < 0) {
      resizer.setConstraint(0, 0, resizer._container.width);
    }

    if (resizer.getConstraint().y > resizer._container.width || resizer.getConstraint().y < 0) {
      resizer.setConstraint(0, 0, resizer._container.width);
    }
  })

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    console.log(resizer.exportImage().src);
    filterForm.elements['filter-image-src'] = resizer.exportImage().src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
