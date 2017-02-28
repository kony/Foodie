define({ 
 //Type your controller code here 
  resObj:{},
  oder_url:"",
  /****************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to home form.
   *****************************************************************/
   navigateTofrmHome: function() {
        try {
            var navigateObj = new kony.mvc.Navigation("frmHome");
            navigateObj.navigate();
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
    },
  /*******************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To initialize the widget of the form when user navigates to it.
   *******************************************************************************/
  onNavigate:function(restaurantObj){
    if(restaurantObj===null || restaurantObj=== undefined ) 
      return;
    this.resObj=restaurantObj;
    var menu_url=restaurantObj["menu_url"];
    this.view.browser.requestURLConfig={"URL":menu_url};
    if(restaurantObj["oder_url"]!==null&&restaurantObj["oder_url"]!==undefined){
      oder_url=(restaurantObj["oder_url"]).trim();
      if(oder_url!==""){
        this.view.btnOrder.setVisibility (true);
      }
    }
  },
  /****************************************************************
   *	Name	:	order
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to form order.
   *****************************************************************/
  order:function(){
    try {
      var navigateObj = new kony.mvc.Navigation("frmOrder");
      navigateObj.navigate();
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  }
 });