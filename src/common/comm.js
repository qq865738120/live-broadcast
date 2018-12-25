//获取连接地址后面的参数
function SKgetUrlParam(){var args={};var search=decodeURIComponent(location.search.substring(1));var arr=search.split('&');for(var i=0,len=arr.length;i<len;i++){var t=arr[i].split('=');args[t[0]]=t[1]}return args}
//获取当前不带参数的url
function SKgetUrlNoParam(){var url=window.location.href;var arr=url.split("?");if(arr.length>0){return url.split("?")[0]}return url}

//**微信相关**//
//判断是否为微信浏览器 @return Boolean
function SKisWeiXin(){var ua=window.navigator.userAgent.toLowerCase();if(ua.match(/MicroMessenger/i)=='micromessenger'){return true}else{return false}}
//隐藏微信菜单
function SKweixinHideMenu(sysCommon){
	var configUrl=sysCommon.jsticketUrl;
	var search=window.location.href.split('#')[0];
	$(function(){
		$.get(configUrl,{'url':search,'cmpyId':-1},function(result){
			//初始化js-sdk配置
			wx.config({
			    debug:false,
			    appId:result.appId,
			    timestamp:result.timestamp,
			    nonceStr:result.noncestr,
			    signature:result.signature,
			    jsApiList:[]
			})
			wx.ready(function(){
				wx.hideOptionMenu();
			})
		})
	})
}
/**
 * 微信分享
 * @param sysCommon 获取系统url集合
 * @param cmpyId 企业ID
 * @param title 分享标题
 * @param desc 分享到朋友的描述
 * @param imgUrl 分享图标
 **/
function SKweixinShare(sysCommon,cmpyId,title,desc,imgUrl){
	var urlParam=SKgetUrlParam();
	var forwardUrl=window.location.href;
	forwardUrl=forwardUrl.replace('&openId='+urlParam.openId,'');
	forwardUrl=forwardUrl.replace('?openId='+urlParam.openId,'');
	forwardUrl=sysCommon.silentAuthUrl+'?returnUrl='+encodeURIComponent(forwardUrl)+'&cmpyId='+cmpyId;
	var search=window.location.href.split('#')[0];
	var configUrl=sysCommon.jsticketUrl;  //获取系统url集合中用于微信的action
	var result={};
	//同步获取微信验证集
	$.ajax({
		type:'get',
		url:configUrl,
		data:{'url':search,'cmpyId':cmpyId},
		async:false,
		success:function(data){
			if(data) result=data;
		}
	})
	//注入权限验证配置
	wx.config({
	    debug:false,  //true 为开启调试模式
	    appId:result.appId,
	    timestamp:result.timestamp,
	    nonceStr:result.noncestr,
	    signature:result.signature,
	    jsApiList:['checkJsApi','onMenuShareAppMessage','onMenuShareTimeline']
	})
	//通过ready接口处理成功验证
	wx.ready(function(){
       	//分享到朋友圈
       	wx.onMenuShareTimeline({
          	title:title,
          	link:forwardUrl,
          	imgUrl:imgUrl,
          	success:function(){
          		mui.toast('分享成功！');
          	},
          	cancel:function(){
          		mui.toast('分享取消！');
           	}
      	})
       	//分享到朋友
       	wx.onMenuShareAppMessage({
    	  	title:title,
          	desc:desc,
          	link:forwardUrl,
          	imgUrl:imgUrl,
          	success:function(){

          	},
      		cancel:function(){
      			mui.toast('分享取消！');
          	}
        })
    })
}
/**
 * 微信分享调取接口记录
 * @param sysCommon 获取系统url集合
 * @param forwardUrl 获取跳转需要微信授权的url
 * @param cmpyId 企业ID
 * @param mediaId 媒体ID
 * @param title 分享标题
 * @param desc 分享到朋友的描述
 * @param imgUrl 分享图标
 * @param mediaType 媒体类型
 * @param readLogId 传播标志  调用阅读记录接口后返回的字段
 * @param communicators 是否是传播者标志  如果URL参数有则赋值，如果调用阅读记录接口后有该字段则再次赋值，否则为空
 * @param type 类型:0->软文,1->活动,2->免费试用,4->产品详情,7->精品导读,8->个人微网首页（有声图）
 **/
function SKweixinRecord(sysCommon,forwardUrl,cmpyId,mediaId,title,desc,imgUrl,mediaType,readLogId,communicators,type){
	var urlParam=SKgetUrlParam();
	var parentOpenId='0';
	var openId=urlParam.openId;
	if(urlParam.parentOpenId){
		parentOpenId=urlParam.parentOpenId;
	}
	var level=parseInt(urlParam.level);
	if(urlParam.openId!=urlParam.parentOpenId){
		level=level+1;
	}
	var startTime=new Date().getTime();
	var search=window.location.href.split('#')[0];
	var configUrl=sysCommon.jsticketUrl;  //获取系统url集合中用于微信的action
	var result={};
	//同步获取微信验证集
	$.ajax({
		type:'get',
		url:configUrl,
		data:{'url':search,'cmpyId':cmpyId},
		async:false,
		success:function(data){
			if(data) result=data;
		}
	})
	//注入权限验证配置
	wx.config({
	    debug:false,  //true 为开启调试模式
	    appId:result.appId,
	    timestamp:result.timestamp,
	    nonceStr:result.noncestr,
	    signature:result.signature,
	    jsApiList:['checkJsApi','onMenuShareAppMessage','onMenuShareTimeline']
	})
	//通过ready接口处理成功验证
	wx.ready(function(){
       	//分享到朋友圈
       	wx.onMenuShareTimeline({
          	title:title,
          	link:forwardUrl,
          	imgUrl:imgUrl,
          	success:function(){
          		var pageData={
					'forwardId':parseInt(mediaId),
					'companyId':parseInt(cmpyId),
					'level':level,
					'openId':openId,
					'opid':parentOpenId,
					'forwardType':mediaType,
					'type':type,
					'readTime':startTime,
					'duration':new Date().getTime()-startTime,
					'readLogId':readLogId,
					'recordId':urlParam.recordId,
					'shareUrl':forwardUrl
				}
				//如果传播者openId不为空，将参数传至接口
				if(communicators){
					pageData.communicators=communicators;
				}
              	$.ajax({
					type:'post',
					contentType:'application/json; charset=utf-8',
					url:'/newmedia/mobile/forward/to.action',
					cache:false,
					data:(JSON.stringify(pageData)),
					dataType:'json',
					async:true,
					success:function(data){}
				})
              	mui.toast('分享成功！');
          	},
          	cancel:function(){
          		mui.toast('分享取消！');
           	}
      	})
       	//分享到朋友
       	wx.onMenuShareAppMessage({
    	  	title:title,
          	desc:desc,
          	link:forwardUrl,
          	imgUrl:imgUrl,
          	success:function(){

          	},
      		cancel:function(){
      			mui.toast('分享取消！');
          	}
        })
    })
}

export default {
  shareRecord: SKweixinRecord
}
