/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Mar 11 10:34
*/
KISSY.add("editor/plugin/color/color-picker/dialog",function(e,o,q){function g(a){if(e.isArray(a))return a;var b=RegExp;if(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.test(a))return f([b.$1,b.$2,b.$3],function(a){return parseInt(a,16)});if(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a))return f([b.$1,b.$2,b.$3],function(a){return parseInt(a+a,16)});if(/^rgb\((.*),(.*),(.*)\)$/i.test(a))return f([b.$1,b.$2,b.$3],function(a){return 0<a.indexOf("%")?2.55*parseFloat(a,10):a|0})}function j(a){var a="0"+
a,b=a.length;return a.slice(b-2,b)}function m(a){a=g(a);return"#"+j(a[0].toString(16))+j(a[1].toString(16))+j(a[2].toString(16))}function p(a){this.editor=a;this._init()}var f=e.map,r=e.DOM,n=function(){function a(a,i,c){for(var d=[],a=b(a),i=b(i),h=(i[0]-a[0])/c,k=(i[1]-a[1])/c,e=(i[2]-a[2])/c,l=0,g=a[0],j=a[1],a=a[2];l<c;l++)d[l]=[g,j,a],g+=h,j+=k,a+=e;d[l]=i;return f(d,function(a){return f(a,function(a){return Math.min(Math.max(0,Math.floor(a)),255)})})}function b(a){var b=g(a);if(void 0===b){c||
(c=document.createElement("textarea"),c.style.display="none",r.prepend(c,document.body));try{c.style.color=a}catch(e){return[0,0,0]}document.defaultView?b=g(document.defaultView.getComputedStyle(c,null).color):(a=c.createTextRange().queryCommandValue("ForeColor"),b=[a&255,(a&65280)>>>8,(a&16711680)>>>16])}return b}var c;return function(b,c){var e=[],d=b.length;void 0===c&&(c=20);if(1==d)e=a(b[0],b[0],c);else if(1<d)for(var h=0,d=d-1;h<d;h++){var k=a(b[h],b[h+1],c[h]||c);h<d-1&&k.pop();e=e.concat(k)}return e}}(),
s="<div class='{prefixCls}editor-color-advanced-picker'><div class='ks-clear'><div class='{prefixCls}editor-color-advanced-picker-left'>"+("<ul>"+f(n("red,orange,yellow,green,cyan,blue,purple".split(","),5),function(a){return f(n(["white","rgb("+a.join(",")+")","black"],5),function(a){return"<li><a style='background-color:"+m(a)+"' href='#'></a></li>"}).join("")}).join("</ul><ul>")+"</ul>")+"</div><div class='{prefixCls}editor-color-advanced-picker-right'></div></div><div style='padding:10px;'><label>\u989c\u8272\u503c\uff1a <input style='width:100px' class='{prefixCls}editor-color-advanced-value'/></label><span class='{prefixCls}editor-color-advanced-indicator'></span></div></div>",
t=o.Utils.addRes,u=o.Utils.destroyRes;e.augment(p,{_init:function(){var a=this,b=a.editor.get("prefixCls");a.dialog=(new q({mask:!0,headerContent:"\u989c\u8272\u62fe\u53d6\u5668",bodyContent:e.substitute(s,{prefixCls:b}),footerContent:e.substitute("<div style='padding:5px 20px 20px;'><a class='{prefixCls}editor-button {prefixCls}editor-color-advanced-ok ks-inline-block'>\u786e\u5b9a</a>&nbsp;&nbsp;&nbsp;<a class='{prefixCls}editor-button  {prefixCls}editor-color-advanced-cancel ks-inline-block'>\u53d6\u6d88</a></div>",{prefixCls:b}),width:"550px"})).render();
var c=a.dialog,f=c.get("body"),i=c.get("footer"),g=f.one("."+b+"editor-color-advanced-indicator"),d=f.one("."+b+"editor-color-advanced-value"),h=f.one("."+b+"editor-color-advanced-picker-left");f.one("."+b+"editor-color-advanced-picker-right");c=i.one("."+b+"editor-color-advanced-ok");b=i.one("."+b+"editor-color-advanced-cancel");c.on("click",function(b){var c=e.trim(d.val()),f=a.colorButtonArrow;/^#([a-f0-9]{1,2}){3,3}$/i.test(c)?(a.hide(),f.fire("selectColor",{color:d.val()}),b.halt()):alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u989c\u8272\u4ee3\u7801")});
d.on("change",function(){var a=e.trim(d.val());/^#([a-f0-9]{1,2}){3,3}$/i.test(a)?g.css("background-color",a):alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u989c\u8272\u4ee3\u7801")});b.on("click",function(b){a.hide();b&&b.halt()});f.on("click",function(b){b.halt();b=new e.Node(b.target);if("a"==b.nodeName()){var c=m(b.css("background-color"));h.contains(b)&&a._detailColor(c);d.val(c);g.css("background-color",c)}});t.call(a,c,d,b,f,a.dialog);a._detailColor("#FF9900");d.val("#FF9900");g.css("background-color","#FF9900")},_detailColor:function(a){var b=
this.dialog.get("body"),c=this.editor.get("prefixCls");b.one("."+c+"editor-color-advanced-picker-right").html(f(n(["#ffffff",a,"#000000"],40),function(a){return"<a style='background-color:"+m(a)+"'></a>"}).join(""))},show:function(a){this.colorButtonArrow=a;this.dialog.show()},hide:function(){this.dialog.hide()},destroy:function(){u.call(this)}});return p},{requires:["editor","../../dialog/"]});
