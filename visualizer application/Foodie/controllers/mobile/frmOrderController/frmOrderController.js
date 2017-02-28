define({ 
  /***************************************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate to Home form.
   ***************************************************************************************/
 navigateTofrmHome: function() {
        try {
            var navigateObj = new kony.mvc.Navigation("frmHome");
            navigateObj.navigate();
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
    },
  /***************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To set the request url config when the user navigate to it.
   ***************************************************************************************/
  onNavigate:function(restaurantObj){
    if(restaurantObj===null || restaurantObj=== undefined ) 
      return;
    this.resObj=restaurantObj;
    var order_url=restaurantObj["order_url"];
    this.view.browser.requestURLConfig={"URL":order_url};
  },
  /***************************************************************************************
   *	Name	:	makePayment
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to frmPayment.
   ***************************************************************************************/
  makePayment:function(){
    try {
      var navigateObj = new kony.mvc.Navigation("frmPayment");
      navigateObj.navigate();
    }catch (exp) {
     kony.print(JSON.stringify(exp));
    }
  }

 });