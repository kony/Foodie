/*
 * Model Extension class for NearByRestaurant object under NearByRestaurant object service group
 * Developer can add validation logic here
 *
 */

kony = kony || {};
kony.model = kony.model || {};
kony.model.NearByRestaurant = kony.model.NearByRestaurant || {};
/**
 * Creates a new Model Extension.
 * @class NearByRestaurantModelExtension
 * @param {Object} modelObj - Model.
 */
kony.model.NearByRestaurant.NearByRestaurantModelExtension = (function(){
    function NearByRestaurantModelExtension(modelObj) {
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
     * @memberof NearByRestaurantModelExtension#
     * @param {Object} dataObject - Data object.
     * @param {kony.model.ValidationType} validationType - Create/Update.
     * @returns {Boolean} - whether data is valid
     */
    NearByRestaurantModelExtension.prototype.validate = function(dataObject, validationType) {
        //TO-DO add custom validation
        return true;
    }
	
	return NearByRestaurantModelExtension;
})();