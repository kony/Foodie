/*
 * Model Extension class for Restaurant object under RestaurantDetails object service group
 * Developer can add validation logic here
 *
 */

kony = kony || {};
kony.model = kony.model || {};
kony.model.RestaurantDetails = kony.model.RestaurantDetails || {};
/**
 * Creates a new Model Extension.
 * @class RestaurantModelExtension
 * @param {Object} modelObj - Model.
 */
kony.model.RestaurantDetails.RestaurantModelExtension = (function(){
    function RestaurantModelExtension(modelObj) {
        var model = modelObj;

        this.getModel = function() {
            return model;
        };
        this.setModel = function(modelObj) {
            model = modelObj;
        };

    }
    
    /**
     * This is called from create and update methods of Model class.
     * This method is a handle to custom validation written by developer.
     * @memberof RestaurantModelExtension#
     * @param {Object} dataObject - Data object.
     * @param {kony.model.ValidationType} validationType - Create/Update.
     * @returns {Boolean} - whether data is valid
     */
    RestaurantModelExtension.prototype.validate = function(dataObject, validationType) {
        //TO-DO add custom validation
        return true;
    }
	
	return RestaurantModelExtension;
})();