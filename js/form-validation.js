(function () {

    var validation = {

        init : function(image){
            var self = this;
            var formResize = document.forms['upload-resize'];
            var filterForm = document.forms['upload-filter'];

            self.validation();

            formResize.onsubmit = function(evt) {
                var x = parseInt(formResize["resize-x"].value, 10);
                var y = parseInt(formResize["resize-y"].value, 10);
                var size = parseInt(formResize["resize-size"].value, 10);

                if (
                    0 <= x && 0 <= y && 0 <= size &&
                    x + size <= image.width &&
                    y + size <= image.height
                ) {
                    evt.preventDefault();
                    filterForm.elements['filter-image-src'] = image.src;

                    formResize.classList.add('invisible');
                    filterForm.classList.remove('invisible');
                    self.cookies();
                } else {
                    evt.preventDefault();
                }
            };
        },

        validation: function () {
            var formResize = document.forms["upload-resize"],
                resizeX = formResize["resize-x"],
                resizeY = formResize["resize-y"],
                resizeSize = formResize["resize-size"],
                inputsStep2 =  document.querySelectorAll(".upload-resize-controls input");
            var image = formResize.querySelector('.resize-image-preview');

            var MAX_PHOTO_SIDE = parseInt(Math.min(image.width, image.height));
            var MIN_PHOTO_SIDE = 1;
            var MIN_INPUT_RESIZE = 0;

            resizeSize.min = MIN_PHOTO_SIDE;
            resizeSize.max = MAX_PHOTO_SIDE;
            resizeX.min = MIN_INPUT_RESIZE;
            resizeY.min = MIN_INPUT_RESIZE;

            resizeSize.value = MAX_PHOTO_SIDE;
            resizeY.value = MIN_INPUT_RESIZE;
            resizeX.value = MIN_INPUT_RESIZE;

            resizeX.onchange = function () {
                resizeSize.value = MAX_PHOTO_SIDE - parseInt(resizeX.value, 10);
            };

            resizeY.onchange = function () {
                resizeSize.value = MAX_PHOTO_SIDE - parseInt(resizeY.value, 10);
            };

            resizeSize.onchange = function () {
                resizeX.value = MAX_PHOTO_SIDE - parseInt(resizeSize.value, 10);
                resizeY.value = MAX_PHOTO_SIDE - parseInt(resizeSize.value, 10);
            }
        },

        cookies: function() {
            var filterForm = document.forms['upload-filter'],
                filterInput = filterForm['upload-filter'];

            var filterMap;

            function setFilter(image, element) {
                if (!filterMap) {
                    filterMap = {
                        'none': 'filter-none',
                        'chrome': 'filter-chrome',
                        'sepia': 'filter-sepia'
                    };
                }

                console.log(image);
                image.className = 'filter-image-preview' + ' ' + filterMap[element.value];
            };

            var restoreFormValueFromCookies = function(form) {
                var name = 'upload-filter';
                var filterEls = filterForm.elements[name];
                var value = docCookies.getItem(name);
                var image = document.forms["upload-filter"].querySelector('.filter-image-preview');

                for (var i = 0; i < filterEls.length; i++) {

                    var element = filterEls[i];
                    if (value === element.value) {
                        setFilter(image, element);

                        element.checked = true;
                    }
                }
            };

            filterForm.onsubmit = function(evt) {

                evt.preventDefault();
                var name = 'upload-filter';
                var filterEls = filterForm.elements[name];
                for (var i = 0; i < filterEls.length; i++) {
                    var element = filterEls[i];

                    if (element.checked) {
                        docCookies.setItem(name, element.value);
                    }
                }

                filterForm.submit();
            };

            restoreFormValueFromCookies(filterForm);
        }

    };






    (function() {
        var formResize = document.forms["upload-resize"],
            image = formResize.querySelector('.resize-image-preview');

        image.onload = function() {
            validation.init(image);
        };
    })();

})();
