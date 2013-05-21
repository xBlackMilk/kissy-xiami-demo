/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: May 15 20:58
*/
KISSY.add("overlay/base",function(e,f,c,a,b,d,g){var i={hide:"hide",destroy:"destroy"};return f.Controller.extend([c.DecorateChild,c.Position,a,c.Align,b,g],{bindUI:function(){var a=this,b=a.get("closeBtn");if(b)b.on("click",function(b){a.close();b.preventDefault()})},close:function(){this[i[this.get("closeAction")]||"hide"]();return this}},{ATTRS:{decorateChildCls:{value:"content"},contentEl:{view:1},closable:{value:!1,view:1},closeBtn:{view:1},closeAction:{value:"hide"},focusable:{value:!1},allowTextSelection:{value:!0},
handleMouseEvents:{value:!1},xrender:{value:d}}},{xclass:"overlay",priority:10})},{requires:"component/base,component/extension,./extension/loading,./extension/mask,./overlay-render,./extension/overlay-effect".split(",")});KISSY.add("overlay/close-tpl",function(){return'{{#if closable}} <a href="javascript:void(\'close\')"    id="ks-ext-close{{id}}"    class="{{prefixCls}}ext-close {{getCssClassWithState "close"}}"    role=\'button\'>     <span class="{{prefixCls}}ext-close-x {{getCssClassWithState "close-x"}}">close</span> </a> {{/if}}'});
KISSY.add("overlay/dialog-render",function(e,f,c,a){return f.extend({initializer:function(){e.mix(this.get("elAttrs"),{role:"dialog","aria-labelledby":"ks-stdmod-header"+this.get("id")});e.mix(this.get("childrenElSelectors"),{header:"#ks-stdmod-header{id}",body:"#ks-stdmod-body{id}",footer:"#ks-stdmod-footer{id}"})},getChildrenContainerEl:function(){return this.get("body")},_onSetBodyStyle:function(a){this.get("body").css(a)},_onSetHeaderStyle:function(a){this.get("header").css(a)},_onSetFooterStyle:function(a){this.get("footer").css(a)},
_onSetBodyContent:function(a){var d;d=this.get("body");d.html(a)},_onSetHeaderContent:function(a){var d;d=this.get("header");d.html(a)},_onSetFooterContent:function(a){var d;d=this.get("footer");d.html(a)}},{ATTRS:{closable:{value:!1},contentTpl:{value:c+a},headerContent:{sync:0},bodyContent:{sync:0},footerContent:{sync:0},headerStyle:{sync:0},bodyStyle:{sync:0},footerStyle:{sync:0},body:{},header:{},footer:{}},HTML_PARSER:{header:function(a){return a.one("."+this.get("prefixCls")+"stdmod-header")},
body:function(a){return a.one("."+this.get("prefixCls")+"stdmod-body")},footer:function(a){return a.one("."+this.get("prefixCls")+"stdmod-footer")},headerContent:function(a){return a.one("."+this.get("prefixCls")+"stdmod-header").html()},bodyContent:function(a){return a.one("."+this.get("prefixCls")+"stdmod-body").html()},footerContent:function(a){return(a=a.one("."+this.get("prefixCls")+"stdmod-footer"))&&a.html()}}})},{requires:["./overlay-render","./dialog-tpl","./close-tpl"]});
KISSY.add("overlay/dialog-tpl",function(){return'<div id="ks-content{{id}}"         class="         {{prefixCls}}content         {{getCssClassWithState "content"}}         ">      <div class="{{prefixCls}}stdmod-header {{prefixCls}}dialog-header"          style=" {{#each headerStyle}}   {{xkey}}:{{.}};   {{/each}} "          id="ks-stdmod-header{{id}}">{{{headerContent}}}</div>      <div class="{{prefixCls}}stdmod-body {{prefixCls}}dialog-body"          style=" {{#each bodyStyle}}   {{xkey}}:{{.}};   {{/each}} "          id="ks-stdmod-body{{id}}">{{{bodyContent}}}</div>      <div class="{{prefixCls}}stdmod-footer {{prefixCls}}dialog-footer"          style=" {{#each footerStyle}}   {{xkey}}:{{.}};   {{/each}} "          id="ks-stdmod-footer{{id}}">{{{footerContent}}}</div>  </div>  <div tabindex="0"      style="position: absolute"></div>'});
KISSY.add("overlay/dialog",function(e,f,c,a){var b=f.extend({__afterCreateEffectGhost:function(a){var b=this.get("body");a.all("."+this.get("prefixCls")+"stdmod-body").css({height:b.height(),width:b.width()}).html("");return a},handleKeyEventInternal:function(g){if(this.get("escapeToClose")&&g.keyCode===a.KeyCodes.ESC){if("select"!=g.target.nodeName.toLowerCase()||g.target.disabled)this.close(),g.halt()}else a:if(g.keyCode==d){var b=this.get("el"),c=a.all(g.target),e=b.last();if(c.equals(b)&&g.shiftKey)e[0].focus(),
g.halt();else if(c.equals(e)&&!g.shiftKey)this.focus(),g.halt();else if(c.equals(b)||b.contains(c))break a;g.halt()}},_onSetVisible:function(a){var c=this.get("el");if(a)this.__lastActive=c[0].ownerDocument.activeElement,this.set("focused",!0),c.attr("aria-hidden","false");else{c.attr("aria-hidden","true");try{this.__lastActive&&this.__lastActive.focus()}catch(d){}}b.superclass._onSetVisible.apply(this,arguments)}},{ATTRS:{header:{view:1},body:{view:1},footer:{view:1},bodyStyle:{value:{},view:1},
footerStyle:{value:{},view:1},headerStyle:{value:{},view:1},headerContent:{value:"",view:1},bodyContent:{value:"",view:1},footerContent:{value:"",view:1},closable:{value:!0},xrender:{value:c},focusable:{value:!0},escapeToClose:{value:!0}}},{xclass:"dialog",priority:20}),d=a.KeyCodes.TAB;return b},{requires:["./base","./dialog-render","node"]});
KISSY.add("overlay/extension/loading-render",function(e,f){function c(){}c.prototype={loading:function(){this._loadingExtEl||(this._loadingExtEl=(new f("<div class='"+this.get("prefixCls")+"ext-loading' style='position: absolute;border: none;width: 100%;top: 0;left: 0;z-index: 99999;height:100%;*height: expression(this.parentNode.offsetHeight);'/>")).appendTo(this.get("el")));this._loadingExtEl.show()},unloading:function(){var a=this._loadingExtEl;a&&a.hide()}};return c},{requires:["node"]});
KISSY.add("overlay/extension/loading",function(){function e(){}e.prototype={loading:function(){this.get("view").loading();return this},unloading:function(){this.get("view").unloading();return this}};return e});
KISSY.add("overlay/extension/mask-render",function(e,f){function c(a){a=a.getCssClassWithPrefix("ext-mask")+" "+a.getCssClassWithState("mask");a=d("<div  style='width:"+(b?"expression(KISSY.DOM.docWidth())":"100%")+";left:0;top:0;height:"+(b?"expression(KISSY.DOM.docHeight())":"100%")+";position:"+(b?"absolute":"fixed")+";' class='"+a+"'>"+(b?"<iframe style='position:absolute;left:0;top:0;background:red;width: expression(this.parentNode.offsetWidth);height: expression(this.parentNode.offsetHeight);filter:alpha(opacity=0);z-index:-1;'></iframe>":
"")+"</div>").prependTo("body");a.unselectable();a.on("mousedown",function(a){a.preventDefault()});return a}function a(){}var b=6===e.UA.ie,d=f.all;a.ATTRS={mask:{},maskNode:{}};a.prototype={__renderUI:function(){this.get("mask")&&this.set("maskNode",c(this))},__syncUI:function(){this.get("mask")&&this.ksSetMaskVisible(this.get("visible"))},ksSetMaskVisible:function(a){var b=this.getCssClassWithState("mask-shown"),c=this.get("maskNode"),d=this.getCssClassWithState("mask-hidden");a?c.removeClass(d).addClass(b):
c.removeClass(b).addClass(d)},__destructor:function(){var a;(a=this.get("maskNode"))&&a.remove()}};return a},{requires:["node"]});
KISSY.add("overlay/extension/mask",function(e,f){function c(){}function a(a,c,e,f){var k=a.effect||b;if(k==b)f.ksSetMaskVisible(e);else{f.ksSetMaskVisible(e);var f=a.duration,a=a.easing,o=e?1:0;c.stop(1,1);c.css("display",e?b:"block");c[k+d[k][o]](f,function(){c.css("display","")},a)}}c.ATTRS={mask:{view:1,value:!1},maskNode:{view:1}};var b="none",d={fade:["Out","In"],slide:["Up","Down"]};c.prototype={__bindUI:function(){var b,c,d=this.get("el"),e=this.get("view");if(c=this.get("mask")){b=this.get("maskNode");
if(c.closeOnClick)b.on(f.Gesture.tap,this.close,this);this.on("afterVisibleChange",function(k){if(k=k.newVal){var f=parseInt(d.css("z-index"))||1;b.css("z-index",f-1)}a(c,b,k,e)})}}};return c},{requires:["event"]});
KISSY.add("overlay/extension/overlay-effect",function(e){function f(a){var b=a.get("el").clone(!0);b.css({visibility:"visible",overflow:i}).addClass(a.get("prefixCls")+"overlay-ghost");return a.__afterCreateEffectGhost(b)}function c(a,b,c){a.__effectGhost&&a.__effectGhost.stop(1,1);var d=a.get("el"),g=e.all,j=a.get("effect"),h=g(j.target),g=j.duration,h=e.mix(h.offset(),{width:h.width(),height:h.height()}),l=e.mix(d.offset(),{width:d.width(),height:d.height()}),m=f(a),j=j.easing;m.insertAfter(d);
d.css("visibility",i);b?(b=h,h=l):b=l;m.css(b);a.__effectGhost=m;m.animate(h,{duration:g,easing:j,complete:function(){a.__effectGhost=null;m.remove();d.css("visibility","");c()}})}function a(a,b,e){var f=a.get("el"),i=a.get("effect"),j=i.effect||d,h=i.target;j==d&&!h?e():h?c(a,b,e):(a=i.duration,i=i.easing,h=b?1:0,f.stop(1,1),f.css({visibility:n,display:b?d:g}),f[j+l[j][h]](a,function(){f.css({display:g,visibility:""});e()},i))}function b(){}var d="none",g="block",i="hidden",n="visible",l={fade:["Out",
"In"],slide:["Up","Down"]};b.ATTRS={effect:{value:{effect:"",target:null,duration:0.5,easing:"easeOut"},setter:function(a){var b=a.effect;"string"==typeof b&&!l[b]&&(a.effect="")}}};b.prototype={__afterCreateEffectGhost:function(a){return a},_onSetVisible:function(b){var c=this;a(c,b,function(){c.fire(b?"show":"hide")})}};return b});
KISSY.add("overlay/overlay-render",function(e,f,c,a,b,d,g){return c.Render.extend([a.ContentRender,a.ShimRender,a.PositionRender,b,g],{initializer:function(){e.mix(this.get("childrenElSelectors"),{closeBtn:"#ks-ext-close{id}"})}},{HTML_PARSER:{closeBtn:function(a){return a.one("."+this.get("prefixCls")+"ext-close")}},ATTRS:{closable:{},contentTpl:{value:a.ContentRender.ContentTpl+d}}})},{requires:"xtemplate,component/base,component/extension,./extension/loading-render,./close-tpl,./extension/mask-render".split(",")});
KISSY.add("overlay",function(e,f,c,a,b,d){f.Render=c;a.Render=b;f.Dialog=a;e.Dialog=a;f.Popup=d;return e.Overlay=f},{requires:["overlay/base","overlay/overlay-render","overlay/dialog","overlay/dialog-render","overlay/popup"]});
KISSY.add("overlay/popup",function(e,f,c){return f.extend({initializer:function(){var a=this;a.get("trigger")&&("mouse"===a.get("triggerType")?(a._bindTriggerMouse(),a.on("afterRenderUI",function(){a._bindContainerMouse()})):a._bindTriggerClick())},_bindTriggerMouse:function(){var a=this,b=a.get("trigger"),d;a.__mouseEnterPopup=function(b){a._clearHiddenTimer();d=e.later(function(){a._showing(b);d=c},1E3*a.get("mouseDelay"))};b.on("mouseenter",a.__mouseEnterPopup);a._mouseLeavePopup=function(){d&&
(d.cancel(),d=c);a._setHiddenTimer()};b.on("mouseleave",a._mouseLeavePopup)},_bindContainerMouse:function(){this.get("el").on("mouseleave",this._setHiddenTimer,this).on("mouseenter",this._clearHiddenTimer,this)},_setHiddenTimer:function(){var a=this;a._hiddenTimer=e.later(function(){a._hiding()},1E3*a.get("mouseDelay"))},_clearHiddenTimer:function(){this._hiddenTimer&&(this._hiddenTimer.cancel(),this._hiddenTimer=c)},_bindTriggerClick:function(){var a=this;a.__clickPopup=function(b){b.halt();if(a.get("toggle"))a[a.get("visible")?
"_hiding":"_showing"](b);else a._showing(b)};a.get("trigger").on("click",a.__clickPopup)},_showing:function(a){this.set("currentTrigger",e.one(a.target));this.show()},_hiding:function(){this.set("currentTrigger",c);this.hide()},destructor:function(){var a,b=this.get("trigger");b&&(this.__clickPopup&&b.detach("click",this.__clickPopup),this.__mouseEnterPopup&&b.detach("mouseenter",this.__mouseEnterPopup),this._mouseLeavePopup&&b.detach("mouseleave",this._mouseLeavePopup));(a=this.get("el"))&&a.detach("mouseleave",
this._setHiddenTimer,this).detach("mouseenter",this._clearHiddenTimer,this)}},{ATTRS:{trigger:{setter:function(a){return e.all(a)}},triggerType:{value:"click"},currentTrigger:{},mouseDelay:{value:0.1},toggle:{value:!1}}},{xclass:"popup",priority:20})},{requires:["./base"]});
