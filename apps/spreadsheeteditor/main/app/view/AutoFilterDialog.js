/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html).
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute.
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
/**
 *  AutoFilterDialog.js
 *
 *  Create filter for cell dialog.
 *
 *  Created by Alexey.Musinov on 22/04/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'common/main/lib/component/Window',
    'common/main/lib/component/ColorPaletteExt'
], function () {
    'use strict';

    SSE.Views = SSE.Views || {};

    SSE.Views.DigitalFilterDialog = Common.UI.Window.extend(_.extend({

        initialize: function (options) {
            var t = this, _options = {};

            _.extend(_options,  {
                width           : 500,
                height          : 230,
                contentWidth    : 180,
                header          : true,
                cls             : 'filter-dlg',
                contentTemplate : '',
                title           : t.txtTitle,
                items           : []
            }, options);

            this.template   =   options.template || [
                '<div class="box" style="height:' + (_options.height - 85) + 'px;">',
                    '<div class="content-panel" >',
                        '<label class="header">', t.textShowRows, '</label>',
                        '<div style="margin-top:15px;">',
                            '<div id="id-search-begin-digital-combo" class="input-group-nr" style="vertical-align:top;width:225px;display:inline-block;"></div>',
                            '<div id="id-sd-cell-search-begin" class="" style="width:225px;display:inline-block;margin-left:18px;"></div>',
                        '</div>',
                        '<div>',
                            '<div id="id-and-radio" class="padding-small" style="display: inline-block; margin-top:10px;"></div>',
                            '<div id="id-or-radio" class="padding-small" style="display: inline-block; margin-left:25px;"></div>',
                        '</div>',
                        '<div style="margin-top:10px;">',
                            '<div id="id-search-end-digital-combo" class="input-group-nr" style="vertical-align:top;width:225px;display:inline-block;"></div>',
                            '<div id="id-sd-cell-search-end" class="" style="width:225px;display:inline-block;margin-left:18px;"></div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="separator horizontal" style="width:100%"></div>',
                '<div class="footer right" style="margin-left:-15px;">',
                    '<button class="btn normal dlg-btn primary" result="ok" style="margin-right:10px;">', t.okButtonText, '</button>',
                    '<button class="btn normal dlg-btn" result="cancel">', t.cancelButtonText, '</button>',
                '</div>'
            ].join('');

            this.api        =   options.api;
            this.handler    =   options.handler;
            this.type       =   options.type || 'number';

            _options.tpl    =   _.template(this.template, _options);

            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            
            this.conditions = [
                {value: Asc.c_oAscCustomAutoFilter.equals,                   displayValue: this.capCondition1},
                {value: Asc.c_oAscCustomAutoFilter.doesNotEqual,             displayValue: this.capCondition2},
                {value: Asc.c_oAscCustomAutoFilter.isGreaterThan,            displayValue: this.capCondition3},
                {value: Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo,   displayValue: this.capCondition4},
                {value: Asc.c_oAscCustomAutoFilter.isLessThan,               displayValue: this.capCondition5},
                {value: Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo,      displayValue: this.capCondition6}
            ];
            if (this.type=='text') this.conditions = this.conditions.concat([
                {value: Asc.c_oAscCustomAutoFilter.beginsWith,               displayValue: this.capCondition7},
                {value: Asc.c_oAscCustomAutoFilter.doesNotBeginWith,         displayValue: this.capCondition8},
                {value: Asc.c_oAscCustomAutoFilter.endsWith,                 displayValue: this.capCondition9},
                {value: Asc.c_oAscCustomAutoFilter.doesNotEndWith,           displayValue: this.capCondition10},
                {value: Asc.c_oAscCustomAutoFilter.contains,                 displayValue: this.capCondition11},
                {value: Asc.c_oAscCustomAutoFilter.doesNotContain,           displayValue: this.capCondition12}
            ]);

            this.cmbCondition1 = new Common.UI.ComboBox({
                el          : $('#id-search-begin-digital-combo', this.$window),
                menuStyle   : 'min-width: 225px;',
                cls         : 'input-group-nr',
                data        : this.conditions,
                editable    : false
            });
            this.cmbCondition1.setValue(Asc.c_oAscCustomAutoFilter.equals);

            this.conditions.splice(0, 0,  {value: 0, displayValue: this.textNoFilter});

            this.cmbCondition2 = new Common.UI.ComboBox({
                el          : $('#id-search-end-digital-combo', this.$window),
                menuStyle   : 'min-width: 225px;',
                cls         : 'input-group-nr',
                data        : this.conditions,
                editable    : false
            });
            this.cmbCondition2.setValue(0);

            this.rbAnd = new Common.UI.RadioBox({
                el: $('#id-and-radio', this.$window),
                labelText: this.capAnd,
                name : 'asc-radio-filter-tab',
                checked: true
            });

            this.rbOr = new Common.UI.RadioBox({
                el: $('#id-or-radio', this.$window),
                labelText: this.capOr,
                name : 'asc-radio-filter-tab'
            });

            this.txtValue1 = new Common.UI.InputField({
                el          : $('#id-sd-cell-search-begin', this.$window),
                template: _.template([
                    '<div class="input-field" style="<%= style %>">',
                    '<input ',
                    'type="<%= type %>" ',
                    'name="<%= name %>" ',
                    'class="form-control <%= cls %>" style="float:none" ',
                    'placeholder="<%= placeHolder %>" ',
                    'value="<%= value %>"',
                    '>',
                    '</div>'].join('')),
                allowBlank  : true,
                validateOnChange: true,
                validation  : function () { return true; }
            });
            this.txtValue2 = new Common.UI.InputField({
                el          : $('#id-sd-cell-search-end', this.$window),
                template: _.template([
                    '<div class="input-field" style="<%= style %>">',
                    '<input ',
                    'type="<%= type %>" ',
                    'name="<%= name %>" ',
                    'class="form-control <%= cls %>" style="float:none" ',
                    'placeholder="<%= placeHolder %>" ',
                    'value="<%= value %>"',
                    '>',
                    '</div>'].join('')),
                allowBlank  : true,
                validateOnChange: true,
                validation  : function () { return true; }
            });

            this.$window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));

            this.loadDefaults();
        },
        show: function () {
            Common.UI.Window.prototype.show.call(this);

            var me  = this;
            _.defer(function () {
                if (me.txtValue1) {
                    me.txtValue1.focus();
                }
            }, 500);
        },

        close: function () {
            if (this.api) {
                this.api.asc_enableKeyEvents(true);
            }
            Common.UI.Window.prototype.close.call(this);
        },

        onBtnClick: function (event) {
            if (event.currentTarget.attributes &&  event.currentTarget.attributes.result) {
                if ('ok' === event.currentTarget.attributes.result.value) {
                    this.save();
                }

                this.close();
            }
        },

        setSettings: function (properties) {
            this.properties = properties;
        },

        loadDefaults: function () {
            if (this.properties && this.rbOr && this.rbAnd &&
                this.cmbCondition1 && this.cmbCondition2 && this.txtValue1 && this.txtValue2) {

                var filterObj = this.properties.asc_getFilterObj();
                if (filterObj.asc_getType() == Asc.c_oAscAutoFilterTypes.CustomFilters) {
                    var customFilter = filterObj.asc_getFilter(),
                        customFilters = customFilter.asc_getCustomFilters();
                    
                    (customFilter.asc_getAnd()) ? this.rbAnd.setValue(true) : this.rbOr.setValue(true);

                    this.cmbCondition1.setValue(customFilters[0].asc_getOperator() || Asc.c_oAscCustomAutoFilter.equals);
                    this.cmbCondition2.setValue((customFilters.length>1) ? (customFilters[1].asc_getOperator() || 0) : 0);

                    this.txtValue1.setValue(null === customFilters[0].asc_getVal() ? '' : customFilters[0].asc_getVal());
                    this.txtValue2.setValue((customFilters.length>1) ? (null === customFilters[1].asc_getVal() ? '' : customFilters[1].asc_getVal()) : '');
                }
            }
        },
        save: function () {
            if (this.api && this.properties && this.rbOr && this.rbAnd &&
                this.cmbCondition1 && this.cmbCondition2 && this.txtValue1 && this.txtValue2) {

                var filterObj = this.properties.asc_getFilterObj();
                filterObj.asc_setFilter(new Asc.CustomFilters());
                filterObj.asc_setType(Asc.c_oAscAutoFilterTypes.CustomFilters);

                var customFilter = filterObj.asc_getFilter();
                customFilter.asc_setCustomFilters((this.cmbCondition2.getValue() == 0) ? [new Asc.CustomFilter()] : [new Asc.CustomFilter(), new Asc.CustomFilter()]);

                var customFilters = customFilter.asc_getCustomFilters();

                customFilter.asc_setAnd(this.rbAnd.getValue());
                customFilters[0].asc_setOperator(this.cmbCondition1.getValue());
                customFilters[0].asc_setVal(this.txtValue1.getValue());
                if (this.cmbCondition2.getValue() !== 0) {
                    customFilters[1].asc_setOperator(this.cmbCondition2.getValue() || undefined);
                    customFilters[1].asc_setVal(this.txtValue2.getValue());
                }

                this.api.asc_applyAutoFilter('digitalFilter', this.properties);
            }
        },

        onPrimary: function() {
            this.save();
            this.close();
            return false;
        },

        cancelButtonText    : "Cancel",
        capAnd              : "And",
        capCondition1       : "equals",
        capCondition10      : "does not end with",
        capCondition11      : "contains",
        capCondition12      : "does not contain",
        capCondition2       : "does not equal",
        capCondition3       : "is greater than",
        capCondition4       : "is greater than or equal to",
        capCondition5       : "is less than",
        capCondition6       : "is less than or equal to",
        capCondition7       : "begins with",
        capCondition8       : "does not begin with",
        capCondition9       : "ends with",
        capOr               : "Or",
        textNoFilter        : "no filter",
        textShowRows        : "Show rows where",
        textUse1            : "Use ? to present any single character",
        textUse2            : "Use * to present any series of character",
        txtTitle            : "Custom Filter"

    }, SSE.Views.DigitalFilterDialog || {}));

    SSE.Views.AutoFilterDialog = Common.UI.Window.extend(_.extend({

        initialize: function (options) {
            var t = this, _options = {};

            _.extend(_options, {
                width           : 423,
                height          : 326,
                contentWidth    : 400,
                header          : true,
                cls             : 'filter-dlg',
                contentTemplate : '',
                title           : t.txtTitle,
                items           : []
            }, options);

            this.template   =   options.template || [
                '<div class="box" style="height:' + (_options.height - 36) + 'px;">',
                    '<div class="content-panel" style="width: 250px;">',
                        '<div class="">',
                            '<div id="id-sd-cell-search" style="height:22px; margin-bottom:10px;"></div>',
                            '<div class="border-values" style="">',
                                '<div id="id-dlg-filter-values" class="combo-values"/>',
                            '</div>',
                        '</div>',
                        '<div class="footer center">',
                            '<div id="id-apply-filter" style="display: inline-block;"></div>',
                            '<button class="btn normal dlg-btn" result="cancel">', t.cancelButtonText, '</button>',
                        '</div>',
                    '</div>',
                    '<div class="separator"/>',
                    '<div class="menu-panel" style="width: 170px;">',
                        '<div id="menu-container-filters" style=""><div class="dropdown-toggle" data-toggle="dropdown"></div></div>',
                    '</div>',
                '</div>'
            ].join('');

            this.api            =   options.api;
            this.handler        =   options.handler;
            this.throughIndexes     =   [];

            _options.tpl        =   _.template(this.template, _options);

            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {

            var me = this;

            Common.UI.Window.prototype.render.call(this);

            this.$window.find('.btn').on('click', _.bind(this.onBtnClick, this));

            this.btnOk = new Common.UI.Button({
                cls: 'btn normal dlg-btn primary',
                caption : this.okButtonText,
                style: 'margin-right:10px;',
                enableToggle: false,
                allowDepress: false
            });

            if (this.btnOk) {
                this.btnOk.render($('#id-apply-filter', this.$window));
                this.btnOk.on('click', _.bind(this.onApplyFilter, this));
            }

            this.miSortLow2High = new Common.UI.MenuItem({
                caption     : this.txtSortLow2High,
                toggleGroup : 'menufiltersort',
                checkable   : true,
                checked     : false
            });
            this.miSortLow2High.on('click', _.bind(this.onSortType, this, 'ascending'));

            this.miSortHigh2Low = new Common.UI.MenuItem({
                caption     : this.txtSortHigh2Low,
                toggleGroup : 'menufiltersort',
                checkable   : true,
                checked     : false
            });
            this.miSortHigh2Low.on('click', _.bind(this.onSortType, this, 'descending'));

            this.miSortCellColor = new Common.UI.MenuItem({
                caption     : this.txtSortCellColor,
                toggleGroup : 'menufiltersort',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    style: 'min-width: inherit; padding: 0px;',
                    menuAlign: 'tl-tr',
                        items: [
                            { template: _.template('<div id="filter-dlg-sort-cells-color" style="max-width: 147px; max-height: 120px;"></div>') }
                        ]
                })
            });

            this.miSortFontColor = new Common.UI.MenuItem({
                caption     : this.txtSortFontColor,
                toggleGroup : 'menufiltersort',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    style: 'min-width: inherit; padding: 0px;',
                    menuAlign: 'tl-tr',
                        items: [
                            { template: _.template('<div id="filter-dlg-sort-font-color" style="max-width: 147px; max-height: 120px;"></div>') }
                        ]
                })
            });

            this.miNumFilter = new Common.UI.MenuItem({
                caption     : this.txtNumFilter,
                toggleGroup : 'menufilterfilter',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    menuAlign: 'tl-tr',
                    items: [
                        {value: 0,                                                   caption: this.textNoFilter,    checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.equals,                   caption: this.txtEquals,       checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.doesNotEqual,             caption: this.txtNotEquals,    checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.isGreaterThan,            caption: this.txtGreater,      checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo,   caption: this.txtGreaterEquals,checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.isLessThan,               caption: this.txtLess,         checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo,      caption: this.txtLessEquals,   checkable: true},
                        {value: -2,                                                  caption: this.txtBetween,      checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.top10,                    caption: this.txtTop10,        checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.aboveAverage,             caption: this.txtAboveAve,     checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.belowAverage,             caption: this.txtBelowAve,     checkable: true},
                        {value: -1, caption: this.btnCustomFilter + '...'}
                    ]
                })
            });
            this.miNumFilter.menu.on('item:click', _.bind(this.onNumFilterMenuClick, this));

            this.miTextFilter = new Common.UI.MenuItem({
                caption     : this.txtTextFilter,
                toggleGroup : 'menufilterfilter',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    menuAlign: 'tl-tr',
                    items: [
                        {value: 0,                                                   caption: this.textNoFilter,    checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.equals,                   caption: this.txtEquals,       checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.doesNotEqual,             caption: this.txtNotEquals,    checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.beginsWith,               caption: this.txtBegins,       checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.doesNotBeginWith,         caption: this.txtNotBegins,    checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.endsWith,                 caption: this.txtEnds,         checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.doesNotEndWith,           caption: this.txtNotEnds,      checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.contains,                 caption: this.txtContains,     checkable: true},
                        {value: Asc.c_oAscCustomAutoFilter.doesNotContain,           caption: this.txtNotContains,  checkable: true},
                        {value: -1, caption: this.btnCustomFilter + '...'}
                    ]
                })
            });
            this.miTextFilter.menu.on('item:click', _.bind(this.onTextFilterMenuClick, this));

            this.miFilterCellColor = new Common.UI.MenuItem({
                caption     : this.txtFilterCellColor,
                toggleGroup : 'menufilterfilter',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    style: 'min-width: inherit; padding: 0px;',
                    menuAlign: 'tl-tr',
                        items: [
                            { template: _.template('<div id="filter-dlg-filter-cells-color" style="max-width: 147px; max-height: 120px;"></div>') }
                        ]
                })
            });

            this.miFilterFontColor = new Common.UI.MenuItem({
                caption     : this.txtFilterFontColor,
                toggleGroup : 'menufilterfilter',
                checkable   : true,
                checked     : false,
                menu        : new Common.UI.Menu({
                    style: 'min-width: inherit; padding: 0px;',
                    menuAlign: 'tl-tr',
                        items: [
                            { template: _.template('<div id="filter-dlg-filter-font-color" style="max-width: 147px; max-height: 120px;"></div>') }
                        ]
                })
            });

            this.miClear = new Common.UI.MenuItem({
                caption     : this.txtClear,
                checkable   : false
            });
            this.miReapply = new Common.UI.MenuItem({
                caption     : this.txtReapply,
                checkable   : false
            });

            this.filtersMenu = new Common.UI.Menu({
                items: [
                    this.miSortLow2High,
                    this.miSortHigh2Low,
                    this.miSortCellColor,
                    this.miSortFontColor,
                    {caption     : '--'},
                    this.miNumFilter,
                    this.miTextFilter,
                    this.miFilterCellColor,
                    this.miFilterFontColor,
                    {caption     : '--'},
                    this.miClear,
                    this.miReapply
                ]
            });

            // Prepare menu container
            var menuContainer = this.$window.find('#menu-container-filters');
            this.filtersMenu.render(menuContainer);
            this.filtersMenu.cmpEl.attr({tabindex: "-1"});

            this.mnuSortColorCellsPicker = new Common.UI.ColorPaletteExt({
                el: $('#filter-dlg-sort-cells-color'),
                colors: [
                    'transparent', 'FFFF00', '00FF00', '00FFFF', 'FF00FF', '0000FF', 'FF0000', '00008B', '008B8B',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3', 'A9A9A9', '000000',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3'
                ]
            });

            this.mnuSortColorFontPicker = new Common.UI.ColorPaletteExt({
                el: $('#filter-dlg-sort-font-color'),
                colors: [
                    'transparent', 'FFFF00', '00FF00', '00FFFF', 'FF00FF', '0000FF', 'FF0000', '00008B', '008B8B',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3', 'A9A9A9', '000000',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3'
                ]
            });

            this.mnuFilterColorCellsPicker = new Common.UI.ColorPaletteExt({
                el: $('#filter-dlg-filter-cells-color'),
                colors: [
                    'transparent', 'FFFF00', '00FF00', '00FFFF', 'FF00FF', '0000FF', 'FF0000', '00008B', '008B8B',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3', 'A9A9A9', '000000',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3'
                ]
            });

            this.mnuFilterColorFontPicker = new Common.UI.ColorPaletteExt({
                el: $('#filter-dlg-filter-font-color'),
                colors: [
                    'transparent', 'FFFF00', '00FF00', '00FFFF', 'FF00FF', '0000FF', 'FF0000', '00008B', '008B8B',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3', 'A9A9A9', '000000',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3',
                    '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3'
                ]
            });

            this.input = new Common.UI.InputField({
                el               : $('#id-sd-cell-search', this.$window),
                allowBlank       : true,
                placeHolder      : this.txtEmpty,
                validateOnChange : true,
                validation       : function () { return true; }
            }).on ('changing', function (input, value) {
                if (value.length) {
                    value = value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                    me.filter = new RegExp(value, 'ig');
                } else {
                    me.filter = undefined;
                }
                me.setupDataCells();
            });

            this.cells = new Common.UI.DataViewStore();
            this.filterExcludeCells = new Common.UI.DataViewStore();
            if (this.cells) {
                this.cellsList = new Common.UI.ListView({
                    el: $('#id-dlg-filter-values', this.$window),
                    store: this.cells,
                    simpleAddMode: true,
                    template: _.template(['<div class="listview inner" style="border:none;"></div>'].join('')),
                    itemTemplate: _.template([
                        '<div>',
                            '<label class="checkbox-indeterminate" style="position:absolute;">',
                                '<% if (!check) { %>',
                                    '<input type="button" class="img-commonctrl"/>',
                                '<% } else { %>',
                                    '<input type="button" class="checked img-commonctrl"/>',
                                '<% } %>',
                            '</label>',
                            '<div id="<%= id %>" class="list-item" style="pointer-events:none;margin-left:20px;display:inline-block;"><%= value %></div>',
                        '</div>'
                    ].join(''))
                });
                this.cellsList.store.comparator = function(item1, item2) {
                    if ('0' == item1.get('groupid')) return -1;
                    if ('0' == item2.get('groupid')) return 1;

                    var n1 = item1.get('intval'),
                        n2 = item2.get('intval'),
                        isN1 = n1!==undefined,
                        isN2 = n2!==undefined;
                    if (isN1 !== isN2) return (isN1) ? -1 : 1;
                    !isN1 && (n1 = item1.get('cellvalue').toLowerCase()) && (n2 = item2.get('cellvalue').toLowerCase());
                    if (n1==n2) return 0;
                    return (n2=='' || n1!=='' && n1<n2) ? -1 : 1;
                };
                this.cellsList.on('item:select', _.bind(this.onCellCheck, this));
                this.cellsList.onKeyDown = _.bind(this.onListKeyDown, this);
            }

            this.setupDataCells();
            this._setDefaults();
        },

        show: function () {
            Common.UI.Window.prototype.show.call(this);

            var me = this;
            if (this.input) {
                _.delay(function () {
                    me.input.$el.find('input').focus();
                }, 500, this);
            }
        },

        onBtnClick: function (event) {
            if (event.currentTarget.attributes &&  event.currentTarget.attributes.result) {
                if ('cancel' === event.currentTarget.attributes.result.value) {
                    this.close();
                }
            }
        },
        onApplyFilter: function () {
            if (this.testFilter()) {
                this.save();
                this.close();
            }
        },

        onSortType: function (type) {
            if (this.api && this.configTo) {
                this.api.asc_sortColFilter(type, this.configTo.asc_getCellId(), this.configTo.asc_getDisplayName());
            }

            this.close();
        },
        onShowCustomFilterDialog: function () {
            var me = this,
                dlgDigitalFilter = new SSE.Views.DigitalFilterDialog({api:this.api}).on({
                    'close': function() {
                        me.close();
                    }
                });

            this.close();

            dlgDigitalFilter.setSettings(this.configTo);
            dlgDigitalFilter.show();
        },

        onNumFilterMenuClick: function(menu, item) {
            var filterObj = this.configTo.asc_getFilterObj(),
                value1 = '', value2 = '',
                cond1 = Asc.c_oAscCustomAutoFilter.equals,
                cond2 = 0, isAnd = true;
            if (filterObj.asc_getType() == Asc.c_oAscAutoFilterTypes.CustomFilters) {
                    var customFilter = filterObj.asc_getFilter(),
                        customFilters = customFilter.asc_getCustomFilters();

                    isAnd = (customFilter.asc_getAnd());
                    cond1 = customFilters[0].asc_getOperator();
                    cond2 = ((customFilters.length>1) ? (customFilters[1].asc_getOperator() || 0) : 0);

                    value1 = (null === customFilters[0].asc_getVal() ? '' : customFilters[0].asc_getVal());
                    value2 = ((customFilters.length>1) ? (null === customFilters[1].asc_getVal() ? '' : customFilters[1].asc_getVal()) : '');
            }

            if (item.value==0) {
                //clear filters
                return;
            } else if (item.value!==-1) {
                var newCustomFilter = new Asc.CustomFilters();
                newCustomFilter.asc_setCustomFilters((item.value == -2) ? [new Asc.CustomFilter(), new Asc.CustomFilter()]: [new Asc.CustomFilter()]);

                var newCustomFilters = newCustomFilter.asc_getCustomFilters();
                newCustomFilter.asc_setAnd(true);
                newCustomFilters[0].asc_setOperator((item.value == -2) ? Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo : item.value);

                if (item.value == -2) {
                    newCustomFilters[0].asc_setVal((cond1 == Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo && cond2 == Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo) ? value1 : '');
                    newCustomFilters[1].asc_setOperator(Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo);
                    newCustomFilters[1].asc_setVal((cond1 == Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo && cond2 == Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo) ? value2 : '');
                } else {
                    newCustomFilters[0].asc_setVal((item.value == cond1) ? value1 : '');
                }

                filterObj.asc_setFilter(newCustomFilter);
                filterObj.asc_setType(Asc.c_oAscAutoFilterTypes.CustomFilters);
            } 

            var me = this,
                dlgDigitalFilter = new SSE.Views.DigitalFilterDialog({api:this.api, type: 'number'}).on({
                    'close': function() {
                        me.close();
                    }
                });

            this.close();

            dlgDigitalFilter.setSettings(this.configTo);
            dlgDigitalFilter.show();
        },

        onTextFilterMenuClick: function(menu, item) {
            var filterObj = this.configTo.asc_getFilterObj(),
                value1 = '', value2 = '',
                cond1 = Asc.c_oAscCustomAutoFilter.equals,
                cond2 = 0, isAnd = true;
            if (filterObj.asc_getType() == Asc.c_oAscAutoFilterTypes.CustomFilters) {
                var customFilter = filterObj.asc_getFilter(),
                    customFilters = customFilter.asc_getCustomFilters();

                isAnd = (customFilter.asc_getAnd());
                cond1 = customFilters[0].asc_getOperator();
                cond2 = ((customFilters.length>1) ? (customFilters[1].asc_getOperator() || 0) : 0);

                value1 = (null === customFilters[0].asc_getVal() ? '' : customFilters[0].asc_getVal());
                value2 = ((customFilters.length>1) ? (null === customFilters[1].asc_getVal() ? '' : customFilters[1].asc_getVal()) : '');
            }

            if (item.value==0) {
                //clear filters
                return;
            } else if (item.value!==-1) {
                var newCustomFilter = new Asc.CustomFilters();
                newCustomFilter.asc_setCustomFilters([new Asc.CustomFilter()]);

                var newCustomFilters = newCustomFilter.asc_getCustomFilters();
                newCustomFilter.asc_setAnd(true);
                newCustomFilters[0].asc_setOperator(item.value);
                newCustomFilters[0].asc_setVal((item.value == cond1) ? value1 : '');

                filterObj.asc_setFilter(newCustomFilter);
                filterObj.asc_setType(Asc.c_oAscAutoFilterTypes.CustomFilters);
            }

            var me = this,
                dlgDigitalFilter = new SSE.Views.DigitalFilterDialog({api:this.api, type: 'text'}).on({
                    'close': function() {
                        me.close();
                    }
                });

            this.close();

            dlgDigitalFilter.setSettings(this.configTo);
            dlgDigitalFilter.show();
        },

        onCellCheck: function (listView, itemView, record) {
            if (this.checkCellTrigerBlock)
                return;

            var target = '', type = '', isLabel = false, bound = null;

            var event = window.event ? window.event : window._event;
            if (event) {
                type = event.target.type;
                target = $(event.currentTarget).find('.list-item');

                if (target.length) {
                    bound = target.get(0).getBoundingClientRect();
                    if (bound.left < event.clientX && event.clientX < bound.right &&
                        bound.top < event.clientY && event.clientY < bound.bottom) {
                        isLabel = true;
                    }
                }

                if (type === 'button' || isLabel) {
                    this.updateCellCheck(listView, record);

                    _.delay(function () {
                        listView.$el.find('.listview').focus();
                    }, 100, this);
                }
            }
        },
        onListKeyDown: function (e, data) {
            var record = null, listView = this.cellsList;

            if (listView.disabled) return;
            if (_.isUndefined(undefined)) data = e;

            if (data.keyCode == Common.UI.Keys.SPACE) {
                data.preventDefault();
                data.stopPropagation();

                this.updateCellCheck(listView, listView.getSelectedRec()[0]);

            } else {
                Common.UI.DataView.prototype.onKeyDown.call(this.cellsList, e, data);
            }
        },

        updateCellCheck: function (listView, record) {
            if (record && listView) {
                listView.isSuspendEvents = true;

                var check = !record.get('check');
                if ('1' !== record.get('groupid')) {
                    var arr = this.configTo.asc_getValues();
                    this.cells.each(function(cell) {
                        cell.set('check', check);
                        if (cell.get('throughIndex')>0)
                            arr[parseInt(cell.get('throughIndex'))-1].asc_setVisible(check);
                    });
                } else {
                    record.set('check', check);
                    this.configTo.asc_getValues()[parseInt(record.get('throughIndex'))-1].asc_setVisible(check);
                }

                this.btnOk.setDisabled(false);
//                this.chCustomFilter.setValue(false);
                this.configTo.asc_getFilterObj().asc_setType(Asc.c_oAscAutoFilterTypes.Filters);

                listView.isSuspendEvents = false;
                listView.scroller.update({minScrollbarLength  : 40, alwaysVisibleY: true, suppressScrollX: true});
            }
        },

        setSettings: function (config) {
            this.config = config;
            this.configTo = config;
        },

        _setDefaults: function() {
            var isCustomFilter = (this.configTo.asc_getFilterObj().asc_getType() === Asc.c_oAscAutoFilterTypes.CustomFilters);

            this.miSortLow2High.setChecked(false, true);
            this.miSortHigh2Low.setChecked(false, true);
            var sort = this.configTo.asc_getSortState();
            if (sort) {
                if ('ascending' === sort) {
                    this.miSortLow2High.setChecked(true, true);
                } else {
                    this.miSortHigh2Low.setChecked(true, true);
                }
            }

//            this.chCustomFilter.setValue(isCustomFilter);
            this.btnOk.setDisabled(isCustomFilter);
        },

        setupDataCells: function() {
            function isNumeric(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }

            var me = this,
                isnumber,
                value,
                index = 0,
                applyfilter = true,
                throughIndex = 1,
                haveUnselectedCell = false;

            this.cells.forEach(function (item) {
                value = item.get('check');
                if (_.isUndefined(value)) value = false;
                me.throughIndexes[parseInt(item.get('throughIndex'))] = item.get('check');
            });

            var arr = [], arrEx = [];

            if (!me.filter) {
                if (me.throughIndexes[0]==undefined)
                    me.throughIndexes[0] = true;
                arr.push(new Common.UI.DataViewModel({
                    id              : ++index,
                    selected        : false,
                    allowSelected   : true,
                    value           : this.textSelectAll,
                    groupid         : '0',
                    check           : me.throughIndexes[0],
                    throughIndex    : 0
                }));
            }

            this.configTo.asc_getValues().forEach(function (item) {
                value       = item.asc_getText();
                isnumber    = isNumeric(value);
                applyfilter = true;

                if (me.filter) {
                    if (null === value.match(me.filter)) {
                        applyfilter = false;
                    }
                }

                if (me.throughIndexes[throughIndex]==undefined)
                    me.throughIndexes[throughIndex] = item.asc_getVisible();

                if (applyfilter) {
                    arr.push(new Common.UI.DataViewModel({
                        id              : ++index,
                        selected        : false,
                        allowSelected   : true,
                        cellvalue       : value,
                        value           : isnumber ? value : (value.length > 0 ? value: me.textEmptyItem),
                        intval          : isnumber ? parseFloat(value) : undefined,
                        strval          : !isnumber ? value : '',
                        groupid         : '1',
                        check           : me.throughIndexes[throughIndex],
                        throughIndex    : throughIndex
                    }));
                    if (!me.throughIndexes[throughIndex]) {
                        haveUnselectedCell = true;
                    }
                } else {
                    arrEx.push(new Common.UI.DataViewModel({
                        cellvalue       : value
                    }));
                }

                ++throughIndex;
            });
            this.cells.reset(arr);
            this.filterExcludeCells.reset(arrEx);

            if (this.cells.length) {
                this.checkCellTrigerBlock = true;
                this.cells.at(0).set('check', !haveUnselectedCell);
                this.checkCellTrigerBlock = undefined;

//                this.chCustomFilter.setValue(this.configTo.asc_getFilterObj().asc_getType() === Asc.c_oAscAutoFilterTypes.CustomFilters);
            }

            this.cellsList.scroller.update({minScrollbarLength  : 40, alwaysVisibleY: true, suppressScrollX: true});
        },

        testFilter: function () {
            var me = this, isValid= false;

            if (this.cells) {
                this.cells.forEach(function(item){
                    if ('1' === item.get('groupid')) {
                        if (item.get('check')) {
                            isValid = true;
                        }
                    }
                });
            }

            if (!isValid) {
                Common.UI.warning({title: this.textWarning,
                    msg: this.warnNoSelected,
                    callback: function() {
                        _.delay(function () {
                            me.input.$el.find('input').focus();
                        }, 100, this);
                    }
                });
            }

            return isValid;
        },
        save: function () {
            if (this.api && this.configTo && this.cells && this.filterExcludeCells)
                this.api.asc_applyAutoFilter('mainFilter', this.configTo);
        },

        onPrimary: function() {
            this.save();
            this.close();
            return false;
        },

        okButtonText        : 'Ok',
        btnCustomFilter     : 'Custom Filter',
        textSelectAll       : 'Select All',
        txtTitle            : 'Filter',
        warnNoSelected      : 'You must choose at least one value',
        textWarning         : 'Warning',
        cancelButtonText    : 'Cancel',
        textEmptyItem       : '{Blanks}',
        txtEmpty            : 'Enter cell\'s filter',
        txtSortLow2High     : 'Sort Lowest to Highest',
        txtSortHigh2Low     : 'Sort Highest to Lowest',
        txtSortCellColor    : 'Sort by cells color',
        txtSortFontColor    : 'Sort by font color',
        txtNumFilter        : 'Number filter',
        txtTextFilter       : 'Text filter',
        txtFilterCellColor  : 'Filter by cells color',
        txtFilterFontColor  : 'Filter by font color',
        txtClear            : 'Clear',
        txtReapply          : 'Reapply',
        txtEquals           : "Equals...",
        txtNotEquals        : "Does not equal...",
        txtGreater          : "Greater than...",
        txtGreaterEquals    : "Greater than or equal to...",
        txtLess             : "Less than...",
        txtLessEquals       : "Less than or equal to...",
        txtBetween          : 'Between...',
        txtTop10            : 'Top 10',
        txtAboveAve         : 'Above average',
        txtBelowAve         : 'Below average',
        txtBegins           : "Begins with...",
        txtNotBegins        : "Does not begin with...",
        txtEnds             : "Ends with...",
        txtNotEnds          : "Does not end with...",
        txtContains         : "Contains...",
        txtNotContains      : "Does not contain...",
        textNoFilter        : "None"


    }, SSE.Views.AutoFilterDialog || {}));
});