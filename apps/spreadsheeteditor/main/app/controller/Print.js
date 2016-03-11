define([
    'core',
    'spreadsheeteditor/main/app/view/FileMenuPanels',
    'spreadsheeteditor/main/app/view/PrintSettings'
], function () {
    'use strict';

    SSE.Controllers.Print = Backbone.Controller.extend(_.extend({
        views: [
            'MainSettingsPrint'
        ],

        initialize: function() {
            this.adjPrintParams = new Asc.asc_CAdjustPrint();
            this.adjPrintParams.asc_setPrintType(c_oAscPrintType.ActiveSheets);
            this.adjPrintParams.asc_setLayoutPageType(c_oAscLayoutPageType.ActualSize);
            this.diffParams = {};

            this.addListeners({
                'MainSettingsPrint': {
                    'show': _.bind(this.onShowMainSettingsPrint, this),
                    'render:after': _.bind(this.onAfterRender, this)
                },
                'PrintSettings': {
                    'changerange': _.bind(this.onChangeRange,this)
                }
            });
        },

        onLaunch: function() {
            this.printSettings = this.createView('MainSettingsPrint');
        },

        onAfterRender: function(view) {
            this.printSettings.cmbSheet.on('selected', _.bind(this.comboSheetsChange, this));
            this.printSettings.btnOk.on('click', _.bind(this.querySavePrintSettings, this));
            var toolbar = SSE.getController('Toolbar').getView('Toolbar');
            if (toolbar)
                toolbar.mnuPrint.on('item:click', _.bind(this.openPrintSettings, this));
        },

        setApi: function(o) {
            this.api = o;
            this.api.asc_registerCallback('asc_onSheetsChanged', _.bind(this.updateSheetsInfo, this));
        },

        updateSheetsInfo: function() {
            if (this.printSettings.isVisible()) {
                this.updateSettings();
            } else {
                this.isFillSheets = false;
                this.diffParams = {};
            }
        },
        
        updateSettings: function() {
            var wc = this.api.asc_getWorksheetsCount(), i = -1;
            var items = [{displayValue: this.strAllSheets, value:-255}];

            while (++i < wc) {
                if (!this.api.asc_isWorksheetHidden(i)) {
                    items.push({
                        displayValue:this.api.asc_getWorksheetName(i),
                        value: i
                    });
                }
            }

            this.printSettings.cmbSheet.store.reset(items);
            var item = this.printSettings.cmbSheet.store.findWhere({value: this.printSettings.cmbSheet.getValue()}) ||
                       this.printSettings.cmbSheet.store.findWhere({value: this.api.asc_getActiveWorksheetIndex()});
            if (item) {
                this.printSettings.cmbSheet.setValue(item.get('value'));
            }
        },

        comboSheetsChange: function(combo, record) {
            var newvalue = record.value;
            if (newvalue == -255) {
                this.indeterminatePageOptions(this.printSettings);
            } else {
                this.fillPageOptions(this.printSettings, this.api.asc_getPageOptions(newvalue));
            }
        },

        isDiffRefill: function() {
            for (var item in this.diffParams) {
                if (this.diffParams[item] == undefined) return true;
            }

            return item == undefined;
        },

        indeterminatePageOptions: function(panel) {
            if (this.isDiffRefill()) {
                var wc = this.api.asc_getWorksheetsCount();
                if (wc == 1) {
                    this.diffParams.orientation = false;
                    this.diffParams.size = false;
                    this.diffParams.headings = false;
                    this.diffParams.grid = false;
                    this.diffParams.margintop = false;
                    this.diffParams.marginright = false;
                    this.diffParams.marginbottom = false;
                    this.diffParams.marginleft = false;
                } else {
                    var index = 0;
                    var opts = this.api.asc_getPageOptions(index), opts_next;

                    while (++index < wc) {
                        opts_next = this.api.asc_getPageOptions(index);

                        if (this.diffParams.orientation == undefined)
                            this.diffParams.orientation = opts.asc_getPageSetup().asc_getOrientation() != opts_next.asc_getPageSetup().asc_getOrientation();

                        if (this.diffParams.size == undefined)
                            this.diffParams.size = (opts.asc_getPageSetup().asc_getWidth() != opts_next.asc_getPageSetup().asc_getWidth() || opts.asc_getPageSetup().asc_getHeight() != opts_next.asc_getPageSetup().asc_getHeight());

                        if (this.diffParams.headings == undefined)
                            this.diffParams.headings = opts.asc_getHeadings() != opts_next.asc_getHeadings();

                        if (this.diffParams.grid == undefined)
                            this.diffParams.grid = opts.asc_getGridLines() != opts_next.asc_getGridLines();

                        if (this.diffParams.margintop == undefined)
                            this.diffParams.margintop = Math.abs(opts.asc_getPageMargins().asc_getTop()-opts_next.asc_getPageMargins().asc_getTop()) > 0.001;

                        if (this.diffParams.marginright == undefined)
                            this.diffParams.marginright = Math.abs(opts.asc_getPageMargins().asc_getRight() - opts_next.asc_getPageMargins().asc_getRight()) > 0.001;

                        if (this.diffParams.marginbottom == undefined)
                            this.diffParams.marginbottom = Math.abs(opts.asc_getPageMargins().asc_getBottom() - opts_next.asc_getPageMargins().asc_getBottom()) > 0.001;

                        if (this.diffParams.marginleft == undefined)
                            this.diffParams.marginleft = Math.abs(opts.asc_getPageMargins().asc_getLeft() - opts_next.asc_getPageMargins().asc_getLeft()) > 0.001;
                    }
                }
            }

            if (this.diffParams.orientation) panel.cmbPaperOrientation.setValue('-');
            if (this.diffParams.size) panel.cmbPaperSize.setValue('-');

            if (this.diffParams.margintop) panel.spnMarginTop.setValue('-');
            if (this.diffParams.marginright) panel.spnMarginRight.setValue('-');
            if (this.diffParams.marginbottom) panel.spnMarginBottom.setValue('-');
            if (this.diffParams.marginleft) panel.spnMarginLeft.setValue('-');

            if (this.diffParams.grid) panel.chPrintGrid.setValue('indeterminate');
            if (this.diffParams.headings) panel.chPrintRows.setValue('indeterminate');
        },

        fillPageOptions: function(panel, props) {
            var opt = props.asc_getPageSetup();

            var item = panel.cmbPaperOrientation.store.findWhere({value: opt.asc_getOrientation()});
            if (item) panel.cmbPaperOrientation.setValue(item.get('value'));

            var w = opt.asc_getWidth();
            var h = opt.asc_getHeight();

            item = panel.cmbPaperSize.store.findWhere({value: w+'|'+h});
            if (item)
                panel.cmbPaperSize.setValue(item.get('value'));
            else
                panel.cmbPaperSize.setValue('Custom (' + w +' x ' + h);

            opt = props.asc_getPageMargins();
            panel.spnMarginLeft.setValue(Common.Utils.Metric.fnRecalcFromMM(opt.asc_getLeft()));
            panel.spnMarginTop.setValue(Common.Utils.Metric.fnRecalcFromMM(opt.asc_getTop()));
            panel.spnMarginRight.setValue(Common.Utils.Metric.fnRecalcFromMM(opt.asc_getRight()));
            panel.spnMarginBottom.setValue(Common.Utils.Metric.fnRecalcFromMM(opt.asc_getBottom()));

            panel.chPrintGrid.setValue(props.asc_getGridLines());
            panel.chPrintRows.setValue(props.asc_getHeadings());
        },

        fillPrintOptions: function(panel, props) {
            panel.setRange(props.asc_getPrintType());
//            panel.setLayout(props.asc_getLayoutPageType());
        },

        getPageOptions: function(panel) {
            var props = new Asc.asc_CPageOptions();
            props.asc_setGridLines(panel.chPrintGrid.getValue() == 'indeterminate' ? undefined : panel.chPrintGrid.getValue()=='checked'?1:0);
            props.asc_setHeadings(panel.chPrintRows.getValue() == 'indeterminate' ? undefined : panel.chPrintRows.getValue()=='checked'?1:0);

            var opt = new Asc.asc_CPageSetup();
            opt.asc_setOrientation(panel.cmbPaperOrientation.getValue() == '-' ? undefined : panel.cmbPaperOrientation.getValue());

            var pagew = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
            var pageh = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());

//        if (pagew && pageh) {
            opt.asc_setWidth(!pagew ? undefined : parseFloat(pagew[0]));
            opt.asc_setHeight(!pageh? undefined : parseFloat(pageh[0]));
//        }

            props.asc_setPageSetup(opt);

            opt = new Asc.asc_CPageMargins();
            opt.asc_setLeft(panel.spnMarginLeft.getValue() == '-' ? undefined : Common.Utils.Metric.fnRecalcToMM(panel.spnMarginLeft.getNumberValue()));    // because 1.91*10=19.0999999...
            opt.asc_setTop(panel.spnMarginTop.getValue() == '-' ? undefined : Common.Utils.Metric.fnRecalcToMM(panel.spnMarginTop.getNumberValue()));
            opt.asc_setRight(panel.spnMarginRight.getValue() == '-' ? undefined : Common.Utils.Metric.fnRecalcToMM(panel.spnMarginRight.getNumberValue()));
            opt.asc_setBottom(panel.spnMarginBottom.getValue() == '-' ? undefined : Common.Utils.Metric.fnRecalcToMM(panel.spnMarginBottom.getNumberValue()));

            props.asc_setPageMargins(opt);

            return props;
        },

        savePageOptions: function(panel, index) {
            var opts = this.getPageOptions(panel);

            if (index == -255) {
                var wc = this.api.asc_getWorksheetsCount();
                index = -1;

                while (++index < wc) {
                    this.api.asc_setPageOptions(opts, index);
                }

                if (this.diffParams.orientation) this.diffParams.orientation = opts.asc_getPageSetup().asc_getOrientation() == undefined;
                if (this.diffParams.size) this.diffParams.size = (opts.asc_getPageSetup().asc_getWidth() == undefined || opts.asc_getPageSetup().asc_getHeight() == undefined);
                if (this.diffParams.headings) this.diffParams.headings = opts.asc_getHeadings() == undefined;
                if (this.diffParams.grid) this.diffParams.grid = opts.asc_getGridLines() == undefined;
                if (this.diffParams.margintop) this.diffParams.margintop = opts.asc_getPageMargins().asc_getTop() == undefined;
                if (this.diffParams.marginright) this.diffParams.marginright = opts.asc_getPageMargins().asc_getRight() == undefined;
                if (this.diffParams.marginbottom) this.diffParams.marginbottom = opts.asc_getPageMargins().asc_getBottom() == undefined;
                if (this.diffParams.marginleft) this.diffParams.marginleft = opts.asc_getPageMargins().asc_getLeft() == undefined;
            } else {
                this.api.asc_setPageOptions(opts, index);
                this.diffParams = {};
            }
        },

        onShowMainSettingsPrint: function() {
            if (!this.isFillSheets) {
                this.isFillSheets = true;
                this.updateSettings();
            }

            if (!this.isUpdatedSettings) {
                this.isUpdatedSettings = true;

                var item = this.printSettings.cmbSheet.store.findWhere({value: this.api.asc_getActiveWorksheetIndex()});
                if (item) {
                    this.printSettings.cmbSheet.setValue(item.get('value'));
                    this.comboSheetsChange(this.printSettings.cmbSheet, item.toJSON());
                }
            }
        },

        openPrintSettings: function(menu, item) {
            if (item.value === 'options' && this.api ) {
                this.printSettingsDlg = (new SSE.Views.PrintSettings({
                    handler: _.bind(this.resultPrintSettings,this),
                    afterrender: _.bind(function() {
                        this.fillPageOptions(this.printSettingsDlg, this.api.asc_getPageOptions());
                        this.fillPrintOptions(this.printSettingsDlg, this.adjPrintParams);
                    },this)
                }));
                this.printSettingsDlg.show();
            }
        },

        resultPrintSettings: function(result, value) {
            var view = SSE.getController('Toolbar').getView('Toolbar');
            if (result == 'ok') {
                if ( this.checkMargins(this.printSettingsDlg) ) {
                    this.savePageOptions(this.printSettingsDlg, this.printSettingsDlg.getRange() == c_oAscPrintType.EntireWorkbook ? -255:undefined);

                    this.adjPrintParams.asc_setPrintType(this.printSettingsDlg.getRange());
//                    this.adjPrintParams.asc_setLayoutPageType(this.printSettingsDlg.getLayout());
                    this.api.asc_Print(this.adjPrintParams, Common.Utils.isChrome || Common.Utils.isSafari || Common.Utils.isOpera);

                    this.isUpdatedSettings = false;
                } else
                    return true;
            }

            Common.NotificationCenter.trigger('edit:complete', view);
        },

        onChangeRange: function() {
            var newvalue = this.printSettingsDlg.getRange();
            if (newvalue == c_oAscPrintType.EntireWorkbook) {
                this.indeterminatePageOptions(this.printSettingsDlg);
            } else if (this.lastCheckedRange == c_oAscPrintType.EntireWorkbook) {
                this.fillPageOptions(this.printSettingsDlg, this.api.asc_getPageOptions());
            }
            this.lastCheckedRange = newvalue;
        },

        querySavePrintSettings: function() {
            if ( this.checkMargins(this.printSettings) ) {
                this.savePageOptions(this.printSettings, this.printSettings.cmbSheet.getValue());
                this.printSettings.applySettings();
            }
        },

        checkMargins: function(panel) {
            if (panel.cmbPaperOrientation.getValue() == c_oAscPageOrientation.PagePortrait) {
                var pagewidth = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
                var pageheight = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());
            } else {
                pageheight = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
                pagewidth = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());
            }
            pagewidth = parseFloat(pagewidth[0]);
            pageheight = parseFloat(pageheight[0]);

            var ml = Common.Utils.Metric.fnRecalcToMM(panel.spnMarginLeft.getNumberValue());
            var mr = Common.Utils.Metric.fnRecalcToMM(panel.spnMarginRight.getNumberValue());
            var mt = Common.Utils.Metric.fnRecalcToMM(panel.spnMarginTop.getNumberValue());
            var mb = Common.Utils.Metric.fnRecalcToMM(panel.spnMarginBottom.getNumberValue());

            var result = false;
            if (ml > pagewidth) result = 'left'; else
            if (mr > pagewidth-ml) result = 'right'; else
            if (mt > pageheight) result = 'top'; else
            if (mb > pageheight-mt) result = 'bottom';

            if (result) {
                Common.UI.warning({
                    title: this.textWarning,
                    msg: this.warnCheckMargings,
                    callback: function(btn,text) {
                        switch(result) {
                            case 'left':    panel.spnMarginLeft.$el.focus(); return;
                            case 'right':   panel.spnMarginRight.$el.focus(); return;
                            case 'top':     panel.spnMarginTop.$el.focus(); return;
                            case 'bottom':  panel.spnMarginBottom.$el.focus(); return;
                        }
                    }
                });

                return false;
            }

            return true;
        },

        warnCheckMargings:      'Margins are incorrect',
        strAllSheets:           'All Sheets',
        textWarning: 'Warning'
    }, SSE.Controllers.Print || {}));
});