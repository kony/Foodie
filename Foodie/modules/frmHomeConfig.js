var frmHomeConfig = {
    "formid": "frmHome",
    "frmHome": {
        "entity": "NearByRestaurant",
        "objectServiceName": "NearByRestaurant",
        "objectServiceOptions": {
            "access": "online"
        }
    },
    "segRestaurant": {
        "fieldprops": {
            "widgettype": "Segment",
            "entity": "NearByRestaurant",
            "field": {
                "lblResName": {
                    "widgettype": "Label",
                    "entity": "NearByRestaurant",
                    "field": "name"
                },
                "imgResIcon": {
                    "widgettype": "Image2",
                    "entity": "NearByRestaurant",
                    "field": "thumb"
                },
                "lblRating": {
                    "widgettype": "Label",
                    "entity": "NearByRestaurant",
                    "field": "user_rating.aggregate_rating"
                },
                "lblCuisines": {
                    "widgettype": "Label",
                    "entity": "NearByRestaurant",
                    "field": "cuisines"
                }
            }
        }
    }
};