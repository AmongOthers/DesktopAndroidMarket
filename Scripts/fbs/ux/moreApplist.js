define(['jquery','ux/Paging','ux/jquery.common','ux/applistcommon'],function($,Paging,common,applistcommon){
	moreApplist={
		appinit:function(){
			this.appParam={
				modelId:303,
				appTemplateType:1,
				isInterfere:true,
				board:'default',
				apptype:'hot', //index,hot,baidu
				pageSize:35,
				searchName:''
			};
			
		    this.pageParam={				 //分页参数
				dataListId:"appList",
				pageListId:"PagingBar"
			};
			this.appParam.apptype=this.getQueryString('apptype');
			if (!this.appParam.apptype) {
			    this.appParam.apptype = 'hot';
			}
			this.createPaging(this.pageParam);//创建分页
			this.platForm(); //处理机型和排序方式
			this.dealFNavi();//处理一级菜单
			//this.loadSNavi(); //加载并处理二级菜单
			this.searchForName();//应用的按名搜索
			//初始化页面数据
			this.appParam.modelId=parseInt(this.getQueryString('modelId'));
			this.appParam.appTemplateType=parseInt(this.getQueryString('appTemplateType'));
			this.appParam.searchName=this.getQueryString('searchName');
			if(this.appParam.searchName){
				$('#appName').val(this.appParam.searchName);
			}
			if(this.appParam.apptype=='hot'){
				$('#platForm').find('li[modelId='+this.appParam.modelId+']').addClass('visited');
				var naviItem=$('#appMainNavi').find('li').children('a[appTemplateType='+this.appParam.appTemplateType+']').eq(0);
				naviItem.addClass('on');
			}
			this.typeSelect();//判断类型加载app数据
			
		},
		platForm:function(){
			var platObj=$('#platForm').find('li[name="plat"]');
				platObj.each(function(){
					
					$(this).click(function(){
						 platObj.removeClass('visited');
						 $(this).addClass('visited');
						 moreApplist.appParam.modelId=parseInt($(this).attr('modelId'));
						 if(moreApplist.appParam.searchName!=''){
							moreApplist.appParam.searchName='';
						 }
						 moreApplist.typeSelect();
				    });
					
			    });
			var appKey=$('#appKey').find('li').find('a');
			appKey.each(function(){
					$(this).hover(function(){
						 if(!$(this).hasClass('pitch')){
							$(this).addClass('hover');
						 }
					},function(){
						if(!$(this).hasClass('pitch')){
							$(this).removeClass('hover');
						}
					});
					
				$(this).click(function(){
					if(!$(this).hasClass('pitch')){
						appKey.removeClass('pitch');
						$(this).addClass('pitch');
						if($(this).hasClass('hover')) $(this).removeClass('hover');
					}
					moreApplist.appParam.board=$(this).attr('board');
					moreApplist.typeSelect();
				});
			});
			
		},
		dealFNavi:function(){
			var obj=this;
			//一级菜单处理
			var naviList=$('#appMainNavi').find('li').find('a');
			naviList.each(function(){
				$(this).hover(function(){
					 if(!$(this).hasClass('on')){
						$(this).addClass('hover');
					 }
				},function(){
					if(!$(this).hasClass('on')){
						$(this).removeClass('hover');
					}
				});
				
				$(this).bind('click',function(){
					if(!$(this).hasClass('on')){
						$('#appMainNavi').find('li').find('a').removeClass('on');
						$(this).addClass('on');
						if($(this).hasClass('hover')) $(this).removeClass('hover');
						$('.app_sub_navi').each(function(){
							if($(this).css("display")!=='none'){
								$(this).slideUp("200");
							}
						});
						$(this).parent().find('.app_sub_navi').slideDown("200");
					
					}else{
						if($(this).siblings('.app_sub_navi').css('display')=='none'){
							$(this).siblings('.app_sub_navi').slideDown("200");
						}else{
							$(this).siblings('.app_sub_navi').slideUp("200");
						}
					}
					$('.app_sub_navi').find('p').removeClass('subpitch');
					moreApplist.appParam.apptype=$(this).attr('apptype');
					if(moreApplist.appParam.apptype=='hot'){
						moreApplist.appParam.appTemplateType=$(this).attr('appTemplateType');
					}
					if(moreApplist.appParam.searchName!=''){
						moreApplist.appParam.searchName='';
					}
					moreApplist.typeSelect();
				});
				
				
			});
		},
		loadSNavi:function(){
			var obj=this;
			//热门应用
			$.ajax({
			   type: "GET",
			   url: common.apiroot+"api/app/templateTree",
			   dataType:"jsonp",
			   jsonp:"callback",
			   success: function(result){
					if(result.children.length>0){
						//加载二级菜单
						var gameNavi=result.children[0].children;
						var appNavi=result.children[1].children;
						var gameNaviList=[];
						var appNaviList=[];
						for(var i=0;i<gameNavi.length;i++){
							gameNaviList.push('<p appTemplateType='+gameNavi[i].id+'><span class="point">.</span>'+gameNavi[i].text+'</p>');
							
						}
						$('#hotGame').find('div').append(gameNaviList.join(''));
						for(var i=0;i<appNavi.length;i++){
							appNaviList.push('<p appTemplateType='+appNavi[i].id+'><span class="point">.</span>'+appNavi[i].text+'</p>');
							
						}
						$('#hotApp').find('div').append(appNaviList.join(''));
						
						//二级菜单初始化
						if(obj.appParam.apptype=='hot'){
							var naviItem=$('#appMainNavi').find('li').children('a[appTemplateType='+obj.appParam.appTemplateType+']').eq(0);
							naviItem.parent().find('.app_sub_navi').slideDown("200");
						}
						//二级菜单处理
						$('.app_sub_navi').find('p').each(function(){
							$(this).hover(function(){
								if($(this).hasClass('subpitch')) return;
								$(this).addClass('hover');
							},function(){
								if($(this).hasClass('subpitch')) return;
								$(this).removeClass('hover');
							});
							
							$(this).click(function(){
								if(!$(this).hasClass('subpitch')){
									$(this).parent().parent().find('.app_sub_navi').find('p').removeClass('subpitch');
									$(this).addClass('subpitch');
									if($(this).hasClass('hover')) $(this).removeClass('hover');
								}
								
								if(moreApplist.appParam.apptype=='hot'){
									moreApplist.appParam.appTemplateType=$(this).attr('appTemplateType');
								}
								if(moreApplist.appParam.searchName!=''){
									moreApplist.appParam.searchName='';
								}
								moreApplist.typeSelect();
							});
					
						});
						
					}
			   }
			});
			
		},
		searchForName:function(){
			$('#searchForName').click(function(){
				if($('#appName').val()!=''){
					moreApplist.appParam.searchName=$('#appName').val();
					moreApplist.typeSelect();
				}else{
					common.tipLayer('请输入要搜索的应用名称');
				}
				
			});
			//$('#appName').blur(function(){
			//	if($(this).val()==''){
			//		$(this).val('搜索精品应用');
			//	}
				
			//});
			//$('#appName').focus(function(){
			//	if($(this).val()=='搜索精品应用'){
			//		$(this).val('');
			//	}
			//});
			$('#appName').keydown(function(event){
				if(event.keyCode == 13){
                        $('#searchForName').click();
				}
			});
			
		},
		typeSelect:function(){
			
			if(moreApplist.appParam.apptype=='appindex'){
				window.location.href='apps.html'; //跳转到应用首页
			}
			if(moreApplist.appParam.apptype=='hot'){ //热门应用和热门游戏
				var totaldata={
				    apptype:moreApplist.appParam.apptype,
					url: common.apiroot+"api/app",
					data:{
						modelId:moreApplist.appParam.modelId,
						isInterfere:moreApplist.appParam.isInterfere,
						board:moreApplist.appParam.board,
						pageSize:moreApplist.appParam.pageSize,
						offSet:0,
						orderBy:"hot",
						version:'4S',
						searchName:moreApplist.appParam.searchName
					}
				}
				if(moreApplist.appParam.appTemplateType){
					totaldata.data.appTemplateType=moreApplist.appParam.appTemplateType;
				}
				
				moreApplist.paging.loadDataList(1,totaldata);
				
				//如果按名字搜索，搜索过后清空
				/*
				if(moreApplist.appParam.searchName!=''){
					//totaldata.data=$.extend({},totaldata.data,{searchName:moreApplist.appParam.searchName});
					moreApplist.appParam.searchName='';
				}
				*/
								
			}
		},
		getQueryString:function(name) { //获取url参数
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},
		createPaging:function(pageParam){
			this.paging=new Paging(pageParam); 
			
			this.paging.displayData=function(apptype,result){ //处理结果数据
				common.removeLoading();
				var obj=this;
				if(result.list.length>0){
					if(apptype=='hot'){
						//热门应用和热门游戏
						var appliText='';
						obj.pageCount=result.pageNum;
						var hotAppList=[];
						for(var i=0;i<result.list.length;i++){
							var  appLi='<li>'+
												'<img name="proDetail" src="'+common.imgroot+result.list[i].url+'" dlId='+result.list[i].id+'>'+
												'<p><span class="app-name">'+(result.list[i].name.length>18?result.list[i].name.substring(0,18)+'...':result.list[i].name)+'</span><span class="app-downloads"><em>'+result.list[i].dlTime+'</em>次</span></p>'+
												'<span class="downloadbutton" dlId=' + result.list[i].id+ ' dlUrl=' + common.imgroot + encodeURI(result.list[i].dlUrl) + '></span>'+
										'</li>';
							hotAppList.push(appLi);
							if((i+1)%9==0&&i!==0){
								appliText+=('<ul class="key-applist" >'+hotAppList.join('')+'</ul>');
								hotAppList=[];
							}
						}
						if(hotAppList.length>0){
							appliText+=('<ul class="key-applist" >'+hotAppList.join('')+'</ul>');
						}
						$('#'+obj.dataListId).empty().append(appliText);
						 $('#'+obj.dataListId).find('li').each(function(){
						 	$(this).hover(function(){
						 		$(this).addClass('hover');
						 	},function(){
						 			$(this).removeClass('hover');
						 	});
						 });
						$('#'+obj.dataListId).find('.downloadbutton').each(function(){
							$(this).click(function(){
                                obj.downloadURL($(this).attr('dlUrl'));
							});
						});
						 //$('#'+obj.dataListId).find('img[name="proDetail"]').each(function(){
						 //	$(this).click(function(){
						 //		applistcommon.productDet($(this).attr('dlId'),moreApplist.appParam.modelId);
						 //	});
						 //});
					}
					
				}else{
					$('#'+obj.pageListId).empty();
					$('#'+obj.dataListId).empty().append('<P style="width:100%; float;left;  background:none; font-size:14px; color:#666; margin-top:30px; text-indent:30px;">暂时没有该类型应用</P>');		
				}
			}
			
			this.paging.downloadURL = function downloadURL(url) {
			    var hiddenIFrameID = 'hiddenDownloader',
                    iframe = document.getElementById(hiddenIFrameID);
			    if (iframe === null) {
			        iframe = document.createElement('iframe');
			        iframe.id = hiddenIFrameID;
			        iframe.style.display = 'none';
			        document.body.appendChild(iframe);
			    }
			    iframe.src = url;
			}
			
			//this.paging.downloadApp = function (paramId) {
			//    console.log(paramId);
			//}
			//this.paging.downloadApp=function(paramId){
			////软件下载
			//	common.loading();//loading
			//	$.ajax({
			//	   type: "GET",
			//	   data:"param=T:"+paramId+"&modelId="+moreApplist.appParam.modelId,
			//	   url: common.apiroot+"api/app/matching",
			//	   dataType:"jsonp",
			//	   jsonp:"callback",
			//	   success: function(result){
			//		  window.location.href=common.imgroot+result.list[0].url;
			//		  common.removeLoading();
			//	   },
			//	   error:function(){
			//		  common.removeLoading();
			//	   }
			//	});
			//}
			// this.paging.productDet=function(paramId){
			// 	var obj=this;
			// 	common.loading();//loading
			// 	$.ajax({
			// 	   type: "GET",
			// 	   data:'id='+paramId,
			// 	   url: common.apiroot+"api/app/intro",
			// 	   dataType:"jsonp",
			// 	   jsonp:"callback",
			// 	   async:false,
			// 	   success: function(result){
			// 			common.removeLoading();
			// 			var str='<div class="pro-masker" id="proMasker"></div>'+
			// 					'<div class="product-details">'+
			// 						'<div class="pd-header">应用简介</div>'+
			// 						'<div class="pd-con">'+
			// 							'<div class="base-msg">'+
			// 								'<img src="'+common.imgroot+result.url+'" class="pic">'+
			// 								'<div class="base-text">'+
			// 									'<p class="pro-name">'+result.name+'</p>'+
			// 									'<p class="pro-gray"><span class="orange">'+result.fileSize+'</span>&nbsp;&nbsp;<span class="orange">'+(result.stateDate!=null?common.timeFormat(result.stateDate,true,'-'):'')+'</span>更新</p>'+
			// 									'<p class="pro-gray">'+(result.desc!=null?(result.desc.length>50?result.desc.substring(0,50)+'...	':result.desc):'')+'</p>'+
			// 								'</div>'+
			// 								'<div class="pro-dl">'+
			// 									'<div class="qrcode"><img src="" id="qrcodeImg"></div>'+
			// 									'<div class="dl-times"><button class="dl-btn" dlId='+paramId+' name="dlBtn" ></button>'+
			// 									'<p class="pro-gray"><span class="orange">'+result.dlTime+'</span>次下载</p></div>'+
			// 								'</div>'+
			// 							'</div>'+
			// 							'<div class="pro-tab">'+
			// 								'<span>相关应用</span>'+
			// 							'</div>'+
			// 							'<div class="pro-tab-con" id="relatedApp">'+
			// 							'</div>'+
			// 							'<div class="pro-tab">'+
			// 								'<span>应用简介</span>'+
			// 							'</div>'+
			// 							'<div class="pro-tab-con delcon">'+result.content+'</div>'+
			// 						'</div>'+
			// 						'<div><span class="pd-close" id="pdClose"></span></div>'+
			// 					'</div>';
						
			// 			$('body').append(str);
			// 			$('#proMasker').width($(window).width());
			// 			$('#proMasker').height($(window).height());
			// 			$('.pd-con').height($(window).height()-100);
			// 			$('.product-details').css('left',($(window).width()-750)/2);
			// 			$('.product-details').css('top',($(window).height()-$('.product-details').height())/2);
			// 			var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
			// 			if (isIe6){
			// 				//IE6兼容
			// 				$('.product-details').css('top',$(window).scrollTop()+($(window).height()-$('.product-details').height())/2);
			// 				$('.product-details').css('left',$(window).scrollLeft()+($(window).width()-750)/2);
			// 				$('#proMasker').css('top',$(window).scrollTop());
			// 				$('#proMasker').css('left',$(window).scrollLeft());
			// 				$(window).scroll(function(){
			// 					$('.product-details').css('top',$(window).scrollTop()+($(window).height()-$('.product-details').height())/2);
			// 					$('.product-details').css('left',$(window).scrollLeft()+($(window).width()-750)/2);
			// 					$('#proMasker').css('top',$(window).scrollTop());
			// 					$('#proMasker').css('left',$(window).scrollLeft());
			// 				});
							
			// 			}
						
			// 			$('#pdClose').hover(function(){
			// 				$(this).removeClass('pd-close').addClass('pd-close-hover');
			// 			},function(){
			// 				$(this).removeClass('pd-close-hover').addClass('pd-close');
			// 			});
			// 			$('#pdClose').click(function(){
			// 				$('#proMasker').remove();
			// 				$('.product-details').remove();
			// 			});
						
			// 			if(result.interrelated.length>0){
			// 				var relatedStr='<ul class="related-app">';
			// 				for(var i=0; i<result.interrelated.length;i++){
			// 					relatedStr+='<li>'+
			// 									'<img src="'+common.imgroot+result.interrelated[i].url+'">'+
			// 									'<p><span class="bold">'+(result.interrelated[i].name.length>6?(result.interrelated[i].name.substring(0,6)+'...'):result.interrelated[i].name)+'</span></p>'+
			// 									'<p name="dl">下载：<span class="orange">'+result.interrelated[i].dlTime+'</span></p>'+
			// 									'<button class="ra-dl-btn" name="dlBtn" dlId='+result.interrelated[i].id+'></button>'
			// 								'</li>';
			// 				}
			// 				relatedStr+='</ul>';				
			// 				$('#relatedApp').html(relatedStr);			
			// 			}else{
			// 				$('#relatedApp').html('<p style="line-height:30px;">暂无相关应用</P>');	
			// 			}
						
			// 			$('#relatedApp').find('li').each(function(){
			// 				$(this).hover(function(){
			// 					$(this).find('p[name="dl"]').hide();
			// 					$(this).find('.ra-dl-btn').show();
			// 				},function(){
			// 					$(this).find('p[name="dl"]').show();
			// 					$(this).find('.ra-dl-btn').hide();
			// 				});
			// 			});
						
			// 			$('.product-details').find('button[name="dlBtn"]').each(function(){
			// 				$(this).click(function(){
			// 					obj.downloadApp($(this).attr('dlId'));
			// 				});
			// 			});
						
			// 			$('#qrcodeImg').attr('src',common.apiroot+"api/app/qrlink?appTemplateId="+paramId+"&modelId="+moreApplist.appParam.modelId);
			// 			/*
			// 			$.ajax({
			// 				   type: "GET",
			// 				   data:"param=T:"+paramId+"&modelId="+moreApplist.appParam.modelId,
			// 				   url: common.apiroot+"api/app/matching",
			// 				   dataType:"jsonp",
			// 				   jsonp:"callback",
			// 				   async:false,
			// 				   success: function(result){
			// 						$('#qrcodeImg').attr('src',common.apiroot+"api/app/baidu/qrlink?qrlink="+result.list[0].appid);
			// 				   },
			// 				   error:function(){
									
			// 				   }
			// 			});
			// 			*/
						
			// 	   },
			// 	   error:function(){
			// 			common.removeLoading();
			// 	   }
			// 	});
				
				
			// }
			
		}
	
			
	};
	
	
	return moreApplist;

});