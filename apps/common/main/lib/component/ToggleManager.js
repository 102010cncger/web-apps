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
 *  ToggleManager.js
 *
 *  Created by Alexander Yuzhin on 1/28/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */


if (Common === undefined)
    var Common = {};

define([
    'common/main/lib/component/BaseView'
], function () {
    'use strict';

    var groups = {};

    function toggleGroup(cmp, state) {
        var g, i, l;
        if (state) {
            g = groups[cmp.toggleGroup];
            for (i = 0, l = g.length; i < l; i++) {
                if (g[i] !== cmp) {
                    if (g[i].isActive) {
                        g[i].isActive() && g[i].toggle(false);
                    } else {
                        g[i].toggle(false);
                    }
                }
            }
        }
    }

    /**
     * Private utility class used by component
     */
    Common.UI.ToggleManager = {
        register: function(cmp) {
            if (!cmp.toggleGroup) {
                return;
            }
            var group = groups[cmp.toggleGroup];
            if (!group) {
                group = groups[cmp.toggleGroup] = [];
            }
            group.push(cmp);
            cmp.on('toggle', toggleGroup);
        },

        unregister: function(cmp) {
            if (!cmp.toggleGroup) {
                return;
            }
            var group = groups[cmp.toggleGroup];
            if (group) {
                _.without(group, cmp);
                cmp.off('toggle', toggleGroup);
            }
        },

        /**
         * Gets the toggled components in the passed group or null
         * @param {String} group
         * @return {Common.UI.BaseView}
         */
        getToggled: function(group) {
            var g = groups[group],
                i = 0,
                len;
            if (g) {
                for (len = g.length; i < len; i++) {
                    if (g[i].pressed === true ||
                        g[i].checked === true) {
                        return g[i];
                    }
                }
            }
            return null;
        }
    }
});