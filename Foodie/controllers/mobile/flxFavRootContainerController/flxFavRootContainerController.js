define({ 
  /***************************************************************************************
   *	Name	:	removeRestaurant
   *	Author	:	Kony
   *	Purpose	:	To remove the restaurant from the favourite list.
   ***************************************************************************************/
	removeRestaurant:function(widget, context){
		kony.print("widget :"+JSON.stringify(widget));
  		kony.print("context :"+JSON.stringify(context));
      	this.executeOnParent("removeFavouriteRestaurant",context);
	}
 });