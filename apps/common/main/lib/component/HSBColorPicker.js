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
if (Common === undefined)
    var Common = {};

define([
    'common/main/lib/component/BaseView',
    'common/main/lib/util/utils'

], function () {
    'use strict';

    Common.UI.HSBColorPicker = Common.UI.BaseView.extend({

        template    :
            _.template(
                '<div class="hsb-colorpicker">'+
                    '<% if (this.showCurrentColor) { %>'+
                        '<div class="top-panel">'+
                            '<span class="color-value">'+
                                '<span class="transparent-color img-colorpicker"></span>'+
                            '</span>'+
                            '<div class="color-text"></div>'+
                        '</div>'+
                    '<% } %>'+
                    '<div>'+
                        '<div class="cnt-hb img-colorpicker">'+
                            '<div class="cnt-hb-arrow img-colorpicker"></div>'+
                        '</div>'+
                        '<% if (this.changeSaturation) { %>'+
                            '<div class="cnt-root">'+
                                '<div class="cnt-sat img-colorpicker">'+
                                    '<div class="cnt-sat-arrow img-colorpicker"></div>'+
                                '</div>'+
                            '</div>'+
                        '<% } %>'+
                    '</div>'+
                    '<% if (this.allowEmptyColor) { %>'+
                        '<div class="empty-color"><%= this.textNoColor %></div>'+
                    '<% } %>'+
                '</div>'),

        color: '#ff0000',

        options: {
            allowEmptyColor: false,
            changeSaturation: true,
            showCurrentColor: true
        },

        initialize : function(options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);

            var me = this,
                el = $(this.el),
                arrowSatBrightness, arrowHue,
                areaSatBrightness, areaHue,
                previewColor, previewTransparentColor, previewColorText,
                btnNoColor,
                hueVal          = 0,
                saturationVal   = 100,
                brightnessVal   = 100;


            me.allowEmptyColor = me.options.allowEmptyColor;
            me.changeSaturation = me.options.changeSaturation;
            me.showCurrentColor = me.options.showCurrentColor;


            var onUpdateColor = function(hsb, transparent){
                var rgbColor = new Common.Utils.RGBColor('hsb(' + hsb.h + ',' + hsb.s + ',' + hsb.b + ')'),
                    hexColor = rgbColor.toHex();

                me.color = transparent ? 'transparent' : hexColor;

                refreshUI();

                me.trigger('changecolor', me, me.color);
            };

            var refreshUI = function(){
                if (previewColor.length>0  && previewTransparentColor.length>0){
                    if (me.color == 'transparent'){
                        previewTransparentColor.show();
                    } else {
                        previewColor.css("background-color", me.color);
                        previewTransparentColor.hide();
                    }
                }

                if (areaSatBrightness.length>0)
                    areaSatBrightness.css('background-color', new Common.Utils.RGBColor('hsb('+hueVal+', 100, 100)').toHex());

                if (previewColorText.length>0)
                    previewColorText[0].innerHTML = (me.color == 'transparent') ? me.textNoColor : me.color.toUpperCase();

                if (arrowSatBrightness.length>0 && arrowHue.length>0) {
                    arrowSatBrightness.css('left', saturationVal + '%');
                    arrowSatBrightness.css('top', 100 - brightnessVal + '%');
                    arrowHue.css('top', parseInt(hueVal * 100 / 360.0) + '%');
                }
            };

            var onSBAreaMouseMove = function(event, element, eOpts){
                if (arrowSatBrightness.length>0 && areaSatBrightness.length>0) {
                    var pos = [
                        Math.max(0, Math.min(100, (parseInt((event.pageX - areaSatBrightness.offset().left) / areaSatBrightness.width() * 100)))),
                        Math.max(0, Math.min(100, (parseInt((event.pageY - areaSatBrightness.offset().top) / areaSatBrightness.height() * 100))))
                    ];

                    arrowSatBrightness.css('left', pos[0] + '%');
                    arrowSatBrightness.css('top', pos[1] + '%');

                    saturationVal = pos[0];
                    brightnessVal = 100 - pos[1];

                    onUpdateColor({
                        h: hueVal,
                        s: saturationVal,
                        b: brightnessVal
                    });
                }
            };

            var onHueAreaMouseMove = function(event, element, eOpts){
                if (arrowHue&& areaHue) {
                    var pos = Math.max(0, Math.min(100, (parseInt((event.pageY - areaHue.offset().top) / areaHue.height() * 100))));
                    arrowHue.css('top', pos + '%');

                    hueVal = parseInt(360 * pos / 100.0);

                    onUpdateColor({
                        h: hueVal,
                        s: saturationVal,
                        b: brightnessVal
                    });
                }
            };

            var onSBAreaMouseDown = function(event, element, eOpts){
                $(document).on('mouseup', onSBAreaMouseUp);
                $(document).on('mousemove', onSBAreaMouseMove);
            };

            var onSBAreaMouseUp = function(event, element, eOpts){
                $(document).off('mouseup', onSBAreaMouseUp);
                $(document).off('mousemove', onSBAreaMouseMove);
                onSBAreaMouseMove(event, element, eOpts);
            };

            var onHueAreaMouseDown = function(event, element, eOpts){
                $(document).on('mouseup', onHueAreaMouseUp);
                $(document).on('mousemove', onHueAreaMouseMove);
                onHueAreaMouseMove(event, element, eOpts);
            };

            var onHueAreaMouseUp = function(event, element, eOpts){
                $(document).off('mouseup', onHueAreaMouseUp);
                $(document).off('mousemove', onHueAreaMouseMove);
            };

            var onNoColorClick = function(cnt){
                var hsbColor = new Common.util.RGBColor(me.color).toHSB();

                onUpdateColor(hsbColor, true);
            };

            var onAfterRender = function(ct){
                var rootEl = $(me.el),
                    hsbColor;

                if (rootEl){
                    arrowSatBrightness  = rootEl.find('.cnt-hb-arrow');
                    arrowHue            = rootEl.find('.cnt-sat-arrow');
                    areaSatBrightness   = rootEl.find('.cnt-hb');
                    areaHue             = rootEl.find('.cnt-sat');
                    previewColor        = rootEl.find('.color-value');
                    previewColorText    = rootEl.find('.color-text');
                    btnNoColor          = rootEl.find('.empty-color');

                    if (previewColor.length>0){
                        previewTransparentColor = previewColor.find('.transparent-color');
                    }

                    if (areaSatBrightness.length>0) {
                        areaSatBrightness.off('mousedown');
                        areaSatBrightness.on('mousedown', onSBAreaMouseDown);
                    }

                    if (areaHue.length>0) {
                        areaHue.off('mousedown');
                        areaHue.on('mousedown', onHueAreaMouseDown);
                    }

                    if (btnNoColor.length>0) {
                        btnNoColor.off('click');
                        btnNoColor.on('click', onNoColorClick);
                    }

                    if (me.color == 'transparent')
                        hsbColor = {h: 0, s: 100, b: 100};
                    else
                        hsbColor = new Common.Utils.RGBColor(me.color).toHSB();

                    hueVal          = hsbColor.h;
                    saturationVal   = hsbColor.s;
                    brightnessVal   = hsbColor.b;

                    if (hueVal == saturationVal &&
                        hueVal == brightnessVal &&
                        hueVal == 0)
                        saturationVal = 100;

                    refreshUI();
                }
            };

            me.setColor = function(value){
                if (me.color == value)
                    return;

                var hsbColor;
                if (value == 'transparent')
                    hsbColor = {h: 0, s: 100, b: 100};
                else
                    hsbColor = new Common.Utils.RGBColor(value).toHSB();

                hueVal          = hsbColor.h;
                saturationVal   = hsbColor.s;
                brightnessVal   = hsbColor.b;

                if (hueVal == saturationVal &&
                    hueVal == brightnessVal &&
                    hueVal == 0)
                    saturationVal = 100;

                me.color = value;

                refreshUI();
            };

            me.getColor = function(){
                return me.color;
            };

            me.on('render:after', onAfterRender);
            me.render();
        },

        render: function () {
            $(this.el).html(this.template());

            this.trigger('render:after', this);
            return this;
        },

        textNoColor: 'No Color'

    });
});