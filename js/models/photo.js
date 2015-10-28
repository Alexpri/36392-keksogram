/*use strict*/

(function() {
  /**
   * @constructon
   * @extend {Backbone.Model}
   */
  var PictureModel = Backbone.Model.extend({
    /**
     * @override
     */
    inititalize: function() {
      this.set('liked', false);
    },

    like: function() {
      this.set('liked',true);
    },

    dislike: function() {
      this.set('liked', false);
    }
  });

  window.PictureModel = PictureModel;
})();