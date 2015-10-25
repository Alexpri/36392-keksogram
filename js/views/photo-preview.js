
/*use strict*/

(function() {
    /**
     * @constructon
     * @param{Object} attributes
     * @param{Object} options
     */
    var GalleryPicture = Backbone.View.extend({
        tagName: 'img',

        render: function() {
            console.log(this.model.get('url'));
            this.el.src = this.model.get('url');
        }
    });

    window.GalleryPicture = GalleryPicture;
})();