Ext.define('DE.controller.tablet.panel.TextColor', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            textColorPanel      : 'textcolorsettingspanel',
            navigateView        : '#id-textcolor-navigate',
            textColorView       : '#id-textcolor-root',
            highlightColorList  : '#id-textcolor-highlight dataview',
            textColorList       : '#id-textcolor-text dataview',
            noFillColorButton   : '#id-btn-highlight-none'

        },

        control: {
            textColorPanel      : {
                show        : 'onTextColorPanelShow',
                hide        : 'onTextColorPanelHide'
            },
            navigateView        : {
                push        : 'onNavigateViewPush',
                pop         : 'onNavigateViewPop',
                back        : 'onNavigateViewBack'
            },
            textColorView       : {
                itemsingletap: 'onTextColorItemTap'
            },
            highlightColorList: {
                itemsingletap: 'onHighlightListItemTap'
            },
            noFillColorButton   : {
                tap         : 'onNoFillColorTap'
            },
            textColorList   : {
                itemsingletap: 'onTextColorListItemTap'
            }
        },

        handleApiEvent  : false
    },

    init: function() {
    },

    launch: function() {
    },

    setApi: function(o) {
        this.api = o;

        if (this.api) {
            this.api.asc_registerCallback('asc_onTextColor',        Ext.bind(this.onApiTextColor, this));
            this.api.asc_registerCallback('asc_onTextHighLight',    Ext.bind(this.onApiHighlightColor, this));
        }
    },

    onTextColorPanelShow: function(cmp) {
        this.setHandleApiEvent(true);

        // update ui data
        this.api && this.api.UpdateInterfaceState();
    },

    onTextColorPanelHide: function(cmp) {
        this.setHandleApiEvent(false);

        var navigateView = this.getNavigateView();

        if (navigateView) {
            if (Ext.isDefined(navigateView.getLayout().getAnimation().getInAnimation))
                navigateView.getLayout().getAnimation().getInAnimation().stop();

            if (Ext.isDefined(navigateView.getLayout().getAnimation().getOutAnimation))
                navigateView.getLayout().getAnimation().getOutAnimation().stop();

            navigateView.reset();

            var activeItem  = navigateView.getActiveItem(),
                panelHeight = this.getHeightById(activeItem && activeItem.id);

            cmp.setHeight(panelHeight);
        }
    },

    onTextColorItemTap: function(cmp, index, target, record) {
        var navigateView = this.getNavigateView();

        if (navigateView) {
            var cmpId = record.get('child');

            if (!Ext.isEmpty(cmpId)) {
                    var childCmp = Ext.getCmp(cmpId);

                if (childCmp)
                    navigateView.push(childCmp);
            }
        }
    },

    onHighlightListItemTap: function(cmp, index, target, record) {
        var noFillColorButton   = this.getNoFillColorButton(),
            highlightColorList  = this.getHighlightColorList();

        if (noFillColorButton && highlightColorList) {
            noFillColorButton.removeCls('x-button-pressing pressed');
            highlightColorList.select(record);

            var color = record.get('color'),
                r = color[0] + color[1],
                g = color[2] + color[3],
                b = color[4] + color[5];

            this.api && this.api.SetMarkerFormat(true, true, parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));

            Common.component.Analytics.trackEvent('ToolBar', 'Highlight Color');
        }
    },

    onNoFillColorTap: function(btn){
        var noFillColorButton   = this.getNoFillColorButton(),
            highlightColorList  = this.getHighlightColorList();

        if (noFillColorButton && highlightColorList) {
            if (!btn.element.hasCls('x-button-pressing pressed')) {
                highlightColorList.deselectAll();
                noFillColorButton.addCls('x-button-pressing pressed');

                this.api && this.api.SetMarkerFormat(true, false);

                Common.component.Analytics.trackEvent('ToolBar', 'Highlight Color');
            }
        }
    },

    onTextColorListItemTap: function(cmp, index, target, record) {
        var textColorList = this.getTextColorList();

        if (textColorList) {
            textColorList.select(record);

            var color = record.get('color'),
                ascColor = new CAscColor();

            ascColor.put_r(parseInt((color[0] + color[1]), 16));
            ascColor.put_g(parseInt((color[2] + color[3]), 16));
            ascColor.put_b(parseInt((color[4] + color[5]), 16));

            this.api && this.api.put_TextColor(ascColor);

            Common.component.Analytics.trackEvent('ToolBar', 'Text Color');
        }
    },

    scrollToSelected: function(view) {
        if (view && view.isXType('dataview')) {
            var el       = view.element,
                cls      = view.getSelectedCls(),
                selected = el.down('.' + cls),
                y;

            if (selected) {
                y = selected.dom.offsetTop;

                Ext.defer(function(){
                    var scroller = view.getScrollable().getScroller().getTranslatable()._element;

                    if (scroller && y > scroller.getHeight() - view.element.getHeight())
                        y = scroller.getHeight() - view.element.getHeight();

                    view.getScrollable().getScroller().scrollTo(0, y, true)
                }, 500);
            }
        }
    },

    animateSetHeight: function(cmp, height){
        if (Ext.isDefined(cmp)){
            cmp.setHeight(height);
//            Ext.Animator.run({
//                element: cmp.element,
//                preserveEndState: true,
//                to: {
//                    height: height
//                },
//                from: {
//                    height: cmp.element.getHeight()
//                }
//            });
        }
    },

    getHeightById: function(id){
        switch(id){
            case 'id-textcolor-root':       return 172;
            case 'id-textcolor-highlight':  return 326;
            default:
            case 'id-textcolor-text':       return 336;
        }
    },

    onNavigateViewPush: function(cmp, view) {
        this.animateSetHeight(cmp.getParent(), this.getHeightById(view.id));

        if (view.id == 'id-textcolor-highlight')
            this.scrollToSelected(this.getHighlightColorList());
        else if (view.id == 'id-textcolor-text')
            this.scrollToSelected(this.getTextColorList());
    },

    onNavigateViewPop: function(cmp, view) {
        //
    },

    onNavigateViewBack: function(cmp) {
        var parentCmp = cmp.getParent(),
            activeItem = cmp.getActiveItem();

        if (parentCmp && activeItem) {
            this.animateSetHeight(parentCmp, this.getHeightById(activeItem && activeItem.id));
        }
    },

    onApiTextColor: function(color) {
        if (this.getHandleApiEvent() && Ext.isDefined(color)) {
            var textColorList = this.getTextColorList();

            if (textColorList) {
                var colorToHex = function(r, g, b) {
                    var r = r.toString(16),
                        g = g.toString(16),
                        b = b.toString(16);

                    if (r.length == 1) r = '0' + r;
                    if (g.length == 1) g = '0' + g;
                    if (b.length == 1) b = '0' + b;

                    return (r + g + b).toUpperCase();
                };

                var hexColor = colorToHex(color.get_r(), color.get_g(), color.get_b()),
                    recColor = textColorList.getStore().findRecord('color', hexColor);

                if (recColor) {
                    textColorList.select(recColor);
                } else {
                    textColorList.deselectAll();
                }
            }
        }
    },

    onApiHighlightColor: function(color) {
        if (this.getHandleApiEvent() && Ext.isDefined(color)) {
            var textPara            = this.api.get_TextProps().get_TextPr(),
                highlightColorList  = this.getHighlightColorList(),
                noFillColorButton   = this.getNoFillColorButton();

            var pressNoColor = function() {
                highlightColorList.deselectAll();
                noFillColorButton.addCls('x-button-pressing pressed');
            };

            if (textPara) {
                color = textPara.get_HighLight();
                if (color == -1) {
                    pressNoColor();
                } else {
                    var hexColor = color.get_hex().toUpperCase();

                    if (highlightColorList) {
                        var recColor = highlightColorList.getStore().findRecord('color', hexColor);

                        if (recColor) {
                            noFillColorButton.removeCls('x-button-pressing pressed');
                            highlightColorList.select(recColor);
                        } else {
                            pressNoColor();
                        }
                    }
                }
            }
        }
    }
});
