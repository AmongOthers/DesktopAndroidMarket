require(['jquery','ux/moreApplist','ux/jquery.common'],function($,moreApplist,common){
	 common.loginState(false);
	 moreApplist.appinit();
	common.getQRCode();//二维码
});
