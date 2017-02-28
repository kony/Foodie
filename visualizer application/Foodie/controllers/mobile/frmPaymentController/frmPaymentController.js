define({ 
  /***************************************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to Home form.
   ***************************************************************************************/
   navigateTofrmHome: function() {
        try {
          alert("order placed successfully.");
            var navigateObj = new kony.mvc.Navigation("frmHome");
            navigateObj.navigate();
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
    },

 });