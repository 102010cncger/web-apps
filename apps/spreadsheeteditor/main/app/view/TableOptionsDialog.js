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
 *  TableOptionsDialog.js
 *
 *  Created by Alexander Yuzhin on 4/9/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */


if (Common === undefined)
    var Common = {};

define([
    'common/main/lib/component/ComboBox',
    'common/main/lib/component/CheckBox',
    'common/main/lib/component/InputField',
    'common/main/lib/component/Window'
], function () { 'use strict';

    SSE.Views.TableOptionsDialog = Common.UI.Window.extend(_.extend({
        options: {
            width   : 350,
            cls     : 'modal-dlg',
            modal   : false
        },

        initialize : function(options) {
            _.extend(this.options, {
                title: this.txtFormat
            }, options);

            this.template = [
                '<div class="box">',
                    '<div id="id-dlg-tableoptions-range" class="input-row" style="margin-bottom: 10px;"></div>',
                    '<div class="input-row" id="id-dlg-tableoptions-title"></div>',
                '</div>',
                '<div class="footer right">',
                    '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + '</button>',
                    '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + '</button>',
                '</div>'
            ].join('');

            this.options.tpl = _.template(this.template, this.options);

            Common.UI.Window.prototype.initialize.call(this, this.options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);

            var $window = this.getChild(),
                me = this;

            me.inputRange = new Common.UI.InputField({
                el          : $('#id-dlg-tableoptions-range'),
                name        : 'range',
                style       : 'width: 100%;',
                allowBlank  : false,
                blankError  : this.txtEmpty,
                validateOnChange: true
            });

            me.cbTitle = new Common.UI.CheckBox({
                el          : $('#id-dlg-tableoptions-title'),
                labelText   : this.txtTitle
            });

            $window.find('.dlg-btn').on('click',     _.bind(this.onBtnClick, this));
            me.inputRange.cmpEl.find('input').on('keypress', _.bind(this.onKeyPress, this));

            this.on('close', _.bind(this.onClose, this));
        },

        onPrimary: function() {
            this._handleInput('ok');
            return false;
        },

        setSettings: function(settings) {
            var me = this;

            if (settings.api) {
                me.api = settings.api;

                var options = me.api.asc_getAddFormatTableOptions();

                this.inputRange.setValue(options.asc_getRange());
                this.cbTitle.setValue(options.asc_getIsTitle());

                me.api.asc_setSelectionDialogMode(c_oAscSelectionDialogType.FormatTable, options.asc_getRange());
                me.api.asc_unregisterCallback('asc_onSelectionRangeChanged', _.bind(me.onApiRangeChanged, me));
                me.api.asc_registerCallback('asc_onSelectionRangeChanged', _.bind(me.onApiRangeChanged, me));
                Common.NotificationCenter.trigger('cells:range', c_oAscSelectionDialogType.FormatTable);
            }

            me.inputRange.validation = function(value) {
                var isvalid = me.api.asc_checkDataRange(c_oAscSelectionDialogType.FormatTable, value, false);
                return (isvalid==c_oAscError.ID.DataRangeError) ? me.txtInvalidRange : true;
            };
        },

        getSettings: function () {
            var options = this.api.asc_getAddFormatTableOptions(this.inputRange.getValue());

//            options.asc_setRange(this.inputRange.getValue());
            options.asc_setIsTitle(this.cbTitle.checked);

            return options;
        },

        onApiRangeChanged: function(info) {
            this.inputRange.setValue(info);
            if (this.inputRange.cmpEl.hasClass('error'))
                this.inputRange.cmpEl.removeClass('error');
        },

        isRangeValid: function() {
            var isvalid = this.api.asc_checkDataRange(c_oAscSelectionDialogType.FormatTable, this.inputRange.getValue(), true);
            if (isvalid == c_oAscError.ID.No)
                return true;
            else {
                if (isvalid == c_oAscError.ID.AutoFilterDataRangeError) {
                    Common.UI.warning({msg: this.errorAutoFilterDataRange});
                }
            }
            return false;
        },

        onBtnClick: function(event) {
            this._handleInput(event.currentTarget.attributes['result'].value);
        },

        onClose: function(event) {
            if (this.api)
                this.api.asc_setSelectionDialogMode(c_oAscSelectionDialogType.None);

            Common.NotificationCenter.trigger('cells:range', c_oAscSelectionDialogType.None);
            Common.NotificationCenter.trigger('edit:complete', this);
        },

        onKeyPress: function(event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                this._handleInput('ok');
            }
        },

        _handleInput: function(state) {
            if (this.options.handler) {
                if (state == 'ok') {
                    if (this.isRangeValid() !== true)
                        return;
                }
                this.options.handler.call(this, this, state);
            }

            this.close();
        },

//        show: function () {
//            Common.UI.Window.prototype.show.call(this);
//
//            var me = this;
//            _.delay(function () {
//                me.inputRange.cmpEl.find('input').focus();
//            }, 500, me);
//        },

        txtTitle    : 'Title',
        txtFormat   : 'Format as table',
        textCancel  : 'Cancel',
        txtEmpty    : 'This field is required',
        txtInvalidRange: 'ERROR! Invalid cells range',
        errorAutoFilterDataRange: 'The operation could not be done for the selected range of cells.<br>Select a uniform data range inside or outside the table and try again.'
    }, SSE.Views.TableOptionsDialog || {}))
});