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
 *  DimensionPicker.js
 *
 *  Created by Alexander Yuzhin on 1/29/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

if (Common === undefined)
    var Common = {};

define([
    'common/main/lib/component/BaseView'
], function () {
    'use strict';

    Common.UI.DimensionPicker = Common.UI.BaseView.extend((function(){
        var me,
            rootEl,
            areaMouseCatcher,
            areaUnHighLighted,
            areaHighLighted,
            areaStatus,
            curColumns = 0,
            curRows = 0;

        var onMouseMove = function(event){
            me.setTableSize(
                Math.ceil((event.offsetX === undefined ? event.originalEvent.layerX : event.offsetX) / me.itemSize),
                Math.ceil((event.offsetY === undefined ? event.originalEvent.layerY : event.offsetY) / me.itemSize),
                event
            );
        };

        var onMouseLeave = function(event){
            me.setTableSize(0, 0, event);
        };

        var onHighLightedMouseClick = function(e){
            me.trigger('select', me, curColumns, curRows, e);
        };

        return {
            options: {
                itemSize    : 18,
                minRows     : 5,
                minColumns  : 5,
                maxRows     : 20,
                maxColumns  : 20
            },

            template:_.template([
                '<div style="width: 100%; height: 100%;">',
                    '<div class="dimension-picker-status">0x0</div>',
                    '<div class="dimension-picker-observecontainer">',
                        '<div class="dimension-picker-mousecatcher"></div>',
                        '<div class="dimension-picker-unhighlighted"></div>',
                        '<div class="dimension-picker-highlighted"></div>',
                    '</div>',
                '</div>'
            ].join('')),

            initialize : function(options) {
                Common.UI.BaseView.prototype.initialize.call(this, options);

                me = this;

                rootEl = $(this.el);

                me.itemSize    = me.options.itemSize;
                me.minRows     = me.options.minRows;
                me.minColumns  = me.options.minColumns;
                me.maxRows     = me.options.maxRows;
                me.maxColumns  = me.options.maxColumns;

                this.render();

                if (rootEl){
                    areaMouseCatcher    = rootEl.find('.dimension-picker-mousecatcher');
                    areaUnHighLighted   = rootEl.find('.dimension-picker-unhighlighted');
                    areaHighLighted     = rootEl.find('.dimension-picker-highlighted');
                    areaStatus          = rootEl.find('.dimension-picker-status');

                    rootEl.css({width: me.minColumns + 'em'});
                    areaMouseCatcher.css('z-index', 1);
                    areaMouseCatcher.width(me.maxColumns + 'em').height(me.maxRows + 'em');
                    areaUnHighLighted.width(me.minColumns + 'em').height(me.minRows + 'em');
                    areaStatus.html(curColumns + ' x ' + curRows);
                    areaStatus.width(areaUnHighLighted.width());
                }

                areaMouseCatcher.on('mousemove', onMouseMove);
                areaHighLighted.on('mousemove', onMouseMove);
                areaUnHighLighted.on('mousemove', onMouseMove);
                areaMouseCatcher.on('mouseleave', onMouseLeave);
                areaHighLighted.on('mouseleave', onMouseLeave);
                areaUnHighLighted.on('mouseleave', onMouseLeave);
                areaMouseCatcher.on('click', onHighLightedMouseClick);
                areaHighLighted.on('click', onHighLightedMouseClick);
                areaUnHighLighted.on('click', onHighLightedMouseClick);
            },

            render: function() {
                $(this.el).html(this.template());

                return this;
            },

            setTableSize: function(columns, rows, event){
                if (columns > this.maxColumns)  columns = this.maxColumns;
                if (rows > this.maxRows)        rows = this.maxRows;

                if (curColumns != columns || curRows != rows){
                    curColumns  = columns;
                    curRows     = rows;

                    areaHighLighted.width(curColumns + 'em').height(curRows + 'em');
                    areaUnHighLighted.width(
                        ((curColumns < me.minColumns)
                            ? me.minColumns
                            : ((curColumns + 1 > me.maxColumns)
                            ? me.maxColumns
                            : curColumns + 1)) + 'em'
                    ).height(((curRows < me.minRows)
                            ? me.minRows
                            : ((curRows + 1 > me.maxRows)
                            ? me.maxRows
                            : curRows + 1)) + 'em'
                    );

                    rootEl.width(areaUnHighLighted.width());
                    areaStatus.html(curColumns + ' x ' + curRows);
                    areaStatus.width(areaUnHighLighted.width());

                    me.trigger('change', me, curColumns, curRows, event);
                }
            },

            getColumnsCount: function() {
                return curColumns;
            },

            getRowsCount: function() {
                return curRows;
            }
        }
    })())
});
