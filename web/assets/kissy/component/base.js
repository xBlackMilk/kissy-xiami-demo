﻿/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: May 20 22:58
*/
/**
 * @ignore
 * mvc based component framework for kissy
 * @author yiminghe@gmail.com
 */
KISSY.add('component/base', function (S, Component, Controller, Render) {

    S.mix(Component, {
        Controller: Controller,
        'Render': Render
    });

    return Component;

}, {
    requires: [
        './base/impl',
        './base/controller',
        './base/render'
    ]
});/**
 * @ignore
 * Box
 * @author yiminghe@gmail.com
 */
KISSY.add('component/base/box-render', function (S, Node, XTemplate, BoxTpl) {

    var $ = S.all,
        UA = S.UA,
        startTpl = BoxTpl,
        endTpl = '</div>',
        doc = S.Env.host.document;

    function pxSetter(v) {
        if (typeof v == 'number') {
            v += 'px';
        }
        return v;
    }

    function BoxRender() {

        var self = this,
            width,
            height,
            style = self.get('elStyle'),
            elCls = self.get('elCls'),
            visible;

        if (!self.get('srcNode')) {
            var attrs = self.getAttrs(),
                a,
                attr,
                renderData = self.get('renderData');

            for (a in attrs) {
                attr = attrs[a];
                if (a != 'renderData' && !(a in renderData)) {
                    renderData[a] = self.get(a);
                }
            }
            width = renderData.width;
            height = renderData.height;
            visible = renderData.visible;

            if (width) {
                style.width = pxSetter(width);
            }

            if (height) {
                style.height = pxSetter(height);
            }

            elCls.push(visible ?
                self.getCssClassWithState('shown') :
                self.getCssClassWithState('hidden'));
        }

    }

    BoxRender.ATTRS = {

        id: {
        },

        el: {},

        // 构建时批量生成，不需要执行单个
        elCls: {
            sync: 0,
            setter: function (v) {
                if (typeof v == 'string') {
                    v = v.split(/\s+/);
                }
                return v;
            }
        },

        elStyle: {
            sync: 0
        },

        width: {
            sync: 0
        },

        height: {
            sync: 0
        },

        elAttrs: {
            sync: 0
        },

        // renderBefore
        elBefore: {
            sync: 0
        },

        render: {},

        visible: {
            sync: 0
        },

        contentTpl: {
            value: '{{{content}}}'
        },

        renderData: {},

        childrenElSelectors: {
            value: {}
        }
    };

    BoxRender.HTML_PARSER = {
        content: function (el) {
            return el.html();
        }
    };

    // for augment, no need constructor
    BoxRender.prototype = {
        /**
         * @ignore
         * 只负责建立节点，如果是 decorate 过来的，甚至内容会丢失
         * 通过 render 来重建原有的内容
         */
        __createDom: function () {
            var self = this,
                renderData = self.get('renderData'),
                el, tpl, html;

            if (!(el = self.get('srcNode'))) {

                tpl = startTpl +
                    self.get('contentTpl') +
                    endTpl;

                html = new XTemplate(tpl, {
                    commands: {
                        getCssClassWithState: function (scope, option) {
                            return self.getCssClassWithState(option.params[0]);
                        }
                    }
                }).render(renderData);

                el = $(html);

                var childrenElSelectors = self.get('childrenElSelectors');

                for (var childName in childrenElSelectors) {
                    var selector = childrenElSelectors[childName];
                    if (typeof selector === "function") {
                        self.setInternal(childName, selector(el));
                    } else {
                        self.setInternal(childName,
                            el.all(S.substitute(selector, this.get('renderData'))));
                    }
                }
            } else if ((el = $(el)) && !el[0].id) {
                el[0].id = ('ks-component' + S.guid());
            }
            self.setInternal("el", el);
        },

        __renderUI: function () {
            var self = this;
            // 新建的节点才需要摆放定位
            if (!self.get('srcNode')) {
                var render = self.get('render'),
                    el = self.get('el'),
                    renderBefore = self.get('elBefore');
                if (renderBefore) {
                    el.insertBefore(renderBefore, /**
                     @type Node
                     @ignore
                     */undefined);
                } else if (render) {
                    el.appendTo(render, undefined);
                } else {
                    el.appendTo(doc.body, undefined);
                }
            }
        },

        '_onSetWidth': function (w) {
            this.get('el').width(w);
        },

        _onSetHeight: function (h) {
            var self = this;
            self.get('el').height(h);
        },

        '_onSetContent': function (c) {
            var el = this.get('el');
            el.html(c);
            // ie needs to set unselectable attribute recursively
            if (UA.ie < 9 && !this.get('allowTextSelection')) {
                el.unselectable();
            }
        },

        _onSetVisible: function (visible) {
            var self = this,
                el = self.get('el'),
                shownCls = self.getCssClassWithState('shown'),
                hiddenCls = self.getCssClassWithState('hidden');
            if (visible) {
                el.removeClass(hiddenCls);
                el.addClass(shownCls);
            } else {
                el.removeClass(shownCls);
                el.addClass(hiddenCls);
            }
        },

        __destructor: function () {
            var el = this.get('el');
            if (el) {
                el.remove();
            }
        }
    };

    return BoxRender;
}, {
    requires: ['node', 'xtemplate', './box-tpl']
});
/*
  Generated by kissy-tpl2mod.
*/
KISSY.add('component/base/box-tpl',function(){
 return '<div id="ks-component{{id}}" class="{{getCssClassWithState ""}} {{#each elCls}} {{.}} {{/each}} " {{#each elAttrs}} {{xkey}}="{{.}}" {{/each}} style=" {{#each elStyle}} {{xkey}}:{{.}}; {{/each}} ">';
});
/**
 * @ignore
 * Box
 * @author yiminghe@gmail.com
 */
KISSY.add('component/base/box', function (S) {


    /**
     * Box extension class.Represent a dom element.
     * @class KISSY.Component.Extension.Box
     * @private
     */
    function Box() {

        /**
         * @event beforeVisibleChange
         * fired before visible is changed,
         * can return false to prevent this change
         * @param {KISSY.Event.CustomEventObject} e
         * @param {Boolean} e.prevVal current component 's visible value
         * @param {Boolean} e.prevVal visible value to be changed
         */

        /**
         * @event afterVisibleChange
         * fired after visible is changed
         * @param {KISSY.Event.CustomEventObject} e
         * @param {Boolean} e.prevVal current component 's previous visible value
         * @param {Boolean} e.prevVal current component 's visible value
         */

        /**
         * @event show
         * fired after current component shows
         * @param {KISSY.Event.CustomEventObject} e
         */

        /**
         * @event hide
         * fired after current component hides
         * @param {KISSY.Event.CustomEventObject} e
         */
    }


    Box.ATTRS =
    {

        id: {
            view: 1,
            valueFn: function () {
                return S.guid();
            }
        },

        /**
         * component's html content. Note: content and srcNode can not be set both!
         * @type {String|KISSY.NodeList}
         * @property content
         */
        /**
         * component's html content. Note: content and srcNode can not be set both!
         * @cfg {String|KISSY.NodeList} content
         */
        /**
         * @ignore
         */
        content: {
            view: 1,
            value:''
        },

        contentTpl: {
            view: 1
        },

        renderData: {
            view: 1,
            value: {}
        },

        childrenElSelectors: {
            view: 1
        },

        /**
         * component's width
         * @type {Number|String}
         * @property width
         */
        /**
         * component's width
         * @cfg {Number|String} width
         */
        /**
         * @ignore
         */
        width: {
            view: 1
        },

        /**
         * component's height
         * @type {Number|String}
         * @property height
         */
        /**
         * component's height
         * @cfg {Number|String} height
         */
        /**
         * @ignore
         */
        height: {
            view: 1
        },

        /**
         * css class of component's root element
         * @cfg {String} elCls
         */
        /**
         * @ignore
         */
        elCls: {
            view: 1,
            value: []
        },

        /**
         * name-value pair css style of component's root element
         * @cfg {Object} elStyle
         */
        /**
         * @ignore
         */
        elStyle: {
            view: 1,
            value: {}
        },

        /**
         * name-value pair attribute of component's root element
         * @cfg {Object} elAttrs
         */
        /**
         * @ignore
         */
        elAttrs: {
            view: 1,
            value: {}
        },

        /**
         * archor element where component insert before
         * @cfg {KISSY.NodeList} elBefore
         */
        /**
         * @ignore
         */
        elBefore: {
            // better named to renderBefore, too late !
            view: 1
        },

        /**
         * root element of current component
         * @type {KISSY.NodeList}
         * @readonly
         * @property el
         */
        /**
         * @ignore
         */
        el: {
            view: 1
        },

        /**
         * archor element where component append to
         * @cfg {KISSY.NodeList} render
         */
        /**
         * @ignore
         */
        render: {
            view: 1
        },

        /**
         * whether this component is visible after created.
         *
         * will add css class {prefix}{component}-hidden
         * or {prefix}{component}-shown to component's root el.
         *
         * @cfg {Boolean} visible
         */
        /**
         * whether this component is visible.
         *
         * will add css class {prefix}{component}-hidden
         * or {prefix}{component}-shown to component's root el.
         *
         * @type {Boolean}
         * @property visible
         */
        /**
         * @ignore
         */
        visible: {
            sync: 0,
            value: true,
            view: 1
        },

        /**
         * kissy node or css selector to find the first match node
         *
         * parsed for configuration values,
         * passed to component's HTML_PARSER definition
         * @cfg {KISSY.NodeList|String} srcNode
         *
         */
        /**
         * @ignore
         */
        srcNode: {
            view: 1
        }
    };

    // for augment, no need constructor
    Box.prototype = {

        _onSetVisible: function (v) {
            // do not fire event at render phrase
            this.fire(v ? "show" : "hide");
        },

        /**
         * show component
         * @chainable
         */
        show: function () {
            var self = this;
            self.render();
            self.set("visible", true);
            return self;
        },

        /**
         * hide component
         * @chainable
         */
        hide: function () {
            var self = this;
            self.set("visible", false);
            return self;
        }
    };

    return Box;
});
/**
 * @ignore
 * Base Controller class for KISSY Component.
 * @author yiminghe@gmail.com
 */
KISSY.add("component/base/controller", function (S, Box, Event, Component, UIBase, Manager, Render, undefined) {

    var ie = S.Env.host.document.documentMode || S.UA.ie,
        Features = S.Features,
        Gesture = Event.Gesture,
        isTouchSupported = Features.isTouchSupported();

    function wrapperViewSetter(attrName) {
        return function (ev) {
            var self = this;
            // in case bubbled from sub component
            if (self == ev.target) {
                var value = ev.newVal,
                    view = self.get("view");
                view.set(attrName, value);
            }
        };
    }

    function wrapperViewGetter(attrName) {
        return function (v) {
            var self = this,
                ret,
                view = self.get("view");
            if (view) {
                // 优先 view
                ret = view.get(attrName);
            }
            return ret === undefined ? v : ret;
        };
    }

    function defAddChild(e) {
        var self = this;
        if (e.target !== self) {
            return;
        }
        var c = e.component,
            children = self.get('children'),
            index = e.index;
        children.splice(index, 0, c);
        if (self.get('rendered')) {
            c = self.renderChild(c, index);
        }
        self.fire('afterAddChild', {
            component: c,
            index: index
        });
    }

    function defRemoveChild(e) {
        var self = this;
        if (e.target !== self) {
            return;
        }
        var c = e.component,
            cEl,
            cDOMParentEl,
            cDOMEl,
            destroy = e.destroy,
            children = self.get('children'),
            index = e.index;
        if (index != -1) {
            children.splice(index, 1);
        }
        if (c.setInternal) {
            c.setInternal('parent', null);
        }
        if (destroy) {
            // c is still json
            if (c.destroy)
                c.destroy();
        } else {
            if (c.get && (cEl = c.get('el'))) {
                cDOMEl = cEl[0];
                if (cDOMParentEl = cDOMEl.parentNode) {
                    cDOMParentEl.removeChild(cDOMEl);
                }
            }
        }
        self.fire('afterRemoveChild', {
            component: c,
            index: index
        });
    }

    /**
     * 不使用 valueFn，
     * 只有 render 时需要找到默认，其他时候不需要，防止莫名其妙初始化
     * @ignore
     */
    function constructView(self) {
        // 逐层找默认渲染器
        var attrs,
            attrCfg,
            attrName,
            cfg = {},
            v,
            Render = self.get('xrender');

        // 将渲染层初始化所需要的属性，直接构造器设置过去
        attrs = self['getAttrs']();

        // 整理属性，对纯属于 view 的属性，添加 getter setter 直接到 view
        for (attrName in attrs) {
            attrCfg = attrs[attrName];
            if (attrCfg.view) {
                // 先取后 getter
                // 防止死循环
                if (( v = self.get(attrName) ) !== undefined) {
                    cfg[attrName] = v;
                }

                // setter 不应该有实际操作，仅用于正规化比较好
                // attrCfg.setter = wrapperViewSetter(attrName);
                self.on("after" + S.ucfirst(attrName) + "Change",
                    wrapperViewSetter(attrName));
                // 逻辑层读值直接从 view 层读
                // 那么如果存在默认值也设置在 view 层
                // 逻辑层不要设置 getter
                attrCfg.getter = wrapperViewGetter(attrName);
            }
        }
        cfg.ksComponentCss = getComponentCss(self);
        return new Render(cfg);
    }

    function getComponentCss(self) {
        var constructor = self.constructor,
            cls,
            re = [];
        while (constructor && constructor != Controller) {
            cls = Manager.getXClassByConstructor(constructor);
            if (cls) {
                re.push(cls);
            }
            constructor = constructor.superclass && constructor.superclass.constructor;
        }
        return re;
    }

    function isMouseEventWithinElement(e, elem) {
        var relatedTarget = e.relatedTarget;
        // 在里面或等于自身都不算 mouseenter/leave
        return relatedTarget &&
            ( relatedTarget === elem[0] ||
                elem.contains(relatedTarget) );
    }

    function wrapBehavior(self, action) {
        return function (e) {
            if (!self.get("disabled")) {
                self[action](e);
            }
        };
    }

    /**
     * Base Controller class for KISSY Component.
     * xclass: 'controller'.
     * @extends KISSY.Component.UIBase
     * @mixins KISSY.Component.Extension.Box
     * @class KISSY.Component.Controller
     */
    var Controller = UIBase.extend([Box], {

            /**
             * mark current instance as controller instance.
             *
             * access this property directly.
             *
             * for example:
             *
             *      menu.isController // => true
             *
             * @type {Boolean}
             * @member KISSY.Component.Controller
             */
            isController: true,

            /**
             * Get full class name for current component.
             * @param {String} classes class names without prefixCls. Separated by space.
             * @method
             * @protected
             * @return {String} class name with prefixCls
             */
            getCssClassWithPrefix: Manager.getCssClassWithPrefix,

            /**
             * Initialize this component.
             * @protected
             */
            initializer: function () {
                var self = this,
                    defaultChildCfg = self.get('defaultChildCfg');

                self.publish('beforeAddChild', {
                    defaultFn: defAddChild
                });

                self.publish('beforeRemoveChild', {
                    defaultFn: defRemoveChild
                });

                defaultChildCfg.prefixCls = defaultChildCfg.prefixCls ||
                    self.get('prefixCls');
            },

            'createChild': function (c) {
                return Component.create(c, this);
            },

            /**
             * Constructor(or get) view object to create ui elements.
             * @protected
             */
            createDom: function () {
                var self = this,
                    view,
                    el;
                // initialize view
                self.setInternal("view", view = constructView(self));
                view.create();
                el = view.getKeyEventTarget();
                if (!self.get("allowTextSelection")) {
                    el.unselectable();
                }
            },

            /**
             * Call view object to render ui elements.
             * @protected
             *
             */
            renderUI: function () {
                var self = this;
                self.get("view").render();
                self.renderChildren();
            },

            bindUI: function () {
                var self = this,
                    el = self.getKeyEventTarget();
                if (self.get('focusable')) {
                    // remove smart outline in ie
                    // set outline in style for other standard browser
                    el.on("focus", wrapBehavior(self, "handleFocus"))
                        .on("blur", wrapBehavior(self, "handleBlur"))
                        .on("keydown", wrapBehavior(self, "handleKeydown"));
                }

                if (self.get('handleMouseEvents')) {

                    el = self.get('el');

                    if (!isTouchSupported) {
                        el.on("mouseenter", wrapBehavior(self, "handleMouseEnter"))
                            .on("mouseleave", wrapBehavior(self, "handleMouseLeave"))
                            .on("contextmenu", wrapBehavior(self, "handleContextMenu"))
                    }

                    el.on(Gesture.start, wrapBehavior(self, "handleMouseDown"))
                        .on(Gesture.end, wrapBehavior(self, "handleMouseUp"))
                        .on('touchcancel', wrapBehavior(self, "handleMouseUp"))
                        // consider touch environment
                        .on(Gesture.tap, wrapBehavior(self, "performActionInternal"));

                    // click quickly only trigger click and dblclick in ie<9
                    // others click click dblclick
                    if (ie && ie < 9) {
                        el.on("dblclick", wrapBehavior(self, "handleDblClick"));
                    }

                }
            },

            renderChildren: function () {
                var i,
                    self = this,
                    children = self.get("children");
                for (i = 0; i < children.length; i++) {
                    self.renderChild(children[i], i);
                }
            },

            '_onSetFocused': function (v) {
                var target = this.getKeyEventTarget()[0];
                if (v) {
                    target.focus();
                } else {
                    if (target.ownerDocument.activeElement == target) {
                        target.ownerDocument.body.focus();
                    }
                }
            },

            focus: function () {
                if (this.get('focusable')) {
                    this.set('focused', true);
                }
            },

            blur: function () {
                if (this.get('focusable')) {
                    this.set('focused', false);
                }
            },

            /**
             * child component's render container.
             * @protected
             * @return {KISSY.NodeList}
             */
            getChildrenContainerEl: function () {
                return this.get('view').getChildrenContainerEl();
            },

            /**
             * focusable element of component.
             * @protected
             * @return {KISSY.NodeList}
             */
            getKeyEventTarget: function () {
                return this.get('view').getKeyEventTarget();
            },

            /**
             * Add the specified component as a child of current component
             * at the given 0-based index.
             * @param {KISSY.Component.Controller|Object} c
             * Child component instance to be added
             * or
             * Object describe child component
             * @param {String} [c.xclass] When c is a object, specify its child class.
             * @param {Number} [index]  0-based index at which
             * the new child component is to be inserted;
             * If not specified , the new child component will be inserted at last position.
             * @return {KISSY.Component.Controller} this
             */
            addChild: function (c, index) {
                var self = this,
                    children = self.get("children");
                if (index === undefined) {
                    index = children.length;
                }
                c = self.createChild(c);
                self.fire('beforeAddChild', {
                    component: c,
                    index: index
                });
                return c;
            },

            renderChild: function (c, childIndex) {
                var self = this,
                    elBefore,
                    domContentEl,
                    children = self.get('children'),
                    cEl,
                    contentEl;
                if (typeof childIndex === "undefined") {
                    childIndex = S.indexOf(c, children);
                }
                c = self.createChild(c);
                children[childIndex] = c;
                // 生成父组件的 dom 结构
                self.create();
                contentEl = self.getChildrenContainerEl();
                domContentEl = contentEl[0];
                elBefore = domContentEl.children[childIndex] || null;
                if (c.get('rendered')) {
                    cEl = c.get('el')[0];
                    if (cEl.parentNode != domContentEl) {
                        domContentEl.insertBefore(cEl, elBefore);
                    }
                } else {
                    // set 通知 view 也更新对应属性
                    if (elBefore) {
                        c.set("elBefore", elBefore);
                    } else {
                        c.set("render", contentEl);
                    }
                    // 如果 parent 也没渲染，子组件 create 出来和 parent 节点关联
                    // 子组件和 parent 组件一起渲染
                    // 之前设好属性，view ，logic 同步还没 bind ,create 不是 render ，还没有 bindUI
                    c.render();
                }
                return c;
            },

            /**
             * Removed the given child from this component,and returns it.
             *
             * If destroy is true, calls ``destroy()`` on the removed child component,
             * and subsequently detaches the child's DOM from the document.
             * Otherwise it is the caller's responsibility to
             * clean up the child component's DOM.
             *
             * @param {KISSY.Component.Controller} c The child component to be removed.
             * @param {Boolean} [destroy=true] If true,
             * calls ``destroy()`` on the removed child component.
             */
            removeChild: function (c, destroy) {
                if (destroy === undefined) {
                    destroy = true;
                }
                this.fire('beforeRemoveChild', {
                    component: c,
                    index: S.indexOf(c, this.get('children')),
                    destroy: destroy
                });
            },

            /**
             * Removes every child component attached to current component.
             * see {@link KISSY.Component.Controller#removeChild}
             * @param {Boolean} [destroy] If true,
             * calls ``destroy()`` on the removed child component.
             * @chainable
             */
            removeChildren: function (destroy) {
                var self = this,
                    i,
                    t = [].concat(self.get("children"));
                for (i = 0; i < t.length; i++) {
                    self.removeChild(t[i], destroy);
                }
                return self;
            },

            /**
             * Returns the child at the given index, or null if the index is out of bounds.
             * @param {Number} index 0-based index.
             * @return {KISSY.Component.Controller} The child at the given index; null if none.
             */
            getChildAt: function (index) {
                var children = this.get("children");
                return children[index] || null;
            },

            /**
             * Hack click in ie<9 by handling dblclick events.
             * By default, this performs its associated action by calling
             * {@link KISSY.Component.Controller#performActionInternal}.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleDblClick: function (ev) {
                this.performActionInternal(ev);
            },

            /**
             * Called by it's container component to dispatch mouseenter event.
             * @private
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseOver: function (ev) {
                var self = this,
                    el = self.get("el");
                if (!isMouseEventWithinElement(ev, el)) {
                    self.handleMouseEnter(ev);
                }
            },

            /**
             * Called by it's container component to dispatch mouseleave event.
             * @private
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseOut: function (ev) {
                var self = this,
                    el = self.get("el");
                if (!isMouseEventWithinElement(ev, el)) {
                    self.handleMouseLeave(ev);
                }
            },

            /**
             * Handle mouseenter events. If the component is not disabled, highlights it.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseEnter: function (ev) {
                this.set("highlighted", !!ev);
            },

            /**
             * Handle mouseleave events. If the component is not disabled, de-highlights it.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseLeave: function (ev) {
                var self = this;
                self.set("active", false);
                self.set("highlighted", !ev);
            },

            /**
             * Handles mousedown events. If the component is not disabled,
             * If the component is activeable, then activate it.
             * If the component is focusable, then focus it,
             * else prevent it from receiving keyboard focus.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseDown: function (ev) {
                var self = this,
                    n,
                    isMouseActionButton = ev['which'] == 1,
                    el;
                if (isMouseActionButton || isTouchSupported) {
                    el = self.getKeyEventTarget();
                    if (self.get("activeable")) {
                        self.set("active", true);
                    }
                    if (self.get("focusable")) {
                        el[0].focus();
                        self.set("focused", true);
                    }

                    if (!self.get("allowTextSelection")) {
                        // firefox /chrome 不会引起焦点转移
                        n = ev.target.nodeName;
                        n = n && n.toLowerCase();
                        // do not prevent focus when click on editable element
                        if (n != "input" && n != "textarea") {
                            ev['preventDefault']();
                        }
                    }
                }
            },

            /**
             * Handles mouseup events.
             * If this component is not disabled, performs its associated action by calling
             * {@link KISSY.Component.Controller#performActionInternal}, then deactivates it.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleMouseUp: function (ev) {
                var self = this;
                // 左键
                if (self.get("active") && (ev['which'] == 1 || isTouchSupported)) {
                    self.set("active", false);
                }
            },

            /**
             * Handles context menu.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleContextMenu: function (ev) {
                if (0) {
                    S.log(ev);
                }
            },

            /**
             * Handles focus events. Style focused class.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleFocus: function (ev) {
                this.set("focused", !!ev);
                this.fire("focus");
            },

            /**
             * Handles blur events. Remove focused class.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleBlur: function (ev) {
                this.set("focused", !ev);
                this.fire("blur");
            },

            /**
             * Handle enter keydown event to {@link KISSY.Component.Controller#performActionInternal}.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleKeyEventInternal: function (ev) {
                if (ev['keyCode'] == Event.KeyCodes.ENTER) {
                    return this.performActionInternal(ev);
                }
                return undefined;
            },

            /**
             * Handle keydown events.
             * If the component is not disabled, call {@link KISSY.Component.Controller#handleKeyEventInternal}
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            handleKeydown: function (ev) {
                var self = this;
                if (self.handleKeyEventInternal(ev)) {
                    ev['halt']();
                    return true;
                }
                return undefined;
            },

            /**
             * Performs the appropriate action when this component is activated by the user.
             * @protected
             * @param {KISSY.Event.DOMEventObject} ev DOM event to handle.
             */
            performActionInternal: function (ev) {
                if (0) {
                    S.log(ev);
                }
            },

            /**
             * destroy children
             * @protected
             */
            destructor: function () {
                var self = this,
                    i,
                    view = self.get("view"),
                    children = self.get("children");
                for (i = 0; i < children.length; i++) {
                    children[i].destroy && children[i].destroy();
                }
                if (view) {
                    view.destroy();
                }

            }
        },
        {
            ATTRS: {

                /**
                 * Enables or disables mouse event handling for the component.
                 * Containers may set this attribute to disable mouse event handling
                 * in their child component.
                 *
                 * Defaults to: true.
                 *
                 * @cfg {Boolean} handleMouseEvents
                 * @protected
                 */
                /**
                 * @ignore
                 */
                handleMouseEvents: {
                    value: true
                },

                /**
                 * Whether this component can get focus.
                 *
                 * Defaults to: true.
                 *
                 * @protected
                 * @cfg {Boolean} focusable
                 */
                /**
                 * @ignore
                 */
                focusable: {
                    value: true,
                    view: 1
                },

                /**
                 * 1. Whether allow select this component's text.<br/>
                 * 2. Whether not to lose last component's focus if click current one (set false).
                 *
                 * Defaults to: false
                 *
                 * @cfg {Boolean} allowTextSelection
                 * @protected
                 */
                /**
                 * @ignore
                 */
                allowTextSelection: {
                    view: 1,
                    // 和 focusable 分离
                    // grid 需求：容器允许选择里面内容
                    value: false
                },

                /**
                 * Whether this component can be activated.
                 *
                 * Defaults to: true.
                 *
                 * @cfg {Boolean} activeable
                 * @protected
                 */
                /**
                 * @ignore
                 */
                activeable: {
                    value: true
                },

                /**
                 * Whether this component has focus.
                 * @type {Boolean}
                 * @property focused
                 */
                /**
                 * Whether this component has focus on initialization.
                 * @cfg {Boolean} focused
                 */
                /**
                 * @ignore
                 */
                focused: {
                    view: 1
                },

                /**
                 * Whether this component is activated.
                 * @type {Boolean}
                 * @property active
                 */
                /**
                 * @ignore
                 */
                active: {
                    view: 1,
                    value: false
                },

                /**
                 * Whether this component is highlighted.
                 * @type {Boolean}
                 * @property highlighted
                 */
                /**
                 * @ignore
                 */
                highlighted: {
                    view: 1,
                    value: false
                },

                /**
                 * Array of child components
                 * @cfg {KISSY.Component.Controller[]} children
                 */
                /**
                 * @ignore
                 */
                children: {
                    value: []
                },

                /**
                 * This component's prefix css class.
                 * @cfg {String} prefixCls
                 */
                /**
                 * @ignore
                 */
                prefixCls: {
                    value: S.config('component/prefixCls') || 'ks-',
                    view: 1
                },
                /**
                 * This component's prefix xclass. Only be used in cfg.
                 * To use this property as 'xclass' when not specified 'xclass' and 'xtype'
                 * @cfg {String} prefixXClass
                 */
                /**
                 * @ignore
                 */
                prefixXClass: {

                },
                /**
                 * This component's xtype, xclass = prefixXClass + xtype.
                 * @cfg {String} prefixXClass
                 */

                /**
                 * This component's parent component.
                 * @type {KISSY.Component.Controller}
                 * @property parent
                 * @readonly
                 */
                /**
                 * This component's parent component.
                 * @cfg {KISSY.Component.Controller} parent
                 */
                /**
                 * @ignore
                 */
                parent: {
                    setter: function (p, prev) {
                        if (prev = this.get('parent')) {
                            this.removeTarget(prev);
                        }
                        if (p) {
                            this.addTarget(p);
                        }
                    }
                },

                /**
                 * Whether this component is disabled.
                 * @type {Boolean}
                 * @property disabled
                 */
                /**
                 * Whether this component is disabled.
                 * @cfg {Boolean} disabled
                 */
                /**
                 * @ignore
                 */
                disabled: {
                    view: 1,
                    value: false
                },

                /**
                 * Render class.
                 * @protected
                 * @cfg {*} xrender
                 */
                /**
                 * @ignore
                 */
                xrender: {
                    value: Render
                },

                /**
                 * default child config
                 * @protected
                 * @cfg {String} defaultChildCfg
                 */
                /**
                 * @ignore
                 */
                defaultChildCfg: {
                    view: 1,
                    value: {}
                }
            }
        }, {
            xclass: 'controller'
        });

    return Controller;
}, {
    requires: ['./box', 'event', './impl', './uibase', './manager', './render']
});
/*

 yiminghe@gmail.com - 2012.10.31
 - 考虑触屏，绑定 Event.Gesture.tap 为主行为事件
 - handleMouseDown/up 对应 Gesture.start/end


 事件冒泡机制
 - child 组件的冒泡源配置为其所属的 parent
 - 性能考虑:不是 child 的所有事件都冒泡到 parent，要具体配置哪些事件需要冒泡

 view 和 controller 的平行关系
 - controller 初始化 -> initializer -> new view()
 - controller createDom -> createDom -> view.createDom()
 - controller renderUI -> renderUI -> view.render()


 控制层元属性配置中 view 的作用
 - 如果没有属性变化处理函数，自动生成属性变化处理函数，自动转发给 view 层
 - 如果没有指定 view 层实例，在生成默认 view 实例时，所有用户设置的 view 的属性都转到默认 view 实例中


 observer synchronization, model 分成两类
 - view 负责监听 view 类 model 变化更新界面
 - control 负责监听 control 类变化改变逻辑



 problem: Observer behavior is hard to understand and debug
 because it's implicit behavior.

 Keeping screen state and session state synchronized is an important task
 Data Binding.

 In general data binding gets tricky
 because if you have to avoid cycles where a change to the control,
 changes the record set, which updates the control,
 which updates the record set....
 The flow of usage helps avoid these -
 we load from the session state to the screen when the screen is opened,
 after that any changes to the screen state propagate back to the session state.
 It's unusual for the session state to be updated directly once the screen is up.
 As a result data binding might not be entirely bi-directional -
 just confined to initial upload and
 then propagating changes from the controls to the session state.

 Refer
 - http://martinfowler.com/eaaDev/uiArchs.html

 *//**
 * @ignore
 * Setup component namespace.
 * @author yiminghe@gmail.com
 */
KISSY.add("component/base/impl", function (S, UIBase, Manager) {
    /**
     * @class KISSY.Component
     * @singleton
     * Component infrastructure.
     */
    var Component = {
        Manager: Manager,
        UIBase: UIBase
    };

    /**
     * Create a component instance using json with xclass.
     * @param {Object} component Component's json notation with xclass attribute.
     * @param {String} component.xclass Component to be newed 's xclass.
     * @param {KISSY.Component.Controller} self Component From which new component generated will inherit prefixCls
     * if component 's prefixCls is undefined.
     * @member KISSY.Component
     *
     *  for example:
     *
     *      create({
     *          xclass:'menu',
     *          children:[{
     *              xclass:'menuitem',
     *              content:"1"
     *          }]
     *      })
     */
    Component.create = function (component, parent) {
        var childConstructor,
            xclass;
        if (component) {
            if (!component.isController && parent) {
                S.mix(component, parent.get('defaultChildCfg'), false);
                if (!component.xclass && component.prefixXClass) {
                    component.xclass = component.prefixXClass;
                    if (component.xtype) {
                        component.xclass += '-' + component.xtype;
                    }
                }
            }
            if (!component.isController && (xclass = component.xclass)) {
                childConstructor = Manager.getConstructorByXClass(xclass);
                if (!childConstructor) {
                    S.error("can not find class by xclass desc : " + xclass);
                }
                component = new childConstructor(component);
            }
            if (component.isController && parent) {
                component.setInternal('parent', parent);
            }
        }
        return component;
    };

    return Component;
}, {
    requires: ['./uibase', './manager']
});/**
 * @ignore
 * storage for component
 * @author yiminghe@gmail.com
 */
KISSY.add("component/base/manager", function (S) {
    var uis = {
        // 不带前缀 prefixCls
        /*
         "menu" :{
         priority:0,
         constructor:Menu
         }
         */
    };

    function getConstructorByXClass(cls) {
        var cs = cls.split(/\s+/), p = -1, t, ui = null;
        for (var i = 0; i < cs.length; i++) {
            var uic = uis[cs[i]];
            if (uic && (t = uic.priority) > p) {
                p = t;
                ui = uic.constructor;
            }
        }
        return ui;
    }

    function getXClassByConstructor(constructor) {
        for (var u in uis) {
            var ui = uis[u];
            if (ui.constructor == constructor) {
                return u;
            }
        }
        return 0;
    }

    function setConstructorByXClass(cls, uic) {
        if (S.isFunction(uic)) {
            uis[cls] = {
                constructor:uic,
                priority:0
            };
        } else {
            uic.priority = uic.priority || 0;
            uis[cls] = uic;
        }
    }


    function getCssClassWithPrefix(cls) {
        var cs = S.trim(cls).split(/\s+/);
        for (var i = 0; i < cs.length; i++) {
            if (cs[i]) {
                cs[i] = this.get("prefixCls") + cs[i];
            }
        }
        return cs.join(" ");
    }


    var componentInstances = {};

    /**
     * @class KISSY.Component.Manager
     * @member Component
     * @singleton
     * Manage component metadata.
     */
    var Manager =  {

        __instances:componentInstances,

        /**
         * associate id with component
         * @param {String} id
         * @param {KISSY.Component.Controller} component
         */
        addComponent:function (id, component) {
            componentInstances[id] = component;
        },

        /**
         * remove association id with component
         * @param {String} id
         */
        removeComponent:function (id) {
            delete componentInstances[id];
        },

        /**
         * get component by id
         * @param {String} id
         * @return {KISSY.Component.Controller}
         */
        'getComponent':function (id) {
            return componentInstances[id];
        },

        /**
         * complete css by prefix prefixCls
         * @return {String}
         * @method
         * @param {String} css
         */
        getCssClassWithPrefix:getCssClassWithPrefix,
        /**
         * Get css class name for this component constructor.
         * @param {Function} constructor Component's constructor.
         * @return {String}
         * @method
         */
        getXClassByConstructor:getXClassByConstructor,
        /**
         * Get component constructor by css class name.
         * @param {String} classNames Class names separated by space.
         * @return {Function}
         * @method
         */
        getConstructorByXClass:getConstructorByXClass,
        /**
         * Associate css class with component constructor.
         * @param {String} className Component's class name.
         * @param {Function} componentConstructor Component's constructor.
         * @method
         */
        setConstructorByXClass:setConstructorByXClass
    };

    Manager.getCssClassWithPrefix = getCssClassWithPrefix;

    return Manager;
});/**
 * @ignore
 * render base class for kissy
 * @author yiminghe@gmail.com
 * refer: http://martinfowler.com/eaaDev/uiArchs.html
 */
KISSY.add("component/base/render", function (S, BoxRender, Component, UIBase, Manager) {

    /**
     * @ignore
     * Base Render class for KISSY Component.
     */
    return UIBase.extend([BoxRender], {

        initializer: function () {
            var self = this;
            var attrs = self.get('elAttrs');
            var cls = self.get('elCls');
            var disabled;
            if (disabled = self.get('disabled')) {
                cls.push(self.getCssClassWithState('disabled'));
                attrs['aria-disabled'] = 'true';
            }
            if (self.get('highlighted')) {
                cls.push(self.getCssClassWithState('hover'));
            }
            if (self.get('focusable')) {
                attrs['hideFocus'] = 'true';
                attrs['tabindex'] = disabled ? '-1' : '0';
            }
        },

        isRender: 1,

        /**
         * Get all css class name to be applied to the root element of this component for given state.
         * the css class names are prefixed with component name.
         * @param {String} [state] This component's state info.
         * @ignore
         */
        getCssClassWithState: function (state) {
            var self = this,
                componentCls = self.get("ksComponentCss");
            if (!componentCls) {
                return '';
            }
            state = state || "";
            if (state) {
                state = "-" + state;
            }
            return self.getCssClassWithPrefix(componentCls.join(state + " ") + state);
        },

        /**
         * Get full class name (with prefix) for current component
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @return {String} class name with prefixCls
         * @ignore
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * Returns the dom element which is responsible for listening keyboard events.
         * @return {KISSY.NodeList}
         * @ignore
         */
        getKeyEventTarget: function () {
            return this.get("el");
        },

        /**
         * @ignore
         */
        _onSetHighlighted: function (v) {
            var self = this,
                componentCls = self.getCssClassWithState("hover"),
                el = self.get("el");
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },

        /**
         * @ignore
         */
        _onSetDisabled: function (v) {
            var self = this,
                componentCls = self.getCssClassWithState("disabled"),
                el = self.get("el");
            el[v ? 'addClass' : 'removeClass'](componentCls)
                .attr("aria-disabled", v);
            if (self.get("focusable")) {
                //不能被 tab focus 到
                self.getKeyEventTarget().attr("tabindex", v ? -1 : 0);
            }
        },
        /**
         * @ignore
         */
        '_onSetActive': function (v) {
            var self = this,
                componentCls = self.getCssClassWithState("active");
            self.get("el")[v ? 'addClass' : 'removeClass'](componentCls)
                .attr("aria-pressed", !!v);
        },
        /**
         * @ignore
         */
        _onSetFocused: function (v) {
            var self = this,
                el = self.get("el"),
                componentCls = self.getCssClassWithState("focused");
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },

        /**
         * Return the dom element into which child component to be rendered.
         * @return {KISSY.NodeList}
         * @ignore
         */
        getChildrenContainerEl: function () {
            return this.get("el");
        }

    }, {//  screen state
        ATTRS: {
            prefixCls: {},

            focusable: {},

            focused: {
                sync: 0
            },

            active: {
                sync: 0
            },

            disabled: {
                sync: 0
            },

            highlighted: {
                sync: 0
            }
        },
        HTML_PARSER: {
            disabled: function (el) {
                var self = this,
                    componentCls = self.getCssClassWithState("disabled");
                return el.hasClass(componentCls);
            }
        }
    });
}, {
    requires: ['./box-render', './impl', './uibase', './manager']
});/**
 * @ignore
 * UIBase
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('component/base/uibase', function (S, RichBase, Node, Manager, undefined) {

    var SRC_NODE = 'srcNode',
        ATTRS = 'ATTRS',
        HTML_PARSER = 'HTML_PARSER',
        noop = S.noop;

    /**
     * init srcNode
     * @ignore
     */
    function initSrcNode(self, srcNode) {
        var c = self.constructor,
            len,
            p,
            constructorChains;

        constructorChains = self.collectConstructorChains();

        // 从父类到子类开始从 html 读取属性
        for (len = constructorChains.length - 1; len >= 0; len--) {
            c = constructorChains[len];
            if (p = c[HTML_PARSER]) {
                applyParser.call(self, srcNode, p);
            }
        }
    }

    function applyParser(srcNode, parser) {
        var self = this,
            p, v,
            ret;

        // 从 parser 中，默默设置属性，不触发事件
        // html parser 优先，超过 js 配置值
        for (p in parser) {
            v = parser[p];
            // 函数
            if (S.isFunction(v)) {
                // html parser 放弃
                ret = v.call(self, srcNode);
                if (ret !== undefined) {
                    self.setInternal(p, ret);
                }
            }
            // 单选选择器
            else if (typeof v == 'string') {
                self.setInternal(p, srcNode.one(v));
            }
            // 多选选择器
            else if (S.isArray(v) && v[0]) {
                self.setInternal(p, srcNode.all(v[0]))
            }
        }
    }

    /**
     * @class KISSY.Component.UIBase
     * @extends KISSY.RichBase
     * UIBase for class-based component.
     */
    var UIBase = RichBase.extend({

        constructor: function UIBaseConstructor() {
            var self = this, srcNode;
            UIBase.superclass.constructor.apply(self, arguments);
            // decorate may perform complex create
            if (self.decorateInternal &&
                (srcNode = self.get('srcNode'))) {
                self.decorateInternal(srcNode);
            }
            if (self.get('autoRender')) {
                self.render();
            }
        },

        // change routine from rich-base for uibase
        bindInternal: noop,

        // change routine from rich-base for uibase
        syncInternal: noop,

        initializer: function () {
            var self = this,
                id,
                srcNode = S.one(self.get(SRC_NODE));

            // register instance if config id
            if (id = self.get("id")) {
                Manager.addComponent(id, self);
            }

            if (srcNode) {
                // 根据 srcNode 设置属性值
                // so initializer can not read attribute in case srcNode is set
                initSrcNode(self, srcNode);
                self.setInternal(SRC_NODE, srcNode);
            }
        },

        /**
         * Create dom structure of this component.
         * @chainable
         */
        create: function () {
            var self = this;
            // 是否生成过节点
            if (!self.get("created")) {
                /**
                 * @event beforeCreateDom
                 * fired before root node is created
                 * @param {KISSY.Event.CustomEventObject} e
                 */
                self.fire('beforeCreateDom');
                self.callMethodByHierarchy("createDom", "__createDom");
                self.setInternal("created", true);

                /**
                 * @event afterCreateDom
                 * fired when root node is created
                 * @param {KISSY.Event.CustomEventObject} e
                 */
                self.fire('afterCreateDom');
                self.callPluginsMethod("createDom");
            }
            return self;
        },

        /**
         * Put dom structure of this component to document, bind event and sync attribute.
         * @chainable
         */
        render: function () {
            var self = this;
            // 是否已经渲染过
            if (!self.get("rendered")) {

                self.create(undefined);

                /**
                 * @event beforeRenderUI
                 * fired when root node is ready
                 * @param {KISSY.Event.CustomEventObject} e
                 */

                self.fire('beforeRenderUI');
                self.callMethodByHierarchy("renderUI", "__renderUI");

                /**
                 * @event afterRenderUI
                 * fired after root node is rendered into dom
                 * @param {KISSY.Event.CustomEventObject} e
                 */

                self.fire('afterRenderUI');
                self.callPluginsMethod("renderUI");

                /**
                 * @event beforeBindUI
                 * fired before component 's internal event is bind.
                 * @param {KISSY.Event.CustomEventObject} e
                 */

                self.fire('beforeBindUI');
                UIBase.superclass.bindInternal.call(self);
                self.callMethodByHierarchy("bindUI", "__bindUI");

                /**
                 * @event afterBindUI
                 * fired when component 's internal event is bind.
                 * @param {KISSY.Event.CustomEventObject} e
                 */

                self.fire('afterBindUI');
                self.callPluginsMethod("bindUI");

                UIBase.superclass.syncInternal.call(self);
                self.sync();

                self.setInternal("rendered", true);
            }
            return self;
        },

        /**
         * sync attribute value
         */
        sync: function () {
            var self = this;
            /**
             * @event beforeSyncUI
             * fired before component 's internal state is synchronized.
             * @param {KISSY.Event.CustomEventObject} e
             */

            self.fire('beforeSyncUI');
            self.callMethodByHierarchy("syncUI", "__syncUI");

            /**
             * @event afterSyncUI
             * fired after component 's internal state is synchronized.
             * @param {KISSY.Event.CustomEventObject} e
             */

            self.fire('afterSyncUI');
            self.callPluginsMethod("syncUI");
        },

        /**
         * For overridden. DOM creation logic of subclass component.
         * @protected
         * @method
         */
        createDom: noop,

        /**
         * For overridden. Render logic of subclass component.
         * @protected
         * @method
         */
        renderUI: noop,

        /**
         * For overridden. Bind logic for subclass component.
         * @protected
         * @method
         */
        bindUI: noop,

        /**
         * For overridden. Sync attribute with ui.
         * @protected
         * @method
         */
        syncUI: noop,

        plug: function () {
            var self = this,
                p,
                plugins = self.get('plugins');
            UIBase.superclass.plug.apply(self, arguments);
            p = plugins[plugins.length - 1];
            if (self.get('rendered')) {
                p.pluginCreateDom && p.pluginCreateDom(self);
                p.pluginRenderUI && p.pluginRenderUI(self);
                p.pluginBindUI && p.pluginBindUI(self);
                p.pluginSyncUI && p.pluginSyncUI(self);
            } else if (self.get('created')) {
                p.pluginCreateDom && p.pluginCreateDom(self);
            }
            return self;
        },


        /**
         * Destroy this component.
         * @protected
         */
        destructor: function () {
            var id;
            // remove instance if set id
            if (id = this.get("id")) {
                Manager.removeComponent(id);
            }
        }
    }, {

        name: 'UIBase',

        ATTRS: {
            /**
             * Whether this component is rendered.
             * @type {Boolean}
             * @property rendered
             * @readonly
             */
            /**
             * @ignore
             */
            rendered: {
                value: false
            },
            /**
             * Whether this component 's dom structure is created.
             * @type {Boolean}
             * @property created
             * @readonly
             */
            /**
             * @ignore
             */
            created: {
                value: false
            },

            /**
             * get xclass of current component instance.
             * @property xclass
             * @type {String}
             * @readonly
             */
            /**
             * @ignore
             */
            xclass: {
                valueFn: function () {
                    return Manager.getXClassByConstructor(this.constructor);
                }
            }
        }
    });

    // RichBase.extend
    var originalExtend = UIBase.extend;

    S.mix(UIBase, {
        /**
         * Parse attribute from existing dom node.
         * @static
         * @protected
         * @property HTML_PARSER
         * @member KISSY.Component.UIBase
         *
         * for example:
         *     @example
         *     Overlay.HTML_PARSER={
         *          // el: root element of current component.
         *          "isRed":function(el){
         *              return el.hasClass("ks-red");
         *          }
         *      };
         */
        HTML_PARSER: {},

        /**
         * Create a new class which extends UIBase .
         * @param {Function[]} extensions Class constructors for extending.
         * @param {Object} px Object to be mixed into new class 's prototype.
         * @param {Object} sx Object to be mixed into new class.
         * @static
         * @return {KISSY.Component.UIBase} A new class which extends UIBase .
         */
        extend: function extend(extensions, px, sx) {
            var args = S.makeArray(arguments),
                baseClass = this,
                parsers = {},
                xclass,
                newClass,
                argsLen = args.length,
                last = args[argsLen - 1];

            if (xclass = last.xclass) {
                args[argsLen - 2].name = xclass;
            }

            newClass = originalExtend.apply(baseClass, args);

            if (S.isArray(extensions)) {
                // [ex1,ex2]，扩展类后面的优先，ex2 定义的覆盖 ex1 定义的
                // 主类最优先
                S.each(extensions['concat'](newClass), function (ext) {
                    if (ext) {
                        // 合并 HTML_PARSER 到主类
                        S.each(ext[HTML_PARSER], function (v, name) {
                            parsers[name] = v;
                        });
                    }
                });
                newClass[HTML_PARSER] = parsers;
            }

            if (xclass) {
                Manager.setConstructorByXClass(xclass, {
                    constructor: newClass,
                    priority: last.priority
                });
            }

            newClass.extend = extend;
            return newClass;
        }
    });

    return UIBase;
}, {
    requires: ["rich-base", "node", "./manager"]
});
/**
 * @ignore
 *
 * Refer:
 *  - http://martinfowler.com/eaaDev/uiArchs.html
 *
 * render 和 create 区别
 *  - render 包括 create ，以及把生成的节点放在 document 中
 *  - create 仅仅包括创建节点
 **/
