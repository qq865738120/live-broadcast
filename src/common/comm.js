import Vue from 'vue'

let context = '';

function setContext(that) {
	context = that
}

//获取连接地址后面的参数
function SKgetUrlParam(){
	var args={};
	var search=decodeURIComponent(location.href.split('?')[1]);
	var arr=search.split('&');
	for(var i=0,len=arr.length;i<len;i++){
		var t=arr[i].split('=');
		args[t[0]]=t[1]
	}
	return args
}
//获取当前不带参数的url
function SKgetUrlNoParam(){
	var url=window.location.href;
	var arr=url.split("?");
	if(arr.length>0){
		return url.split("?")[0]
	}
	return url
}

//**微信相关**//
//判断是否为微信浏览器 @return Boolean
function SKisWeiXin(){var ua=window.navigator.userAgent.toLowerCase();if(ua.match(/MicroMessenger/i)=='micromessenger'){return true}else{return false}}
//隐藏微信菜单
function SKweixinHideMenu(sysCommon){
	var configUrl=sysCommon.jsticketUrl;
	var search=window.location.href.split('#')[0];
	Vue.prototype.$(function(){
		Vue.prototype.$.get(configUrl,{'url':search,'cmpyId':-1},function(result){
			//初始化js-sdk配置
			Vue.prototype.$wx.config({
			    debug:false,
			    appId:result.appId,
			    timestamp:result.timestamp,
			    nonceStr:result.noncestr,
			    signature:result.signature,
			    jsApiList:[]
			})
			Vue.prototype.$wx.ready(function(){
				Vue.prototype.$wx.hideOptionMenu();
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
	Vue.prototype.$.ajax({
		type:'get',
		url:configUrl,
		data:{'url':search,'cmpyId':cmpyId},
		async:false,
		success:function(data){
			if(data) result=data;
		}
	})
	//注入权限验证配置
	Vue.prototype.$wx.config({
	    debug:false,  //true 为开启调试模式
	    appId:result.appId,
	    timestamp:result.timestamp,
	    nonceStr:result.noncestr,
	    signature:result.signature,
	    jsApiList:['checkJsApi','onMenuShareAppMessage','onMenuShareTimeline']
	})
	//通过ready接口处理成功验证
	Vue.prototype.$wx.ready(function(){
       	//分享到朋友圈
       	Vue.prototype.$wx.onMenuShareTimeline({
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
       	Vue.prototype.$wx.onMenuShareAppMessage({
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
async function SKweixinRecord(sysCommon,forwardUrl,cmpyId,mediaId,title,desc,imgUrl,mediaType,readLogId,communicators,type){
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
	// Vue.prototype.$.ajax({
	// 	type:'get',
	// 	url:configUrl,
	// 	data:{'url':search,'cmpyId':cmpyId},
	// 	async:false,
	// 	success:function(data){
	// 		if(data) result=data;
	// 	}
	// })
	result = await context.$axios.get(context.$store.state.path + configUrl, { params: {'url':search,'cmpyId':cmpyId} })
	result = result.data;
	//注入权限验证配置
	Vue.prototype.$wx.config({
	  debug:false,  //true 为开启调试模式
	  appId:result.appId,
	  timestamp:result.timestamp,
	  nonceStr:result.noncestr,
	  signature:result.signature,
	  jsApiList:['checkJsApi','onMenuShareAppMessage','onMenuShareTimeline']
	})
	//通过ready接口处理成功验证
	Vue.prototype.$wx.ready(function(){
	 	//分享到朋友圈
	 	Vue.prototype.$wx.onMenuShareTimeline({
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
	      // Vue.prototype.$.ajax({
				// 	type:'post',
				// 	contentType:'application/json; charset=utf-8',
				// 	url:'/newmedia/mobile/forward/to.action',
				// 	cache:false,
				// 	data:(JSON.stringify(pageData)),
				// 	dataType:'json',
				// 	async:true,
				// })
				Vue.prototype.$.ajax({
					type:'post',
					contentType:'application/json; charset=utf-8',
					url: context.$store.state.host + context.$store.state.path + '/newmedia/mobile/forward/to.action',
					cache:false,
					data:(JSON.stringify(pageData)),
					dataType:'json',
					async:true,
				})
				// context.$axios.defaults.headers.post['Content-Type'] = 'application/json';
				// context.$axios.post(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/forward/to.action', context.$qs.stringify(pageData))
	  	}
		})
	 	//分享到朋友
	 	Vue.prototype.$wx.onMenuShareAppMessage({
	  	title:title,
    	desc:desc,
    	link:forwardUrl,
    	imgUrl:imgUrl,
			success:function(){
				alert(forwardUrl)
				console.log('forwardUrl', forwardUrl);
			}
	  })
  })
}

/**
 * 同步记录阅读转发
 * @param mediaId 媒体ID
 * @param companyId 企业ID
 * @param type 类型:0->软文,1->活动,2->免费试用,4->产品详情,6->投票,7->精品导读,8->个人微网首页（有声图）
 * @return data 数据数组
 **/
async function SKinsertReadLog(mediaId,companyId,type){
	var _obj={};
	var urlParam =  SKgetUrlParam();
	var parentOpenId='0';
	if(urlParam.parentOpenId){
		parentOpenId=urlParam.parentOpenId;
	}
	if(urlParam.level){
		var level=parseInt(urlParam.level);
	}else{
		var level=0;
	}
	if(urlParam.openId!=urlParam.parentOpenId){
		level=level+1;
	}
	var _data={'mediaId':mediaId,'companyId':companyId,'readOpenId':urlParam.openId,'forwardOpenId':parentOpenId,'level':level,'type':type};
	if(urlParam.communicators){
		_data.communicators=urlParam.communicators;
	}
	// 如果传播记录Id不为空，将参数传至接口
	if (urlParam.recordId) {
		_data.recordId=urlParam.recordId;
	}
	Vue.prototype.$.ajax({
		type:'post',
		url:context.$store.state.host + context.$store.state.path + '/newmedia/mobile/media/insertReadLog.action',
		data:_data,
		dataType:'json',
		async:false,
		success:function(data){
			if(data){
				_obj=data;
			}
		}
	})
	// _obj = await context.$axios.post(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/media/insertReadLog.action', context.$qs.stringify(_data))
	return _obj;
}

/**
 * 同步获取搜空系统链接
 * @return 数据数组
 **/
async function SKAjaxgetSysCommonUrl(){
	var sysCommon;
	// Vue.prototype.$.ajax({
	// 	type:'get',
	// 	url:'/newmedia/sysCommon/getCommonUrls.action',
	// 	dataType:'json',
	// 	async:false,
	// 	success:function(data){
	// 		if(data) sysCommon=data;
	// 	}
	// })
	sysCommon = await context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/sysCommon/getCommonUrls.action')
	return sysCommon.data;
}

/**
 * 同步获取对应企业的蜂商ID
 * @param openId 微信openId
 * @param cmpyId 企业ID
 * @return 蜂商ID
 **/
async function SKAjaxgetSoukongAccountId(openId,cmpyId){
	var soukongAccountId;
	// $.ajax({
	// 	type:'get',
	// 	url:'/newmedia/mobile/wechatAccount/getSoukongAccountId.action',
	// 	data:{'openId':openId,'cmpyId':cmpyId},
	// 	dataType:'json',
	// 	async:false,
	// 	success:function(data){
	// 		if(data) soukongAccountId=data.soukongAccountId;
	// 	}
	// })
	soukongAccountId = await context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/wechatAccount/getSoukongAccountId.action', { params: {'openId':openId,'cmpyId':cmpyId} })
	return soukongAccountId.data.soukongAccountId;
}

async function doShare() {
	let desc='搜空直播，助力产品营销，让更多的人看到它更生动的一面。';
  let sysCommon = await SKAjaxgetSysCommonUrl();
	let urlParam = SKgetUrlParam();
	let FUID = '';
	let cmpyId = context.$store.state.cmpyId;
	let liveTitleId = context.$store.state.liveTitleId;
	let title = context.$store.state.title;
  var dataReadLog=SKinsertReadLog(urlParam.liveTitleId, context.$store.state.cmpyId, "9");
  var mediaInfo =dataReadLog.mediaInfo;
	var	recordId = dataReadLog.recordId;
	var	readLogId = dataReadLog.readLogId;
	var level;
	let parentOpenId = ''
	let soukongUID = SKAjaxgetSoukongAccountId(urlParam.openId, urlParam.cmpyId);
	if (soukongUID != 'null') {
		FUID = soukongUID
	} else if (context.$store.state.accountId != '') {
		FUID = context.$store.state.accountId
	} else if (urlParam.FUID) {
		FUID = urlParam.FUID;
	}
	if(urlParam.parentOpenId){
		parentOpenId=urlParam.parentOpenId;
	}
	if(urlParam.level){
		level=parseInt(urlParam.level);
	}else{
		level=0;
	}
	if(urlParam.openId!=urlParam.parentOpenId){
		level=level+1;
	}
	if(dataReadLog.communicators){
		var currentUrl=SKgetUrlNoParam()+'?FUID='+FUID+'&UID=&cmpyId='+cmpyId+'&liveTitleId='+liveTitleId+'&communicators='+dataReadLog.communicators+"&level="+level+"&parentOpenId="+urlParam.openId+'&recordId='+recordId;
	}else{
		var currentUrl=SKgetUrlNoParam()+'?FUID='+FUID+'&UID=&cmpyId='+cmpyId+'&liveTitleId='+liveTitleId+"&level="+level+"&parentOpenId="+urlParam.openId+'&recordId='+recordId;
	}
	var redirect_uri_forward=encodeURIComponent(currentUrl);
	var forwardUrl=sysCommon.silentAuthUrl+'?returnUrl='+redirect_uri_forward+'&cmpyId='+cmpyId;

  SKweixinRecord(sysCommon,forwardUrl,cmpyId,urlParam.liveTitleId,title,desc,context.$store.state.logoUrl,'',readLogId,urlParam.communicators,'9')
}

export default {
  // shareRecord: SKweixinRecord,
	doShare,
	setContext
}
