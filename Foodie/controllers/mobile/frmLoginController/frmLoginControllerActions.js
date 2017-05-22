define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_Button_5ad572826c524e8a90870422b3df6054: function AS_Button_5ad572826c524e8a90870422b3df6054(eventobject) {
        var self = this;
        this.login(RESTAURANT_CONFIG.GOOGLE_PROVIDER);
        //this.login("ZGoogleOAuthv2");
    },
    AS_Button_h450671a6b5c4daa96b235898946ff85: function AS_Button_h450671a6b5c4daa96b235898946ff85(eventobject) {
        var self = this;
        this.login(RESTAURANT_CONFIG.FACEBOOK_PROVIDER);
    },
    AS_Form_d8994d136a0e456b8cca9c472d8d9014: function AS_Form_d8994d136a0e456b8cca9c472d8d9014(eventobject) {
        var self = this;
        setCallBacks();
    }
});