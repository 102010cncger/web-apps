Ext.define('DE.controller.tablet.panel.Font', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            fontPanel           : 'fontpanel',
            navigateView        : '#id-font-navigate',
            fontSizeSpinner     : 'fontpanel planarspinnerfield',
            fontView            : '#id-font-root',
            fontNameView        : '#id-font-name',
            fontNameButton      : '#id-btn-fontname',
            fontButton          : '#id-tb-btn-font',
            fontBaseToggle      : '#id-toggle-baseline',
            fontBaseUp          : '#id-btn-baseline-up',
            fontBaseDown        : '#id-btn-baseline-down'
        },

        control: {
            fontPanel       : {
                show    : 'onFontPanelShow',
                hide    : 'onFontPanelHide'
            },
            navigateView    : {
                push    : 'onNavigateViewPush',
                pop     : 'onNavigateViewPop',
                back    : 'onNavigateViewBack'
            },
            fontNameButton  : {
                tap     : 'onFontNameButtonTap'
            },
            fontSizeSpinner : {
                blur    : 'onFontSizeSpinnerBlur',
                focus   : 'onFontSizeSpinnerFocus',
                keyup   : 'onFontSizeSpinnerKeyUp',
                spin    : 'onFontSizeSpinnerSpin'
            },
            fontNameView    : {
                select  : 'onFontNameSelect',
                itemtap : 'onFontNameItemTap'
            },
            fontBaseUp      : {
                tap     : 'onFontBaseUpTap'
            },
            fontBaseDown    : {
                tap     : 'onFontBaseDownTap'
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
            this.api.asc_registerCallback('asc_onFontFamily',           Ext.bind(this.onApiFontChange, this));
            this.api.asc_registerCallback('asc_onInitEditorFonts',      Ext.bind(this.onApiLoadFonts, this)); // deprecated
            this.api.asc_registerCallback('asc_onFontSize',             Ext.bind(this.onApiFontSize, this));
            this.api.asc_registerCallback('asc_onVerticalAlign',        Ext.bind(this.onApiVerticalAlign, this));
            this.api.asc_registerCallback('asc_onDocumentContentReady', Ext.bind(this.onDocumentContentReady, this));
        }
    },

    onFontPanelShow: function(cmp) {
        this.setHandleApiEvent(true);

        // update ui data
        this.api && this.api.UpdateInterfaceState();
    },

    onFontPanelHide: function(cmp) {
        this.setHandleApiEvent(false);

        var navigateView    = this.getNavigateView(),
            fontSizeSpinner = this.getFontSizeSpinner();

        if (fontSizeSpinner) {
            Ext.defer(function(){
                fontSizeSpinner.blur();
            }, 200);
        }

        if (navigateView) {
            navigateView.reset();
            navigateView.addCls('plain');
            navigateView.getNavigationBar().hide();

            var activeItem = navigateView.getActiveItem(),
                panelSize = this.getSizeById(activeItem && activeItem.id);

            cmp.setSize(panelSize.width, panelSize.height);
        }
    },

    onFontNameButtonTap: function() {
        var navigateView = this.getNavigateView(),
            fontNameView = this.getFontNameView();

        if (navigateView) {
            var navigationBar = navigateView.getNavigationBar();

            if (navigationBar)
                navigationBar.show();

            navigateView.push(fontNameView);
        }
    },

    onFontSizeSpinnerFocus: function() {
        this.api && this.api.asc_enableKeyEvents(false);
    },

    onFontSizeSpinnerBlur: function(field) {
        this.api && this.api.asc_enableKeyEvents(true);

        this.getFontSizeSpinner().setValue(field.getValue());

        if (this.api) {
            this.api.put_TextPrFontSize(field.getValue());

            Common.component.Analytics.trackEvent('ToolBar', 'Font Size');
        }
    },

    onFontSizeSpinnerKeyUp: function(field, event) {
        if (event.browserEvent.keyCode == 13 ||
            event.browserEvent.keyCode == 10) {
            event.stopEvent();
            field.element.dom.blur();

            if (this.api) {
                this.api.put_TextPrFontSize(field.getValue());

                Common.component.Analytics.trackEvent('ToolBar', 'Font Size');
            }
        }
    },

    onFontSizeSpinnerSpin: function(spin, value) {
        if (this.api) {
            this.api.put_TextPrFontSize(value);

            Common.component.Analytics.trackEvent('ToolBar', 'Font Size');
        }
    },

    getSizeById: function(id){
        switch(id){
            case 'id-font-name':    return {width: 350, height: 300};
            default:
            case 'id-font-root':    return {width: 440, height: 46};
        }
    },

    toggleSegmentedButton: function(btn) {
        var toggler = this.getFontBaseToggle();

        if (toggler) {
            var pressedButtonsNew = [];

            if (btn)
                pressedButtonsNew.push(btn);

            toggler.setPressedButtons(pressedButtonsNew);
        }
    },

//    scrollToSelectFont: function() {
//        var fontNameView = this.getFontNameView();
//
//        if (fontNameView) {
//            var el       = fontNameView.element,
//                cls      = fontNameView.getSelectedCls(),
//                selected = el.down('.' + cls),
//                y;
//
//            if (selected) {
//                y = selected.dom.offsetTop;
//
//                fontNameView.getScrollable().getScroller().scrollTo(0, y, true);
//            }
//        }
//    },

    onNavigateViewPush: function(cmp, view) {
        var parentCmp = cmp.getParent(),
            panelSize = this.getSizeById(view && view.id);

        if (parentCmp) {
            parentCmp.setSize(panelSize.width, panelSize.height);

            var navigationView = this.getNavigateView();

            if (navigationView){
                navigationView.removeCls('plain');
                navigationView.getNavigationBar().show();
            }

            var fontButton = this.getFontButton();

            if (fontButton)
                parentCmp.alignTo(fontButton);

//            if (view && view.id == 'id-font-name') {
//                this.scrollToSelectFont();
//            }
        }
    },

    onNavigateViewPop: function(cmp, view) {
//        //
    },

    onNavigateViewBack: function(cmp) {
        var parentCmp  = cmp.getParent(),
            activeItem = cmp.getActiveItem(),
            panelSize  = this.getSizeById(activeItem && activeItem.id);


        if (activeItem && activeItem.id == 'id-font-root') {
            var navigationView = this.getNavigateView();

            if (navigationView) {
                navigationView.addCls('plain');
                navigationView.getNavigationBar().hide();
            }
        }

        if (parentCmp) {
            parentCmp.setSize(panelSize.width, panelSize.height);

            var fontButton = this.getFontButton();

            if (fontButton)
                parentCmp.alignTo(fontButton);
        }
    },

    onFontNameSelect: function(cmp, rec) {
        var fontNameButton = this.getFontNameButton();

        if (fontNameButton) {
            fontNameButton.setText(rec.get('setting'));
        }
    },

    onFontNameItemTap: function(cmp, index, item, rec) {
        if (this.api) {
            this.api.put_TextPrFontName(rec.get('setting'));

            Common.component.Analytics.trackEvent('ToolBar', 'Font Name');
        }
    },

    onFontBaseUpTap: function(btn) {
        if (this.api) {
            var toggler = this.getFontBaseToggle();

            if (toggler) {
                this.api.put_TextPrBaseline(toggler.isPressed(btn) ? 1 : 0);

                Common.component.Analytics.trackEvent('ToolBar', 'Superscript');
            }
        }
    },

    onFontBaseDownTap: function(btn) {
        if (this.api) {
            var toggler = this.getFontBaseToggle();

            if (toggler) {
                this.api.put_TextPrBaseline(toggler.isPressed(btn) ? 2 : 0);

                Common.component.Analytics.trackEvent('ToolBar', 'Subscript');
            }
        }
    },

    onDocumentContentReady: function() {
    },

    onApiFontChange: function(font) {
        if (this.getHandleApiEvent()) {
            var fontNameView = this.getFontNameView();

            if (fontNameView) {
                var fontName = font.get_Name(),
                    fontRec = fontNameView.getStore().findRecord('setting', fontName);

                if (fontRec) {
                    fontNameView.select(fontRec);
                }
            }
        }
    },

    onApiLoadFonts: function(fl) {
        var fontNameView = this.getFontNameView();

        if (fontNameView) {
            var rawFontsArray = [];
            Ext.each(fl, function(font){
                rawFontsArray.push({
                    setting : font.asc_getFontName(),
                    group   : 'font'
                });
            });

            fontNameView.getStore().setData(rawFontsArray);
        }
    },

    onApiFontSize: function(size) {
        if (this.getHandleApiEvent()) {
            var fontSizeSpinner = this.getFontSizeSpinner();

            if (fontSizeSpinner)
                fontSizeSpinner.setValue(size);
//        if (!this.flg.setFontSize) {
////            var str_size = size + ' pt';
//            var str_size = String(size);
//            if (this.cmbFontSize.getValue() != str_size) {
//                this.cmbFontSize.setValue(str_size);
////                this.cmbFontSize.setRawValue(this.cmbFontSize.getValue() + ' pt');
//            }
//        }
        }
    },

    onApiVerticalAlign: function(type) {
        if (this.getHandleApiEvent()) {
            switch(type) {
                case 1:
                    this.toggleSegmentedButton(this.getFontBaseUp());
                    break;
                case 2:
                    this.toggleSegmentedButton(this.getFontBaseDown());
                    break;
                default:
                    this.toggleSegmentedButton();
            }
        }
    }
});