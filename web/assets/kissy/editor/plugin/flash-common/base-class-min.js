/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Apr 17 00:16
*/
KISSY.add("editor/plugin/flash-common/base-class",function(e,k,m,n,f,g){function d(){d.superclass.constructor.apply(this,arguments);this._init()}var l=e.Node;d.ATTRS={cls:{},type:{},label:{value:"\u5728\u65b0\u7a97\u53e3\u67e5\u770b"},bubbleId:{},contextMenuId:{},contextMenuHandlers:{}};e.extend(d,e.Base,{_init:function(){var a=this,c=a.get("cls"),b=a.get("editor"),d=b.get("prefixCls"),j=[],f=a.get("bubbleId"),g=a.get("contextMenuId"),h=a.get("contextMenuHandlers");e.each(h,function(a,b){j.push({content:b})});b.addContextMenu(g,
"."+c,{width:"120px",children:j,listeners:{click:function(a){a=a.target.get("content");h[a]&&h[a].call(this)}}});b.addBubble(f,function(a){return a.hasClass(c,void 0)&&a},{listeners:{afterRenderUI:function(){var c=this,i=c.get("contentEl");i.html(e.substitute(' <a class="{prefixCls}editor-bubble-url" target="_blank" href="#">{label}</a>   |    <span class="{prefixCls}editor-bubble-link {prefixCls}editor-bubble-change">\u7f16\u8f91</span>   |    <span class="{prefixCls}editor-bubble-link {prefixCls}editor-bubble-remove">\u5220\u9664</span>',
{label:a.get("label"),prefixCls:d}));var f=i.one("."+d+"editor-bubble-url"),g=i.one("."+d+"editor-bubble-change"),h=i.one("."+d+"editor-bubble-remove");k.Utils.preventFocus(i);g.on("click",function(b){a.show(c.get("editorSelectedEl"));b.halt()});h.on("click",function(a){if(e.UA.webkit){var d=b.getSelection().getRanges();if(d=d&&d[0])d.collapse(!0),d.select()}c.get("editorSelectedEl").remove();c.hide();b.notifySelectionChange();a.halt()});c.on("show",function(){var b=c.get("editorSelectedEl");b&&a._updateTip(f,
b)})}}});b.docReady(function(){b.get("document").on("dblclick",a._dbClick,a)})},_getFlashUrl:function(a){return g.getUrl(a)},_updateTip:function(a,c){var b=this.get("editor").restoreRealElement(c);b&&(b=this._getFlashUrl(b),a.attr("href",b))},_dbClick:function(a){var c=new l(a.target);"img"===c.nodeName()&&c.hasClass(this.get("cls"),void 0)&&(this.show(c),a.halt())},show:function(a){var c=this.get("editor");f.useDialog(c,this.get("type"),this.get("pluginConfig"),a)}});return d},{requires:["editor",
"../contextmenu","../bubble","../dialog-loader","./utils"]});
