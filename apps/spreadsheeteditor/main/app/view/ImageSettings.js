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
 *  ImageSettings.js
 *
 *  Created by Julia Radzhabova on 3/28/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'text!spreadsheeteditor/main/app/template/ImageSettings.template',
    'jquery',
    'underscore',
    'backbone',
    'common/main/lib/component/Button',
    'common/main/lib/component/MetricSpinner',
    'common/main/lib/view/ImageFromUrlDialog'
], function (menuTemplate, $, _, Backbone) {
    'use strict';

    SSE.Views.ImageSettings = Backbone.View.extend(_.extend({
        el: '#id-image-settings',

        // Compile our stats template
        template: _.template(menuTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        options: {
            alias: 'ImageSettings'
        },

        initialize: function () {
            var me = this;
            this._initSettings = true;

            this._nRatio = 1;
            this._state = {
                Width: 0,
                Height: 0,
                DisabledControls: false
            };
            this.spinners = [];
            this.lockedControls = [];
            this._locked = false;

            this._noApply = false;

            this.render();

            this.spnWidth = new Common.UI.MetricSpinner({
                el: $('#image-spin-width'),
                step: .1,
                width: 78,
                defaultUnit : "cm",
                value: '3 cm',
                maxValue: 55.88,
                minValue: 0
            });
            this.spinners.push(this.spnWidth);
            this.lockedControls.push(this.spnWidth);

            this.spnHeight = new Common.UI.MetricSpinner({
                el: $('#image-spin-height'),
                step: .1,
                width: 78,
                defaultUnit : "cm",
                value: '3 cm',
                maxValue: 55.88,
                minValue: 0
            });
            this.spinners.push(this.spnHeight);
            this.lockedControls.push(this.spnHeight);

            this.btnRatio = new Common.UI.Button({
                cls: 'btn-toolbar',
                iconCls: 'advanced-btn-ratio',
                style: 'margin-bottom: 1px;',
                enableToggle: true,
                hint: this.textKeepRatio
            });
            this.btnRatio.render($('#image-button-ratio')) ;
            this.lockedControls.push(this.btnRatio);

            var value = Common.localStorage.getItem("sse-settings-imageratio");
            if (value===null || parseInt(value) == 1) {
                this.btnRatio.toggle(true);
            }
            this.btnRatio.on('click', _.bind(function(btn, e) {
                if (btn.pressed && this.spnHeight.getNumberValue()>0) {
                    this._nRatio = this.spnWidth.getNumberValue()/this.spnHeight.getNumberValue();
                }
                Common.localStorage.setItem("sse-settings-imageratio", (btn.pressed) ? 1 : 0);
            }, this));

            this.btnOriginalSize = new Common.UI.Button({
                el: $('#image-button-original-size')
            });
            this.lockedControls.push(this.btnOriginalSize);

            this.btnInsertFromFile = new Common.UI.Button({
                el: $('#image-button-from-file')
            });
            this.lockedControls.push(this.btnInsertFromFile);

            this.btnInsertFromUrl = new Common.UI.Button({
                el: $('#image-button-from-url')
            });
            this.lockedControls.push(this.btnInsertFromUrl);

            this.spnWidth.on('change', _.bind(this.onWidthChange, this));
            this.spnHeight.on('change', _.bind(this.onHeightChange, this));
            this.btnOriginalSize.on('click', _.bind(this.setOriginalSize, this));
            this.btnInsertFromFile.on('click', _.bind(function(btn){
                if (this.api) this.api.asc_changeImageFromFile();
                Common.NotificationCenter.trigger('edit:complete', this);
            }, this));
            this.btnInsertFromUrl.on('click', _.bind(this.insertFromUrl, this));
        },

        render: function () {
            var el = $(this.el);
            el.html(this.template({
                scope: this
            }));
        },

        setApi: function(api) {
            if ( api == undefined ) return;
            this.api = api;
            return this;
        },

        updateMetricUnit: function() {
            if (this.spinners) {
                for (var i=0; i<this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.getCurrentMetricName());
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        },

        createDelayedElements: function() {
            this.updateMetricUnit();
        },

        ChangeSettings: function(props) {
            if (this._initSettings) {
                this.createDelayedElements();
                this._initSettings = false;
            }

            this.disableControls(this._locked);

            if (props ){
                var value = props.asc_getWidth();
                if ( Math.abs(this._state.Width-value)>0.001 ||
                    (this._state.Width===null || value===null)&&(this._state.Width!==value)) {
                    this.spnWidth.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                    this._state.Width = value;
                }

                value = props.asc_getHeight();
                if ( Math.abs(this._state.Height-value)>0.001 ||
                    (this._state.Height===null || value===null)&&(this._state.Height!==value)) {
                    this.spnHeight.setValue((value!==null) ? Common.Utils.Metric.fnRecalcFromMM(value) : '', true);
                    this._state.Height = value;
                }

                if (props.asc_getHeight()>0)
                    this._nRatio = props.asc_getWidth()/props.asc_getHeight();

                this.btnOriginalSize.setDisabled(props.asc_getImageUrl()===null || props.asc_getImageUrl()===undefined || this._locked);
            }
        },

        onWidthChange: function(field, newValue, oldValue, eOpts){
            var w = field.getNumberValue();
            var h = this.spnHeight.getNumberValue();
            if (this.btnRatio.pressed) {
                h = w/this._nRatio;
                if (h>this.spnHeight.options.maxValue) {
                    h = this.spnHeight.options.maxValue;
                    w = h * this._nRatio;
                    this.spnWidth.setValue(w, true);
                }
                this.spnHeight.setValue(h, true);
            }
            if (this.api)  {
                var props = new Asc.asc_CImgProperty();
                props.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                props.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger('edit:complete', this);
        },

        onHeightChange: function(field, newValue, oldValue, eOpts){
            var h = field.getNumberValue(), w = this.spnWidth.getNumberValue();
            if (this.btnRatio.pressed) {
                w = h * this._nRatio;
                if (w>this.spnWidth.options.maxValue) {
                    w = this.spnWidth.options.maxValue;
                    h = w/this._nRatio;
                    this.spnHeight.setValue(h, true);
                }
                this.spnWidth.setValue(w, true);
            }
            if (this.api)  {
                var props = new Asc.asc_CImgProperty();
                props.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                props.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger('edit:complete', this);
        },

        setOriginalSize:  function() {
            if (this.api) {
                var imgsize = this.api.asc_getOriginalImageSize();
                var w = imgsize.asc_getImageWidth();
                var h = imgsize.asc_getImageHeight();

                var properties = new Asc.asc_CImgProperty();
                properties.asc_putWidth(w);
                properties.asc_putHeight(h);
                this.api.asc_setGraphicObjectProps(properties);
                Common.NotificationCenter.trigger('edit:complete', this);
            }
        },

        insertFromUrl: function() {
            var me = this;
            (new Common.Views.ImageFromUrlDialog({
                handler: function(result, value) {
                    if (result == 'ok') {
                        if (me.api) {
                            var checkUrl = value.replace(/ /g, '');
                            if (!_.isEmpty(checkUrl)) {
                                var props = new Asc.asc_CImgProperty();
                                props.asc_putImageUrl(checkUrl);
                                me.api.asc_setGraphicObjectProps(props);
                            }
                        }
                    }
                    Common.NotificationCenter.trigger('edit:complete', me);
                }
            })).show();
        },

        setLocked: function (locked) {
            this._locked = locked;
        },

        disableControls: function(disable) {
            if (this._state.DisabledControls!==disable) {
                this._state.DisabledControls = disable;
                _.each(this.lockedControls, function(item) {
                    item.setDisabled(disable);
                });
            }
        },

        textKeepRatio: 'Constant Proportions',
        textSize:       'Size',
        textWidth:      'Width',
        textHeight:     'Height',
        textOriginalSize: 'Default Size',
        textInsert:     'Insert Image',
        textFromUrl:    'From URL',
        textFromFile:   'From File'
    }, SSE.Views.ImageSettings || {}));
});