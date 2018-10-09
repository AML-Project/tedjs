/**

 * @name 2ed : TED js

 * @name Easy Element Definer

 * @version 1.2.2

 * @license MIT

 */

var tedApi;

(function ($, $u) {
	/**

     * @param {HTMLElement} _style The Object Of Ted Style Element In Html Document

     * 

     * @param {Object} Elms Storage Of All Ted Elements Pointer

     * 

     * @param {Object} Attrs Storage Of Ted Attrs Created

     * 

     * @param {Array} Comments Array Of Ted Comments Created Objects

     * 

     * @param {Array} TextNodes Array Of Ted TextNodes Created Objects

     * 

     * @param {Array} local_obj_name,local_obj_value Arrays That are Store the object to send included libs

     * 

     * @param {function} __GLOBAL_API_FUNCTIONS__ Function That Return an Object Of Local Element Functions

     */

	var ted = {},
		Ted_Native_Setting = {
			url      : 'https://api.tedjs.org/cdn/',

			libError : ''
		},
		_EventStorage = {},
		_style,
		Elms = {},
		_this = this,
		Attrs = {},
		Comments = [],
		TextNodes = [],
		readyList = [],
		readyFired = false,
		ready_run_code,
		local_obj_name = [],
		local_obj_value = [],
		included_libs = {},
		Onchage_Compile = [],
		onCompile_Ready = [],
		ElementStyleSets = {},
		readyEventHandlersInstalled = false,
		CURSOR_POSIRION = {
			client   : {
				top  : 0,
				left : 0
			},
			screen   : {
				top  : 0,
				left : 0
			},
			document : {
				top  : 0,
				left : 0
			}
		},
		__FindEvents = function (id, title, event,all) {
			var Events = [];
			if (tedApi.isJustArray(_EventStorage[id])) {
				for (var i = 0; i < _EventStorage[id].length; i++) {
					if (_EventStorage[id][i][title] === event) {
						if(all){
							Events.push(_EventStorage[id][i]);
						}
						else{
							return _EventStorage[id][i];
						}
					}
				}
			}
			return Events;
		},
		__GLOBAL_API_FUNCTIONS__ = function ($this) {
			return {
				show         : function (e) {
					return tedApi.show(this.self, e);
				},
				parent       : function (e) {
					return tedApi.parent(this.self, e);
				},

				hide         : function (e) {
					return tedApi.hide(this.self, e);
				},

				run          : function (e) {
					return tedApi.run.call(this.self, e);
				},

				random       : function (len, kind) {
					return tedApi.random(len, kind);
				},

				html         : function (a) {
					return tedApi.html(this.self, a);
				},

				text         : function (a) {
					return tedApi.text(this.self, a);
				},

				asHtml       : function (a) {
					return tedApi.asHtml(this.self, a);
				},

				attr         : function (a, b) {
					return tedApi.attr(this.self, a, b);
				},

				hasAttr      : function (a) {
					return tedApi.hasAttr(this.self, a);
				},

				copyAttr     : function (a) {
					return tedApi.copyAttr(a, this.self);
				},

				removeAttr   : function (a) {
					return tedApi.removeAttr(this.self, a);
				},

				toMiliSecond : function (str) {
					return tedApi.toMiliSecond(str);
				},

				toTime       : function (s) {
					return typeof s == 'string' || typeof s == 'number'
						? tedApi.toMiliSecond(s) !== null ? tedApi.SecToTime(tedApi.toMiliSecond(s) / 1000) : null
						: null;
				}, //Object{string{h:m:s},Obj{h,m,s}}

				changeWith   : function (o) {
					return tedApi.replaceElement(o, this.self);
				}, //ret 1:Success | ret 0:Wrong Input

				remove       : function () {
					return tedApi.remove(this.self);
				}, //remove this element

				delete       : function () {
					return tedApi.delete(this.self);
				},

				children     : function (y) {
					return tedApi.children.call(window, this.self, y);
				},

				sons         : function (y) {
					return tedApi.sons.call(window, this.self, y);
				},

				removeText   : function () {
					return tedApi.removeText(this.self);
				},

				css          : function (i, v) {
					return tedApi.css.call(window, this.self, i, v);
				},

				bind         : function (v, f) {
					return tedApi.bind(this.self, v, f);
				},

				find         : function (g) {
					return tedApi.find(this.self, g);
				},

				append       : function (b) {
					return tedApi.append(this.self, b);
				},

				reCompile    : function () {
					return tedApi.compile(this.self);
				},

				removeAttr   : function (a) {
					return tedApi.removeAttr(this.self, a);
				},

				ElementStyle : function (objcss) {
					if (!tedApi.isObject(objcss)) return 0;

					var Obj = {};

					Obj[this.self.tagName.toLowerCase()] = objcss;

					return tedApi.ElementStyle(Obj);
				},

				self         : $this // The Element Object
			};
		};

	var Ted_setting_In = typeof Ted_setting === typeof undefined ? {} : Ted_setting;

	_style = document.createElement('style');

	_style.id = '2edMainStyle-style-for-new-elms';

	document.head.appendChild(_style);

	function ready () {
		if (!readyFired) {
			readyFired = true;

			for (var i = 0; i < readyList.length; i++) {
				readyList[i].fn.call(window, readyList[i].ctx);
			}

			readyList = [];
		}
	}

	function readyStateChange () {
		if (document.readyState === 'complete') {
			ready();
		}
	}

	/**

     * 

     * 

     * 

     * this Function is used for get all nodes of any elements

     * @function documentNodes

     * @arg {HTMLElement} b an HTML to Get Its Nodes

     * @arg {boolean} k if false it will not contain element it self

     * @return {NodeList} A Node List Of Child Nodes

     * 

     * 

     */

	function documentNodes (b, k) {
		var nodeIterator;
		try {
			nodeIterator = document.createNodeIterator(b ? b : tedApi.elm('html'), NodeFilter.SHOW_ALL, function (
				node
			) {
				return NodeFilter.FILTER_ACCEPT;
			});
		} catch (e) {
			nodeIterator = document.createNodeIterator(
				b ? b : tedApi.elm('html'),
				NodeFilter.SHOW_ALL,
				function (node) {
					return NodeFilter.FILTER_ACCEPT;
				},
				false
			);
		}

		var pars = [];

		var currentNode;

		if (!k) nodeIterator.nextNode();

		while ((currentNode = nodeIterator.nextNode())) {
			pars.push(currentNode);
		}

		return pars;
	}

	/**

     * 

     * 

     * 

     * This Function Will Create A New Object With Your Constructor Name And Return 

     * That Object With Your Uneditable Functions

     * @function ___$ConstArrayObject

     * @arg {Array} t contain objects to insert your functions into Object : [ { name : "a", content : 2 }, { ... } ]

     * @arg {String} name The Name Of Return Object

     * @return {TED Object} An Object With {name} Constructor with any prototype Object

     * @typedef {TED Object} An Object That Created With ConstArrayObject And Has No Prototype

     * 

     * 

     * 

     */

	function ___$ConstArrayObject (t, name) {
		if (!tedApi.isArray(t) || t.isEmpty()) return [];

		if (tedApi.isUndefined(t[0]['name'], t[0]['content'])) return [];

		if (!tedApi.isAlpha(name)) name = 'TED_Object';

		var tt = '';

		var Ted_Object = tedApi.run('a = new(function ' + name.escape() + '(){});return a;');

		for (var i = 0; i < t.length; i++) {
			Object.defineProperty(Ted_Object, t[i]['name'].escape(), {
				value      : t[i]['content'],

				enumerable : true
			});
		}

		Object.defineProperty(Ted_Object, '__proto__', {
			value : null
		});

		return Ted_Object;
	}

	/**

     * 

     * 

     * 

     * This Function is used to get the variables in url 

     * @function $$GET

     * @return {TED Object} Return A Const Array Object

     * 

     * 

     * 

     */

	function $$GET () {
		var se = document.location.search;

		if (se.trim() == '') return {};

		var b = se.slice(1).split('&');

		var n = [];

		for (var i = 0; i < b.length; i++) {
			if (b[i].indexOf('=') == -1) continue;

			var y = b[i].slice(0, b[i].indexOf('=')),
				z = b[i].slice(b[i].indexOf('=') + 1);

			var CONTENT = decodeURIComponent(z);

			try {
				CONTENT = tedApi.run('return ' + CONTENT);
			} catch (e) {
				CONTENT = decodeURIComponent(z);
			}

			n.push({
				name    : y,

				content : CONTENT
			});
		}

		return ___$ConstArrayObject(n, 'GET');
	}

	/**

     * 

     * 

     * 

     * This Function is used to get the datas in Hash of url 

     * @function $$HASH

     * @return {TED Object} Return A Const Array Object

     * 

     * 

     * 

     */

	function $$HASH () {
		var se = document.location.hash;

		if (se.trim() == '' || se.trim() == '#') return {};

		var b = se.slice(1).split('&');

		var n = [];

		for (var i = 0; i < b.length; i++) {
			if (b[i].indexOf(':') == -1) continue;

			var y = b[i].slice(0, b[i].indexOf(':')),
				z = b[i].slice(b[i].indexOf(':') + 1);

			var CONTENT = decodeURIComponent(z);

			try {
				CONTENT = tedApi.run('return ' + CONTENT);
			} catch (e) {
				CONTENT = decodeURIComponent(z);
			}

			n.push({
				name    : y,

				content : CONTENT
			});
		}

		return ___$ConstArrayObject(n, 'UrlHashData');
	}

	var $$COOKIE = function () {
		return new function Cookie () {
			var COOKIES = [];

			function refresh () {
				var ca = document.cookie.split(';');

				for (var i = 0; i < ca.length; i++) {
					var c = ca[i].split('=');

					if (c[0].trim() != '') {
						var has = false;

						has = COOKIES.each(function (i) {
							if (this[i].name == c[0]) {
								return true;
							}
						});

						if (!has) {
							COOKIES.push({
								name  : c.splice(0, 1),

								value : decodeURIComponent(c.join('')),

								exp   : new Date(0)
							});
						}
					}
				}
			}

			this.set = function (name, value, exp) {
				refresh();

				if (!tedApi.isString(name) || tedApi.isUndefined(value)) return 0;

				if (this.has(name)) return -1;

				if (tedApi.isUndefined(exp)) exp = 1;

				var d = new Date();

				d.setTime(d.getTime() + exp * 24 * 60 * 60 * 1000);

				var expires = 'expires=' + d.toUTCString();

				COOKIES.push({
					name  : name,

					value : value,

					exp   : d
				});

				document.cookie =
					name + '=' + encodeURIComponent(tedApi.objectToString(value).toString()) + '; ' + expires;

				return 1;
			};

			this.all = function () {
				refresh();

				var s = {};

				COOKIES.each(function (i) {
					s[this[i].name] = this[i].value;
				});

				return s;
			};

			this.timeRemain = function (name) {
				refresh();

				if (!tedApi.isString(name)) return undefined;

				var out = COOKIES.each(function (i) {
					if (this[i].name == name) {
						var now = new Date();

						var THIS = this;

						return tedApi.constObj(
							{
								Start : THIS[i].exp,

								End   : now,

								time  : tedApi.SecToTime((THIS[i].exp - now) / 1000)
							},
							'CookieTime'
						);
					}
				});

				if (!tedApi.isUndefined(out)) return out;

				return undefined;
			};

			this.edit = function (name, value) {
				refresh();

				if (!tedApi.isString(name) || tedApi.isUndefined(value)) return 0;

				if (!this.has(name)) return -1;

				var data = this.get(name);

				this.remove(name);

				COOKIES.push({
					name  : name,

					value : value,

					exp   : data.exp
				});

				document.cookie = name + '=' + tedApi.objectToString(value).toString() + '; ' + data.exp.toUTCString();

				return 1;
			};

			this.val = function (name) {
				refresh();

				if (!tedApi.isString(name)) return undefined;

				var name = name + '=';

				var ca = document.cookie.split(';');

				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];

					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}

					if (c.indexOf(name) == 0) {
						var Val = c.substring(name.length, c.length);

						try {
							return tedApi.run('return ' + Val);
						} catch (e) {
							return Val;
						}
					}
				}

				return undefined;
			};

			this.get = function (name) {
				refresh();

				if (!tedApi.isString(name)) return undefined;

				var out = COOKIES.each(function (i) {
					if (this[i].name == name) {
						return this[i];
					}
				});

				if (!tedApi.isUndefined(out)) return out;

				return undefined;
			};

			this.has = function (name) {
				refresh();

				if (!tedApi.isString(name)) return false;

				var name = name + '=';

				var ca = document.cookie.split(';');

				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];

					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}

					if (c.indexOf(name) == 0) {
						return true;
					}
				}

				return false;
			};

			this.remove = function (name) {
				refresh();

				if (!tedApi.isString(name)) return undefined;

				if (this.has(name)) {
					COOKIES.each(function (i) {
						if (this[i].name == name) {
							this.splice(i, 1);

							return 0;
						}
					});

					document.cookie = name + '=; expires=Thu, 01 Jan 2000 00:00:00 UTC';

					return true;
				}

				return false;
			};

			this.clear = function () {
				refresh();

				var ALL = this.all();

				for (var i in ALL) {
					this.remove(i);
				}
			};
		}();
	};

	/**

     * loop in all objects or array

     */

	var $$$each = function (fn) {
		if (!tedApi.isFunction(fn)) return undefined;

		for (var Ted_Loop_I in this) {
			if (this.hasOwnProperty(Ted_Loop_I)) {
				var out = fn.call(this, Ted_Loop_I);

				if (!tedApi.isUndefined(out)) return out;
			}
		}
	};

	Object.defineProperty(Object.prototype, 'each', {
		value        : $$$each,
		writable     : true,
		enumerable   : false,
		configurable : true
	});

	/**

     * 

     *

     *

     * 

     *

     *

     * Editing The ToString Of Array that can return a stringlized Array

     * @function Array.prototype.toString

     * @arg {boolean} b tell function that return stringlized array or not

     * @return {string} if b == true then return Stringlized Array Else return normal string of array

     *

     *

     * 

     * 

     *

     *

     *

     */

	var OldToStrngArray = Array.prototype.toString;

	Array.prototype.toString = function (b) {
		if (b === true) {
			var out = '[';

			for (var i = 0; i < this.length; i++) {
				out += tedApi.isArray(this[i]) || tedApi.isObject(this[i]) ? this[i].toString(true) : this[i];

				if (i < this.length - 1) out += ',';
			}

			out += ']';

			return out;
		}

		return OldToStrngArray.call(this);
	};

	/**

     * 

     *

     *

     * 

     *

     * To Return Count Of Values In Object

     * @function Object.prototype.count

     * @return {number} count of values

     *

     *

     * 

     * 

     *

     */

	Object.defineProperty(Object.prototype, 'count', {
		get : function () {
			var count = 0;

			for (var i in this) {
				if (this.hasOwnProperty(i)) {
					count++;
				}
			}

			return count;
		}
	});

	/**

     * 

     *

     *

     * 

     *

     * Determining That Two Objects Are Equal in Values

     * @function Object.prototype.equal

     * @arg {object} b Second Object To Compare

     * @return {boolean} if They Are Equal => true else => false

     *

     *

     * 

     * 

     *

     */

	var $$$equal = function (b) {
		if ((tedApi.isObject(b) && tedApi.isObject(this)) || (tedApi.isArray(b) && tedApi.isArray(this))) {
			if (this.count != b.count) return false;

			for (var i in this) {
				if (this.hasOwnProperty(i)) {
					if (b.hasOwnProperty(i)) {
						if (
							!tedApi.isObject(this[i]) &&
							!tedApi.isArray(this[i]) &&
							!tedApi.isObject(b[i]) &&
							!tedApi.isArray(b[i])
						) {
							if (b[i].toString().replace(/[\s]+/g, '') != this[i].toString().replace(/[\s]+/g, ''))
								return false;
						}
						else {
							if (!this[i].equal(b[i])) return false;
						}
					}
					else {
						return false;
					}
				}
				else if (b.hasOwnProperty(i)) {
					return false;
				}
			}

			return true;
		}

		return false;
	};

	Object.defineProperty(Object.prototype, 'equal', {
		value        : $$$equal,
		writable     : true,
		enumerable   : false,
		configurable : true
	});

	/**

     *

     *

     *

     * This Function Will Convert First Char Of String To Upper Case

     * @function String.prototype.capital

     * @return {string} new created string

     *

     *

     */

	String.prototype.capital = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	/**

     * 

     *

     *

     *

     *

     * escape espicial characters like " ' ...

     * @function String.prototype.escape

     * @return {string} new escaped string

     *

     *

     *

     *

     */

	String.prototype.escape = function () {
		return this.replace(/[\"\'\\\/]/g, '\\$&');
	};

	/**

     * 

     *

     *

     *

     *

     * redefine replace for string to do replace an array of strings

     * @function String.prototype.replace

     * @arg {regexp, string, Array} v an arrays of string or single string or regexp to replace in String

     * @arg {string} b the string that must be replaced with {v}

     * @return {string} new string after replaces

     *

     *

     *

     *

     */

	var __String_replace = String.prototype.replace;

	String.prototype.replace = function (v, b) {
		var h = this;

		if (v.constructor === [].constructor) {
			for (var i = 0; i < v.length; i++) {
				h = __String_replace.call(h, v[i], b);
			}

			return h;
		}
		else {
			return __String_replace.call(h, v, b);
		}
	}; // Suporting Multi Replacing

	/**

     *

     *

     *

     *

     *

     *

     * this function will find an string in array with regexp.

     * @function Array.prototype.indexOf

     * @arg {string, number, regexp} n an object to match with array to find position

     * @arg {number} b the start point to search

     * @return {number} if notfound return -1 else return position

     *

     *

     *

     *

     *

     *

     */

	var __Array_IndexOf = Array.prototype.indexOf;

	Array.prototype.indexOf = function (n, b) {
		var j = this;

		if (n instanceof RegExp) {
			if (tedApi.isUndefined(b)) b = 0;

			for (var i = b; i < j.length; i++) {
				if (tedApi.isString(j[i]) && n.test(j[i])) return i;
			}

			return -1;
		}
		else {
			return __Array_IndexOf.call(j, n, b);
		}
	};

	var $$$isEmpty = function () {
		if (tedApi.isNull(this)) return true;

		if (this.length > 0) return false;

		if (this.length === 0) return true;

		for (var key in this) {
			if (Object.prototype.hasOwnProperty.call(this, key)) return false;
		}

		return true;
	};

	Object.defineProperty(Object.prototype, 'isEmpty', {
		value        : $$$isEmpty,
		writable     : true,
		enumerable   : false,
		configurable : true
	});

	var $$$copy = function (e) {
		if ({}.constructor !== e.constructor) return e;

		if (null == e || 'object' != typeof e) return e;

		for (var attr in e) {
			if (e.hasOwnProperty(attr)) this[attr] = e[attr];
		}

		return this;
	};

	Object.defineProperty(Object.prototype, 'copy', {
		value        : $$$copy,
		writable     : true,
		enumerable   : false,
		configurable : true
	});

	var $$$push = function (e) {
		if ({}.constructor !== e.constructor) return e;

		if (null == e || 'object' != typeof e) return e;

		for (var attr in e) {
			if (e.hasOwnProperty(attr)) {
				if (!this.hasOwnProperty(attr)) {
					this[attr] = e[attr];
				}
				else {
					var i = 1;

					while (++i) {
						if (!this.hasOwnProperty(attr + i.toString())) {
							this[attr + i.toString()] = e[attr];

							break;
						}
					}
				}
			}
		}

		return this;
	};

	Object.defineProperty(Object.prototype, 'push', {
		value        : $$$push,
		writable     : true,
		enumerable   : false,
		configurable : true
	});

	/**

     * @name NumberToString

     * @description convert scientific notation number to a normal number in String

     * @source http://stackoverflow.com/a/1685917

     */

	function NumberToString (x) {
		if (Math.abs(x) < 1.0) {
			var e = parseInt(x.toString().split('e-')[1]);

			if (e) {
				x *= Math.pow(10, e - 1);

				x = '0.' + new Array(e).join('0') + x.toString().substring(2);
			}
		}
		else {
			var e = parseInt(x.toString().split('+')[1]);

			if (e > 20) {
				e -= 20;

				x /= Math.pow(10, e);

				x += new Array(e + 1).join('0');
			}
		}

		return x;
	}

	/**

     * @arg {string} type set the output type

     * @arg {string} name the name or access name to lib

     */

	$.include = function (name, type) {
		var url = tedApi.isUrl(Ted_setting_In.url) ? Ted_setting_In.url : Ted_Native_Setting.url,
			OutAns,
			xhttp,
			NotFound = 0,
			state,
			rgx = /^([\w\d\$\_]+\.[\w\d\$\_]+\.[\w\d\$\_]+)$/g,
			rgx2 = /^(file\:)/g;

		if (typeof name == typeof $u) return -1;

		name = name.trim();

		if (rgx.test(name)) state = 'global';
		else state = 'local';

		/**

         * file: => it tel to function that input lib is in local

         */

		if (state == 'local') {
			if (rgx2.test(name)) name = name.slice(5).trim();
			else {
				tedApi.error('Your Include File Name Is Wrong!');

				return 0;
			}

			url = name;
		}
		else url += name;

		if (typeof type === typeof undefined) type = 'js';

		if ([ 'js', 'json', 'html', 'xml' ].indexOf(type) == -1) return 0;

		if (included_libs.hasOwnProperty(name.trim())) return included_libs[name.trim()];

		/*

                if (window.XMLHttpRequest) {

                    xhttp = new XMLHttpRequest();

                } else {

                    xhttp = new ActiveXObject("Microsoft.XMLHTTP");

                }

        */

		try {
			xhttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
				try {
					xhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (e) {
					tedApi.error("Your Browser Doesn't Support Ajax!");

					return false;
				}
			}
		}

		name = name.trim();

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				try {
					var SendObj = {},
						out = 1;

					iii = 0;

					if (type == 'js') {
						local_obj_name = [ 'ted', '__GLOBALS__' ];

						local_obj_value = [ ted, __GLOBAL_API_FUNCTIONS__ ];

						out = new Function(local_obj_name, xhttp.responseText + '; \n return this;');

						out = out.apply(SendObj, local_obj_value);
					}
					else if (type == 'json') {
						SendObj = tedApi.parseJSON(xhttp.responseText);
					}
					else if (type == 'html') {
						SendObj = tedApi.parseHTML(xhttp.responseText);
					}
					else if (type == 'xml') {
						SendObj = tedApi.parseXML(xhttp.responseText);
					}

					OutAns = typeof out === typeof $u ? 1 : SendObj;
				} catch (er) {
					tedApi.error("Loading The File '" + name + "' Failed! | Error:" + er);

					if (
						!tedApi.isUndefined(Ted_setting_In.libError) &&
						tedApi.isString(Ted_setting_In.libError) &&
						Ted_setting_In.libError != ''
					) {
						var ErrorText = Ted_setting_In.libError
							.replace(/\{\{\s*(error)\s*\}\}/g, er)
							.replace(/\{\{\s*(name)\s*\}\}/g, name);

						alert(ErrorText);
					}

					OutAns = 0;

					throw er;
				}
			}
			else if (xhttp.readyState == 2 && xhttp.status == 404) {
				NotFound = 1;
			}
			else if (xhttp.readyState == 4 && xhttp.status == 404) {
				if (NotFound) {
					tedApi.log("Loading The File '" + name + "' Failed!");

					if (
						!tedApi.isUndefined(Ted_setting_In.libError) &&
						tedApi.isString(Ted_setting_In.libError) &&
						Ted_setting_In.libError != ''
					) {
						var ErrorText = Ted_setting_In.libError
							.replace(/\{\{\s*(error)\s*\}\}/g, er)
							.replace(/\{\{\s*(name)\s*\}\}/g, name);

						alert(ErrorText);
					}

					OutAns = 0;
				}
				else {
					xhttp.open('GET', url, false);

					xhttp.send();
				}
			}
		};

		xhttp.open('GET', url, false);

		xhttp.send();

		if (OutAns != 0) {
			included_libs[name] = OutAns;
		}

		return OutAns;
	};

	$.ainclude = function (name, type) {
		var url = tedApi.isUrl(Ted_setting_In.url) ? Ted_setting_In.url : Ted_Native_Setting.url,
			OutAns,
			xhttp,
			NotFound = 0,
			state,
			rgx = /^([\w\d\$\_]+\.[\w\d\$\_]+\.[\w\d\$\_]+)$/g,
			rgx2 = /^(file\:)/g,
			successCallback = null,
			afterSuccessCallback = null,
			errorCallback = null;

		var retObject = {
			then     : function (callback) {
				if (tedApi.isFunction(callback)) {
					successCallback = callback;
				}
				return this;
			},
			complete : function (callback) {
				if (tedApi.isFunction(callback)) {
					afterSuccessCallback = callback;
				}
				return this;
			},
			error    : function (callback) {
				if (tedApi.isFunction(callback)) {
					errorCallback = callback;
				}
				return this;
			}
		};

		if (typeof name == typeof $u) return -1;

		name = name.trim();

		if (rgx.test(name)) state = 'global';
		else state = 'local';

		/**

         * file: => it tel to function that input lib is in local

         */

		if (state == 'local') {
			if (rgx2.test(name)) name = name.slice(5).trim();
			else {
				tedApi.error('Your Include File Name Is Wrong!');

				return 0;
			}

			url = name;
		}
		else url += name;

		if (typeof type === typeof undefined) type = 'js';

		if ([ 'js', 'json', 'html', 'xml' ].indexOf(type) == -1) return 0;

		if (included_libs.hasOwnProperty(name.trim())) return included_libs[name.trim()];

		try {
			xhttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
				try {
					xhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (e) {
					tedApi.error("Your Browser Doesn't Support Ajax!");

					return false;
				}
			}
		}

		name = name.trim();

		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				try {
					var SendObj = {},
						out = 1;

					iii = 0;

					if (type == 'js') {
						local_obj_name = [ 'ted', '__GLOBALS__' ];

						local_obj_value = [ ted, __GLOBAL_API_FUNCTIONS__ ];

						out = new Function(local_obj_name, xhttp.responseText + '; \n return this;');

						out = out.apply(SendObj, local_obj_value);
					}
					else if (type == 'json') {
						SendObj = tedApi.parseJSON(xhttp.responseText);
					}
					else if (type == 'html') {
						SendObj = tedApi.parseHTML(xhttp.responseText);
					}
					else if (type == 'xml') {
						SendObj = tedApi.parseXML(xhttp.responseText);
					}

					OutAns = typeof out === typeof $u ? 1 : SendObj;

					included_libs[name] = OutAns;

					if (tedApi.isFunction(successCallback)) {
						successCallback.call(xhttp, OutAns);
					}

					__NodeReady__(function () {
						if (tedApi.isFunction(afterSuccessCallback)) {
							afterSuccessCallback.call(xhttp, OutAns);
						}
					});
				} catch (er) {
					errorCallback = null;

					if (tedApi.isFunction(errorCallback)) {
						errorCallback.call(xhttp, "Loading The File '" + name + "' Failed! | Error:" + er);
					}
					else {
						tedApi.error("Loading The File '" + name + "' Failed! | Error:" + er);

						if (
							!tedApi.isUndefined(Ted_setting_In.libError) &&
							tedApi.isString(Ted_setting_In.libError) &&
							Ted_setting_In.libError != ''
						) {
							var ErrorText = Ted_setting_In.libError
								.replace(/\{\{\s*(error)\s*\}\}/g, er)
								.replace(/\{\{\s*(name)\s*\}\}/g, name);

							alert(ErrorText);
						}

						throw er;
					}
				}
			}
			else if (xhttp.readyState == 2 && xhttp.status == 404) {
				NotFound = 1;
			}
			else if (xhttp.readyState == 4 && xhttp.status == 404) {
				if (NotFound) {
					if (tedApi.isFunction(errorCallback)) {
						errorCallback.call(xhttp, "Loading The File '" + name + "' Failed! | Error:" + er);
					}
					else {
						tedApi.log("Loading The File '" + name + "' Failed!");

						if (
							!tedApi.isUndefined(Ted_setting_In.libError) &&
							tedApi.isString(Ted_setting_In.libError) &&
							Ted_setting_In.libError != ''
						) {
							var ErrorText = Ted_setting_In.libError
								.replace(/\{\{\s*(error)\s*\}\}/g, er)
								.replace(/\{\{\s*(name)\s*\}\}/g, name);

							alert(ErrorText);
						}
					}
				}
			}
		};

		xhttp.open('GET', url, true);

		xhttp.send();

		return retObject;
	};

	var alpha = function (n) {
		if (parseInt(n) > 51) return 'a';

		var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

		return a[n];
	};

	var num = function (n) {
		if (parseInt(n) > 9) return '0';

		var a = '0123456789'.split('');

		return a[n];
	};

	/*

     * Public Api For Users

     * every needed functions

     */

	tedApi = {
		// New
		callByParam     : function (fn, $this, params) {
			var startFuncRegexp = /^(function([\s\t\r\n\v]+[A-z\$\_0-9]+|[\s\t\r\n\v]*)){0,1}(\(([^\(\)\,]+(\,[^\(\)\,]+)*){0,1}\)|[A-z0-9\_\$]+)[\s\t\r\n\v]*(\=\>[\s\t\r\n\v]*){0,1}(\{){0,1}/,
				fnString = fn.toString().trim(),
				parameters = '',
				args = [],
				funcmaches = fnString.match(startFuncRegexp);

			if (funcmaches !== null) {
				if (typeof funcmaches[4] === typeof undefined) {
					parameters = funcmaches[3];
				}
				else {
					parameters = funcmaches[4].split(',');
				}

				for (var i = 0; i < parameters.length; i++) {
					args.push(params[parameters[i].trim()]);
				}

				return fn.apply($this, args);
			}
			return tedApi.ERROR;
		},
		// New
		scaleNumber     : function (from, to, x) {
			if (
				tedApi.isUndefined(from, to, x, from.min, from.max, to.min, to.max) ||
				!tedApi.isNumber(x, from.min, from.max, to.min, to.max)
			) {
				return x;
			}

			return (to.max - to.min) * (x - from.min) / (from.max - from.min) + to.min;
		},
		// New
		passwordCheck   : function (password) {
			var total = password.length,
				totalLetters = 0,
				totalNumbers = 0,
				totalSpecialChars = 0,
				tokens = password.split(''),
				len = tokens.length,
				i,
				calculate = function (total, letters, numbers, chars) {
					var level = 0,
						sum = 42 + 10 + 72,
						baseLength = 7,
						lt = 0,
						l = parseInt(letters, 10),
						n = parseInt(numbers, 10),
						c = parseInt(chars, 10),
						ll = baseLength / 1.3 * 42,
						nn = baseLength / 0.7 * 10,
						cc = baseLength / 8 * 72,
						avg = Math.abs(sum * (3 - 3 / (l + n + c)));

					if (l > 0) {
						level += l * (42 % avg);
					}

					if (n > 0) {
						level += n * (10 % avg);
					}

					if (c > 0) {
						level += c * (72 % avg);
					}

					level = tedApi.scaleNumber(
						{
							min : 0,
							max : ll + nn + cc
						},
						{
							min : 0,
							max : 10
						},
						level
					);

					return level > 10 ? 10 : Number.isNaN(level) ? 0 : level;
				};

			for (i = 0; i < len; ++i) {
				if (tedApi.isAlpha(tokens[i])) {
					totalLetters++;
				}
				else if (tedApi.isNumber(tokens[i])) {
					totalNumbers++;
				}
				else {
					totalSpecialChars++;
				}
			}

			return Math.ceil(calculate(total, totalLetters, totalNumbers, totalSpecialChars));
		},
		// New
		toUnicode       : function (str) {
			var uniString = '';
			if (tedApi.isString(str)) {
				str = str.split('');
				for (var i = 0; i < str.length; i++) {
					var char = str[i].charCodeAt(0).toString(16).toLowerCase();
					if (char.length > 2) {
						if (char.length === 3) {
							char = '0' + char;
						}
						uniString += '\\u' + char;
					}
					else {
						uniString += str[i];
					}
				}
			}
			return uniString;
		},
		// New
		toPersianNumber : function (str) {
			if (tedApi.isString(str)) {
				var persian = [ '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ];
				str = str.replace(/[0-9]/g, function (n) {
					return persian[n];
				});
			}
			return str;
		},
		// New
		isPersianAlpha  : function () {
			var alpha = /^[\u0600-\u06FF]+$/g;

			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				if (!tedApi.isString(arguments[i])) return false;

				if (arguments[i].trim() == '') return false;

				if (!alpha.test(arguments[i])) {
					return false;
				}
			}
			return true;
		},
		// New
		isPersianNumber : function () {
			var alpha = /^[\u06f0-\u06f9]+$/g;

			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				if (!tedApi.isString(arguments[i])) return false;

				if (arguments[i].trim() == '') return false;

				if (!alpha.test(arguments[i])) {
					return false;
				}
			}
			return true;
		},

		isAlpha         : function () {
			var alpha = /^[A-Za-z\$]+$/g;

			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				if (!tedApi.isString(arguments[i])) return false;

				if (arguments[i].trim() == '') return false;

				if (!alpha.test(arguments[i])) {
					return false;
				}
			}
			return true;
		},

		isArray         : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					Object.prototype.toString.call(arguments[i]) === '[object Array]'
						? true
						: tedApi.isNodeList(arguments[i]) ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isJustArray     : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = tedApi.isArray(arguments[i]) && !tedApi.isNodeList(arguments[i]) ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isNodeList      : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = arguments[i] instanceof NodeList ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isString        : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = typeof arguments[i] === typeof '' ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isObject        : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					typeof arguments[i] == 'object' && !tedApi.isArray(arguments[i]) && !tedApi.isNull(arguments[i])
						? true
						: false;

				if (!cond) return false;
			}

			return true;
		},

		isUndefined     : function () {
			for (var i = 0; i < arguments.length; i++) {
				var cond = typeof arguments[i] === typeof undefined ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isFunction      : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = typeof arguments[i] === typeof function () {} ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isNull          : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = arguments[i] === null ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isNode          : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					tedApi.isElement(arguments[i]) ||
					tedApi.isTextNode(arguments[i]) ||
					tedApi.isTag(arguments[i]) ||
					tedApi.isCommentNode(arguments[i])
						? true
						: false;

				if (!cond) return false;
			}

			return true;
		},

		isElement       : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					typeof HTMLElement === 'object'
						? arguments[i] instanceof HTMLElement
						: arguments[i] === document
							? document
							: arguments[i] &&
								typeof arguments[i] === 'object' &&
								arguments[i] !== null &&
								arguments[i].nodeType === 1 &&
								typeof arguments[i].nodeName === 'string';

				if (!cond) return false;
			}

			return true;
		},

		isTextNode      : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					typeof CharacterData === 'object'
						? arguments[i] instanceof CharacterData
						: arguments[i] &&
							typeof arguments[i] === 'object' &&
							arguments[i] !== null &&
							arguments[i].nodeType === 3 &&
							typeof arguments[i].nodeName === 'string' &&
							arguments[i].nodeName == '#text';

				if (!cond) return false;
			}

			return true;
		}, //or arg[0] or arg[1] .... or arg[n] must be tru else if return false

		isCommentNode   : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond =
					typeof CharacterData === 'object'
						? arguments[i] instanceof CharacterData
						: arguments[i] &&
							typeof arguments[i] === 'object' &&
							arguments[i] !== null &&
							arguments[i].nodeType === 8 &&
							typeof arguments[i].nodeName === 'string' &&
							arguments[i].nodeName == '#comment';

				if (!cond) return false;
			}

			return true;
		}, //or arg[0] or arg[1] .... or arg[n] must be tru else if return false

		isInt           : function () {
			// String Or Number will Accepted

			for (var i = 0; i < arguments.length; i++) {
				if (arguments.length == 0) return false;

				var cond =
					typeof arguments[i] === typeof ''
						? /^[-+]{0,1}?(\d+(e[-+]{0,1}\d+){0,1}|Infinity)$/.test(arguments[i])
						: Number.isInteger ? Number.isInteger(arguments[i]) : arguments[i] % 1 === 0;

				if (!cond) return false;
			}

			return true;
		},

		isFloat         : function () {
			if (arguments.length == 0) return false; // String Or Number will Accepted

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i] + '';

				var cond =
					typeof arg === typeof ''
						? /^[+-]{0,1}?(\d+\.\d+(e[-+]{0,1}\d+){0,1}|Infinity)$/.test(arg)
						: !tedApi.isInt(arguments[i]);

				if (!cond) return false;
			}

			return true;
		},

		isTag           : function () {
			if (arguments.length == 0) return false;

			var reg = /^\<[^\>]+\>$/;

			for (var i = 0; i < arguments.length; i++) {
				var cond = tedApi.isElement(arguments[i]) ? reg.test(arguments[i].outerHTML) : false;

				if (!cond) return false;
			}

			return true;
		},

		isNumber        : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = tedApi.isInt(arguments[i]) || tedApi.isFloat(arguments[i]) ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isBool          : function () {
			if (arguments.length == 0) return false;

			for (var i = 0; i < arguments.length; i++) {
				var cond = typeof arguments[i] === typeof true ? true : false;

				if (!cond) return false;
			}

			return true;
		},

		isUrl           : function () {
			if (arguments.length == 0) return false;

			var reg = /^((http|https|ftp)\:\/\/){0,1}(www.){0,1}((([^\/\\\,\;\'\"\)\(\=\+\*\&\^\%\#\!\~\|\]\[\}\{\@\.]+\.{0,1})+\.([^\/\\\,\;\'\"\)\(\=\+\*\&\^\%\#\!\~\|\]\[\}\{\@\_\-\.\:]+)|localhost)(\/[^\/]+)*)$/;

			for (var i = 0; i < arguments.length; i++) {
				var cond = tedApi.isString(arguments[i]) ? reg.test(arguments[i]) : false;

				if (!cond) return false;
			}

			return true;
		},

		isEmail         : function () {
			if (arguments.length == 0) return false;

			var reg = /^[^\/\\\,\;\'\"\)\(\=\*\&\^\#\!\~\|\]\[\}\{\@]+@[^\/\\\,\;\'\"\)\(\=\+\*\&\^\%\#\!\~\|\]\[\}\{\@\_]+\.[^\/\\\,\;\'\"\)\(\=\+\*\&\^\%\#\!\~\|\]\[\}\{\@\_\-\.\:]{2,}$/;

			for (var i = 0; i < arguments.length; i++) {
				var cond = tedApi.isString(arguments[i]) ? reg.test(arguments[i]) : false;

				if (!cond) return false;
			}

			return true;
		},

		html            : function (el, a) {
			el = tedApi.elm(el);

			return tedApi.isElement(el) && !tedApi.isTag(el)
				? tedApi.isUndefined(a) ? el.innerHTML : (el.innerHTML = a)
				: undefined;
		},

		text            : function (el, a) {
			el = tedApi.elm(el);

			return tedApi.isElement(el) || tedApi.isTextNode(el)
				? typeof a === typeof $u
					? tedApi.isTextNode(el) || tedApi.isCommentNode(el) ? el.nodeValue : el.textContent
					: tedApi.isTextNode(el) || tedApi.isCommentNode(el) ? (el.nodeValue = a) : (el.textContent = a)
				: undefined;
		},

		asHtml          : function (el, a) {
			el = tedApi.elm(el);

			return tedApi.isElement(el) ? (typeof a === typeof $u ? el.outerHTML : (el.outerHTML = a)) : undefined;
		},

		floatPoint      : function (num, fp) {
			//like toFixed but return number and doesn't round number

			if (fp == 0 || typeof fp === typeof undefined || typeof fp != 'number') fp = 1;

			if (typeof num != 'number') return NaN;

			if (tedApi.isInt(num)) return num;
			else if (tedApi.isFloat(num)) {
				var t = NumberToString(num).toString();

				var reg = new RegExp('[-+]{0,1}(\\d+\\.(\\d{0,' + fp + '})|Infinity)', 'g');

				var res = t.match(reg);

				if (res !== null) {
					if (res[0] == 'Infinity') return Infinity;

					if (tedApi.isInt(Math.round(parseFloat(res[0]) * Math.pow(10, fp - 1)) / Math.pow(10, fp - 1))) {
						return Math.round(parseFloat(res[0]) * Math.pow(10, fp - 1)) / Math.pow(10, fp - 1);
					}

					return parseFloat(res[0]);
				}

				return NaN;
			}

			return NaN;
		},

		onFrame         : function (callback) {
			var $_callback =
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};

			$_callback(callback);
		},
		// New
		onFrameInterval : function (callback) {
			var $_callback =
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						window.setTimeout(callback, 1000 / 60);
					},
				$cb = function () {
					callback();
					$_callback($cb);
				};

			$_callback($cb);
		},

		equation        : function (x1, x2, x3) {
			//create equatin of 3 point in graph that start from [0,0]

			var a,
				b,
				c,
				dif = 0,
				n,
				m,
				THAT = this,
				g;

			var x22 = [].concat(x2),
				x32 = [].concat(x3),
				x12 = [].concat(x1);

			if (x1[0] != 0) {
				dif = x1[0];

				x22[0] -= dif;

				x32[0] -= dif;

				x12[0] -= dif;
			}

			c = x12[1];

			if (x32[0] > x22[0]) {
				a = tedApi.floatPoint(
					(x32[1] -
						x12[1] +
						tedApi.floatPoint(tedApi.floatPoint(x32[0] * (x12[1] - x22[1]), 7) / x22[0], 7)) /
						tedApi.floatPoint(x32[0] * (x32[0] - x22[0]), 7),
					7
				);
			}
			else {
				a = tedApi.floatPoint(
					(x22[1] -
						x12[1] +
						tedApi.floatPoint(tedApi.floatPoint(x22[0] * (x12[1] - x32[1]), 7) / x32[0], 7)) /
						tedApi.floatPoint(x22[0] * (x22[0] - x32[0]), 7),
					7
				);
			}

			b = tedApi.floatPoint(
				tedApi.floatPoint(x22[1] - x12[1] - tedApi.floatPoint(a * Math.pow(x22[0], 2), 7), 7) /
					tedApi.floatPoint(x22[0], 7),
				7
			);

			this.a = a;

			this.b = tedApi.floatPoint(2 * a * -1 * dif + b, 7);

			this.c = tedApi.floatPoint(a * Math.pow(-1 * dif, 2) + b * -1 * dif + c, 7);

			this.points = {
				p1 : x1,

				p2 : x2,

				p3 : x3
			};

			this.answer = function (x) {
				if (typeof x != 'number') return undefined;

				return tedApi.floatPoint(THAT.a * Math.pow(x, 2) + THAT.b * x + THAT.c, 6);
			};

			this.inverse = function (x) {
				//return answer of invers of function

				if (typeof x != 'number') return undefined;

				var qq = tedApi.floatPoint(
					Math.sqrt(
						Math.abs(
							tedApi.floatPoint(Math.pow(THAT.b, 2), 7) - tedApi.floatPoint(4 * THAT.a * (THAT.c - x), 7)
						)
					),
					7
				);

				var qe = tedApi.floatPoint(-1 * THAT.b + qq, 7),
					qr = tedApi.floatPoint(-1 * THAT.b - qq, 7);

				var answers = {
					x1 : tedApi.floatPoint(qe / (2 * THAT.a), 7),

					x2 : tedApi.floatPoint(qr / (2 * THAT.a), 7)
				};

				return tedApi.constObj(answers, 'Points');
			};

			this.SEquat = function () {
				//return String of equation

				return (
					'y = ' +
					(THAT.a != 0 ? THAT.a + 'x^2 ' : '') +
					(THAT.b != 0 ? (THAT.b >= 0 ? '+ ' + THAT.b : '- ' + Math.abs(THAT.b)) + 'x ' : '') +
					(THAT.c != 0 ? (THAT.c >= 0 ? '+ ' + THAT.c : '- ' + Math.abs(THAT.c)) : '')
				);
			};

			this.time = function (x, v) {
				//return time of each point

				var PoiNt = Math.min(THAT.inverse(0).x1, THAT.inverse(0).x2);

				var g = 9.8,
					v_zero = tedApi.isNumber(v) ? v : 20,
					teta_0 = tedApi.findAngel(
						{
							x : PoiNt + 0.1,

							y : THAT.answer(PoiNt + 0.1)
						},
						{
							x : 0,

							y : 0
						},
						{
							x : 1,

							y : 0
						}
					);

				var First = tedApi.floatPoint(
					Math.sqrt(tedApi.floatPoint(2 * g * (x - PoiNt) + tedApi.floatPoint(Math.pow(v_zero, 2), 7), 7)),
					7
				);
				var Second = tedApi.floatPoint(v_zero * Math.sin(teta_0));
				var t = tedApi.floatPoint((First - Second) / (-1 * g), 7);
				return !t ? 0 : Math.abs(t);
			};
		},

		// NEW
		closeNumber     : function (array, num) {
			var i = 0;
			var minDiff = 1000;
			var ans;
			for (i in array) {
				if (tedApi.isNumber(array[i])) {
					var m = Math.abs(num - array[i]);
					if (m < minDiff) {
						minDiff = m;
						ans = array[i];
					}
				}
			}
			return ans;
		},

		animGraph       : function (points, fn, done) {
			//[ [length,top point] ...] , function , function

			var Start,
				End,
				equ,
				t,
				len,
				count,
				i,
				xlen,
				loop = false,
				stop = false,
				$Gravity = false,
				endPoint = 0,
				finished = false,
				onPrecentCall = { data: {}, list: [] },
				onEquationStep = {};

			if (!tedApi.isArray(points) || !tedApi.isFunction(fn)) return 0;

			if (points.length == 0) return -1;

			if (!tedApi.isArray(points[0])) return -2;

			if(!tedApi.isFunction(done)){
				done = function(){};
			}

			function isPoint (a) {
				if (!tedApi.isArray(a)) return false;

				if (a.length != 2) return false;

				if (!tedApi.isNumber(a[0]) || !tedApi.isNumber(a[1])) return false;

				return true;
			}

			if (!isPoint(points[0])) return -3;

			for (var ii = 0; ii < points.length; ii++) {
				endPoint += points[ii][0];
			}

			function startNew () {
				(Start = [ 0, 0 ]), (End = [ points[0][0], 0 ]);

				equ = new tedApi.equation(Start, [ points[0][0] / 2, points[0][1] ], End);

				t = End[0];

				len = points.length;

				count = 0;

				i = 0;

				xlen = points[0][0];

				finished = false;
			}

			startNew();

			function seT () {
				var $_AnimFunction = function () {
					if (stop) return 1;

					if (i - 1 == t) {
						if (count >= len - 1) {
							if (tedApi.isFunction(done) && !finished) {
								done.call(equ, i, equ.answer(i));

								finished = true;
							}

							if (loop && !stop) {
								startNew();

								if ($Gravity) {
									window.setTimeout($_AnimFunction, Math.abs(equ.time(i) - equ.time(i - 1)));
								}
								else {
									tedApi.onFrame($_AnimFunction);
								}
							}
							return 1;
						}

						count++;

						Start = [ xlen, 0 ];

						if (!isPoint(points[count])) return -3;

						End = [ xlen + points[count][0], 0 ];

						equ = new tedApi.equation(Start, [ xlen + points[count][0] / 2, points[count][1] ], End);

						xlen += points[count][0];

						t = End[0];

						if ($Gravity) {
							window.setTimeout($_AnimFunction, Math.abs(equ.time(i) - equ.time(i - 1)));
						}
						else {
							tedApi.onFrame($_AnimFunction);
						}

						return 1;
					}

					var XANS = equ.answer(i),
						PERC = tedApi.floatPoint(i * 100 / endPoint, 3),
						perCall = tedApi.closeNumber(onPrecentCall.list, PERC);

					fn.call(equ, i, XANS, PERC);

					if( tedApi.isFunction( onEquationStep[count] )){
						onEquationStep[count].call(equ, i, XANS, PERC,count);
					}

					if(PERC < perCall){
						var index = onPrecentCall.list.indexOf(perCall);
						if(index > 0){
							perCall = onPrecentCall.list[index-1];
						}
					}

					if (tedApi.isFunction(onPrecentCall.data[perCall])) {
						onPrecentCall.data[perCall].call(equ, i, XANS, PERC,perCall);
					}

					if (stop) return 1;

					++i;

					if ($Gravity) {
						window.setTimeout($_AnimFunction, Math.abs(equ.time(i) - equ.time(i - 1)));
					}
					else {
						tedApi.onFrame($_AnimFunction);
					}
				};

				if ($Gravity) {
					window.setTimeout($_AnimFunction, Math.abs(equ.time(i) - equ.time(i - 1)));
				}
				else {
					tedApi.onFrame($_AnimFunction);
				}
			}

			// NEW
			this.precent = function (num, callback) {
				if (tedApi.isNumber(num)) {
					if(typeof onPrecentCall.data[num] === typeof undefined){
						onPrecentCall.list.push(num);
						onPrecentCall.list.sort(function(a, b){return a - b});
					}
					onPrecentCall.data[num] = callback;
				}
				else if(tedApi.isJustArray(num)){
					for(var i in num){
						if (tedApi.isNumber(num[i])) {
							if(typeof onPrecentCall.data[num[i]] === typeof undefined){
								onPrecentCall.list.push(num[i]);
							}
							onPrecentCall.data[num[i]] = callback;
						}
					}
					onPrecentCall.list.sort(function(a, b){return a - b});
				}
				return this;
			};

			this.point = function (num,callback){
				if (tedApi.isNumber(num)) {
					onEquationStep[num] = callback;
				}
				else if(tedApi.isJustArray(num)){
					for(var i in num){
						if (tedApi.isNumber(num[i])) {
							onEquationStep[num[i]] = callback;
						}
					}
				}
				return this;
			}

			this.start = function (lo) {
				if (tedApi.isBool(lo)) loop = lo;

				stop = false;

				startNew();

				seT(i);

				return this;
			};

			this.gravity = function (state) {
				$Gravity = !state ? false : true;
				return this;
			};

			this.end = function () {
				done.call(equ, i, equ.answer(i));

				stop = true;

				startNew();

				return this;
			};

			this.stop = function () {
				stop = true;

				startNew();

				fn.call(equ, i, equ.answer(i));

				return this;
			};

			this.pause = function () {
				stop = true;

				return this;
			};

			this.continue = function () {
				stop = false;

				seT(i);

				return this;
			};

			return this;
		},

		findAngel       : function (A, B, C) {
			//find angel betwein 3 point : A={x,y}

			var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));

			var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));

			var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

			return !(2 * BC * AB) ? undefined : Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
		},

		ready           : function (n, f) {
			//ready of compile

			if (!tedApi.isFunction(f) || (!tedApi.isString(n) && !tedApi.isElement(n))) return 0;

			var elm = tedApi.elm(n);

			onCompile_Ready.push({
				fn : f,

				el : tedApi.isArray(elm) ? elm[0] : elm
			});

			return 1;
		},

		docReady        : function (fn) {
			//ready of document

			ted.docReady(function () {
				if (tedApi.isFunction(fn)) {
					fn.call(document);
				}
			});
		},
		// New
		offset          : function (el) {
			el = tedApi.elm(el);

			if (el === null) {
				return null;
			}

			var rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return {
				top  : rect.top + scrollTop,
				left : rect.left + scrollLeft
			};
		},
		// New
		cursor          : function () {
			var pointed = document.elementFromPoint(CURSOR_POSIRION.client.left, CURSOR_POSIRION.client.top),
				body = document.body,
				html = document.documentElement,
				height = Math.max(
					body.scrollHeight,
					body.offsetHeight,
					html.clientHeight,
					html.scrollHeight,
					html.offsetHeight
				),
				width = Math.max(
					body.scrollWidth,
					body.offsetWidth,
					html.clientWidth,
					html.scrollWidth,
					html.offsetWidth
				),
				offset = tedApi.offset(pointed),
				positionInDocument = CURSOR_POSIRION,
				positionInPointedDom = {
					top  :
						CURSOR_POSIRION.document.top - offset.top <= 0 ? 0 : CURSOR_POSIRION.document.top - offset.top,
					left :
						CURSOR_POSIRION.document.left - offset.left <= 0
							? 0
							: CURSOR_POSIRION.document.left - offset.left
				};

			return {
				target  : pointed,
				client  : positionInDocument,
				pointed : positionInPointedDom
			};
		},
		// New
		splitTextNode   : function (textNode, split) {
			var nodeVal = textNode.nodeValue,
				leftPos = nodeVal.indexOf(split.toString()),
				rightPos = leftPos + split.toString().length,
				leftVal = '',
				rightVal = '';

			if (leftPos >= 0) {
				leftVal = nodeVal.slice(0, leftPos);
				rightVal = nodeVal.slice(rightPos, nodeVal.length);
				textNode.nodeValue = split;
				tedApi.insert(document.createTextNode(leftVal)).before(textNode);
				tedApi.insert(document.createTextNode(rightVal)).after(textNode);
				return true;
			}
			return false;
		},

		insert          : function (n) {
			n = tedApi.elm(n);

			var $Insert = function (n) {
				var sp = n;

				this.before = function (e) {
					e = tedApi.elm(e);

					try {
						var parentDiv = e.parentNode;

						parentDiv.insertBefore(sp, e);

						return true;
					} catch (el) {
						return false;
					}
				};

				this.after = function (e) {
					e = tedApi.elm(e);

					try {
						var parentDiv = e.parentNode;

						parentDiv.insertBefore(sp, e.nextSibling);

						return true;
					} catch (el) {
						return false;
					}
				};

				this.end = function (e) {
					e = tedApi.elm(e);

					try {
						e.insertBefore(sp, null);
						return true;
					} catch (el) {
						return false;
					}
				};
				// New
				this.first = function (e) {
					e = tedApi.elm(e);

					try {
						e.insertBefore(sp, e.firstChild);
						return true;
					} catch (el) {
						return false;
					}
				};
			};

			return new $Insert(n);
		},

		constObj        : function (b, n) {
			if (!tedApi.isObject(b)) return 0;

			var r = [];

			for (var i in b) {
				if (b.hasOwnProperty(i)) {
					r.push({
						name    : i,

						content : b[i]
					});
				}
			}

			return ___$ConstArrayObject(r, n);
		},

		append          : function (a, b) {
			//a.append:b

			if (!tedApi.isElement(a) && !tedApi.isString(a)) return 0;

			if (!tedApi.isElement(b) && !tedApi.isString(b) && !tedApi.isTextNode(b)) return 0;

			a = tedApi.elm(a);

			b = tedApi.elm(b);

			if (tedApi.isNull(a, b)) return 0;

			a.appendChild(b);

			return 1;
		},

		ElementStyle    : function (b) {
			n = '';

			if (tedApi.isObject(b)) {
				for (var i in b) {
					if (b.hasOwnProperty(i)) {
						if (tedApi.isObject(b[i])) {
							if (ElementStyleSets.hasOwnProperty(i)) {
								if (ElementStyleSets[i].equal(b[i]))
									for (var item in b[i]) {
										ElementStyleSets[i][item] = b[i][item];
									}
							}
							else {
								ElementStyleSets[i] = b[i];
							}
						}
						else {
							continue;
						}
					}
				}
			}
			else {
				return 0;
			}

			for (var selector in ElementStyleSets) {
				n = selector + '{';
				for (var attr in ElementStyleSets[selector]) {
					if (ElementStyleSets[selector].hasOwnProperty(attr)) {
						n += attr + ':' + ElementStyleSets[selector][attr] + ';';
					}
				}
				n += '}';
			}

			_style.innerHTML = n;

			return 1;
		},

		elm             : function () {
			var m = /(\<(\w+)(?:(?:\s+\w+(?:\s*=\s*(?:\".*?\"|\'.*?\'|[^\'\"\>\s]+))?)+\s*|\s*)\>[^]*\<\/\2+\s*\>\s*[,]{0,1}|\<\w+(?:(?:\s+\w+(?:\s*=\s*(?:\".*?\"|\'.*?\'|[^\'\"\>\s]+))?)+\s*|\s*)\/\>\s*[,]{0,1}|\<\!\-\-(.*?)\-\-\>[,]{0,1})/gm,
				g = /[\w\d\$\[\]\=\'\"\_\+\*\-\!\@\#\%\^\&\(\)\`\~\/\.\{\}\:]+\s*[^,]*/gm,
				id = /^\#[A-Za-z0-9\_\-\$]+$/g,
				w = [];

			for (var j = 0; j < arguments.length; j++) {
				var e = [],
					b = [],
					l = [],
					y = [],
					t = [],
					n = arguments[j];

				if (n === document) return document;

				if (n === window) return window;

				if (tedApi.isElement(n)) return n;

				if (tedApi.isTextNode(n)) return n;

				if (!tedApi.isString(n)) return null;

				n += ',';

				l = n.match(m);

				l = l === null ? [] : l;

				n = n.replace(l, '');

				b = n.match(g);

				b = b === null ? [] : b;

				e = l.concat(b);

				for (var i = 0; i < e.length; i++) {
					if (e[i][e[i].length - 1] == ',') {
						y = e[i].slice(0, e[i].length - 1);

						t.push(tedApi.parseHTML('<body>' + y + '</body>').body.childNodes[0]);
					}
					else {
						try {
							if (id.test(e[i])) {
								y = document.getElementById(e[i].slice(1));
							}
							else {
								y = document.querySelectorAll(e[i]);
							}
						} catch (e) {
							y = [];
						}
						t.push(
							tedApi.isNode(y)
								? y
								: tedApi.isArray(y) && y.length == 1
									? y[0]
									: !tedApi.isArray(y) || y.length == 0 ? null : y
						);
					}
				}

				w = w.concat(t);
			}

			return tedApi.isArray(w) ? w.length == 1 ? w[0] : w.length == 0 ? null : w : null;
		}, //creat and get element

		replaceElement  : function (u, t) {
			if (!tedApi.isElement(u, t) && !tedApi.isTextNode(u, t) && !tedApi.isCommentNode(u, t)) return 0;

			return t.parentNode.replaceChild(u, t);
		}, //replace u on t

		removeText      : function (e) {
			e = tedApi.elm(e);

			if (!tedApi.isElement(e)) return 0;

			var CNodes = e.childNodes;

			for (var i = 0; i < CNodes.length; i++) {
				if (CNodes[i].nodeName == '#text') {
					e.removeChild(CNodes[i]);

					//CNodes[i].textContent = "";
				}
			}

			return 1;
		},

		find            : function (g, j) {
			g = tedApi.elm(g);

			if (!tedApi.isString(j) || !tedApi.isElement(g)) return -1;

			var u = /[\w\d\$\[\]\=\'\"\_\+\*\-\!\@\#\%\^\&\(\)\`\~\/\.\{\}\:]+\s*[^,]*/gm;

			if (u.test(j)) return g.querySelectorAll(j);
		},

		each            : function (r, q) {
			if (typeof r === typeof $u || (typeof r != 'object' && typeof r != 'string') || typeof q != 'function')
				return $u;

			if (tedApi.isArray(r) || Object.prototype.toString.call(r) === '[object HTMLCollection]') {
				try {
					for (var o = 0; o < r.length; o++) {
						q.call(r[o], o); //send Object Value As {this} And Loop Value As Secondary val In Func Arguments
					}

					return 1;
				} catch (e) {
					return 0;
				}
			}
			else {
				try {
					for (var o in r) {
						if (r.hasOwnProperty(o)) {
							q.call(r[o], o); //send Object Value As {this} And Loop Value As Secondary val In Func Arguments
						}
					}

					return 1;
				} catch (e) {
					return 0;
				}
			}
		},
		// New
		hasAttr         : function (el, r) {
			var el = tedApi.elm(el);

			return typeof el !== typeof $u
				? tedApi.isElement(el)
					? typeof r !== typeof $u ? (typeof r == 'string' ? el.hasAttribute(r) : -1) : -2
					: -3
				: -4;
		},
		// New
		between         : function (start, end) {
			start = tedApi.elm(start);
			end = tedApi.elm(end);
			if (tedApi.isNode(start, end) && tedApi.parent(start).isEqualNode(tedApi.parent(end))) {
				var nodes = Array.prototype.slice.call(tedApi.parent(start).childNodes),
					startPos = nodes.indexOf(start),
					endPos = nodes.indexOf(end),
					$bw = nodes.slice(startPos + 1, endPos);

				return $bw;
			}
			return null;
		},

		children        : function (n, u) {
			if (typeof n == 'string') {
				if (!(document.querySelector(n) instanceof HTMLElement)) return -1;

				n = document.querySelectorAll(n)[0];
			}
			else if (typeof n == 'object') {
				if (!tedApi.isElement(n) && !tedApi.isTextNode(n) && !tedApi.isCommentNode(n)) return -1;
			}
			else {
				return null;
			}

			var h = documentNodes(n, false);

			if (typeof u !== typeof $u && typeof u == 'string') {
				var m = h;

				h = [];

				for (var j = 0; j < m.length; j++) {
					if (tedApi.isElement(m[j]) && m[j].tagName.toLowerCase() == u.toLowerCase()) {
						h.push(m[j]);
					}
				}
			}

			return h;
		}, //returns All Sub Childrens

		sons            : function (j, k) {
			var RetArray = [];

			if (typeof j == 'string') {
				if (!(document.querySelector(j) instanceof HTMLElement)) return -1;

				j = document.querySelector(j);
			}
			else if (typeof j == 'object') {
				if (!(j instanceof HTMLElement)) return -1;
			}
			else {
				return null;
			}

			if (typeof k !== typeof $u && typeof k == 'string') {
				for (var i = 0; i < j.children.length; i++) {
					if (j.children[i].tagName.toLowerCase() == k.toLowerCase()) {
						RetArray.push(j.children[i]);
					}
				}
			}
			else {
				RetArray = j.children;
			}

			return RetArray;
		}, //return [] of Html Elements Of Children || return [] Of Selected HTMLs With Tag Name

		parent          : function (el, level) {
			if (!tedApi.isNumber(level) || level < 1) level = 1;

			var elm = tedApi.elm(el);

			if (!tedApi.isNode(elm)) return null;

			for (var i = 0; i < level; i++) {
				try {
					elm = elm.parentNode;
				} catch (e) {
					break;
				}
			}

			return elm;
		},

		delete          : function (a) {
			if (tedApi.isString(a) || tedApi.isNode(a)) {
				a = tedApi.elm(a);

				if (!tedApi.isElement(a) && !tedApi.isArray(a)) {
					return 0;
				}

				if (tedApi.isElement(a)) {
					a = [ a ];
				}

				for (var b = a.length - 1; 0 <= b; b--) {
					a[b] && a[b].parentNode && a[b].parentNode.removeChild(a[b]);
				}

				return 1;
			}
			else if (tedApi.isArray(a) || Object.prototype.toString.call(a) === '[object HTMLCollection]') {
				for (var b = a.length - 1; 0 <= b; b--) {
					var a2 = tedApi.elm(a[b]);

					if (tedApi.isNull(a2)) return 0;

					a2 && a2.parentNode && a2.parentNode.removeChild(a2);
				}

				return 1;
			}

			return 0;
		},

		remove          : function (elm) {
			elm = tedApi.elm(elm);

			if (tedApi.isElement(elm)) {
				for (var i = 0; i < document.all.length; i++) {
					if (document.all[i] == elm) {
						var RandElm = 'Removed-Elm_' + tedApi.random(20, 'number');

						var sp1 = document.createElement(RandElm);

						var Parn = document.all[i].parentNode;

						Parn.replaceChild(sp1, document.all[i]);

						return RandElm;
					}
				}
			}

			return 0;
		},

		show            : function (a, b) {
			//0 to 1 || 'hide' ||  [empty] === "show"

			typeof b === typeof $u && (b = 'block');

			'string' == typeof a && (a = tedApi.elm(a));

			if (!tedApi.isElement(a)) {
				return 0;
			}

			'show' == b
				? (a.style.display = 'block')
				: 'hide' == b
					? (a.style.display = 'none')
					: 'number' == typeof b
						? ((a.style.opacity = b), (a.style.display = 0 == a.style.opacity ? 'none' : 'block'))
						: (a.style.display = b);

			return 1;
		},

		hide            : function (a, b) {
			typeof b === typeof $u && (b = 'hide');

			'string' == typeof a && (a = tedApi.elm(a));

			if (!tedApi.isElement(a)) {
				return 0;
			}

			'show' == b
				? (a.style.display = 'block')
				: 'hide' == b
					? (a.style.display = 'none')
					: 'number' == typeof b
						? ((a.style.opacity = 1 - b), (a.style.display = 0 == a.style.opacity ? 'none' : 'block'))
						: (a.style.display = b);

			return 1;
		},

		run             : function (a) {
			return new Function(a).call(this === tedApi ? window : this);
		},

		random          : function (c, e) {
			if ('hash' == e && tedApi.isNumber(c)) {
				for (var a = '', g = [ alpha, num ], b = 0; b < c; b++) {
					var f = Math.floor(2 * Math.random()),
						d = 0 == f ? Math.floor(52 * Math.random()) : Math.floor(10 * Math.random()),
						a = a + g[f](d);
				}

				return a;
			}

			if ('number' == e && tedApi.isNumber(c)) {
				a = '';

				for (b = 0; b < c; b++) {
					(d = Math.floor(10 * Math.random())), (a += num(d));
				}

				return parseInt(a);
			}

			if ('alpha' == e && tedApi.isNumber(c)) {
				a = '';

				for (b = 0; b < c; b++) {
					(d = Math.floor(52 * Math.random())), (a += alpha(d));
				}

				return a;
			}
			else {
				a = '';

				if (!tedApi.isNumber(c)) c = tedApi.random(1);

				c == 0 ? (c = 1) : (c = c);

				for (b = 0; b < c; b++) {
					(d = Math.floor(10 * Math.random())), (a += num(d));
				}

				return parseInt(a);
			}
		},

		attr            : function (a, b, c) {
			a = tedApi.elm(a);

			if ('undefined' === typeof a || !tedApi.isElement(a)) {
				return -1;
			}

			if ('undefined' === typeof c && 'undefined' === typeof b) {
				a = a.attributes;

				b = {};

				for (c = 0; c < a.length; c++) {
					b[a[c].nodeName] = a[c].nodeValue;
				}

				return b;
			}

			return '' == b.trim()
				? -1
				: 'undefined' === typeof c
					? tedApi.hasAttr(a, b) ? a.getAttribute(b) : -1
					: (a.setAttribute(b, c), 1);
		},

		copyAttr        : function (a, b) {
			//a:from  b:to

			a = tedApi.elm(a);

			b = tedApi.elm(b);

			if (!tedApi.isElement(a)) {
				return 0;
			}

			if (!tedApi.isElement(b)) {
				return 0;
			}

			a = a.attributes;

			for (var c = 0; c < a.length; c++) {
				tedApi.attr(b, a[c].nodeName, a[c].nodeValue);
			}

			return 1;
		},

		removeAttr      : function (elm, attr) {
			if (tedApi.isString(elm)) {
				elm = tedApi.elm(elm);
			}

			if (tedApi.isUndefined(elm) || (!tedApi.isElement(elm) && !tedApi.isArray(elm))) {
				return 0;
			}

			if (!tedApi.isString(attr)) {
				return 0;
			}

			if (tedApi.isArray(elm)) {
				for (var i = 0; i < elm.length; i++) {
					elm[i].removeAttribute(attr);
				}
			}
			else {
				elm.removeAttribute(attr);
			}

			return 1;
		},

		sleep           : function (milliseconds) {
			if (!tedApi.isNumber(milliseconds)) return false;

			var start = new Date().getTime();

			for (var i = 0; i < 1e7; i++) {
				if (new Date().getTime() - start > milliseconds + 1000) {
					break;
				}
			}

			return true;
		},
		// New
		secToTime       : function (a) {
			if (!tedApi.isNumber(a)) {
				return -1;
			}

			a = parseInt(a);

			var b = 0,
				c = 0,
				d = 0,
				e = 0,
				f = 0;

			for (c = 0, b = 0, d = 0; 60 <= a; ) {
				c++, 60 == c && (b++, (c = 0)), (a -= 60);
			}

			for (; 24 <= b; ) {
				(b -= 24), d++;
			}

			for (; 365 <= d; ) {
				(d -= 365), e++;
			}

			var month = [ 365, 334, 304, 273, 243, 212, 181, 150, 120, 90, 59, 31 ];

			for (var i = 0; i < 12; i++) {
				if (d >= month[i]) {
					d -= month[i];

					f += 12 - i;

					break;
				}
			}

			return tedApi.constObj(
				{
					string : b + ':' + c + ':' + a,

					year   : e,

					month  : f,

					day    : d,

					hour   : b,

					minute : c,

					second : a
				},
				'tedDate'
			);
		},

		toMiliSecond    : function (a) {
			if (tedApi.isString(a)) {
				var b = 0;

				return /^\d+(s|ms|m|h|)$/.test(a)
					? (/\d+s/.test(a)
							? (b = 1e3 * Number(a.replace('s', '')))
							: /\d+ms/.test(a)
								? (b = Number(a.replace('ms', '')))
								: /\d+m/.test(a)
									? (b = 6e4 * Number(a.replace('m', '')))
									: /\d+h/.test(a) && (b = 36e5 * Number(a.replace('h', ''))),
						0 > b ? 0 : b)
					: null;
			}

			return a;
		},

		trim            : function (a) {
			return null == a ? '' : (a + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		},

		warn            : function (a) {
			return typeof $u === typeof a ? $u : $.console.error(a);
		},

		log             : function (a) {
			return typeof $u === typeof a ? $u : $.console.log(a);
		},

		debug           : function (a) {
			return typeof $u === typeof a ? $u : $.console.debug(a);
		},

		info            : function (a) {
			return typeof $u === typeof a ? $u : $.console.info(a);
		},

		dir             : function (a) {
			return typeof $u === typeof a ? $u : $.console.dir(a);
		},

		error           : function (a) {
			return typeof $u === typeof a ? $u : $.console.error(a);
		},

		browser         : function () {
			var br = [ 'opera', 'firefox', 'safari', 'ie', 'edge', 'chrome' ];

			var Browser =
				(!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
					? 0
					: typeof InstallTrigger !== 'undefined'
						? 1
						: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
							? 2
							: false || !!document.documentMode
								? 3
								: !(false || !!document.documentMode) && !!window.StyleMedia
									? 4
									: !!window.chrome && !!window.chrome.webstore ? 5 : -1;

			return Browser != -1 ? br[Browser] : -1;
		},

		parseJSON       : function (b) {
			try {
				if ($.JSON && $.JSON.parse) return $.JSON.parse(b + '');
			} catch (eee) {
				try {
					var c,
						d = null,
						FRG = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
						e = tedApi.trim(b + '');

					return e &&
					!tedApi.trim(
						e.replace(FRG, function (a, b, e, f) {
							return c && b && (d = 0), 0 === d ? a : ((c = e || b), (d += !f - !e), '');
						})
					)
						? e
						: tedApi.warn('Invalid JSON: ' + b);
				} catch (ee) {
					return $u;
				}
			}
		},

		parseXML        : function (b) {
			var c, d;

			if (!b || 'string' != typeof b) return null;

			try {
				$.DOMParser
					? ((d = new $.DOMParser()), (c = d.parseFromString(b, 'application/xml')))
					: ((c = new $.ActiveXObject('Microsoft.XMLDOM')), (c.async = 'false'), c.loadXML(b));
			} catch (e) {
				c = void 0;
			}

			return (
				(c && c.documentElement && !c.getElementsByTagName('parsererror').length) ||
					tedApi.warn('Invalid XML: ' + b),
				c
			);
		},

		parseHTML       : function (b) {
			var c, d;

			if (!b || 'string' != typeof b) return null;

			try {
				$.DOMParser
					? ((d = new $.DOMParser()), (c = d.parseFromString(b, 'text/html')))
					: ((c = new $.ActiveXObject('Microsoft.XMLDOM')), (c.async = 'false'), c.loadXML(b));
			} catch (e) {
				c = void 0;
			}

			return (
				(c && c.documentElement && !c.getElementsByTagName('parsererror').length) ||
					tedApi.warn('Invalid HTML: ' + b),
				c
			);
		},

		serialize       : function (obj, prefix) {
			var str = [];

			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					var k = prefix ? prefix + '[' + p + ']' : p,
						v = obj[p];

					str.push(
						tedApi.isArray(v) || tedApi.isObject(v)
							? tedApi.serialize(v, k)
							: k + '=' + encodeURIComponent(v)
					);
				}
			}

			return str.join('&');
		},

		objectToString  : function (a) {
			var i = 0,
				o = '';

			if (tedApi.isArray(a)) {
				o += '[';

				for (i; i < a.length; i++) {
					o += tedApi.isString(a[i]) ? '"' + a[i].escape() + '"' : tedApi.objectToString(a[i]);

					if (i < a.length - 1) o += ',';
				}

				o += ']';
			}
			else if (tedApi.isObject(a)) {
				o += '{';

				for (i in a) {
					if (a.hasOwnProperty(i)) {
						o +=
							(tedApi.isString(i) ? '"' + i.escape() + '"' : i) +
							':' +
							(tedApi.isString(a[i]) ? '"' + a[i].escape() + '"' : tedApi.objectToString(a[i]));

						o += ',';
					}
				}

				if (o.length > 2) {
					o = o.slice(0, o.length - 1);
				}

				o += '}';
			}
			else {
				o = a;
			}

			return o;
		},

		httpSetting     : function (a) {
			'object' != typeof a && (a = {});

			var b = {};

			b.async = 'boolean' == typeof a.async ? (a.async ? !0 : !1) : !0;

			b.url = 'string' == typeof a.url ? a.url : window.location.href;

			b.data = 'object' == typeof a.data ? ({}.constructor === a.data.constructor ? a.data : {}) : {};

			b.method =
				'string' == typeof a.method
					? a.method.toUpperCase() == 'POST'
						? 'POST'
						: a.method.toUpperCase() == 'GET' ? 'GET' : a.method.toUpperCase() == 'JSONP' ? 'JSONP' : 'GET'
					: 'GET';

			b.type =
				'string' == typeof a.type
					? [ 'html', 'json', 'xml', 'text' ].indexOf(a.type.toLowerCase()) != -1
						? a.type.toLowerCase()
						: 'text'
					: 'text';

			b.success = 'function' == typeof a.success ? a.success : new Function();

			b.error = 'function' == typeof a.error ? a.error : new Function();

			b.repeat = 'number' == typeof a.repeat ? (a.repeat > 1 ? a.repeat : 1) : 1;

			b.repeatToDone =
				!1 === b.async && 0 == b.repeat && 'boolean' == typeof b.repeatToDone ? b.repeatToDone : !1;

			b.header = 'object' == typeof a.header ? ({}.constructor === a.header.constructor ? a.header : {}) : {};

			b.callback = 'function' == typeof a.callback ? a.callback : new Function('return 0;');

			b.condition = 'function' == typeof a.condition ? a.condition : new Function('return 0;');

			return b;
		},

		http            : function (r) {
			if (typeof r === typeof $u || (typeof r != 'string' && typeof r != 'object')) {
				return -1;
			}

			var jsp,
				i = 0,
				SettingHttp = tedApi.httpSetting(
					typeof r == 'string'
						? {
								url : r
							}
						: r
				);

			if (tedApi.trim(SettingHttp.url) == '') return -1;

			if (SettingHttp.method.toUpperCase() == 'JSONP') {
				//url, type , callback , repeat

				function JSONPFUNC () {
					var SONPVAR = 'JSONP' + tedApi.random(30, 'hash') + '_' + tedApi.random(5, 'number'),
						script = document.createElement('script');

					function RetFunction (r) {
						return function (data) {
							var validJSON = false;

							if (typeof data == 'string') {
								try {
									validJSON = JSON.parse(data);
								} catch (e) {
									tedApi.warn('There is an error in JSON parsing!');
								}
							}

							if (data.constructor === {}.constructor) {
								validJSON = data;
							}
							else {
								window.console && tedApi.warn('response data was not a JSON string Or Object');
							}

							if (validJSON) {
								SettingHttp.callback(validJSON);
							}
							else {
								delete window[SONPVAR];

								script.parentNode.removeChild(script);

								r(data);

								tedApi.warn('JSONP call returned invalid or empty JSON');

								return 0;
							}

							delete window[SONPVAR];

							script.parentNode.removeChild(script);

							r(data);
						};
					}

					return new Promise(function (resolve, reject) {
						window[SONPVAR] = RetFunction(resolve);

						// window.setTimeout(script.onerror, 5000); might be advisable

						script.src = /\?[\d\w]+\=/.test(SettingHttpe.url)
							? SettingHttp.url + '&callback=' + SONPVAR
							: SettingHttp.url + '?callback=' + SONPVAR;

						script.src = !SettingHttp.data.isEmpty()
							? script.src + '&' + tedApi.serialize(SettingHttp.data)
							: script.src;

						document.getElementsByTagName('head')[0].appendChild(script);
					});
				}

				for (i = 0; i < SettingHttp.repeat; i++) {
					JSONPFUNC();
				}
			}
			else {
				//JSONP
				var OutPutRes;

				function AJAXFN () {
					var OutAns = null,
						url,
						x,
						xhttp,
						DATA = '';

					url = SettingHttp.url;

					if (!SettingHttp.data.isEmpty()) {
						if (SettingHttp.method == 'GET') {
							url = /\?[\d\w]+\=/.test(url)
								? url + '&' + tedApi.serialize(SettingHttp.data)
								: url + '?' + tedApi.serialize(SettingHttp.data);
						}
						else {
							DATA = tedApi.serialize(SettingHttp.data);
						}
					}

					try {
						xhttp = new XMLHttpRequest();
					} catch (e) {
						try {
							xhttp = new ActiveXObject('Msxml2.XMLHTTP');
						} catch (e) {
							try {
								xhttp = new ActiveXObject('Microsoft.XMLHTTP');
							} catch (e) {
								tedApi.error("Your Browser Doesn't Support Ajax!");

								return false;
							}
						}
					}

					var NotFound = 0;

					(xhttp.onerror = function () {
						SettingHttp.error.call(xhttp, {
							type    : 'error',

							code    : 404,

							message : 'Not Found!'
						}); //xhttp as {this} , error

						tedApi.warn("Loading The Url: '" + url + "' Failed!");
					}),
						(xhttp.onreadystatechange = function () {
							SettingHttp.condition.call(xhttp, xhttp.readyState, xhttp.status); //xhttp as {this}

							if (xhttp.readyState == 4 && xhttp.status == 200) {
								var done = false;

								try {
									var out =
										SettingHttp.type == 'text'
											? xhttp.responseText
											: SettingHttp.type == 'html'
												? tedApi.parseHTML(xhttp.responseText)
												: SettingHttp.type == 'xml'
													? tedApi.parseXML(xhttp.responseText)
													: SettingHttp.type == 'json'
														? tedApi.parseJSON(xhttp.responseText)
														: xhttp.responseText;

									OutAns =
										typeof out === typeof $u
											? {
													type    : 'error',

													content : xhttp.responseText
												}
											: {
													type    : SettingHttp.type,

													content : out
												};

									done = true;
								} catch (er) {
									SettingHttp.error.call(xhttp, er); //xhttp as {this} , error

									tedApi.warn("Loading The Url: '" + url + "' Failed! | Error:" + er);

									OutAns = 0;
								}

								if (done) {
									try {
										SettingHttp.success.call(xhttp, OutAns);
									} catch (ee) {
										tedApi.warn(
											"There is an error in you success function!  |  Url: '" + url + "'\n" + ee
										);
									}
								}
							}
							else if (xhttp.readyState == 2 && xhttp.status == 404) {
								NotFound = 1;
							}
							else if (xhttp.readyState == 4 && xhttp.status != 200) {
								if (NotFound) {
									SettingHttp.error.call(xhttp, {
										type    : 'error',

										code    : 404,

										message : 'Not Found!'
									}); //xhttp as {this} , error

									tedApi.warn("Loading The Url: '" + url + "' Failed!");

									OutAns = 0;
								}
								else {
									if (SettingHttp.repeatToDone) {
										xhttp.open(SettingHttp.method, url, SettingHttp.async);

										if (SettingHttpe.method == 'GET') {
											xhttp.send();
										}
										else {
											xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

											xhttp.send(DATA);
										}
									}
								}
							}
						});

					xhttp.open(SettingHttp.method, url, SettingHttp.async);

					if (!SettingHttp.header.isEmpty()) {
						for (x in SettingHttp.header) {
							xhttp.setRequestHeader(x, SettingHttp.header[x]);
						}
					}

					if (SettingHttp.method == 'GET') {
						xhttp.send();
					}
					else {
						xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

						xhttp.send(DATA);
					}

					return OutAns;
				}

				for (i = 0; i < SettingHttp.repeat; i++) {
					OutPutRes = AJAXFN();
				}

				return OutPutRes;
			}
		},

		//Css Functions

		css             : function (el, index, value) {
			var pesu = null;

			if (tedApi.isUndefined(el)) return undefined;

			if (tedApi.isString(el)) {
				var rgx = /[:]{1,2}(?:first\-(letter|line)|before|after|selection|value|choices|repeat\-(item|index)|outside|alternate|(line\-)?marker|slot\([_a-z0-9\-\+\.\\]*\))/g,
					elm = el.match(rgx),
					els = el;

				if (elm !== null) {
					pesu = elm;

					els = el.replace(elm, '');

					if (/\:/g.test(els)) return null;
				}

				el = tedApi.elm(els);
			}

			if (tedApi.isString(index) && tedApi.isString(value)) {
				if (tedApi.isArray(el)) {
					var ret = [];

					for (var i = 0; i < el.length; i++) {
						ret.push(tedApi.cssEdit(el[i], index, value));
					}

					return ret;
				}

				return tedApi.cssEdit(el, index, value);
			}

			if (tedApi.isString(index) && tedApi.isUndefined(value)) {
				if (tedApi.isArray(el)) {
					var ret = [];

					for (var i = 0; i < el.length; i++) {
						ret.push(tedApi.cssSelect(el[i], index, pesu));
					}

					return ret;
				}

				return tedApi.cssSelect(el, index, pesu);
			}

			if (tedApi.isObject(index) && tedApi.isUndefined(value)) {
				if (tedApi.isArray(el)) {
					var ret = [];

					for (var i = 0; i < el.length; i++) {
						for (var j in index) {
							if (index.hasOwnProperty(j)) {
								var out;

								if (tedApi.isFunction(index[j])) {
									out = tedApi.cssEditFunc(el[i], j, index[j]);
								}
								else {
									out = tedApi.cssEdit(el[i], j, index[j]);
								}

								if (!out || out == -1) return 0;

								ret.push(out);
							}
						}
					}

					return ret;
				}

				for (var j in index) {
					var out;

					if (index.hasOwnProperty(j)) {
						if (tedApi.isFunction(index[j])) {
							out = tedApi.cssEditFunc(el, j, index[j]);
						}
						else {
							out = tedApi.cssEdit(el, j, index[j]);
						}

						if (!out || out == -1) return 0;
					}
				}

				return 1;
			}

			if (tedApi.isString(index) && tedApi.isFunction(value)) {
				if (tedApi.isArray(el)) {
					var ret = [];

					for (var i = 0; i < el.length; i++) {
						var out = tedApi.cssEditFunc(el[i], index, value);

						if (!out || out == -1) return 0;

						ret.push(out);
					}

					return ret;
				}

				return tedApi.cssEditFunc(el, index, value);
			}

			return 0;
		},

		/**

         * @param {HTMLElement} el The Element That Want To select css

         * @param {String} index The Name Of Style Select like [width,height,...]

         * @param {String} value The Value Of Style to change

         * @return {Integer} 1 if is done else 0

         */

		cssEdit         : function (el, index, value) {
			if (tedApi.isElement(el) && tedApi.isString(index) && tedApi.isString(value)) {
				var rgx = new RegExp('^(' + index + '\\s*\\:\\s*(.+?)\\s*)$', 'g'),
					style = tedApi.attr(el, 'style'),
					st = [],
					stp;

				style = (style == -1 ? '' : style).trim();

				st = style.split(';');

				stp = st.indexOf(rgx);

				style = '';

				for (var i = 0; i < st.length; i++) {
					if (i != stp && st[i].trim() != '') {
						style += st[i] + ';';
					}
				}

				style += index + ':' + value + ';';

				tedApi.attr(el, 'style', style);

				return 1;
			}

			return 0;
		},

		/**

         * @param {HTMLElement} el The Element That Want To select css

         * @param {String} index The Name Of Style Select like [width,height,...]

         * @param {Array} pesu Array Of pseudo like [:after,:before,::marker,...]

         * @return {String,undefined} If value of style exist it will return value Otherwise undefined

         */

		cssSelect       : function (el, index, pesu) {
			if (
				tedApi.isElement(el) &&
				tedApi.isString(index) &&
				(tedApi.isString(pesu) || tedApi.isUndefined(pesu) || tedApi.isNull(pesu))
			) {
				if (typeof pesu === typeof undefined) pesu = null;

				return window.getComputedStyle(el, pesu).getPropertyValue(index);
			}

			return undefined;
		},

		/**

         * @param {HTMLElement} el The Element That Is for css modifictions

         * @param {String} index the css atrrbute name for edit

         * @param {Function} value The Function To Modifie Css Value Functionaly

         */

		cssEditFunc     : function (el, index, value) {
			if (tedApi.isElement(el) && tedApi.isString(index) && tedApi.isFunction(value)) {
				var per_val = tedApi.cssSelect(el, index),
					rg = /^([\d]+\.[\d]+|[\d]+)(\w{1,4})$/,
					val,
					per = '';

				if (rg.test(per_val)) {
					val = per_val.match(rg);

					per = val[2];

					val = parseFloat(val[1]).toFixed(2);
				}

				var TempVal = val;

				val = value.call(el, val);

				if (tedApi.isUndefined(val)) return 0;

				return tedApi.cssEdit(el, index, val + per);
			}

			return -1;
		},

		//End Of Css Functions

		//On Events Functions

		/**

         * @desc the event listener of tedjs

         * @param {Array|String} el the selected doms

         * @param {String} events the event name

         * @param {Function} func the callback function

         * @return {Number}

         */

		bind            : function (el, events, func) {
			var EventID = tedApi.random(20, 'number');
			if (
				(tedApi.isElement(el) ||
					tedApi.isString(el) ||
					tedApi.isArray(el) ||
					el === document ||
					el === window) &&
				tedApi.isString(events) &&
				tedApi.isFunction(func)
			) {
				if (tedApi.isString(el)) {
					el = tedApi.elm(el);

					if (!tedApi.isElement(el) && !tedApi.isArray(el) && el !== document && el !== window) return 0;
				}

				events = events.trim().split(',');

				if (tedApi.isElement(el) || el === document || el === window) {
					el = [ el ];
				}

				for (var i = 0; i < events.length; i++) {
					var event = events[i];

					if (/^(on).+?$/g.test(event)) event = event.slice(2);

					var f = function () {
						var obj = new __GLOBAL_API_FUNCTIONS__(this);
						return func.apply(obj, arguments);
					};

					function Attr (element, event) {
						var eventT = event.replace('attrchange:', '');

						var attr = new MutationObserver(function (objs) {
							objs.forEach(function (obj, ev) {
								if (obj.attributeName == eventT && obj.type == 'attributes') {
									f.call(element, tedApi.attr(element, eventT), obj.oldValue);
								}
							});
						});

						var config = {
							attributes        : true,

							attributeOldValue : true,

							childList         : false
						};

						if (typeof element.TED_RANDOM_ID === typeof undefined) {
							element.TED_RANDOM_ID = 'TID_' + tedApi.random(20, 'hash');
						}
						if (!tedApi.isJustArray(_EventStorage[element.TED_RANDOM_ID])) {
							_EventStorage[element.TED_RANDOM_ID] = [
								{
									type : 'observe',
									name : 'inchange',
									id   : EventID,
									data : attr
								}
							];
						}
						else {
							_EventStorage[element.TED_RANDOM_ID].push({
								type : 'observe',
								name : 'inchange',
								id   : EventID,
								data : attr
							});
						}

						attr.observe(element, config);
					}

					function InChange (element, ev) {
						var eventT = ev.match(/^inchange(\:[A-Za-z0-9_-]+){0,1}$/);

						var config = {
							attributes        : true,

							attributeOldValue : true,

							childList         : true,

							subtree           : true,

							characterData     : true
						};

						var isSet = false;
						if (tedApi.isUndefined(eventT) || tedApi.isUndefined(eventT[1])) {
							isSet = false;
							eventT = undefined;
						}
						else {
							isSet = true;
							eventT = eventT[1].slice(1);
						}

						var change = new MutationObserver(function (objs) {
							var eventT_ = eventT;

							objs.forEach(function (obj) {
								if (obj.type == 'childList') {
									if (isSet) {
										var AR = obj.addedNodes.length == 0 ? obj.addedNodes : obj.addedNodes;
										var objectT = {};
										if (obj.addedNodes.length == 0) {
											objectT['type'] = 'remove';

											objectT['value'] = [];
										}
										else {
											objectT['type'] = 'add';

											objectT['value'] = [];
										}
										AR.each(function (i) {
											if (AR[i].tagName && AR[i].tagName.toLowerCase() == eventT_.toLowerCase()) {
												objectT['value'].push(AR[i]);
											}
										});
										if (objectT['value'].length > 0) {
											f.call(element, objectT);
										}
									}
									else {
										var objectT = {};

										if (obj.addedNodes.length == 0) {
											objectT['type'] = 'remove';

											objectT['value'] = obj.removedNodes;
										}
										else {
											objectT['type'] = 'add';

											objectT['value'] = obj.addedNodes;
										}

										f.call(element, objectT); //obj.target
									}
								}
								else if (obj.type == 'attributes') {
									var objectT = {};

									objectT['type'] = 'attr';

									objectT['value'] = {
										name   : obj.attributeName,

										old    : obj.oldValue,

										new    : tedApi.attr(obj.target, obj.attributeName),

										target : obj.target
									};

									if (isSet) {
										if (
											obj.target !== element &&
											obj.target.tagName.toLowerCase() == eventT_.toLowerCase()
										) {
											f.call(obj.target, objectT);
										}
									}
									else {
										f.call(obj.target, objectT);
									}
								}
								else if (obj.type == 'characterData') {
									f.call(el, {
										type   : 'char',
										target : obj.target
									});
								}
							});
						});
						if (typeof element.TED_RANDOM_ID === typeof undefined) {
							element.TED_RANDOM_ID = 'TID_' + tedApi.random(20, 'hash');
						}
						if (!tedApi.isJustArray(_EventStorage[element.TED_RANDOM_ID])) {
							_EventStorage[element.TED_RANDOM_ID] = [
								{
									type : 'observe',
									name : 'inchange',
									id   : EventID,
									data : change
								}
							];
						}
						else {
							_EventStorage[element.TED_RANDOM_ID].push({
								type : 'observe',
								name : 'inchange',
								id   : EventID,
								data : change
							});
						}
						change.observe(element, config);
					}

					for (var j = 0; j < el.length; j++) {
						var yy = el[j];

						if (tedApi.isArray(yy)) {
							tedApi.bind(yy, event, func);
							continue;
						}

						yy = tedApi.elm(yy);

						if (!tedApi.isElement(yy)) return 0;

						if (/^attrchange\:[A-Za-z0-9_-]+$/g.test(event)) {
							Attr(yy, event);
						}
						else if (/^inchange(\:[A-Za-z0-9_-]+){0,1}$/g.test(event)) {
							InChange(yy, event);
						}
						else {
							try {
								if (yy.addEventListener) {
									yy.addEventListener(event, f, false);
								}
								else if (yy.attachEvent) {
									yy.attachEvent('on' + event, f);
								}

								if (typeof yy.TED_RANDOM_ID === typeof undefined) {
									yy.TED_RANDOM_ID = 'TID_' + tedApi.random(20, 'hash');
								}
								if (!tedApi.isJustArray(_EventStorage[yy.TED_RANDOM_ID])) {
									_EventStorage[yy.TED_RANDOM_ID] = [
										{
											type : 'event',
											name : event,
											id   : EventID,
											data : f
										}
									];
								}
								else {
									_EventStorage[yy.TED_RANDOM_ID].push({
										type : 'event',
										name : event,
										id   : EventID,
										data : f
									});
								}
							} catch (e) {}
						}
					}
				}

				return EventID;
			}
			else {
				return 0;
			}
		},
		// New
		//return cont of unbinded data
		unbind          : function (el, event) {
			var count = 0;
			el = tedApi.elm(el);
			if (tedApi.isElement(el)) {
				el = [ el ];
			}
			else if (!tedApi.isArray(el)) {
				return 0;
			}

			for (var i = 0; i < el.length; i++) {
				var $event;
				if (tedApi.isElement(el[i]) && !tedApi.isUndefined(_EventStorage[el[i].TED_RANDOM_ID])) {
					if (tedApi.isNumber(event)) {
						$event = [ __FindEvents(el[i].TED_RANDOM_ID, 'id', event,false) ];
					}
					else if (tedApi.isString(event)) {
						$event = __FindEvents(el[i].TED_RANDOM_ID, 'name', event,true);
					}
					else {
						$event = _EventStorage[el[i].TED_RANDOM_ID];
						_EventStorage[el[i].TED_RANDOM_ID] = [];
					}

					for (var j = 0; j < $event.length; j++) {
						if ($event[j] !== null) {
							if ($event[j].type === 'observe') {
								$event[j].data.disconnect();
							}
							else {
								if (el[i].removeEventListener) {
									el[i].removeEventListener($event[j].name, $event[j].data);
								}
								else if (el[i].detachEvent) {
									el[i].detachEvent('on' + $event[j].name, $event[j].data);
								}
							}
							count++;
						}

						for(var k=0;k<_EventStorage[el[i].TED_RANDOM_ID].length;k++){
							if(_EventStorage[el[i].TED_RANDOM_ID][k].id === $event[j].id){
								_EventStorage[el[i].TED_RANDOM_ID].splice(k,1);
								k--;
							}
						}
					}
				}
			}

			return count;
		},

		compile         : function ($this) {
			if (tedApi.isString($this)) $this = tedApi.elm($this);

			if (!tedApi.isElement($this)) return 0;

			ted.compile($this);

			var i = 0,
				el = tedApi.children($this);

			if (el.isEmpty()) return 0;

			var nodeIterator;
			try {
				nodeIterator = document.createNodeIterator($this, NodeFilter.SHOW_ALL, function (node) {
					return NodeFilter.FILTER_ACCEPT;
				});
			} catch (e) {
				nodeIterator = document.createNodeIterator(
					$this,
					NodeFilter.SHOW_ALL,
					function (node) {
						return NodeFilter.FILTER_ACCEPT;
					},
					false
				);
			}

			var currentNode;

			for (i = 0; (currentNode = nodeIterator.nextNode()); i++) {
				ted.compile(currentNode);
			}

			return 1;
		},

		onCompile       : function (fn) {
			//run when each element in pointed from compiler

			if (!tedApi.isFunction(fn)) return 0;

			Onchage_Compile.push(fn);

			return 1;
		}
	};
	// New
	Object.defineProperty(tedApi, 'ERROR', {
		value : tedApi.constObj({ type: 'Error' }, 'TedapiError')
	});

	Object.defineProperty(tedApi, 'GET', {
		get : function () {
			return $$GET();
		}
	});

	Object.defineProperty(tedApi, 'urlHash', {
		get : function () {
			return $$HASH();
		}
	});

	Object.defineProperty(tedApi, 'cookie', {
		value : $$COOKIE()
	});
	// New
	Object.defineProperty(tedApi, 'export', {
		value : new Proxy(
			{},
			{
				set : function (obj, prop, value) {
					if (tedApi.isFunction(value)) {
						obj[prop] = {};
						tedApi.callByParam(value, obj[prop], {
							ted         : ted,
							__GLOBALS__ : __GLOBAL_API_FUNCTIONS__
						});
					}
				}
			}
		)
	});

	/*

     * The Main Ted function

     */

	ted = {
		version              : '1.2.2',

		__AfterFunctions     : [],

		__BeforeFunctions    : [],

		__BeforeRunFunctions : [],

		__EndCFunction       : [],

		_Elements            : Elms,

		eachReady            : function (f) {
			var i = 0;

			var elmOn = window.setInterval(function () {
				if (typeof document.all[i] !== typeof $u) {
					f.call(document.all[i]);

					i++;
				}

				//if(element.nodeName.toLowerCase() == n.toLowerCase())f.call(element);

				if (i + 1 == document.all.length) clearInterval(elmOn);
			}, 1);
		},

		ready                : function (f) {
			ted.docReady(function () {
				var i = 0;

				for (i = 0; i < document.all.length; i++) {
					var element = document.all[i];

					if (typeof element !== typeof $u) {
						f.call(element);
					}

					//if(element.nodeName.toLowerCase() == n.toLowerCase())f.call(element);
				}
			});
		},

		nodeReady            : function (f, callback) {
			ted.docReady(function () {
				var i = 0,
					el = documentNodes();

				if (el.isEmpty()) return 0;

				var nodeIterator;
				try {
					nodeIterator = document.createNodeIterator(tedApi.elm('html'), NodeFilter.SHOW_ALL, function (
						node
					) {
						return NodeFilter.FILTER_ACCEPT;
					});
				} catch (e) {
					nodeIterator = document.createNodeIterator(
						tedApi.elm('html'),
						NodeFilter.SHOW_ALL,
						function (node) {
							return NodeFilter.FILTER_ACCEPT;
						},
						false
					);
				}

				var pars = [];

				var currentNode;

				for (i = 0; (currentNode = nodeIterator.nextNode()); i++) {
					//el = documentNodes();

					f.call(currentNode, i, Math.ceil(i * 100 / el.length)); //el[i] as this , i as first arg and secend arg is percent of element count

					//if(element.nodeName.toLowerCase() == n.toLowerCase())f.call(element);
				}

				/*

                for (i = 0; i < el.length; i++) {

                    //el = documentNodes();

                    if (el.isEmpty()) return 0;

                    f.call(el[i], i, Math.ceil((i * 100) / el.length)); //el[i] as this , i as first arg and secend arg is percent of element count

                    //if(element.nodeName.toLowerCase() == n.toLowerCase())f.call(element);

                }

                */

				if (tedApi.isFunction(callback)) {
					callback.call(_this);
				}
			});
		},

		afterCompile         : function (f) {
			ted.__AfterFunctions.push(f);
		},

		beforeCompile        : function (f) {
			ted.__BeforeFunctions.push(f);
		},

		beforeElementRun     : function (f) {
			ted.__BeforeRunFunctions.push(f);
		},

		define               : function (a, b) {
			if (typeof b === typeof $u || '[object Array]' !== Object.prototype.toString.call(b)) {
				return -1;
			}

			document.getElementById('2edMainStyle-style-for-new-elms').innerHTML += a + '{display:none;}';

			var c = {
				point : 'TED_' + tedApi.random(23, 'hash')
			};

			'undefined' !== typeof window['TEDElement_' + a.toLowerCase()]
				? ((Elms[window['TEDElement_' + a.toLowerCase()]] = {
						tagName    : a.toLowerCase(),

						attributes : b
					}),
					(c.point = window['TEDElement_' + a.toLowerCase()]))
				: (Object.defineProperty(window, 'TEDElement_' + a.toLowerCase(), {
						value : c.point
					}),
					(Elms[c.point] = {
						tagName    : a.toLowerCase(),

						attributes : b
					}));

			return c;
		},

		create               : function (a, d) {
			if (
				typeof a === typeof $u ||
				('[object Object]' !== Object.prototype.toString.call(a) &&
					'[object Array]' !== Object.prototype.toString.call(a)) ||
				'function' != typeof d
			) {
				return -1;
			}

			if (tedApi.isJustArray(a)) {
				for (var e = 0; e < a.length; e++) {
					var g = a[e],
						f = function (b) {
							typeof b === typeof $u && (b = []);

							var c = __GLOBAL_API_FUNCTIONS__(this);

							Object.defineProperty(c, 'name', {
								value : Elms[a.point].tagName
							});

							Object.defineProperty(c, 'attrs', {
								value : Elms[a.point].attributes
							});

							d.apply(c, b);

							this.toString = function () {
								return '[object HTML' + Elms[g.point].tagName.capital() + 'Element]';
							};
						};

					Elms[g.point]['function'] = f;
				}
			}
			else {
				(f = function (b) {
					typeof b === typeof $u && (b = []);

					var c = __GLOBAL_API_FUNCTIONS__(this);

					Object.defineProperty(c, 'name', {
						value : Elms[a.point].tagName
					});

					Object.defineProperty(c, 'attrs', {
						value : Elms[a.point].attributes
					});

					d.apply(c, b);

					this.toString = function () {
						return '[object HTML' + Elms[a.point].tagName.capital() + 'Element]';
					};
				}),
					(Elms[a.point]['function'] = f);
			}

			return this;
		}, //Arg:obj,func

		createAttr           : function (b, d, a) {
			if (
				typeof a === typeof $u ||
				'[object Array]' !== Object.prototype.toString.call(a) ||
				'function' != typeof d
			) {
				return -1;
			}

			Attrs[b.toLowerCase()] = {
				elements : a,

				function : function (f) {
					var e = this,
						c = __GLOBAL_API_FUNCTIONS__(e);

					c.content = function (a) {
						return e.setAttribute(b, a);
					};

					Object.defineProperty(c, 'name', {
						value : b
					});

					Object.defineProperty(c, 'tags', {
						value : a
					});

					d.call(c, f);
				}
			};

			return this;
		}, //arg:name,fun,tagObj

		createComment        : function (v, n) {
			if (!tedApi.isFunction(n)) {
				return -1;
			}

			if (tedApi.isString(v)) {
				v = new RegExp(v);
			}

			if (!(v instanceof RegExp)) {
				return -1;
			}

			Comments.push({
				regexp   : v,

				function : function () {
					var e = this;

					n.apply(e, arguments);
				}
			});

			return this;
		}, //arg:regexp,func

		createTextNode       : function (v, n) {
			if (!tedApi.isFunction(n)) {
				return -1;
			}

			if (tedApi.isString(v)) {
				v = new RegExp(v);
			}

			if (!(v instanceof RegExp)) {
				return -1;
			}

			TextNodes.push({
				regexp   : v,

				function : function () {
					var e = this;

					n.apply(e, arguments);
				}
			});

			return this;
		}, //arg:regexp,func

		compile              : function (c, e) {
			'undefined' === typeof e && (e = 0);

			ted.Backup(c);

			for (var d = 0; d < ted.__BeforeFunctions.length; d++) {
				ted.__BeforeFunctions[d].call(c, e == true);
			}

			if (!tedApi.isElement(c)) {
				if (tedApi.isCommentNode(c)) {
					for (var d = 0; d < Comments.length; d++) {
						if (Comments[d].regexp.test(c.nodeValue.trim()))
							Comments[d]['function'].apply(c, c.nodeValue.trim().match(Comments[d].regexp));
					}
				}
				else if (tedApi.isTextNode(c)) {
					c.nodeValue = c.oldIn;

					for (var d = 0; d < TextNodes.length; d++) {
						if (TextNodes[d].regexp.test(c.nodeValue.trim()))
							TextNodes[d]['function'].apply(c, c.nodeValue.trim().match(TextNodes[d].regexp));
					}
				}
				else {
					return 0;
				}
			}
			else {
				//c.innerHTML = c.oldIn;

				var b = c.attributes,
					d = [];

				for (var i = 0; i < c.oldAttrs.length; i++) {
					c.attributes[c.oldAttrs[i].name] = c.oldAttrs[i].value;
				}

				function $$t (a, c, d) {
					Object.defineProperty(a, c, {
						get : function () {
							return d[c]['function'].call(a, tedApi.attr(a, c) != -1 ? tedApi.attr(a, c) : '');
						},

						set : function (v) {
							d[c]['function'].call(a, v);

							tedApi.attr(a, c, v);
						}
					});
				}

				for (var a = 0; a < b.length; a++) {
					d[b[a].name] = b[a].value;
					if (tedApi.isObject(Attrs[b[a].name])) {
						if (
							(-1 == Attrs[b[a].name].elements.indexOf(c.tagName.toLowerCase()) &&
								0 == Attrs[b[a].name].elements.length) ||
							(-1 != Attrs[b[a].name].elements.indexOf(c.tagName.toLowerCase()) &&
								0 < Attrs[b[a].name].elements.length)
						)
							Attrs[b[a].name]['function'].call(c, b[a].value);
					}
				}

				for (var i in Attrs) {
					if (!c.hasOwnProperty(i)) {
						$$t(c, i, Attrs);
					}
				}

				for (var dd = 0; dd < ted.__BeforeRunFunctions.length; dd++) {
					ted.__BeforeRunFunctions[dd].call(c, e == true);
				}

				for (var f in Elms) {
					if (
						'undefined' !== typeof Elms[f]['function'] &&
						Elms[f].tagName.toLowerCase() == c.tagName.toString().toLowerCase()
					) {
						b = [];

						for (a = 0; a < Elms[f].attributes.length; a++) {
							b.push(d[Elms[f].attributes[a]]);
						}

						Elms[f]['function'].call(c, b);
					}
				}
			}

			for (d = 0; d < ted.__AfterFunctions.length; d++) {
				ted.__AfterFunctions[d].call(c, e == true);
			}
		},

		Backup               : function (c, b) {
			if (!tedApi.isUndefined(c.oldIn) && b) return 0;

			if (tedApi.isElement(c)) {
				c.oldOut = c.outerHTML;

				c.oldIn = c.innerHTML;

				c.oldAttrs = [];

				for (var i = 0; i < c.attributes.length; i++) {
					c.oldAttrs.push({
						name  : c.attributes[i].localName,

						value : c.attributes[i].nodeValue
					});
				}
			}
			else if (tedApi.isTextNode(c)) {
				c.oldIn = c.nodeValue;
			}
			else if (tedApi.isCommentNode(c)) {
				c.oldIn = c.nodeValue;
			}

			return 1;
		},

		returnBack           : function (c) {
			if (tedApi.isUndefined(c.oldIn)) return 0;

			if (tedApi.isElement(c)) {
				//c.outerHTML = c.oldOut;

				c.innerHTML = c.oldIn;

				for (var i = 0; i < c.oldAttrs.length; i++) {
					c.attributes[c.oldAttrs[i].name] = c.oldAttrs[i].value;
				}
			}
			else if (tedApi.isTextNode(c)) {
				c.nodeValue = c.oldIn;
			}
			else if (tedApi.isCommentNode(c)) {
				c.nodeValue = c.oldIn;
			}

			return 1;
		},

		docReady             : function (callback, context) {
			if (readyFired) {
				window.setTimeout(function () {
					callback(context);
				}, 1);

				return;
			}
			else {
				readyList.push({
					fn  : callback,

					ctx : context
				});
			}

			if (document.readyState === 'complete') {
				window.setTimeout(ready, 1);
			}
			else if (!readyEventHandlersInstalled) {
				if (document.addEventListener) {
					document.addEventListener('DOMContentLoaded', ready, false);

					window.addEventListener('load', ready, false);
				}
				else {
					document.attachEvent('onreadystatechange', readyStateChange);

					window.attachEvent('onload', ready);
				}

				readyEventHandlersInstalled = true;
			}
		},
		EndCompile           : function (fn) {
			if (tedApi.isFunction(fn)) {
				ted.__EndCFunction.push(fn);
			}
		}
	};

	ready_run_code = function (loop, percent) {
		for (var TED_LOOP = 0; TED_LOOP < Onchage_Compile.length; TED_LOOP++) {
			Onchage_Compile[TED_LOOP].call(__GLOBAL_API_FUNCTIONS__(this), loop, percent);
		}

		var OnCompile_Number = [];

		for (var TED_LOOP = 0; TED_LOOP < onCompile_Ready.length; TED_LOOP++) {
			if (this === onCompile_Ready[TED_LOOP].el) OnCompile_Number.push(TED_LOOP);
		}

		ted.Backup.call(_this, this);

		ted.compile.call(_this, this);

		for (var TED_LOOP = 0; TED_LOOP < OnCompile_Number.length; TED_LOOP++) {
			onCompile_Ready[OnCompile_Number[TED_LOOP]].fn.call(__GLOBAL_API_FUNCTIONS__(this));
		}
	};

	function __NodeReady__ (callback) {
		ted.nodeReady(ready_run_code, function () {
			for (var TED_LOOP = 0; TED_LOOP < ted.__EndCFunction.length; TED_LOOP++) {
				ted.__EndCFunction[TED_LOOP].call(__GLOBAL_API_FUNCTIONS__(this));
			}

			tedApi.bind(document, 'inchange', function (data) {
				if (data.type == 'add') {
					for (var i = 0; i < data.value.length; i++) {
						var el = data.value[i];

						ted.Backup.call(_this, el);

						ted.compile.call(_this, el);
					}
				}
			});
			if (tedApi.isFunction(callback)) {
				callback.call();
			}
		}); //nodeReady
	}

	__NodeReady__();

	tedApi.bind(document, 'mousemove', function (e) {
		var posx = 0;
		var posy = 0;

		CURSOR_POSIRION.client.left = e.clientX;
		CURSOR_POSIRION.client.top = e.clientY;

		CURSOR_POSIRION.screen.left = e.screenX;
		CURSOR_POSIRION.screen.top = e.screenY;

		if (!e) {
			var e = window.event;
		}
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		CURSOR_POSIRION.document.top = posy;
		CURSOR_POSIRION.document.left = posx;
	});
})(window, undefined);
