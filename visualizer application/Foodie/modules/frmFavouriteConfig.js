var frmFavouriteConfig = {
    "formid": "frmFavourite",
    "frmFavourite": {
        "entity": "Restaurant",
        "objectServiceName": "FavouriteRestaurant",
        "objectServiceOptions": {
            "access": "online"
        }
    },
    "segRestaurant": {
        "fieldprops": {
            "widgettype": "Segment",
            "entity": "Restaurant",
            "field": {
                "lblResName": {
                    "widgettype": "Label",
                    "entity": "Restaurant",
                    "field": "name"
                },
                "imgResIcon": {
                    "widgettype": "Image2",
                    "entity": "Restaurant",
                    "field": "thumb"
                },
                "lblRating": {
                    "widgettype": "Label",
                    "entity": "Restaurant",
                    "field": "aggregate_rating"
                },
                "lblCuisines": {
                    "widgettype": "Label",
                    "entity": "Restaurant",
                    "field": "cuisines"
                }
            }
        }
    }
};