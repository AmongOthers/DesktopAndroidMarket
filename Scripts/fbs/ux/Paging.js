define(['jquery','ux/jquery.common'],function($,common){
	var Paging=function(pageParam){
		this.pageCount=0;//页码数
		this.offSet=0;
		this.pageListId=pageParam.pageListId!=null?pageParam.pageListId:null;//分页栏的id
		this.dataListId=pageParam.dataListId!=null?pageParam.dataListId:null;//数据列表的id
		this.totaldata=null; //请求的参数
	}
	Paging.prototype.getPageList=function(currentInd){ //生成分页菜单
		var obj=this;
		var startInd=1;
		var endInd=1;
		if(currentInd<5){
			startInd=1;
			if(this.pageCount<5){
				endInd=this.pageCount;
			}else{
				endInd=5;
		
			}
		}else  if(currentInd>=5&&this.pageCount-currentInd<4){
			startInd=this.pageCount-4;
			endInd=this.pageCount;
		}else{
			startInd=currentInd-2;
			endInd=currentInd+2;
		}
		var pageList=[];
		if(startInd>1){
			pageList.push('<a href="javascript:void(0)" pageInd=1>1</a>');
			if(startInd>2){
				pageList.push('<span>...</span>');
			}
		}
		for(var i=startInd;i<=endInd;i++){
			if(i==currentInd){
				pageList.push('<b pageInd='+i+'>'+i+'</b>');
			}else{
				pageList.push('<a href="javascript:void(0)" pageInd='+i+'>'+i+'</a>');
			}
		}
		if(endInd<this.pageCount){
			if(this.pageCount-endInd>1){
				pageList.push('<span>...</span>');
				pageList.push('<a href="javascript:void(0)"  pageInd='+this.pageCount+'>'+this.pageCount+'</a>');
			}else{
				pageList.push('<a href="javascript:void(0)" pageInd='+this.pageCount+'>'+this.pageCount+'</a>');
			}
		
		}
		$('#'+this.pageListId).html(pageList.join(''));
		$('#'+this.pageListId).find('a').each(function(){
			$(this).click(function(){
				var currentInd=parseInt($(this).attr('pageInd'));
				obj.totaldata.data.offSet=(currentInd-1)*obj.totaldata.data.pageSize;
				obj.loadDataList(currentInd,obj.totaldata);
				return false;
			});
		});
		
	}
	Paging.prototype.loadDataList=function(currentInd,totaldata){ //加载数据
	
		var obj=this;
		if(totaldata){
			this.totaldata=totaldata;
		}
		
		common.loading();
		if(obj.dataListId!=null){
			$('#'+obj.dataListId).empty();
		}
		if(obj.pageListId!=null){
			$('#'+obj.pageListId).empty();
		}
		$.ajax({
			   type: "GET",
			   data:totaldata.data,
			   url:totaldata.url,
			   dataType:"jsonp",
			   jsonp:"callback",
			   success: function(result){
					obj.displayData(obj.totaldata.apptype,result);
					if((result.list!=null&&result.list.length>0)||(result.apps!=null&&result.apps.length>0)){
						obj.getPageList(currentInd);
					}
			   },
			   error:function(){
					common.removeLoading();
			   }
			});
	}
	Paging.prototype.displayData=function(apptype,currentInd,result){}; //展示数据
	Paging.prototype.downloadApp=function(paramId){};
	Paging.prototype.productDet=function(paramId){};
	

	return Paging;
});
















