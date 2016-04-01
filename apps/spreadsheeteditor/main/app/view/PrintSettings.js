/**
 *  PrintSettings.js
 *
 *  Created by Julia Radzhabova on 4/03/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([    'text!spreadsheeteditor/main/app/template/PrintSettings.template',
    'common/main/lib/view/AdvancedSettingsWindow',
    'common/main/lib/component/MetricSpinner',
    'common/main/lib/component/CheckBox',
    'common/main/lib/component/RadioBox',
    'common/main/lib/component/ListView'
], function (contentTemplate) {
    'use strict';

    SSE.Views.PrintSettings = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            alias: 'PrintSettings',
            contentWidth: 280,
            height: 471
        },

        initialize : function(options) {
            _.extend(this.options, {
                title: this.textTitle,
                template: [
                    '<div class="box" style="height:' + (this.options.height-85) + 'px;">',
                        '<div class="menu-panel" style="overflow: hidden;">',
                            '<div style="height: 42px; line-height: 42px;" class="div-category">' + this.textPrintRange + '</div>',
                            '<div style="height: 52px; line-height: 66px;" class="div-category">' + this.textSettings + '</div>',
                            '<div style="height: 38px; line-height: 38px;" class="div-category">' + this.textPageSize + '</div>',
                            '<div style="height: 38px; line-height: 38px;" class="div-category">' + this.textPageOrientation + '</div>',
                            '<div style="height: 38px; line-height: 38px;" class="div-category">' + this.textScaling + '</div>',
                            '<div style="height: 108px; line-height: 33px;" class="div-category">' + this.strMargins + '</div>',
                            '<div style="height: 58px; line-height: 40px;" class="div-category">' + this.strPrint + '</div>',
                        '</div>',
                        '<div class="content-panel">' + _.template(contentTemplate)({scope: this}) + '</div>',
                    '</div>',
                    '<div class="separator horizontal"/>',
                    '<div class="footer justify">',
                        '<button id="printadv-dlg-btn-hide" class="btn btn-text-default" style="margin-right: 55px; width: 100px;">' + this.textHideDetails + '</button>',
                        '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;  width: 150px;">' + this.btnPrint + '</button>',
                        '<button class="btn normal dlg-btn" result="cancel" style="width: 86px;">' + this.cancelButtonText + '</button>',
                    '</div>'
                ].join('')
            }, options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this.spinners = [];
        },

        render: function() {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);

            this.cmbRange = new Common.UI.ComboBox({
                el          : $('#printadv-dlg-combo-range'),
                style       : 'width: 132px;',
                menuStyle   : 'min-width: 132px;max-height: 280px;',
                editable    : false,
                cls         : 'input-group-nr',
                 data        : [
                    { value: c_oAscPrintType.ActiveSheets, displayValue: this.textCurrentSheet },
                    { value: c_oAscPrintType.EntireWorkbook, displayValue: this.textAllSheets },
                    { value: c_oAscPrintType.Selection, displayValue: this.textSelection }
                ]
            });
            this.cmbRange.on('selected', _.bind(this.comboRangeChange, this));

            this.cmbSheet = new Common.UI.ComboBox({
                el          : $('#printadv-dlg-combo-sheets'),
                style       : 'width: 242px;',
                menuStyle   : 'min-width: 242px;max-height: 280px;',
                editable    : false,
                cls         : 'input-group-nr',
                data        : []
            });

            this.cmbPaperSize = new Common.UI.ComboBox({
                el          : $('#printadv-dlg-combo-pages'),
                style       : 'width: 242px;',
                menuStyle   : 'max-height: 280px; min-width: 242px;',
                editable    : false,
                cls         : 'input-group-nr',
                data : [
                    {value:'215.9|279.4',    displayValue:'US Letter (21,59cm x 27,94cm)'},
                    {value:'215.9|355.6',    displayValue:'US Legal (21,59cm x 35,56cm)'},
                    {value:'210|297',        displayValue:'A4 (21cm x 29,7cm)'},
                    {value:'148.1|209.9',    displayValue:'A5 (14,81cm x 20,99cm)'},
                    {value:'176|250.1',      displayValue:'B5 (17,6cm x 25,01cm)'},
                    {value:'104.8|241.3',    displayValue:'Envelope #10 (10,48cm x 24,13cm)'},
                    {value:'110.1|220.1',    displayValue:'Envelope DL (11,01cm x 22,01cm)'},
                    {value:'279.4|431.7',    displayValue:'Tabloid (27,94cm x 43,17cm)'},
                    {value:'297|420.1',      displayValue:'A3 (29,7cm x 42,01cm)'},
                    {value:'304.8|457.1',    displayValue:'Tabloid Oversize (30,48cm x 45,71cm)'},
                    {value:'196.8|273',      displayValue:'ROC 16K (19,68cm x 27,3cm)'},
                    {value:'119.9|234.9',    displayValue:'Envelope Choukei 3 (11,99cm x 23,49cm)'},
                    {value:'330.2|482.5',    displayValue:'Super B/A3 (33,02cm x 48,25cm)'}
                ]
            });

            this.cmbPaperOrientation = new Common.UI.ComboBox({
                el          : $('#printadv-dlg-combo-orient'),
                style       : 'width: 132px;',
                menuStyle   : 'min-width: 132px;',
                editable    : false,
                cls         : 'input-group-nr',
                data        : [
                    { value: c_oAscPageOrientation.PagePortrait, displayValue: this.strPortrait },
                    { value: c_oAscPageOrientation.PageLandscape, displayValue: this.strLandscape }
                ]
            });

            this.chPrintGrid = new Common.UI.CheckBox({
                el: $('#printadv-dlg-chb-grid'),
                labelText: this.textPrintGrid
            });

            this.chPrintRows = new Common.UI.CheckBox({
                el: $('#printadv-dlg-chb-rows'),
                labelText: this.textPrintHeadings
            });

            this.spnMarginTop = new Common.UI.MetricSpinner({
                el: $('#printadv-dlg-spin-margin-top'),
                step: .1,
                width: 110,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 48.25,
                minValue: 0
            });
            this.spinners.push(this.spnMarginTop);

            this.spnMarginBottom = new Common.UI.MetricSpinner({
                el: $('#printadv-dlg-spin-margin-bottom'),
                step: .1,
                width: 110,
                defaultUnit : "cm",
                value: '0 cm',
                maxValue: 48.25,
                minValue: 0
            });
            this.spinners.push(this.spnMarginBottom);

            this.spnMarginLeft = new Common.UI.MetricSpinner({
                el: $('#printadv-dlg-spin-margin-left'),
                step: .1,
                width: 110,
                defaultUnit : "cm",
                value: '0.19 cm',
                maxValue: 48.25,
                minValue: 0
            });
            this.spinners.push(this.spnMarginLeft);

            this.spnMarginRight = new Common.UI.MetricSpinner({
                el: $('#printadv-dlg-spin-margin-right'),
                step: .1,
                width: 110,
                defaultUnit : "cm",
                value: '0.19 cm',
                maxValue: 48.25,
                minValue: 0
            });
            this.spinners.push(this.spnMarginRight);

            this.cmbLayout = new Common.UI.ComboBox({
                el          : $('#printadv-dlg-combo-layout'),
                style       : 'width: 242px;',
                menuStyle   : 'min-width: 242px;',
                editable    : false,
                cls         : 'input-group-nr',
                data        : [
                    { value: 0, displayValue: this.textActualSize },
                    { value: 1, displayValue: this.textFitPage },
                    { value: 2, displayValue: this.textFitCols },
                    { value: 3, displayValue: this.textFitRows }
                ]
            });

            this.btnHide = new Common.UI.Button({
                el: $('#printadv-dlg-btn-hide')
            });
            this.btnHide.on('click', _.bind(this.handlerShowDetails, this));

            this.panelDetails = $('#printadv-dlg-content-to-hide');
            this.updateMetricUnit();
            this.options.afterrender && this.options.afterrender.call(this);

            var value = Common.localStorage.getItem("sse-hide-print-settings");
            this.extended = (value!==null && parseInt(value)==0);
            this.handlerShowDetails(this.btnHide);
        },

        setRange: function(value) {
            this.cmbRange.setValue(value);
        },

        getRange: function() {
            return this.cmbRange.getValue();
        },

        comboRangeChange: function(combo, record) {
            this.fireEvent('changerange', this);
        },

        updateMetricUnit: function() {
            if (this.spinners) {
                for (var i=0; i<this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        },

        handlerShowDetails: function(btn) {
            if (!this.extended) {
                this.extended = true;
                this.panelDetails.css({'display': 'none'});
                this.setHeight(303);
                btn.setCaption(this.textShowDetails);
                Common.localStorage.setItem("sse-hide-print-settings", 1);
            } else {
                this.extended = false;
                this.panelDetails.css({'display': 'block'});
                this.setHeight(471);
                btn.setCaption(this.textHideDetails);
                Common.localStorage.setItem("sse-hide-print-settings", 0);
            }
        },

        textTitle:              'Print Settings',
        strLeft:                'Left',
        strRight:               'Right',
        strTop:                 'Top',
        strBottom:              'Bottom',
        strPortrait:            'Portrait',
        strLandscape:           'Landscape',
        textPrintGrid:          'Print Gridlines',
        textPrintHeadings:      'Print Rows and Columns Headings',
        textPageSize:           'Page Size',
        textPageOrientation:    'Page Orientation',
        strMargins:             'Margins',
        strPrint:               'Print',
        btnPrint:               'Save & Print',
        textPrintRange:         'Print Range',
        textLayout:             'Layout',
        textCurrentSheet:       'Current Sheet',
        textAllSheets:          'All Sheets',
        textSelection:          'Selection',
        textActualSize:         'Actual Size',
        textFitPage:            'Fit Sheet on One Page',
        textFitCols:            'Fit All Columns on One Page',
        textFitRows:            'Fit All Rows on One Page',
        textShowDetails:        'Show Details',
        cancelButtonText:       'Cancel',
        textHideDetails:        'Hide Details',
        textScaling:            'Scaling',
        textSettings:           'Sheet Settings'
    }, SSE.Views.PrintSettings || {}));
});