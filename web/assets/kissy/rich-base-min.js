/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Mar 13 22:07
*/
KISSY.add("rich-base",function(e,m){function k(){var b,a;m.apply(this,arguments);a=this.get("listeners");for(b in a)this.on(b,a[b]);this.callMethodByHierarchy("initializer","constructor");this.constructPlugins();this.callPluginsMethod("initializer");this.bindInternal();this.syncInternal()}function o(b){if(b.target==this)this[l+b.type.slice(5).slice(0,-6)](b.newVal,b)}var j=e.ucfirst,l="_onSet",n=e.noop,p=/(?:^|-)([a-z])/ig,q=function(b,a){return a.toUpperCase()};e.extend(k,m,{collectConstructorChains:function(){for(var b=
[],a=this.constructor;a;)b.push(a),a=a.superclass&&a.superclass.constructor;return b},callMethodByHierarchy:function(b,a){for(var c=this.constructor,g=[],f,e,d,h,i;c;){i=[];if(h=c.__ks_exts)for(d=0;d<h.length;d++)if(f=h[d])"constructor"!=a&&(f=f.prototype.hasOwnProperty(a)?f.prototype[a]:null),f&&i.push(f);c.prototype.hasOwnProperty(b)&&(e=c.prototype[b])&&i.push(e);i.length&&g.push.apply(g,i.reverse());c=c.superclass&&c.superclass.constructor}for(d=g.length-1;0<=d;d--)g[d]&&g[d].call(this)},callPluginsMethod:function(b){var a=
this,b="plugin"+j(b);e.each(a.get("plugins"),function(c){if(c[b])c[b](a)})},constructPlugins:function(){var b=this.get("plugins");e.each(b,function(a,c){e.isFunction(a)&&(b[c]=new a)})},bindInternal:function(){var b=this.getAttrs(),a,c;for(a in b)if(c=l+j(a),this[c])this.on("after"+j(a)+"Change",o)},syncInternal:function(){var b,a,c,g,f,e={},d=this.collectConstructorChains(),h;for(c=d.length-1;0<=c;c--)if(g=d[c],h=g.ATTRS)for(f in h)e[f]||(e[f]=1,g=l+j(f),(a=this[g])&&!1!==h[f].sync&&void 0!==(b=
this.get(f))&&a.call(this,b))},initializer:n,destructor:n,destroy:function(){this.callPluginsMethod("destructor");for(var b=this.constructor,a,c,g;b;){b.prototype.hasOwnProperty("destructor")&&b.prototype.destructor.apply(this);if(a=b.__ks_exts)for(g=a.length-1;0<=g;g--)(c=a[g]&&a[g].prototype.__destructor)&&c.apply(this);b=b.superclass&&b.superclass.constructor}this.fire("destroy");this.detach()},plug:function(b){e.isFunction(b)&&(b=new b);b.pluginInitializer&&b.pluginInitializer(this);this.get("plugins").push(b);
return this},unplug:function(b){var a=[],c=this,g="string"==typeof b;e.each(c.get("plugins"),function(f){var e=0,d;b&&(g?(d=f.get&&f.get("pluginId")||f.pluginId,d!=b&&(a.push(f),e=1)):f!=b&&(a.push(f),e=1));e||f.pluginDestructor(c)});c.setInternal("plugins",a);return c},getPlugin:function(b){var a=null;e.each(this.get("plugins"),function(c){if((c.get&&c.get("pluginId")||c.pluginId)==b)return a=c,!1});return a}},{ATTRS:{plugins:{value:[]},listeners:{value:[]}}});e.mix(k,{extend:function a(c,g,f){var j,
d;e.isArray(c)||(f=g,g=c,c=[]);f=f||{};j=f.name||"RichBaseDerived";g=g||{};g.hasOwnProperty("constructor")?d=g.constructor:e.Config.debug?eval("C = function "+j.replace(p,q)+"(){ C.superclass.constructor.apply(this, arguments);}"):d=function(){d.superclass.constructor.apply(this,arguments)};e.extend(d,this,g,f);if(c){d.__ks_exts=c;var h={},i={};e.each(c.concat(d),function(a){if(a){e.each(a.ATTRS,function(a,c){var d=h[c]=h[c]||{};e.mix(d,a)});var a=a.prototype,c;for(c in a)a.hasOwnProperty(c)&&(i[c]=
a[c])}});d.ATTRS=h;e.augment(d,i);d.prototype.constructor=d}d.extend=a;return d}});return k},{requires:["base"]});
