﻿"use strict";

(
	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ( window, undefined) {

		if (!window["Asc"]) {window["Asc"] = {};}
		var prot;

		/** @constructor */
		function asc_CAdvancedOptions(id,opt){
			this.optionId = null;
			this.options = null;

			switch(id){
				case c_oAscAdvancedOptionsID.CSV:
					this.optionId = id;
					this.options = new asc_CCSVOptions(opt);
					break;
			}
		}
		asc_CAdvancedOptions.prototype.asc_getOptionId = function(){ return this.optionId; };
		asc_CAdvancedOptions.prototype.asc_getOptions = function(){ return this.options; };

		window["Asc"].asc_CAdvancedOptions = window["Asc"]["asc_CAdvancedOptions"] = asc_CAdvancedOptions;
		prot = asc_CAdvancedOptions.prototype;
		prot["asc_getOptionId"]			= prot.asc_getOptionId;
		prot["asc_getOptions"]			= prot.asc_getOptions;

		/** @constructor */
		function asc_CCSVOptions(opt){
			this.codePages = function(){
				var arr = [], c, encodings = opt["encodings"];
				for(var i = 0; i < encodings.length; i++ ){
					c = new asc_CCodePage();
					c.init(encodings[i]);
					arr.push(c);
				}
				return arr;
			}();
			this.recommendedSettings = new asc_CCSVAdvancedOptions (opt["codepage"], opt["delimiter"]);
		}
		asc_CCSVOptions.prototype.asc_getCodePages = function(){ return this.codePages;};
		asc_CCSVOptions.prototype.asc_getRecommendedSettings = function () { return this.recommendedSettings; };

		window["Asc"].asc_CCSVOptions = asc_CCSVOptions;
		window["Asc"]["asc_CCSVOptions"] = asc_CCSVOptions;
		prot = asc_CCSVOptions.prototype;

		prot["asc_getCodePages"]			= prot.asc_getCodePages;
		prot["asc_getRecommendedSettings"]	= prot.asc_getRecommendedSettings;

		/** @constructor */
		function asc_CCSVAdvancedOptions(codepage,delimiter){
			this.codePage = codepage;
			this.delimiter = delimiter;
		}
		asc_CCSVAdvancedOptions.prototype.asc_getDelimiter = function(){return this.delimiter;};
		asc_CCSVAdvancedOptions.prototype.asc_setDelimiter = function(v){this.delimiter = v;};
		asc_CCSVAdvancedOptions.prototype.asc_getCodePage = function(){return this.codePage;};
		asc_CCSVAdvancedOptions.prototype.asc_setCodePage = function(v){this.codePage = v;};

		window["Asc"].asc_CCSVAdvancedOptions = window["Asc"]["asc_CCSVAdvancedOptions"] = asc_CCSVAdvancedOptions;
		prot = asc_CCSVAdvancedOptions.prototype;
		prot["asc_getDelimiter"] = prot.asc_getDelimiter;
		prot["asc_setDelimiter"] = prot.asc_setDelimiter;
		prot["asc_getCodePage"] = prot.asc_getCodePage;
		prot["asc_setCodePage"] = prot.asc_setCodePage;

		/** @constructor */
		function asc_CCodePage(){
			this.codePageName = null;
			this.codePage = null;
			this.text = null;
		}
		asc_CCodePage.prototype.init = function (encoding) {
			this.codePageName = encoding["name"];
			this.codePage = encoding["codepage"];
			this.text = encoding["text"];
		};
		asc_CCodePage.prototype.asc_getCodePageName = function(){return this.codePageName;};
		asc_CCodePage.prototype.asc_setCodePageName = function(v){this.codePageName = v;};
		asc_CCodePage.prototype.asc_getCodePage = function(){return this.codePage;};
		asc_CCodePage.prototype.asc_setCodePage = function(v){this.codePage = v;};
		asc_CCodePage.prototype.asc_getText = function(){return this.text;};
		asc_CCodePage.prototype.asc_setText = function(v){this.text = v;};

		window["Asc"].asc_CCodePage = window["Asc"]["asc_CCodePage"] = asc_CCodePage;
		prot = asc_CCodePage.prototype;
		prot["asc_getCodePageName"]		= prot.asc_getCodePageName;
		prot["asc_setCodePageName"]		= prot.asc_setCodePageName;
		prot["asc_getCodePage"]			= prot.asc_getCodePage;
		prot["asc_setCodePage"]			= prot.asc_setCodePage;
		prot["asc_getText"]				= prot.asc_getText;
		prot["asc_setText"]				= prot.asc_setText;

		/** @constructor */
		function asc_CDelimiter(delimiter){
			this.delimiterName = delimiter;
		}
		asc_CDelimiter.prototype.asc_getDelimiterName = function(){return this.delimiterName;};
		asc_CDelimiter.prototype.asc_setDelimiterName = function(v){ this.delimiterName = v;};

		window["Asc"].asc_CDelimiter = window["Asc"]["asc_CDelimiter"] = asc_CDelimiter;
		prot = asc_CDelimiter.prototype;
		prot["asc_getDelimiterName"]			= prot.asc_getDelimiterName;
		prot["asc_setDelimiterName"]			= prot.asc_setDelimiterName;

		CFont.prototype= {
			asc_getFontId : function() { return this.id; },
			asc_getFontName : function() { return this.name; },
			asc_getFontThumbnail : function() { return this.thumbnail; },
			asc_getFontType : function() { return this.type; }
		};

		window["Asc"].CFont = window["Asc"]["CFont"] = CFont;
		prot = CFont.prototype;
		prot["asc_getFontId"]			= prot.asc_getFontId;
		prot["asc_getFontName"]			= prot.asc_getFontName;
		prot["asc_getFontThumbnail"]	= prot.asc_getFontThumbnail;
		prot["asc_getFontType"]			= prot.asc_getFontType;

		/** @constructor */
		function asc_CFormulaGroup(name){
			this.groupName = name;
			this.formulasArray = [];
		}
		asc_CFormulaGroup.prototype.asc_getGroupName = function() { return this.groupName; };
		asc_CFormulaGroup.prototype.asc_getFormulasArray = function() { return this.formulasArray; };
		asc_CFormulaGroup.prototype.asc_addFormulaElement = function(o) { return this.formulasArray.push(o); };

		window["Asc"].asc_CFormulaGroup = window["Asc"]["asc_CFormulaGroup"] = asc_CFormulaGroup;
		prot = asc_CFormulaGroup.prototype;
		prot["asc_getGroupName"]				= prot.asc_getGroupName;
		prot["asc_getFormulasArray"]			= prot.asc_getFormulasArray;
		prot["asc_addFormulaElement"]			= prot.asc_addFormulaElement;

		/** @constructor */
		function asc_CFormula(o){
			this.name = o.name;
			this.arg = o.args;
		}
		asc_CFormula.prototype.asc_getName = function () {
			return cFormulaFunctionToLocale ? cFormulaFunctionToLocale[this.name] : this.name;
		};
		asc_CFormula.prototype.asc_getArguments = function () {
			return this.arg;
		};

		window["Asc"].asc_CFormula = window["Asc"]["asc_CFormula"] = asc_CFormula;
		prot = asc_CFormula.prototype;
		prot["asc_getName"]				= prot.asc_getName;
		prot["asc_getArguments"]		= prot.asc_getArguments;

	}
)(window);