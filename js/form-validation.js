(function () {

    var validation = {

        init : function(){
            var self = this;
            self.validation();
            self.cookies();
        },

        validation: function () {
            var formResize = document.forms["upload-resize"],
                resizeX = formResize["resize-x"],
                resizeY = formResize["resize-y"],
                resizeSize = formResize["resize-size"],
                inputsStep2 =  document.querySelectorAll(".upload-resize-controls input");

            var MAX_PHOTO_SIDE = 569;
            var MIN_PHOTO_SIDE = 0;
            var MIN_INPUT_RESIZE = 0;

            resizeSize.min = MIN_PHOTO_SIDE;
            resizeSize.max = MAX_PHOTO_SIDE;
            resizeSize.value = MAX_PHOTO_SIDE;
            resizeX.min = MIN_INPUT_RESIZE;
            resizeY.min = MIN_INPUT_RESIZE;
            resizeY.value = MIN_INPUT_RESIZE;
            resizeX.value = MIN_INPUT_RESIZE;

            var inputSize = function (field) {

                if (field == resizeX) {

                    field.onchange = function () {
                       /* var x = parseInt(resizeY.value);
                        var Size = parseInt(resizeSize.value);*/

                        if (parseInt(field.value, 10) < 0 || parseInt(field.value, 10) > MAX_PHOTO_SIDE) {
                            field.value = 0;
                            resizeX.value = 0;
                        }

                        var y = parseInt(field.value, 10);
                        var x = parseInt(resizeX.value, 10);
                        var size = MAX_PHOTO_SIDE - parseInt(field.value, 10);

                            resizeY.value = y;
                            resizeSize.value = size;
                            resizer.setConstraint(x, y, size);
                    }
                } else if (field == resizeY) {
                    field.onchange = function () {

                        if (parseInt(field.value, 10) < 0 || parseInt(field.value, 10) > MAX_PHOTO_SIDE) {
                            field.value = 0;
                            resizeY.value = 0;
                        }

                        var x = parseInt(field.value, 10);
                        var y = parseInt(resizeY.value, 10);
                        var size = MAX_PHOTO_SIDE - parseInt(field.value, 10);

                            resizeX.value = x;
                            resizeSize.value = size;
                            resizer.setConstraint(x, y, size);
                    }
                }  else if (field == resizeSize) {
                    field.onchange = function () {

                        if (parseInt(resizeSize.value, 10) < 0 || parseInt(resizeSize.value, 10) > MAX_PHOTO_SIDE) {
                            resizeSize.value = MAX_PHOTO_SIDE;
                        }

                        var y = MAX_PHOTO_SIDE - parseInt(resizeSize.value, 10);
                        var x = MAX_PHOTO_SIDE - parseInt(resizeSize.value, 10);
                        var size = parseInt(field.value, 10);

                            resizeY.value = y;
                            resizeX.value = x;
                            resizeSize.value = size;
                            resizer.setConstraint(x, y, size);
                    }
                }
            };

            inputSize(resizeX);
            inputSize(resizeY);
            inputSize(resizeSize);
        },

        cookies: function() {
                var filterForm = document.forms['upload-filter'],
                    filterInput = filterForm['upload-filter'];

                var restoreFormValueFromCookies = function(form) {
                    var element;

                    for (var i = 0; i < filterForm.elements['upload-filter'].length; i++) {
                         element = filterForm.elements['upload-filter'][i];

                        if (docCookies.hasItem(element.name)) {
                            element.checked = docCookies.getItem(element.checked);
                        }
                    }
                }

            filterForm.addEventListener('submit', function(evt) {
                evt.preventDefault();

                 var element;

                for (var i = 0; i < filterForm.elements['upload-filter'].length; i++) {
                        element = filterForm.elements['upload-filter'][i];
                        docCookies.setItem(element.name, element.checked);
                    }


                    filterForm.submit();
                });

          restoreFormValueFromCookies(filterForm);
        }

    };


    (function() {
        validation.init();
    })();

})();
