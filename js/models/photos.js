
/*use strict*/

(function() {
  /**
   * @constructon
   * @param{Object} attributes
   * @param{Object} options
   */
    var PicturesCollection = Backbone.Collection.extend({
      model: PictureModel,
      url: 'data/pictures.json'
    });

    window.PicturesCollection = PicturesCollection;
})();