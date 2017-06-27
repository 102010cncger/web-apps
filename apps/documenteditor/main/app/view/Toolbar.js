/*
 *
 * (c) Copyright Ascensio System Limited 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *  Toolbar.js
 *
 *  Toolbar view
 *
 *  Created by Maxim.Kadushkin on 2/13/17
 *  Copyright (c) 2017 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!documenteditor/main/app/template/Toolbar.template',
    'common/main/lib/collection/Fonts',
    'common/main/lib/component/Button',
    'common/main/lib/component/ComboBox',
    'common/main/lib/component/DataView',
    'common/main/lib/component/ColorPalette',
    'common/main/lib/component/ThemeColorPalette',
    'common/main/lib/component/Menu',
    'common/main/lib/component/DimensionPicker',
    'common/main/lib/component/Window',
    'common/main/lib/component/ComboBoxFonts',
    'common/main/lib/component/ComboDataView'
    ,'common/main/lib/component/SynchronizeTip'
    ,'common/main/lib/component/Mixtbar'
], function ($, _, Backbone, template) {
    'use strict';

    DE.Views.Toolbar =  Common.UI.Mixtbar.extend(_.extend((function(){

        return {
            el: '#toolbar',

            // Compile our stats template
            // template: _.template(template),

            // Delegated events for creating new items, and clearing completed ones.
            events: {
                //
            },

            initialize: function () {
                var me = this;

                Common.UI.Mixtbar.prototype.initialize.call(this, {
                        template: _.template(template),
                        tabs: [
                            { caption: me.textTabFile, action: 'file'},
                            { caption: me.textTabHome, action: 'home', extcls: 'canedit'},
                            { caption: me.textTabInsert, action: 'ins', extcls: 'canedit'},
                            { caption: me.textTabLayout, action: 'layout', extcls: 'canedit'}
                        ]}
                );

                /**
                 * UI Components
                 */

                this.SchemeNames = [
                    this.txtScheme1, this.txtScheme2, this.txtScheme3, this.txtScheme4, this.txtScheme5,
                    this.txtScheme6, this.txtScheme7, this.txtScheme8, this.txtScheme9, this.txtScheme10,
                    this.txtScheme11, this.txtScheme12, this.txtScheme13, this.txtScheme14, this.txtScheme15,
                    this.txtScheme16, this.txtScheme17, this.txtScheme18, this.txtScheme19, this.txtScheme20,
                    this.txtScheme21
                ];

                this.paragraphControls = [];
                this.toolbarControls = [];
                this.textOnlyControls = [];
                this._state = {
                    hasCollaborativeChanges: undefined
                };
                this.btnSaveCls = 'btn-save';
                this.btnSaveTip = this.tipSave + Common.Utils.String.platformKey('Ctrl+S');

                this.btnPrint = new Common.UI.Button({
                    id: 'id-toolbar-btn-print',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-print no-mask'
                });
                this.toolbarControls.push(this.btnPrint);

                this.btnSave = new Common.UI.Button({
                    id: 'id-toolbar-btn-save',
                    cls: 'btn-toolbar',
                    iconCls: 'no-mask ' + this.btnSaveCls
                });
                this.toolbarControls.push(this.btnSave);

                this.btnUndo = new Common.UI.Button({
                    id: 'id-toolbar-btn-undo',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-undo'
                });
                this.toolbarControls.push(this.btnUndo);

                this.btnRedo = new Common.UI.Button({
                    id: 'id-toolbar-btn-redo',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-redo'
                });
                this.toolbarControls.push(this.btnRedo);

                this.btnCopy = new Common.UI.Button({
                    id: 'id-toolbar-btn-copy',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-copy'
                });
                this.toolbarControls.push(this.btnCopy);

                this.btnPaste = new Common.UI.Button({
                    id: 'id-toolbar-btn-paste',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-paste'
                });
                this.paragraphControls.push(this.btnPaste);

                this.btnIncFontSize = new Common.UI.Button({
                    id: 'id-toolbar-btn-incfont',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-incfont'
                });
                this.paragraphControls.push(this.btnIncFontSize);

                this.btnDecFontSize = new Common.UI.Button({
                    id: 'id-toolbar-btn-decfont',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-decfont'
                });
                this.paragraphControls.push(this.btnDecFontSize);

                this.btnBold = new Common.UI.Button({
                    id: 'id-toolbar-btn-bold',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-bold',
                    enableToggle: true
                });
                this.paragraphControls.push(this.btnBold);

                this.btnItalic = new Common.UI.Button({
                    id: 'id-toolbar-btn-italic',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-italic',
                    enableToggle: true
                });
                this.paragraphControls.push(this.btnItalic);

                this.btnUnderline = new Common.UI.Button({
                    id: 'id-toolbar-btn-underline',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-underline',
                    enableToggle: true
                });
                this.paragraphControls.push(this.btnUnderline);

                this.btnStrikeout = new Common.UI.Button({
                    id: 'id-toolbar-btn-strikeout',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-strikeout',
                    enableToggle: true
                });
                this.paragraphControls.push(this.btnStrikeout);

                this.btnSuperscript = new Common.UI.Button({
                    id: 'id-toolbar-btn-superscript',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-superscript',
                    enableToggle: true,
                    toggleGroup: 'superscriptGroup'
                });
                this.paragraphControls.push(this.btnSuperscript);

                this.btnSubscript = new Common.UI.Button({
                    id: 'id-toolbar-btn-subscript',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-subscript',
                    enableToggle: true,
                    toggleGroup: 'superscriptGroup'
                });
                this.paragraphControls.push(this.btnSubscript);

                this.btnHighlightColor = new Common.UI.Button({
                    id: 'id-toolbar-btn-highlight',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-highlight',
                    enableToggle: true,
                    allowDepress: true,
                    split: true,
                    menu: new Common.UI.Menu({
                        style: 'min-width: 100px;',
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-highlight" style="width: 120px; height: 120px; margin: 10px;"></div>')},
                            {caption: '--'},
                            this.mnuHighlightTransparent = new Common.UI.MenuItem({
                                caption: this.strMenuNoFill,
                                checkable: true
                            })
                        ]
                    })
                });
                this.paragraphControls.push(this.btnHighlightColor);
                this.textOnlyControls.push(this.btnHighlightColor);

                this.btnFontColor = new Common.UI.Button({
                    id: 'id-toolbar-btn-fontcolor',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-fontcolor',
                    split: true,
                    menu: new Common.UI.Menu({
                        items: [
                            {
                                id: 'id-toolbar-menu-auto-fontcolor',
                                caption: this.textAutoColor,
                                template: _.template('<a tabindex="-1" type="menuitem"><span class="menu-item-icon" style="background-image: none; width: 12px; height: 12px; margin: 1px 7px 0 -7px; background-color: #000;"></span><%= caption %></a>')
                            },
                            {caption: '--'},
                            {template: _.template('<div id="id-toolbar-menu-fontcolor" style="width: 169px; height: 220px; margin: 10px;"></div>')},
                            {template: _.template('<a id="id-toolbar-menu-new-fontcolor" style="padding-left:12px;">' + this.textNewColor + '</a>')}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnFontColor);

                this.btnParagraphColor = new Common.UI.Button({
                    id: 'id-toolbar-btn-paracolor',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-paracolor',
                    split: true,
                    menu: new Common.UI.Menu({
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-paracolor" style="width: 169px; height: 220px; margin: 10px;"></div>')},
                            {template: _.template('<a id="id-toolbar-menu-new-paracolor" style="padding-left:12px;">' + this.textNewColor + '</a>')}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnParagraphColor);
                this.textOnlyControls.push(this.btnParagraphColor);

                this.btnAlignLeft = new Common.UI.Button({
                    id: 'id-toolbar-btn-align-left',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-align-left',
                    enableToggle: true,
                    allowDepress: false,
                    toggleGroup: 'alignGroup'
                });
                this.paragraphControls.push(this.btnAlignLeft);

                this.btnAlignCenter = new Common.UI.Button({
                    id: 'id-toolbar-btn-align-center',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-align-center',
                    enableToggle: true,
                    allowDepress: false,
                    toggleGroup: 'alignGroup'
                });
                this.paragraphControls.push(this.btnAlignCenter);

                this.btnAlignRight = new Common.UI.Button({
                    id: 'id-toolbar-btn-align-right',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-align-right',
                    enableToggle: true,
                    allowDepress: false,
                    toggleGroup: 'alignGroup'
                });
                this.paragraphControls.push(this.btnAlignRight);

                this.btnAlignJust = new Common.UI.Button({
                    id: 'id-toolbar-btn-align-just',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-align-just',
                    enableToggle: true,
                    allowDepress: false,
                    toggleGroup: 'alignGroup'
                });
                this.paragraphControls.push(this.btnAlignJust);

                this.btnHorizontalAlign = new Common.UI.Button({
                    id: 'id-toolbar-btn-halign',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-align-left',
                    icls: 'btn-align-left',
                    menu: new Common.UI.Menu({
                        cls: 'ppm-toolbar',
                        items: [
                            {
                                caption: this.tipAlignLeft + Common.Utils.String.platformKey('Ctrl+L'),
                                iconCls: 'mnu-align-left',
                                icls: 'btn-align-left',
                                checkable: true,
                                toggleGroup: 'halignGroup',
                                checked: true,
                                value: 1
                            },
                            {
                                caption: this.tipAlignCenter + Common.Utils.String.platformKey('Ctrl+E'),
                                iconCls: 'mnu-align-center',
                                icls: 'btn-align-center',
                                checkable: true,
                                toggleGroup: 'halignGroup',
                                value: 2
                            },
                            {
                                caption: this.tipAlignRight + Common.Utils.String.platformKey('Ctrl+R'),
                                iconCls: 'mnu-align-right',
                                icls: 'btn-align-right',
                                checkable: true,
                                toggleGroup: 'halignGroup',
                                value: 0
                            },
                            {
                                caption: this.tipAlignJust + Common.Utils.String.platformKey('Ctrl+J'),
                                iconCls: 'mnu-align-just',
                                icls: 'btn-align-just',
                                checkable: true,
                                toggleGroup: 'halignGroup',
                                value: 3
                            }
                        ]
                    })
                });
                this.paragraphControls.push(this.btnHorizontalAlign);

                this.btnDecLeftOffset = new Common.UI.Button({
                    id: 'id-toolbar-btn-decoffset',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-decoffset'
                });
                this.paragraphControls.push(this.btnDecLeftOffset);

                this.btnIncLeftOffset = new Common.UI.Button({
                    id: 'id-toolbar-btn-incoffset',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-incoffset'
                });
                this.paragraphControls.push(this.btnIncLeftOffset);

                this.btnLineSpace = new Common.UI.Button({
                    id: 'id-toolbar-btn-linespace',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-linespace',
                    menu: new Common.UI.Menu({
                        style: 'min-width: 60px;',
                        items: [
                            {caption: '1.0', value: 1.0, checkable: true, toggleGroup: 'linesize'},
                            {caption: '1.15', value: 1.15, checkable: true, toggleGroup: 'linesize'},
                            {caption: '1.5', value: 1.5, checkable: true, toggleGroup: 'linesize'},
                            {caption: '2.0', value: 2.0, checkable: true, toggleGroup: 'linesize'},
                            {caption: '2.5', value: 2.5, checkable: true, toggleGroup: 'linesize'},
                            {caption: '3.0', value: 3.0, checkable: true, toggleGroup: 'linesize'}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnLineSpace);

                this.btnShowHidenChars = new Common.UI.Button({
                    id: 'id-toolbar-btn-hidenchars',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-hidenchars',
                    enableToggle: true,
                    split: true,
                    menu: new Common.UI.Menu({
                        style: 'min-width: 60px;',
                        items: [
                            {caption: this.mniHiddenChars, value: 'characters', checkable: true},
                            {caption: this.mniHiddenBorders, value: 'table', checkable: true}
                        ]
                    })
                });
                this.toolbarControls.push(this.btnShowHidenChars);

                this.btnMarkers = new Common.UI.Button({
                    id: 'id-toolbar-btn-markers',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-setmarkers',
                    enableToggle: true,
                    toggleGroup: 'markersGroup',
                    split: true,
                    menu: true
                });
                this.paragraphControls.push(this.btnMarkers);
                this.textOnlyControls.push(this.btnMarkers);

                this.btnNumbers = new Common.UI.Button({
                    id: 'id-toolbar-btn-numbering',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-numbering',
                    enableToggle: true,
                    toggleGroup: 'markersGroup',
                    split: true,
                    menu: true
                });
                this.paragraphControls.push(this.btnNumbers);
                this.textOnlyControls.push(this.btnNumbers);

                this.btnMultilevels = new Common.UI.Button({
                    id: 'id-toolbar-btn-multilevels',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-multilevels',
                    menu: true
                });
                this.paragraphControls.push(this.btnMultilevels);
                this.textOnlyControls.push(this.btnMultilevels);

                var clone = function (source) {
                    var obj = {};
                    for (var prop in source)
                        obj[prop] = (typeof(source[prop]) == 'object') ? clone(source[prop]) : source[prop];
                    return obj;
                };

                this.mnuMarkersPicker = {
                    conf: {index: 0},
                    selectByIndex: function (idx) {
                        this.conf.index = idx;
                    }
                };
                this.mnuNumbersPicker = clone(this.mnuMarkersPicker);
                this.mnuMultilevelPicker = clone(this.mnuMarkersPicker);

                this.btnInsertTable = new Common.UI.Button({
                    id: 'tlb-btn-instable',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-table',
                    caption: me.capBtnInsTable,
                    menu: new Common.UI.Menu({
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-tablepicker" class="dimension-picker" style="margin: 5px 10px;"></div>')},
                            {caption: this.mniCustomTable, value: 'custom'}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnInsertTable);

                this.btnInsertImage = new Common.UI.Button({
                    id: 'tlb-btn-insimage',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-image',
                    caption: me.capBtnInsImage,
                    menu: new Common.UI.Menu({
                        items: [
                            {caption: this.mniImageFromFile, value: 'file'},
                            {caption: this.mniImageFromUrl, value: 'url'}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnInsertImage);

                this.btnInsertChart = new Common.UI.Button({
                    id: 'tlb-btn-inschart',
                    cls: 'btn-toolbar x-huge icon-top',
                    caption: me.capBtnInsChart,
                    iconCls: 'svgicon svg-btn-chart',
                    menu: new Common.UI.Menu({
                        style: 'width: 435px;',
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-insertchart" class="menu-insertchart" style="margin: 5px 5px 5px 10px;"></div>')}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnInsertChart);

                this.btnInsertText = new Common.UI.Button({
                    id: 'tlb-btn-inserttext',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-textbox',
                    caption: me.capBtnInsTextbox,
                    enableToggle: true
                });
                this.paragraphControls.push(this.btnInsertText);

                this.btnInsertTextArt = new Common.UI.Button({
                    id: 'tlb-btn-instextart',
                    cls: 'btn-toolbar x-huge icon-top',
                    // iconCls: 'svgicon svg-btn-textart',
                    iconCls: 'btn-textart',
                    caption: me.capBtnInsTextart,
                    menu: new Common.UI.Menu({
                        cls: 'menu-shapes',
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-insart" style="width: 239px; margin-left: 5px;"></div>')}
                        ]
                    })
                });
                this.paragraphControls.push(this.btnInsertTextArt);

                this.btnInsertHyperlink = new Common.UI.Button({
                    id: 'tlb-btn-inshyperlink',
                    cls: 'btn-toolbar x-huge icon-top',
                    caption: me.capBtnInsLink,
                    iconCls: 'svgicon svg-btn-hlink'
                });
                this.paragraphControls.push(this.btnInsertHyperlink);

                this.btnEditHeader = new Common.UI.Button({
                    id: 'id-toolbar-btn-editheader',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-editheader',
                    caption: me.capBtnInsHeader,
                    menu: true
                });
                this.mnuPageNumberPosPicker = {
                    conf: {disabled: false},
                    isDisabled: function () {
                        return this.conf.disabled;
                    },
                    setDisabled: function (val) {
                        this.conf.disabled = val;
                    }
                };
                this.mnuPageNumCurrentPos = clone(this.mnuPageNumberPosPicker);
                this.mnuInsertPageNum = clone(this.mnuPageNumberPosPicker);
                this.mnuInsertPageCount = clone(this.mnuPageNumberPosPicker);
                this.paragraphControls.push(this.mnuPageNumCurrentPos);
                this.paragraphControls.push(this.mnuInsertPageCount);
                this.toolbarControls.push(this.btnEditHeader);

                this.btnInsertShape = new Common.UI.Button({
                    id: 'tlb-btn-insshape',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-shape',
                    caption: me.capBtnInsShape,
                    enableToggle: true,
                    menu: new Common.UI.Menu({cls: 'menu-shapes'})
                });
                this.paragraphControls.push(this.btnInsertShape);

                this.btnInsertEquation = new Common.UI.Button({
                    id: 'tlb-btn-insequation',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-equation',
                    caption: me.capBtnInsEquation,
                    split: true,
                    menu: new Common.UI.Menu({cls: 'menu-shapes'})
                });
                this.paragraphControls.push(this.btnInsertEquation);

                this.btnDropCap = new Common.UI.Button({
                    id: 'tlb-btn-dropcap',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-dropcap',
                    caption: me.capBtnInsDropcap,
                    menu: new Common.UI.Menu({
                        cls: 'ppm-toolbar',
                        items: [
                            {
                                caption: this.textNone,
                                iconCls: 'mnu-dropcap-none',
                                checkable: true,
                                toggleGroup: 'menuDropCap',
                                value: Asc.c_oAscDropCap.None,
                                checked: true
                            },
                            {
                                caption: this.textInText,
                                iconCls: 'mnu-dropcap-intext',
                                checkable: true,
                                toggleGroup: 'menuDropCap',
                                value: Asc.c_oAscDropCap.Drop
                            },
                            {
                                caption: this.textInMargin,
                                iconCls: 'mnu-dropcap-inmargin',
                                checkable: true,
                                toggleGroup: 'menuDropCap',
                                value: Asc.c_oAscDropCap.Margin
                            },
                            {caption: '--'},
                            this.mnuDropCapAdvanced = new Common.UI.MenuItem({caption: this.mniEditDropCap})
                        ]
                    })
                });
                this.paragraphControls.push(this.btnDropCap);

                this.btnColumns = new Common.UI.Button({
                    id: 'tlb-btn-columns',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-columns',
                    caption: me.capBtnColumns,
                    menu: new Common.UI.Menu({
                        cls: 'ppm-toolbar',
                        items: [
                            {
                                caption: this.textColumnsOne,
                                iconCls: 'mnu-columns-one',
                                checkable: true,
                                toggleGroup: 'menuColumns',
                                value: 0
                            },
                            {
                                caption: this.textColumnsTwo,
                                iconCls: 'mnu-columns-two',
                                checkable: true,
                                toggleGroup: 'menuColumns',
                                value: 1
                            },
                            {
                                caption: this.textColumnsThree,
                                iconCls: 'mnu-columns-three',
                                checkable: true,
                                toggleGroup: 'menuColumns',
                                value: 2
                            },
                            {
                                caption: this.textColumnsLeft,
                                iconCls: 'mnu-columns-left',
                                checkable: true,
                                toggleGroup: 'menuColumns',
                                value: 3
                            },
                            {
                                caption: this.textColumnsRight,
                                iconCls: 'mnu-columns-right',
                                checkable: true,
                                toggleGroup: 'menuColumns',
                                value: 4
                            },
                            { caption: '--' },
                            { caption: this.textColumnsCustom, value: 'advanced' }
                        ]
                    })
                });
                this.paragraphControls.push(this.btnColumns);

                this.btnPageOrient = new Common.UI.Button({
                    id: 'tlb-btn-pageorient',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-pageorient',
                    caption: me.capBtnPageOrient,
                    menu: new Common.UI.Menu({
                        cls: 'ppm-toolbar',
                        items: [
                            {
                                caption: this.textPortrait,
                                iconCls: 'mnu-orient-portrait',
                                checkable: true,
                                toggleGroup: 'menuOrient',
                                value: true
                            },
                            {
                                caption: this.textLandscape,
                                iconCls: 'mnu-orient-landscape',
                                checkable: true,
                                toggleGroup: 'menuOrient',
                                value: false
                            }
                        ]
                    })
                });
                this.toolbarControls.push(this.btnPageOrient);


                var pageMarginsTemplate = _.template('<a id="<%= id %>" tabindex="-1" type="menuitem"><div><b><%= caption %></b></div>' +
                    '<% if (options.value !== null) { %><div style="display: inline-block;margin-right: 20px;min-width: 80px;">' +
                    '<label style="display: block;">' + this.textTop + '<%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[0]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label>' +
                    '<label style="display: block;">' + this.textLeft + '<%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[1]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label></div><div style="display: inline-block;">' +
                    '<label style="display: block;">' + this.textBottom + '<%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[2]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label>' +
                    '<label style="display: block;">' + this.textRight + '<%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[3]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label></div>' +
                    '<% } %></a>');

                this.btnPageMargins = new Common.UI.Button({
                    id: 'tlb-btn-pagemargins',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-pagemargins',
                    caption: me.capBtnMargins,
                    menu: new Common.UI.Menu({
                        items: [
                            {
                                caption: this.textMarginsLast,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins'
                            }, //top,left,bottom,right
                            {
                                caption: this.textMarginsNormal,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins',
                                value: [20, 30, 20, 15]
                            },
                            {
                                caption: this.textMarginsUsNormal,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins',
                                value: [25.4, 25.4, 25.4, 25.4]
                            },
                            {
                                caption: this.textMarginsNarrow,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins',
                                value: [12.7, 12.7, 12.7, 12.7]
                            },
                            {
                                caption: this.textMarginsModerate,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins',
                                value: [25.4, 19.1, 25.4, 19.1]
                            },
                            {
                                caption: this.textMarginsWide,
                                checkable: true,
                                template: pageMarginsTemplate,
                                toggleGroup: 'menuPageMargins',
                                value: [25.4, 50.8, 25.4, 50.8]
                            },
                            {caption: '--'},
                            {caption: this.textPageMarginsCustom, value: 'advanced'}
                        ]
                    })
                });
                this.toolbarControls.push(this.btnPageMargins);

                var pageSizeTemplate = _.template('<a id="<%= id %>" tabindex="-1" type="menuitem"><div><b><%= caption %></b></div>' +
                    '<div><%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[0]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %> x ' +
                    '<%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(options.value[1]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></div></a>');

                this.btnPageSize = new Common.UI.Button({
                    id: 'tlb-btn-pagesize',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-pagesize',
                    caption: me.capBtnPageSize,
                    menu: new Common.UI.Menu({
                        items: [
                            {
                                caption: 'US Letter',
                                subtitle: '21,59cm x 27,94cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [215.9, 279.4]
                            },
                            {
                                caption: 'US Legal',
                                subtitle: '21,59cm x 35,56cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [215.9, 355.6]
                            },
                            {
                                caption: 'A4',
                                subtitle: '21cm x 29,7cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [210, 297],
                                checked: true
                            },
                            {
                                caption: 'A5',
                                subtitle: '14,81cm x 20,99cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [148.1, 209.9]
                            },
                            {
                                caption: 'B5',
                                subtitle: '17,6cm x 25,01cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [176, 250.1]
                            },
                            {
                                caption: 'Envelope #10',
                                subtitle: '10,48cm x 24,13cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [104.8, 241.3]
                            },
                            {
                                caption: 'Envelope DL',
                                subtitle: '11,01cm x 22,01cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [110.1, 220.1]
                            },
                            {
                                caption: 'Tabloid',
                                subtitle: '27,94cm x 43,17cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [279.4, 431.7]
                            },
                            {
                                caption: 'A3',
                                subtitle: '29,7cm x 42,01cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [297, 420.1]
                            },
                            {
                                caption: 'Tabloid Oversize',
                                subtitle: '30,48cm x 45,71cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [304.8, 457.1]
                            },
                            {
                                caption: 'ROC 16K',
                                subtitle: '19,68cm x 27,3cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [196.8, 273]
                            },
                            {
                                caption: 'Envelope Choukei 3',
                                subtitle: '11,99cm x 23,49cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [119.9, 234.9]
                            },
                            {
                                caption: 'Super B/A3',
                                subtitle: '33,02cm x 48,25cm',
                                template: pageSizeTemplate,
                                checkable: true,
                                toggleGroup: 'menuPageSize',
                                value: [330.2, 482.5]
                            },
                            {caption: '--'},
                            {caption: this.textPageSizeCustom, value: 'advanced'}
                        ]
                    })
                });
                this.toolbarControls.push(this.btnPageSize);

                this.btnClearStyle = new Common.UI.Button({
                    id: 'id-toolbar-btn-clearstyle',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-clearstyle'
                });
                this.toolbarControls.push(this.btnClearStyle);

                this.btnCopyStyle = new Common.UI.Button({
                    id: 'id-toolbar-btn-copystyle',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-copystyle',
                    enableToggle: true
                });
                this.toolbarControls.push(this.btnCopyStyle);

                this.btnColorSchemas = new Common.UI.Button({
                    id: 'id-toolbar-btn-colorschemas',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-colorschemas',
                    menu: new Common.UI.Menu({
                        items: [],
                        maxHeight: 600,
                        restoreHeight: 600
                    }).on('show:before', function (mnu) {
                        if (!this.scroller) {
                            this.scroller = new Common.UI.Scroller({
                                el: $(this.el).find('.dropdown-menu '),
                                useKeyboard: this.enableKeyEvents && !this.handleSelect,
                                minScrollbarLength: 40,
                                alwaysVisibleY: true
                            });
                        }
                    }).on('show:after', function (btn, e) {
                        var mnu = $(this.el).find('.dropdown-menu '),
                            docH = $(document).height(),
                            menuH = mnu.outerHeight(),
                            top = parseInt(mnu.css('top'));

                        if (menuH > docH) {
                            mnu.css('max-height', (docH - parseInt(mnu.css('padding-top')) - parseInt(mnu.css('padding-bottom')) - 5) + 'px');
                            this.scroller.update({minScrollbarLength: 40});
                        } else if (mnu.height() < this.options.restoreHeight) {
                            mnu.css('max-height', (Math.min(docH - parseInt(mnu.css('padding-top')) - parseInt(mnu.css('padding-bottom')) - 5, this.options.restoreHeight)) + 'px');
                            menuH = mnu.outerHeight();
                            if (top + menuH > docH) {
                                mnu.css('top', 0);
                            }
                            this.scroller.update({minScrollbarLength: 40});
                        }
                    })
                });
                this.toolbarControls.push(this.btnColorSchemas);

                this.btnNotes = new Common.UI.Button({
                    id: 'id-toolbar-btn-notes',
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'svgicon svg-btn-notes',
                    caption: me.capBtnInsFootnote,
                    split: true,
                    menu: true
                });
                this.paragraphControls.push(this.btnNotes);

                this.btnMailRecepients = new Common.UI.Button({
                    id: 'id-toolbar-btn-mailrecepients',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-mailrecepients'
                });

                this.btnHide = new Common.UI.Button({
                    id: 'id-toolbar-btn-hidebars',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-hidebars no-mask',
                    menu: true
                });
                this.toolbarControls.push(this.btnHide);

                this.btnFitPage = {
                    conf: {checked: false},
                    setChecked: function (val) {
                        this.conf.checked = val;
                    },
                    isChecked: function () {
                        return this.conf.checked;
                    }
                };
                this.btnFitWidth = clone(this.btnFitPage);
                this.mnuZoom = {options: {value: 100}};

                this.btnAdvSettings = new Common.UI.Button({
                    id: 'id-toolbar-btn-settings',
                    cls: 'btn-toolbar',
                    iconCls: 'btn-settings no-mask'
                });
                this.toolbarControls.push(this.btnAdvSettings);

                me.btnImgAlign = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    iconCls: 'btn-img-align',
                    caption: me.capImgAlign,
                    menu: true
                });

                me.btnImgGroup = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    iconCls: 'btn-img-group',
                    caption: me.capImgGroup,
                    menu: true
                });
                me.btnImgForward = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    iconCls: 'btn-img-frwd',
                    caption: me.capImgForward,
                    split: true,
                    menu: true
                });
                me.btnImgBackward = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    iconCls: 'btn-img-bkwd',
                    caption: me.capImgBackward,
                    split: true,
                    menu: true
                });
                me.btnImgWrapping = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    iconCls: 'btn-img-wrap',
                    caption: me.capImgWrapping,
                    menu: true
                });
                me.toolbarControls.push( me.btnImgAlign,
                    me.btnImgGroup, me.btnImgForward, me.btnImgBackward, me.btnImgWrapping);

                //
                // Menus
                //

                this.mnuLineSpace = this.btnLineSpace.menu;
                this.mnuNonPrinting = this.btnShowHidenChars.menu;
                this.mnuInsertTable = this.btnInsertTable.menu;
                this.mnuInsertImage = this.btnInsertImage.menu;
                this.mnuPageSize = this.btnPageSize.menu;
                this.mnuColorSchema = this.btnColorSchemas.menu;

                this.cmbFontSize = new Common.UI.ComboBox({
                    cls: 'input-group-nr',
                    menuStyle: 'min-width: 55px;',
                    hint: this.tipFontSize,
                    data: [
                        {value: 8, displayValue: "8"},
                        {value: 9, displayValue: "9"},
                        {value: 10, displayValue: "10"},
                        {value: 11, displayValue: "11"},
                        {value: 12, displayValue: "12"},
                        {value: 14, displayValue: "14"},
                        {value: 16, displayValue: "16"},
                        {value: 18, displayValue: "18"},
                        {value: 20, displayValue: "20"},
                        {value: 22, displayValue: "22"},
                        {value: 24, displayValue: "24"},
                        {value: 26, displayValue: "26"},
                        {value: 28, displayValue: "28"},
                        {value: 36, displayValue: "36"},
                        {value: 48, displayValue: "48"},
                        {value: 72, displayValue: "72"}
                    ]
                });
                this.paragraphControls.push(this.cmbFontSize);

                this.cmbFontName = new Common.UI.ComboBoxFonts({
                    cls: 'input-group-nr',
                    menuCls: 'scrollable-menu',
                    menuStyle: 'min-width: 325px;',
                    hint: this.tipFontName,
                    store: new Common.Collections.Fonts()
                });
                this.paragraphControls.push(this.cmbFontName);

                this.listStylesAdditionalMenuItem = new Common.UI.MenuItem({
                    template: _.template(
                        '<div id="id-save-style-container" class = "save-style-container">' +
                        '<span id="id-save-style-plus" class="plus img-commonctrl"  ></span>' +
                        '<label id="id-save-style-link" class="save-style-link" >' + me.textStyleMenuNew + '</label>' +
                        '</div>')
                });

                this.listStyles = new Common.UI.ComboDataView({
                    cls: 'combo-styles',
                    itemWidth: 104,
                    itemHeight: 38,
//                hint        : this.tipParagraphStyle,
                    enableKeyEvents: true,
                    additionalMenuItems: [this.listStylesAdditionalMenuItem],
                    beforeOpenHandler: function (e) {
                        var cmp = this,
                            menu = cmp.openButton.menu,
                            minMenuColumn = 6;

                        if (menu.cmpEl) {
                            var itemEl = $(cmp.cmpEl.find('.dataview.inner .style').get(0)).parent();
                            var itemMargin = /*parseInt($(itemEl.get(0)).parent().css('margin-right'))*/-1;
                            var itemWidth = itemEl.is(':visible') ? parseInt(itemEl.css('width')) :
                                (cmp.itemWidth + parseInt(itemEl.css('padding-left')) + parseInt(itemEl.css('padding-right')) +
                                parseInt(itemEl.css('border-left-width')) + parseInt(itemEl.css('border-right-width')));

                            var minCount = cmp.menuPicker.store.length >= minMenuColumn ? minMenuColumn : cmp.menuPicker.store.length,
                                columnCount = Math.min(cmp.menuPicker.store.length, Math.round($('.dataview', $(cmp.fieldPicker.el)).width() / (itemMargin + itemWidth) + 0.5));

                            columnCount = columnCount < minCount ? minCount : columnCount;
                            menu.menuAlignEl = cmp.cmpEl;

                            menu.menuAlign = 'tl-tl';
                            var offset = cmp.cmpEl.width() - cmp.openButton.$el.width() - columnCount * (itemMargin + itemWidth) - 1;
                            menu.setOffset(Math.min(offset, 0));

                            menu.cmpEl.css({
                                'width': columnCount * (itemWidth + itemMargin),
                                'min-height': cmp.cmpEl.height()
                            });
                        }

                        if (cmp.menuPicker.scroller) {
                            cmp.menuPicker.scroller.update({
                                includePadding: true,
                                suppressScrollX: true
                            });
                        }

                        cmp.removeTips();
                    }
                });

                this.listStyles.fieldPicker.itemTemplate = _.template([
                    '<div class="style" id="<%= id %>">',
                    '<div style="background-image: url(<%= imageUrl %>); width: ' + this.listStyles.itemWidth + 'px; height: ' + this.listStyles.itemHeight + 'px;"/>',
                    '</div>'
                ].join(''));
                this.listStyles.menuPicker.itemTemplate = _.template([
                    '<div class="style" id="<%= id %>">',
                    '<div style="background-image: url(<%= imageUrl %>); width: ' + this.listStyles.itemWidth + 'px; height: ' + this.listStyles.itemHeight + 'px;"/>',
                    '</div>'
                ].join(''));
                this.paragraphControls.push(this.listStyles);
                this.textOnlyControls.push(this.listStyles);

                // Disable all components before load document
                _.each(this.toolbarControls.concat(this.paragraphControls), function (cmp) {
                    if (_.isFunction(cmp.setDisabled))
                        cmp.setDisabled(true);
                });
                this.btnMailRecepients.setDisabled(true);

                var editStyleMenuUpdate = new Common.UI.MenuItem({
                    caption: me.textStyleMenuUpdate
                }).on('click', _.bind(me.onStyleMenuUpdate, me));

                var editStyleMenuRestore = new Common.UI.MenuItem({
                    caption: me.textStyleMenuDelete
                }).on('click', _.bind(me.onStyleMenuDelete, me));

                var editStyleMenuDelete = new Common.UI.MenuItem({
                    caption: me.textStyleMenuRestore
                }).on('click', _.bind(me.onStyleMenuDelete, me));

                var editStyleMenuRestoreAll = new Common.UI.MenuItem({
                    caption: me.textStyleMenuRestoreAll
                }).on('click', _.bind(me.onStyleMenuRestoreAll, me));

                var editStyleMenuDeleteAll = new Common.UI.MenuItem({
                    caption: me.textStyleMenuDeleteAll
                }).on('click', _.bind(me.onStyleMenuDeleteAll, me));

                if (this.styleMenu == null) {
                    this.styleMenu = new Common.UI.Menu({
                        items: [
                            editStyleMenuUpdate,
                            editStyleMenuRestore,
                            editStyleMenuDelete,
                            editStyleMenuRestoreAll,
                            editStyleMenuDeleteAll
                        ]
                    });
                }

                this.on('render:after', _.bind(this.onToolbarAfterRender, this));

                Common.NotificationCenter.on('app:ready', me.onAppReady.bind(this));

                return this;
            },

            render: function (mode) {
                var me = this;

                /**
                 * Render UI layout
                 */

                this.fireEvent('render:before', [this]);

                me.isCompactView = mode.isCompactView;
                if ( mode.isEdit ) {
                    me.$el.html(me.rendererComponents(me.$layout));
                } else {
                    me.$layout.find('.canedit').hide();
                    me.$layout.addClass('folded');

                    me.$el.html(me.$layout);
                }

                this.fireEvent('render:after', [this]);
                Common.UI.Mixtbar.prototype.afterRender.call(this);

                /** coauthoring begin **/
                this.showSynchTip = !Common.localStorage.getBool("de-hide-synch");
                this.needShowSynchTip = false;
                /** coauthoring end **/

                me.$tabs.parent().on('click', '.ribtab', function (e) {
                    var tab = $(e.target).data('tab');
                    if (tab == 'file') {
                        me.fireEvent('file:open');
                    } else
                    if ( me.isTabActive('file') )
                        me.fireEvent('file:close');

                    me.setTab(tab);
                });

                Common.NotificationCenter.on({
                    'window:resize': function() {
                        Common.UI.Mixtbar.prototype.onResize.apply(me, arguments);
                    }
                });

                if ( me.isCompactView )
                    me.setFolded(true); else
                    me.setTab('home');

                var top = Common.localStorage.getItem("de-pgmargins-top"),
                    left = Common.localStorage.getItem("de-pgmargins-left"),
                    bottom = Common.localStorage.getItem("de-pgmargins-bottom"),
                    right = Common.localStorage.getItem("de-pgmargins-right");
                if ( top!==null && left!==null && bottom!==null && right!==null ) {
                    var mnu = this.btnPageMargins.menu.items[0];
                    mnu.options.value = mnu.value = [parseFloat(top), parseFloat(left), parseFloat(bottom), parseFloat(right)];
                    mnu.setVisible(true);
                    $(mnu.el).html(mnu.template({id: Common.UI.getId(), caption : mnu.caption, options : mnu.options}));
                } else
                    this.btnPageMargins.menu.items[0].setVisible(false);

                return this;
            },

            rendererComponents: function (html) {
                var $host = $(html);
                var _injectComponent = function (id, cmp) {
                    var $slot = $host.find(id);
                    if ($slot.length) {
                        cmp.rendered ?
                            $slot.append(cmp.$el) : cmp.render($slot);
                    }
                };

                _injectComponent('#slot-field-fontname', this.cmbFontName);
                _injectComponent('#slot-field-fontsize', this.cmbFontSize);
                _injectComponent('#slot-btn-print', this.btnPrint);
                _injectComponent('#slot-btn-save', this.btnSave);
                _injectComponent('#slot-btn-undo', this.btnUndo);
                _injectComponent('#slot-btn-redo', this.btnRedo);
                _injectComponent('#slot-btn-copy', this.btnCopy);
                _injectComponent('#slot-btn-paste', this.btnPaste);
                _injectComponent('#slot-btn-incfont', this.btnIncFontSize);
                _injectComponent('#slot-btn-decfont', this.btnDecFontSize);
                _injectComponent('#slot-btn-bold', this.btnBold);
                _injectComponent('#slot-btn-italic', this.btnItalic);
                _injectComponent('#slot-btn-underline', this.btnUnderline);
                _injectComponent('#slot-btn-strikeout', this.btnStrikeout);
                _injectComponent('#slot-btn-superscript', this.btnSuperscript);
                _injectComponent('#slot-btn-subscript', this.btnSubscript);
                _injectComponent('#slot-btn-highlight', this.btnHighlightColor);
                _injectComponent('#slot-btn-fontcolor', this.btnFontColor);
                _injectComponent('#slot-btn-align-left', this.btnAlignLeft);
                _injectComponent('#slot-btn-align-center', this.btnAlignCenter);
                _injectComponent('#slot-btn-align-right', this.btnAlignRight);
                _injectComponent('#slot-btn-align-just', this.btnAlignJust);
                _injectComponent('#slot-btn-incoffset', this.btnIncLeftOffset);
                _injectComponent('#slot-btn-decoffset', this.btnDecLeftOffset);
                _injectComponent('#slot-btn-linespace', this.btnLineSpace);
                _injectComponent('#slot-btn-hidenchars', this.btnShowHidenChars);
                _injectComponent('#slot-btn-markers', this.btnMarkers);
                _injectComponent('#slot-btn-numbering', this.btnNumbers);
                _injectComponent('#slot-btn-multilevels', this.btnMultilevels);
                _injectComponent('#slot-btn-instable', this.btnInsertTable);
                _injectComponent('#slot-btn-insimage', this.btnInsertImage);
                _injectComponent('#slot-btn-inschart', this.btnInsertChart);
                _injectComponent('#slot-btn-instext', this.btnInsertText);
                _injectComponent('#slot-btn-instextart', this.btnInsertTextArt);
                _injectComponent('#slot-btn-dropcap', this.btnDropCap);
                _injectComponent('#slot-btn-columns', this.btnColumns);
                _injectComponent('#slot-btn-inshyperlink', this.btnInsertHyperlink);
                _injectComponent('#slot-btn-editheader', this.btnEditHeader);
                _injectComponent('#slot-btn-insshape', this.btnInsertShape);
                _injectComponent('#slot-btn-insequation', this.btnInsertEquation);
                _injectComponent('#slot-btn-pageorient', this.btnPageOrient);
                _injectComponent('#slot-btn-pagemargins', this.btnPageMargins);
                _injectComponent('#slot-btn-pagesize', this.btnPageSize);
                _injectComponent('#slot-btn-clearstyle', this.btnClearStyle);
                _injectComponent('#slot-btn-copystyle', this.btnCopyStyle);
                _injectComponent('#slot-btn-colorschemas', this.btnColorSchemas);
                _injectComponent('#slot-btn-hidebars', this.btnHide);
                _injectComponent('#slot-btn-settings', this.btnAdvSettings);
                _injectComponent('#slot-btn-paracolor', this.btnParagraphColor);
                _injectComponent('#slot-field-styles', this.listStyles);
                _injectComponent('#slot-btn-halign', this.btnHorizontalAlign);
                _injectComponent('#slot-btn-mailrecepients', this.btnMailRecepients);
                _injectComponent('#slot-btn-notes', this.btnNotes);
                _injectComponent('#slot-img-align', this.btnImgAlign);
                _injectComponent('#slot-img-group', this.btnImgGroup);
                _injectComponent('#slot-img-movefrwd', this.btnImgForward);
                _injectComponent('#slot-img-movebkwd', this.btnImgBackward);
                _injectComponent('#slot-img-wrapping', this.btnImgWrapping);

                +function injectBreakButtons() {
                    var me = this;

                    me.btnsPageBreak = [];
                    me.btnsPageBreak.disable = function(status) {
                        this.forEach(function(btn) {
                            btn.setDisabled(status);
                        });
                    };

                    var $slots = $host.find('.btn-slot.btn-pagebreak');
                    $slots.each(function(index, el) {
                        var button = new Common.UI.Button({
                            cls: 'btn-toolbar',
                            iconCls: 'btn-pagebreak',
                            caption: me.capBtnInsPagebreak,
                            split: true,
                            menu: true
                        }).render( $slots.eq(index) );

                        me.btnsPageBreak.push(button);
                    });

                    Array.prototype.push.apply(me.paragraphControls, me.btnsPageBreak);
                }.call(this);

                return $host;
            },

            onAppReady: function (config) {
                var me = this;
                (new Promise( function(resolve, reject) {
                    resolve();
                })).then(function () {
                    if ( !config.isEdit ) return;

                    me.btnsPageBreak.forEach( function(btn) {
                        btn.updateHint( me.tipPageBreak );

                        var _menu_section_break = new Common.UI.Menu({
                            menuAlign: 'tl-tr',
                            items: [
                                {caption: me.textNextPage, value: Asc.c_oAscSectionBreakType.NextPage},
                                {caption: me.textContPage, value: Asc.c_oAscSectionBreakType.Continuous},
                                {caption: me.textEvenPage, value: Asc.c_oAscSectionBreakType.EvenPage},
                                {caption: me.textOddPage, value: Asc.c_oAscSectionBreakType.OddPage}
                            ]
                        });

                        var _menu = new Common.UI.Menu({
                            items: [
                                {caption: me.textInsPageBreak},
                                {caption: me.textInsColumnBreak, value: 'column'},
                                {caption: me.textInsSectionBreak, value: 'section', menu: _menu_section_break}
                            ]
                        });

                        btn.setMenu(_menu);
                    });

                    var _holder_view = DE.getController('DocumentHolder').getView();
                    me.btnImgForward.updateHint(me.tipSendForward);
                    me.btnImgForward.setMenu(new Common.UI.Menu({
                        items: [{
                                caption : _holder_view.textArrangeFront,
                                iconCls : 'mnu-arrange-front',
                                valign  : Asc.c_oAscChangeLevel.BringToFront
                            }, {
                                caption : _holder_view.textArrangeForward,
                                iconCls : 'mnu-arrange-forward',
                                valign  : Asc.c_oAscChangeLevel.BringForward
                            }
                        ]})
                    );

                    me.btnImgBackward.updateHint(me.tipSendBackward);
                    me.btnImgBackward.setMenu(new Common.UI.Menu({
                        items: [{
                                caption : _holder_view.textArrangeBack,
                                iconCls : 'mnu-arrange-back',
                                valign  : Asc.c_oAscChangeLevel.SendToBack
                            }, {
                                caption : _holder_view.textArrangeBackward,
                                iconCls : 'mnu-arrange-backward',
                                valign  : Asc.c_oAscChangeLevel.BringBackward
                            }]
                    }));

                    me.btnImgAlign.updateHint(me.tipImgAlign);
                    me.btnImgAlign.setMenu(new Common.UI.Menu({
                        items: [{
                                caption : _holder_view.textShapeAlignLeft,
                                iconCls : 'mnu-img-align-left',
                                halign  : Asc.c_oAscAlignH.Left
                            }, {
                                caption : _holder_view.textShapeAlignCenter,
                                iconCls : 'mnu-img-align-center',
                                halign  : Asc.c_oAscAlignH.Center
                            }, {
                                caption : _holder_view.textShapeAlignRight,
                                iconCls : 'mnu-img-align-right',
                                halign  : Asc.c_oAscAlignH.Right
                            }, {
                                caption : _holder_view.textShapeAlignTop,
                                iconCls : 'mnu-img-align-top',
                                valign  : Asc.c_oAscAlignV.Top
                            }, {
                                caption : _holder_view.textShapeAlignMiddle,
                                iconCls : 'mnu-img-align-middle',
                                valign  : Asc.c_oAscAlignV.Center
                            }, {
                                caption : _holder_view.textShapeAlignBottom,
                                iconCls : 'mnu-img-align-bottom',
                                valign  : Asc.c_oAscAlignV.Bottom
                            }]
                    }));

                    me.btnImgGroup.updateHint(me.tipImgGroup);
                    me.btnImgGroup.setMenu(new Common.UI.Menu({
                        items: [{
                            caption : _holder_view.txtGroup,
                            iconCls : 'mnu-arrange-group',
                            groupval: 1
                        }, {
                            caption : _holder_view.txtUngroup,
                            iconCls : 'mnu-arrange-ungroup',
                            groupval: -1
                        }]
                    }));

                    me.btnImgWrapping.updateHint(me.tipImgWrapping);
                    me.btnImgWrapping.setMenu(new Common.UI.Menu({
                        cls: 'ppm-toolbar',
                        items: [{
                                caption     : _holder_view.txtInline,
                                iconCls     : 'mnu-wrap-inline',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.Inline,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtSquare,
                                iconCls     : 'mnu-wrap-square',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.Square,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtTight,
                                iconCls     : 'mnu-wrap-tight',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.Tight,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtThrough,
                                iconCls     : 'mnu-wrap-through',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.Through,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtTopAndBottom,
                                iconCls     : 'mnu-wrap-topAndBottom',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.TopAndBottom,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtInFront,
                                iconCls     : 'mnu-wrap-inFront',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.InFront,
                                checkable   : true
                            }, {
                                caption     : _holder_view.txtBehind,
                                iconCls     : 'mnu-wrap-behind',
                                toggleGroup : 'imgwrapping',
                                wrapType    : Asc.c_oAscWrapStyle2.Behind,
                                checkable   : true
                            }
                        ]
                    }));
                });
            },

            createDelayedElements: function () {
                if (this.api) {
                    this.mnuNonPrinting.items[0].setChecked(this.api.get_ShowParaMarks(), true);
                    this.mnuNonPrinting.items[1].setChecked(this.api.get_ShowTableEmptyLine(), true);
                    this.btnShowHidenChars.toggle(this.mnuNonPrinting.items[0].checked, true);

                    this.updateMetricUnit();
                }

                // set hints
                this.btnPrint.updateHint(this.tipPrint + Common.Utils.String.platformKey('Ctrl+P'));
                this.btnSave.updateHint(this.btnSaveTip);
                this.btnUndo.updateHint(this.tipUndo + Common.Utils.String.platformKey('Ctrl+Z'));
                this.btnRedo.updateHint(this.tipRedo + Common.Utils.String.platformKey('Ctrl+Y'));
                this.btnCopy.updateHint(this.tipCopy + Common.Utils.String.platformKey('Ctrl+C'));
                this.btnPaste.updateHint(this.tipPaste + Common.Utils.String.platformKey('Ctrl+V'));
                this.btnIncFontSize.updateHint(this.tipIncFont + Common.Utils.String.platformKey('Ctrl+]'));
                this.btnDecFontSize.updateHint(this.tipDecFont + Common.Utils.String.platformKey('Ctrl+['));
                this.btnBold.updateHint(this.textBold + Common.Utils.String.platformKey('Ctrl+B'));
                this.btnItalic.updateHint(this.textItalic + Common.Utils.String.platformKey('Ctrl+I'));
                this.btnUnderline.updateHint(this.textUnderline + Common.Utils.String.platformKey('Ctrl+U'));
                this.btnStrikeout.updateHint(this.textStrikeout);
                this.btnSuperscript.updateHint(this.textSuperscript);
                this.btnSubscript.updateHint(this.textSubscript);
                this.btnHighlightColor.updateHint(this.tipHighlightColor);
                this.btnFontColor.updateHint(this.tipFontColor);
                this.btnParagraphColor.updateHint(this.tipPrColor);
                this.btnAlignLeft.updateHint(this.tipAlignLeft + Common.Utils.String.platformKey('Ctrl+L'));
                this.btnAlignCenter.updateHint(this.tipAlignCenter + Common.Utils.String.platformKey('Ctrl+E'));
                this.btnAlignRight.updateHint(this.tipAlignRight + Common.Utils.String.platformKey('Ctrl+R'));
                this.btnAlignJust.updateHint(this.tipAlignJust + Common.Utils.String.platformKey('Ctrl+J'));
                this.btnHorizontalAlign.updateHint(this.tipHAligh);
                this.btnDecLeftOffset.updateHint(this.tipDecPrLeft + Common.Utils.String.platformKey('Ctrl+Shift+M'));
                this.btnIncLeftOffset.updateHint(this.tipIncPrLeft + Common.Utils.String.platformKey('Ctrl+M'));
                this.btnLineSpace.updateHint(this.tipLineSpace);
                this.btnShowHidenChars.updateHint(this.tipShowHiddenChars);
                this.btnMarkers.updateHint(this.tipMarkers);
                this.btnNumbers.updateHint(this.tipNumbers);
                this.btnMultilevels.updateHint(this.tipMultilevels);
                this.btnInsertTable.updateHint(this.tipInsertTable);
                this.btnInsertImage.updateHint(this.tipInsertImage);
                this.btnInsertChart.updateHint(this.tipInsertChart);
                this.btnInsertText.updateHint(this.tipInsertText);
                this.btnInsertTextArt.updateHint(this.tipInsertTextArt);
                this.btnInsertHyperlink.updateHint(this.tipInsertHyperlink + Common.Utils.String.platformKey('Ctrl+K'));
                this.btnEditHeader.updateHint(this.tipEditHeader);
                this.btnInsertShape.updateHint(this.tipInsertShape);
                this.btnInsertEquation.updateHint(this.tipInsertEquation);
                this.btnDropCap.updateHint(this.tipDropCap);
                this.btnColumns.updateHint(this.tipColumns);
                this.btnPageOrient.updateHint(this.tipPageOrient);
                this.btnPageSize.updateHint(this.tipPageSize);
                this.btnPageMargins.updateHint(this.tipPageMargins);
                this.btnClearStyle.updateHint(this.tipClearStyle);
                this.btnCopyStyle.updateHint(this.tipCopyStyle + Common.Utils.String.platformKey('Ctrl+Shift+C'));
                this.btnColorSchemas.updateHint(this.tipColorSchemas);
                this.btnMailRecepients.updateHint(this.tipMailRecepients);
                this.btnHide.updateHint(this.tipViewSettings);
                this.btnAdvSettings.updateHint(this.tipAdvSettings);
                this.btnNotes.updateHint(this.tipNotes);

                // set menus

                var me = this;

                this.btnHide.setMenu(new Common.UI.Menu({
                        cls: 'pull-right',
                        style: 'min-width: 180px;',
                        items: [
                            this.mnuitemCompactToolbar = new Common.UI.MenuItem({
                                caption: this.textCompactView,
                                checked: me.isCompactView,
                                checkable: true
                            }),
                            this.mnuitemHideStatusBar = new Common.UI.MenuItem({
                                caption: this.textHideStatusBar,
                                checked: Common.localStorage.getBool("de-hidden-status"),
                                checkable: true
                            }),
                            this.mnuitemHideRulers = new Common.UI.MenuItem({
                                caption: this.textHideLines,
                                checked: Common.localStorage.getBool("de-hidden-rulers"),
                                checkable: true
                            }),
                            {caption: '--'},
                            this.btnFitPage = new Common.UI.MenuItem({
                                caption: this.textFitPage,
                                checkable: true,
                                checked: this.btnFitPage.isChecked()
                            }),
                            this.btnFitWidth = new Common.UI.MenuItem({
                                caption: this.textFitWidth,
                                checkable: true,
                                checked: this.btnFitWidth.isChecked()
                            }),
                            this.mnuZoom = new Common.UI.MenuItem({
                                template: _.template([
                                    '<div id="id-toolbar-menu-zoom" class="menu-zoom" style="height: 25px;" ',
                                    '<% if(!_.isUndefined(options.stopPropagation)) { %>',
                                    'data-stopPropagation="true"',
                                    '<% } %>', '>',
                                    '<label class="title">' + this.textZoom + '</label>',
                                    '<button id="id-menu-zoom-in" type="button" style="float:right; margin: 2px 5px 0 0;" class="btn small btn-toolbar"><i class="icon btn-zoomup">&nbsp;</i></button>',
                                    '<label class="zoom"><%= options.value %>%</label>',
                                    '<button id="id-menu-zoom-out" type="button" style="float:right; margin-top: 2px;" class="btn small btn-toolbar"><i class="icon btn-zoomdown">&nbsp;</i></button>',
                                    '</div>'
                                ].join('')),
                                stopPropagation: true,
                                value: this.mnuZoom.options.value
                            })
                        ]
                    })
                );
                // if (this.mode.isDesktopApp || this.mode.canBrandingExt && this.mode.customization && this.mode.customization.header === false)
                //     this.mnuitemHideTitleBar.hide();

                if (this.mode.canBrandingExt && this.mode.customization && this.mode.customization.statusBar===false)
                    this.mnuitemHideStatusBar.hide();

                this.btnMarkers.setMenu(
                    new Common.UI.Menu({
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-markers" class="menu-markers" style="width: 185px; margin: 0 5px;"></div>')}
                        ]
                    })
                );

                this.btnNumbers.setMenu(
                    new Common.UI.Menu({
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-numbering" class="menu-markers" style="width: 185px; margin: 0 5px;"></div>')}
                        ]
                    })
                );

                this.btnMultilevels.setMenu(
                    new Common.UI.Menu({
                        style: 'min-width: 90px',
                        items: [
                            {template: _.template('<div id="id-toolbar-menu-multilevels" class="menu-markers" style="width: 93px; margin: 0 5px;"></div>')}
                        ]
                    })
                );

                this.btnEditHeader.setMenu(
                    new Common.UI.Menu({
                        items: [
                            {caption: this.mniEditHeader, value: 'header'},
                            {caption: this.mniEditFooter, value: 'footer'},
                            {caption: '--'},
                            this.mnuInsertPageNum = new Common.UI.MenuItem({
                                caption: this.textInsertPageNumber,
                                disabled: this.mnuInsertPageNum.isDisabled(),
                                menu: new Common.UI.Menu({
                                    menuAlign: 'tl-tr',
                                    items: [
                                        {template: _.template('<div id="id-toolbar-menu-pageposition" class="menu-pageposition"></div>')},
                                        this.mnuPageNumCurrentPos = new Common.UI.MenuItem({
                                            caption: this.textToCurrent,
                                            disabled: this.mnuPageNumCurrentPos.isDisabled(),
                                            value: 'current'
                                        })
                                    ]
                                })
                            }),
                            this.mnuInsertPageCount = new Common.UI.MenuItem({
                                caption: this.textInsertPageCount,
                                disabled: this.mnuInsertPageCount.isDisabled()
                            })
                        ]
                    })
                );
                this.paragraphControls.push(this.mnuPageNumCurrentPos);
                this.paragraphControls.push(this.mnuInsertPageCount);

                this.mnuZoomOut = new Common.UI.Button({
                    el: $('#id-menu-zoom-out'),
                    cls: 'btn-toolbar'
                });
                this.mnuZoomIn = new Common.UI.Button({
                    el: $('#id-menu-zoom-in'),
                    cls: 'btn-toolbar'
                });

                this.btnNotes.setMenu(
                    new Common.UI.Menu({
                        items: [
                            {caption: this.mniInsFootnote, value: 'ins_footnote'},
                            {caption: '--'},
                            this.mnuGotoFootnote = new Common.UI.MenuItem({
                                template: _.template([
                                    '<div id="id-toolbar-menu-goto-footnote" class="menu-zoom" style="height: 25px;" ',
                                    '<% if(!_.isUndefined(options.stopPropagation)) { %>',
                                    'data-stopPropagation="true"',
                                    '<% } %>', '>',
                                    '<label class="title">' + this.textGotoFootnote + '</label>',
                                    '<button id="id-menu-goto-footnote-next" type="button" style="float:right; margin: 2px 5px 0 0;" class="btn small btn-toolbar"><i class="icon mmerge-next">&nbsp;</i></button>',
                                    '<button id="id-menu-goto-footnote-prev" type="button" style="float:right; margin-top: 2px;" class="btn small btn-toolbar"><i class="icon mmerge-prev">&nbsp;</i></button>',
                                    '</div>'
                                ].join('')),
                                stopPropagation: true
                            }),
                            {caption: '--'},
                            {caption: this.mniDelFootnote, value: 'delele'},
                            {caption: this.mniNoteSettings, value: 'settings'}
                        ]
                    })
                );

                this.mnuGotoFootPrev = new Common.UI.Button({
                    el: $('#id-menu-goto-footnote-prev'),
                    cls: 'btn-toolbar'
                });
                this.mnuGotoFootNext = new Common.UI.Button({
                    el: $('#id-menu-goto-footnote-next'),
                    cls: 'btn-toolbar'
                });

                // set dataviews

                var _conf = this.mnuMarkersPicker.conf;
                this.mnuMarkersPicker = new Common.UI.DataView({
                    el: $('#id-toolbar-menu-markers'),
                    parentMenu: this.btnMarkers.menu,
                    restoreHeight: 92,
                    allowScrollbar: false,
                    store: new Common.UI.DataViewStore([
                        {offsety: 0, data: {type: 0, subtype: -1}},
                        {offsety: 38, data: {type: 0, subtype: 1}},
                        {offsety: 76, data: {type: 0, subtype: 2}},
                        {offsety: 114, data: {type: 0, subtype: 3}},
                        {offsety: 152, data: {type: 0, subtype: 4}},
                        {offsety: 190, data: {type: 0, subtype: 5}},
                        {offsety: 228, data: {type: 0, subtype: 6}},
                        {offsety: 266, data: {type: 0, subtype: 7}}
                    ]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-markerlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
                _conf && this.mnuMarkersPicker.selectByIndex(_conf.index, true);

                _conf = this.mnuNumbersPicker.conf;
                this.mnuNumbersPicker = new Common.UI.DataView({
                    el: $('#id-toolbar-menu-numbering'),
                    parentMenu: this.btnNumbers.menu,
                    restoreHeight: 92,
                    allowScrollbar: false,
                    store: new Common.UI.DataViewStore([
                        {offsety: 0, data: {type: 1, subtype: -1}},
                        {offsety: 570, data: {type: 1, subtype: 4}},
                        {offsety: 532, data: {type: 1, subtype: 5}},
                        {offsety: 608, data: {type: 1, subtype: 6}},
                        {offsety: 418, data: {type: 1, subtype: 1}},
                        {offsety: 456, data: {type: 1, subtype: 2}},
                        {offsety: 494, data: {type: 1, subtype: 3}},
                        {offsety: 646, data: {type: 1, subtype: 7}}
                    ]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-markerlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
                _conf && this.mnuNumbersPicker.selectByIndex(_conf.index, true);

                _conf = this.mnuMultilevelPicker.conf;
                this.mnuMultilevelPicker = new Common.UI.DataView({
                    el: $('#id-toolbar-menu-multilevels'),
                    parentMenu: this.btnMultilevels.menu,
                    restoreHeight: 92,
                    allowScrollbar: false,
                    store: new Common.UI.DataViewStore([
                        {offsety: 0, data: {type: 2, subtype: -1}},
                        {offsety: 304, data: {type: 2, subtype: 1}},
                        {offsety: 342, data: {type: 2, subtype: 2}},
                        {offsety: 380, data: {type: 2, subtype: 3}}
                    ]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-markerlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
                _conf && this.mnuMultilevelPicker.selectByIndex(_conf.index, true);

                _conf = this.mnuPageNumberPosPicker ? this.mnuPageNumberPosPicker.conf : undefined;
                this.mnuPageNumberPosPicker = new Common.UI.DataView({
                    el: $('#id-toolbar-menu-pageposition'),
                    allowScrollbar: false,
                    store: new Common.UI.DataViewStore([
                        {
                            offsety: 132,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                            }
                        },
                        {
                            offsety: 99,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                            }
                        },
                        {
                            offsety: 66,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                            }
                        },
                        {
                            offsety: 33,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                            }
                        },
                        {
                            offsety: 0,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                            }
                        },
                        {
                            offsety: 165,
                            allowSelected: false,
                            data: {
                                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                                subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                            }
                        }
                    ]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-pagenumber" style="background-position: 0 -<%= offsety %>px"></div>')
                });
                _conf && this.mnuPageNumberPosPicker.setDisabled(_conf.disabled);

                this.mnuInsertChartPicker = new Common.UI.DataView({
                    el: $('#id-toolbar-menu-insertchart'),
                    parentMenu: this.btnInsertChart.menu,
                    showLast: false,
                    restoreHeight: 421,
                    groups: new Common.UI.DataViewGroupStore([
                        {id: 'menu-chart-group-bar', caption: me.textColumn, headername: me.textCharts},
                        {id: 'menu-chart-group-line', caption: me.textLine},
                        {id: 'menu-chart-group-pie', caption: me.textPie},
                        {id: 'menu-chart-group-hbar', caption: me.textBar},
                        {id: 'menu-chart-group-area', caption: me.textArea, inline: true},
                        {id: 'menu-chart-group-scatter', caption: me.textPoint, inline: true},
                        {id: 'menu-chart-group-stock', caption: me.textStock, inline: true}
                    ]),
                    store: new Common.UI.DataViewStore([
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barNormal,
                            allowSelected: true,
                            iconCls: 'column-normal',
                            selected: true
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barStacked,
                            allowSelected: true,
                            iconCls: 'column-stack'
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barStackedPer,
                            allowSelected: true,
                            iconCls: 'column-pstack'
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barNormal3d,
                            allowSelected: true,
                            iconCls: 'column-3d-normal'
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barStacked3d,
                            allowSelected: true,
                            iconCls: 'column-3d-stack'
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barStackedPer3d,
                            allowSelected: true,
                            iconCls: 'column-3d-pstack'
                        },
                        {
                            group: 'menu-chart-group-bar',
                            type: Asc.c_oAscChartTypeSettings.barNormal3dPerspective,
                            allowSelected: true,
                            iconCls: 'column-3d-normal-per'
                        },
                        {
                            group: 'menu-chart-group-line',
                            type: Asc.c_oAscChartTypeSettings.lineNormal,
                            allowSelected: true,
                            iconCls: 'line-normal'
                        },
                        {
                            group: 'menu-chart-group-line',
                            type: Asc.c_oAscChartTypeSettings.lineStacked,
                            allowSelected: true,
                            iconCls: 'line-stack'
                        },
                        {
                            group: 'menu-chart-group-line',
                            type: Asc.c_oAscChartTypeSettings.lineStackedPer,
                            allowSelected: true,
                            iconCls: 'line-pstack'
                        },
                        {
                            group: 'menu-chart-group-line',
                            type: Asc.c_oAscChartTypeSettings.line3d,
                            allowSelected: true,
                            iconCls: 'line-3d'
                        },
                        {
                            group: 'menu-chart-group-pie',
                            type: Asc.c_oAscChartTypeSettings.pie,
                            allowSelected: true,
                            iconCls: 'pie-normal'
                        },
                        {
                            group: 'menu-chart-group-pie',
                            type: Asc.c_oAscChartTypeSettings.doughnut,
                            allowSelected: true,
                            iconCls: 'pie-doughnut'
                        },
                        {
                            group: 'menu-chart-group-pie',
                            type: Asc.c_oAscChartTypeSettings.pie3d,
                            allowSelected: true,
                            iconCls: 'pie-3d-normal'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarNormal,
                            allowSelected: true,
                            iconCls: 'bar-normal'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarStacked,
                            allowSelected: true,
                            iconCls: 'bar-stack'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarStackedPer,
                            allowSelected: true,
                            iconCls: 'bar-pstack'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarNormal3d,
                            allowSelected: true,
                            iconCls: 'bar-3d-normal'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarStacked3d,
                            allowSelected: true,
                            iconCls: 'bar-3d-stack'
                        },
                        {
                            group: 'menu-chart-group-hbar',
                            type: Asc.c_oAscChartTypeSettings.hBarStackedPer3d,
                            allowSelected: true,
                            iconCls: 'bar-3d-pstack'
                        },
                        {
                            group: 'menu-chart-group-area',
                            type: Asc.c_oAscChartTypeSettings.areaNormal,
                            allowSelected: true,
                            iconCls: 'area-normal'
                        },
                        {
                            group: 'menu-chart-group-area',
                            type: Asc.c_oAscChartTypeSettings.areaStacked,
                            allowSelected: true,
                            iconCls: 'area-stack'
                        },
                        {
                            group: 'menu-chart-group-area',
                            type: Asc.c_oAscChartTypeSettings.areaStackedPer,
                            allowSelected: true,
                            iconCls: 'area-pstack'
                        },
                        {
                            group: 'menu-chart-group-scatter',
                            type: Asc.c_oAscChartTypeSettings.scatter,
                            allowSelected: true,
                            iconCls: 'point-normal'
                        },
                        {
                            group: 'menu-chart-group-stock',
                            type: Asc.c_oAscChartTypeSettings.stock,
                            allowSelected: true,
                            iconCls: 'stock-normal'
                        }
                    ]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-chartlist <%= iconCls %>"></div>')
                });

                this.mnuTablePicker = new Common.UI.DimensionPicker({
                    el: $('#id-toolbar-menu-tablepicker'),
                    minRows: 8,
                    minColumns: 10,
                    maxRows: 8,
                    maxColumns: 10
                });
            },

            onToolbarAfterRender: function(toolbar) {
                // DataView and pickers
                //
                var colorVal;
                if (this.btnHighlightColor.cmpEl) {
                    colorVal = $('<div class="btn-color-value-line"></div>');
                    $('button:first-child', this.btnHighlightColor.cmpEl).append(colorVal);
                    this.btnHighlightColor.currentColor = 'FFFF00';
                    colorVal.css('background-color', '#' + this.btnHighlightColor.currentColor);
                    this.mnuHighlightColorPicker = new Common.UI.ColorPalette({
                        el: $('#id-toolbar-menu-highlight'),
                        colors: [
                            'FFFF00', '00FF00', '00FFFF', 'FF00FF', '0000FF', 'FF0000', '00008B', '008B8B',
                            '006400', '800080', '8B0000', '808000', 'FFFFFF', 'D3D3D3', 'A9A9A9', '000000'
                        ]
                    });
                    this.mnuHighlightColorPicker.select('FFFF00');
                }

                if (this.btnFontColor.cmpEl) {
                    colorVal = $('<div class="btn-color-value-line"></div>');
                    $('button:first-child', this.btnFontColor.cmpEl).append(colorVal);
                    colorVal.css('background-color', this.btnFontColor.currentColor || 'transparent');
                    this.mnuFontColorPicker = new Common.UI.ThemeColorPalette({
                        el: $('#id-toolbar-menu-fontcolor')
                    });
                }

                if (this.btnParagraphColor.cmpEl) {
                    colorVal = $('<div class="btn-color-value-line"></div>');
                    $('button:first-child', this.btnParagraphColor.cmpEl).append(colorVal);
                    colorVal.css('background-color', this.btnParagraphColor.currentColor || 'transparent');
                    this.mnuParagraphColorPicker = new Common.UI.ThemeColorPalette({
                        el: $('#id-toolbar-menu-paracolor'),
                        transparent: true
                    });
                }
            },

            updateMetricUnit: function () {
                var items = this.btnPageMargins.menu.items;
                for (var i = 0; i < items.length; i++) {
                    var mnu = items[i];
                    if (mnu.checkable) {
                        var checked = mnu.checked;
                        $(mnu.el).html(mnu.template({
                            id: Common.UI.getId(),
                            caption: mnu.caption,
                            options: mnu.options
                        }));
                        if (checked) mnu.setChecked(checked);
                    }
                }
                items = this.btnPageSize.menu.items;
                for (var i = 0; i < items.length; i++) {
                    var mnu = items[i];
                    if (mnu.checkable) {
                        var checked = mnu.checked;
                        $(mnu.el).html(mnu.template({
                            id: Common.UI.getId(),
                            caption: mnu.caption,
                            options: mnu.options
                        }));
                        if (checked) mnu.setChecked(checked);
                    }
                }
            },

            setApi: function (api) {
                this.api = api;
                /** coauthoring begin **/
                this.api.asc_registerCallback('asc_onSendThemeColorSchemes', _.bind(this.onSendThemeColorSchemes, this));
                this.api.asc_registerCallback('asc_onCollaborativeChanges', _.bind(this.onCollaborativeChanges, this));
                this.api.asc_registerCallback('asc_onAuthParticipantsChanged', _.bind(this.onApiUsersChanged, this));
                this.api.asc_registerCallback('asc_onParticipantsChanged', _.bind(this.onApiUsersChanged, this));
                /** coauthoring end **/
                return this;
            },

            setMode: function (mode) {
                if (mode.isDisconnected) {
                    this.btnSave.setDisabled(true);
                    this.btnCopy.setDisabled(true);
                    this.btnPaste.setDisabled(true);
                    this.btnUndo.setDisabled(true);
                    this.btnRedo.setDisabled(true);
                    this.btnIncFontSize.setDisabled(true);
                    this.btnDecFontSize.setDisabled(true);
                    this.btnBold.setDisabled(true);
                    this.btnItalic.setDisabled(true);
                    this.btnUnderline.setDisabled(true);
                    this.btnStrikeout.setDisabled(true);
                    this.btnSuperscript.setDisabled(true);
                    this.btnSubscript.setDisabled(true);
                    this.btnHighlightColor.setDisabled(true);
                    this.btnFontColor.setDisabled(true);
                    this.btnParagraphColor.setDisabled(true);
                    this.btnMarkers.setDisabled(true);
                    this.btnNumbers.setDisabled(true);
                    this.btnMultilevels.setDisabled(true);
                    this.btnAlignLeft.setDisabled(true);
                    this.btnAlignCenter.setDisabled(true);
                    this.btnAlignRight.setDisabled(true);
                    this.btnAlignJust.setDisabled(true);
                    this.btnDecLeftOffset.setDisabled(true);
                    this.btnIncLeftOffset.setDisabled(true);
                    this.btnLineSpace.setDisabled(true);
                    this.btnShowHidenChars.setDisabled(true);
                    this.btnInsertTable.setDisabled(true);
                    this.btnInsertImage.setDisabled(true);
                    this.btnInsertChart.setDisabled(true);
                    this.btnInsertText.setDisabled(true);
                    this.btnInsertTextArt.setDisabled(true);
                    this.btnDropCap.setDisabled(true);
                    this.btnColumns.setDisabled(true);
                    this.btnInsertHyperlink.setDisabled(true);
                    this.btnEditHeader.setDisabled(true);
                    this.btnInsertShape.setDisabled(true);
                    this.btnInsertEquation.setDisabled(true);
                    this.btnPageOrient.setDisabled(true);
                    this.btnPageMargins.setDisabled(true);
                    this.btnPageSize.setDisabled(true);
                    this.btnClearStyle.setDisabled(true);
                    this.btnCopyStyle.setDisabled(true);
                    this.btnColorSchemas.setDisabled(true);
                    this.btnMailRecepients.setDisabled(true);
                    this.btnHorizontalAlign.setDisabled(true);
                    this.cmbFontName.setDisabled(true);
                    this.cmbFontSize.setDisabled(true);
                    this.listStyles.setDisabled(true);
                    this.btnNotes.setDisabled(true);
                    if (mode.disableDownload)
                        this.btnPrint.setDisabled(true);

                    this.btnsPageBreak.disable(true);
                }

                this.mode = mode;

                this.btnMailRecepients.setVisible(mode.canCoAuthoring == true && mode.canUseMailMerge);
                this.listStylesAdditionalMenuItem.setVisible(mode.canEditStyles);
            },

            onSendThemeColorSchemes: function (schemas) {
                var me = this;

                if (this.mnuColorSchema && this.mnuColorSchema.items.length > 0) {
                    _.each(this.mnuColorSchema.items, function (item) {
                        item.remove();
                    });
                }

                if (this.mnuColorSchema == null) {
                    this.mnuColorSchema = new Common.UI.Menu({
                        maxHeight: 600,
                        restoreHeight: 600
                    }).on('show:before', function (mnu) {
                        this.scroller = new Common.UI.Scroller({
                            el: $(this.el).find('.dropdown-menu '),
                            useKeyboard: this.enableKeyEvents && !this.handleSelect,
                            minScrollbarLength: 40
                        });
                    });
                }
                this.mnuColorSchema.items = [];

                var itemTemplate = _.template([
                    '<a id="<%= id %>"  tabindex="-1" type="menuitem" class="<%= options.cls %>">',
                    '<span class="colors">',
                    '<% _.each(options.colors, function(color) { %>',
                    '<span class="color" style="background: <%= color %>;"></span>',
                    '<% }) %>',
                    '</span>',
                    '<span class="text"><%= caption %></span>',
                    '</a>'
                ].join(''));

                _.each(schemas, function (schema, index) {
                    var colors = schema.get_colors();//schema.colors;
                    var schemecolors = [];
                    for (var j = 2; j < 7; j++) {
                        var clr = '#' + Common.Utils.ThemeColor.getHexColor(colors[j].get_r(), colors[j].get_g(), colors[j].get_b());
                        schemecolors.push(clr);
                    }

                    if (index == 21) {
                        this.mnuColorSchema.addItem({
                            caption: '--'
                        });
                    } else {
                        this.mnuColorSchema.addItem({
                            template: itemTemplate,
                            cls: 'color-schemas-menu',
                            colors: schemecolors,
                            caption: (index < 21) ? (me.SchemeNames[index] || schema.get_name()) : schema.get_name(),
                            value: index
                        });
                    }
                }, this);
            },

            /** coauthoring begin **/
            onCollaborativeChanges: function () {
                if (this._state.hasCollaborativeChanges) return;
                if (!this.btnSave.rendered) {
                    this.needShowSynchTip = true;
                    return;
                }

                this._state.hasCollaborativeChanges = true;
                var iconEl = $('.icon', this.btnSave.cmpEl);
                iconEl.removeClass(this.btnSaveCls);
                iconEl.addClass('btn-synch');
                if (this.showSynchTip) {
                    this.btnSave.updateHint('');
                    if (this.synchTooltip === undefined)
                        this.createSynchTip();

                    this.synchTooltip.show();
                } else {
                    this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey('Ctrl+S'));
                }

                this.btnSave.setDisabled(false);
                Common.Gateway.collaborativeChanges();
            },

            createSynchTip: function () {
                this.synchTooltip = new Common.UI.SynchronizeTip({
                    target: $('#id-toolbar-btn-save')
                });
                this.synchTooltip.on('dontshowclick', function () {
                    this.showSynchTip = false;
                    this.synchTooltip.hide();
                    this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey('Ctrl+S'));
                    Common.localStorage.setItem("de-hide-synch", 1);
                }, this);
                this.synchTooltip.on('closeclick', function () {
                    this.synchTooltip.hide();
                    this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey('Ctrl+S'));
                }, this);
            },

            synchronizeChanges: function () {
                if (this.btnSave.rendered) {
                    var iconEl = $('.icon', this.btnSave.cmpEl);

                    if (iconEl.hasClass('btn-synch')) {
                        iconEl.removeClass('btn-synch');
                        iconEl.addClass(this.btnSaveCls);
                        if (this.synchTooltip)
                            this.synchTooltip.hide();
                        this.btnSave.updateHint(this.btnSaveTip);
                        this.btnSave.setDisabled(!this.mode.forcesave);
                        this._state.hasCollaborativeChanges = false;
                    }
                }
            },

            onApiUsersChanged: function (users) {
                var editusers = [];
                _.each(users, function (item) {
                    if (!item.asc_getView())
                        editusers.push(item);
                });

                var length = _.size(editusers);
                var cls = (length > 1) ? 'btn-save-coauth' : 'btn-save';
                if (cls !== this.btnSaveCls && this.btnSave.rendered) {
                    this.btnSaveTip = ((length > 1) ? this.tipSaveCoauth : this.tipSave ) + Common.Utils.String.platformKey('Ctrl+S');

                    var iconEl = $('.icon', this.btnSave.cmpEl);
                    if (!iconEl.hasClass('btn-synch')) {
                        iconEl.removeClass(this.btnSaveCls);
                        iconEl.addClass(cls);
                        this.btnSave.updateHint(this.btnSaveTip);
                    }
                    this.btnSaveCls = cls;
                }
            },

            /** coauthoring end **/

            onStyleMenuUpdate: function (item, e, eOpt) {
                var me = this;
                if (me.api) {
                    var style = me.api.asc_GetStyleFromFormatting();
                    var title = item.styleTitle;

                    var characterStyle = style.get_Link();
                    style.put_Name(title);
                    characterStyle.put_Name(title + '_character');
                    me.api.asc_AddNewStyle(style);
                    setTimeout(function () {
                        me.listStyles.openButton.menu.hide();
                    }, 100);
                }
            },

            onStyleMenuDelete: function (item, e, eOpt) {
                var me = this;
                if (me.api) {
                    this.api.asc_RemoveStyle(item.styleTitle);
                }
            },

            onStyleMenuRestoreAll: function (item, e, eOpt) {
                var me = this;
                if (me.api) {
                    _.each(window.styles.get_MergedStyles(), function (style) {
                        if (me.api.asc_IsStyleDefault(style.get_Name())) {
                            me.api.asc_RemoveStyle(style.get_Name());
                        }
                    });
                }
            },

            onStyleMenuDeleteAll: function (item, e, eOpt) {
                if (this.api)
                    this.api.asc_RemoveAllCustomStyles();
            },

            textBold: 'Bold',
            textItalic: 'Italic',
            textUnderline: 'Underline',
            textStrikeout: 'Strikeout',
            textSuperscript: 'Superscript',
            textSubscript: 'Subscript',
            strMenuNoFill: 'No Fill',
            tipFontName: 'Font Name',
            tipFontSize: 'Font Size',
            tipParagraphStyle: 'Paragraph Style',
            tipCopy: 'Copy',
            tipPaste: 'Paste',
            tipUndo: 'Undo',
            tipRedo: 'Redo',
            tipPrint: 'Print',
            tipSave: 'Save',
            tipIncFont: 'Increment font size',
            tipDecFont: 'Decrement font size',
            tipHighlightColor: 'Highlight color',
            tipFontColor: 'Font color',
            tipMarkers: 'Bullets',
            tipNumbers: 'Numbering',
            tipMultilevels: 'Outline',
            tipAlignLeft: 'Align Left',
            tipAlignRight: 'Align Right',
            tipAlignCenter: 'Align Center',
            tipAlignJust: 'Justified',
            tipDecPrLeft: 'Decrease Indent',
            tipIncPrLeft: 'Increase Indent',
            tipShowHiddenChars: 'Nonprinting Characters',
            tipLineSpace: 'Paragraph Line Spacing',
            tipPrColor: 'Background color',
            tipInsertTable: 'Insert Table',
            tipInsertImage: 'Insert Picture',
            tipPageBreak: 'Insert Page or Section break',
            tipInsertNum: 'Insert Page Number',
            tipClearStyle: 'Clear Style',
            tipCopyStyle: 'Copy Style',
            tipPageSize: 'Page Size',
            tipPageOrient: 'Page Orientation',
            tipBack: 'Back',
            tipInsertShape: 'Insert Autoshape',
            tipInsertEquation: 'Insert Equation',
            mniImageFromFile: 'Picture from file',
            mniImageFromUrl: 'Picture from url',
            mniCustomTable: 'Insert Custom Table',
            textTitleError: 'Error',
            textInsertPageNumber: 'Insert page number',
            textToCurrent: 'To Current Position',
            tipEditHeader: 'Edit Document Header or Footer',
            mniEditHeader: 'Edit Document Header',
            mniEditFooter: 'Edit Document Footer',
            tipInsertHyperlink: 'Add Hyperlink',
            mniHiddenChars: 'Nonprinting Characters',
            mniHiddenBorders: 'Hidden Table Borders',
            tipSynchronize: 'The document has been changed by another user. Please click to save your changes and reload the updates.',
            textNewColor: 'Add New Custom Color',
            textAutoColor: 'Automatic',
            tipInsertChart: 'Insert Chart',
            textLine: 'Line',
            textColumn: 'Column',
            textBar: 'Bar',
            textArea: 'Area',
            textPie: 'Pie',
            textPoint: 'XY (Scatter)',
            textStock: 'Stock',
            tipColorSchemas: 'Change Color Scheme',
            tipInsertText: 'Insert Text',
            tipInsertTextArt: 'Insert Text-art',
            tipHAligh: 'Horizontal Align',
            tipViewSettings: 'View Settings',
            tipAdvSettings: 'Advanced Settings',
            textCompactView: 'View Compact Toolbar',
            textHideTitleBar: 'Hide Title Bar',
            textHideStatusBar: 'Hide Status Bar',
            textHideLines: 'Hide Rulers',
            textFitPage: 'Fit to Page',
            textFitWidth: 'Fit to Width',
            textZoom: 'Zoom',
            mniEditDropCap: 'Drop Cap Settings',
            textNone: 'None',
            textInText: 'In Text',
            textInMargin: 'In Margin',
            tipDropCap: 'Insert drop cap',
            txtScheme1: 'Office',
            txtScheme2: 'Grayscale',
            txtScheme3: 'Apex',
            txtScheme4: 'Aspect',
            txtScheme5: 'Civic',
            txtScheme6: 'Concourse',
            txtScheme7: 'Equity',
            txtScheme8: 'Flow',
            txtScheme9: 'Foundry',
            txtScheme10: 'Median',
            txtScheme11: 'Metro',
            txtScheme12: 'Module',
            txtScheme13: 'Opulent',
            txtScheme14: 'Oriel',
            txtScheme15: 'Origin',
            txtScheme16: 'Paper',
            txtScheme17: 'Solstice',
            txtScheme18: 'Technic',
            txtScheme19: 'Trek',
            txtScheme20: 'Urban',
            txtScheme21: 'Verve',
            textInsPageBreak: 'Insert Page Break',
            textInsColumnBreak: 'Insert Column Break',
            textInsSectionBreak: 'Insert Section Break',
            textNextPage: 'Next Page',
            textContPage: 'Continuous Page',
            textEvenPage: 'Even Page',
            textOddPage: 'Odd Page',
            tipSaveCoauth: 'Save your changes for the other users to see them.',
            tipMailRecepients: 'Mail Merge',
            textStyleMenuUpdate: 'Update from select',
            textStyleMenuRestore: 'Restore to default',
            textStyleMenuDelete: 'Delete style',
            textStyleMenuRestoreAll: 'Restore all to default styles',
            textStyleMenuDeleteAll: 'Delete all custom styles',
            textStyleMenuNew: 'New style from selection',
            tipColumns: 'Insert columns',
            textColumnsOne: 'One',
            textColumnsTwo: 'Two',
            textColumnsThree: 'Three',
            textColumnsLeft: 'Left',
            textColumnsRight: 'Right',
            tipPageMargins: 'Page Margins',
            textMarginsLast: 'Last Custom',
            textMarginsNormal: 'Normal',
            textMarginsUsNormal: 'US Normal',
            textMarginsNarrow: 'Narrow',
            textMarginsModerate: 'Moderate',
            textMarginsWide: 'Wide',
            textPageMarginsCustom: 'Custom margins',
            textTop: 'Top: ',
            textLeft: 'Left: ',
            textBottom: 'Bottom: ',
            textRight: 'Right: ',
            textPageSizeCustom: 'Custom Page Size',
            textPortrait: 'Portrait',
            textLandscape: 'Landscape',
            textInsertPageCount: 'Insert number of pages',
            textCharts: 'Charts',
            tipNotes: 'Footnotes',
            mniInsFootnote: 'Insert Footnote',
            mniDelFootnote: 'Delete All Footnotes',
            mniNoteSettings: 'Notes Settings',
            textGotoFootnote: 'Go to Footnotes',
            tipChangeChart: 'Change Chart Type',
            capBtnInsPagebreak: 'Page Break',
            capBtnInsImage: 'Picture',
            capBtnInsTable: 'Table',
            capBtnInsChart: 'Chart',
            capBtnInsLink: 'Hyperlink',
            textTabFile: 'File',
            textTabHome: 'Home',
            textTabInsert: 'Insert',
            textTabLayout: 'Page Layout',
            textTabReview: 'Review',
            capBtnInsShape: 'Shape',
            capBtnInsTextbox: 'Text',
            capBtnInsTextart: 'Text-art',
            capBtnInsDropcap: 'Drop Cap',
            capBtnInsFootnote: 'Footnotes',
            capBtnInsEquation: 'Equation',
            capBtnInsHeader: 'Headers/Footers',
            capBtnColumns: 'Columns',
            capBtnPageOrient: 'Orientation',
            capBtnMargins: 'Margins',
            capBtnPageSize: 'Size',
            tipImgAlign: 'Align objects',
            tipImgGroup: 'Group objects',
            tipImgWrapping: 'Wrap text',
            tipSendForward: 'Send forward',
            tipSendBackward: 'Send backward',
            capImgAlign: 'Align',
            capImgGroup: 'Group',
            capImgForward: 'Move forward',
            capImgBackward: 'Move backward',
            capImgWrapping: 'Wrapping',
            capBtnComment: 'Comment',
            textColumnsCustom: 'Custom Columns'
        }
    })(), DE.Views.Toolbar || {}));
});
