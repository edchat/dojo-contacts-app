define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-geometry", "dojo/dom-style",
	"dojo/dom-class", "dojox/mobile/sniff", "dojo/_base/window", "dojox/app/controllers/Layout"],
function(declare, lang, dom, domGeom, domStyle, domClass, has, win, Layout){
//	define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/window",
//			"dojo/query", "dojo/dom-geometry", "dojo/dom-attr", "dojo/dom-style", "dijit/registry",
//			"./LayoutBase", "../utils/layout", "../utils/constraints"],
//	function(declare, lang, array, win, query, domGeom, domAttr, domStyle, registry, LayoutBase, layout, constraints){


	// module:
	//		dojox/app/tests/mediaQuery3ColumnApp/controllers/CssLayout
	// summary:
	//		Will layout an application with a BorderContainer.  
	//		Each view to be shown in a region of the BorderContainer will be wrapped in a StackContainer and a ContentPane.
	//		

	return declare("contactsApp/controllers/ios7StatusBarLayout", Layout, {

		constructor: function(app, events){
			// summary:
			//		bind "app-initLayout" and "app-layoutView" events on application instance.
			//
			// app:
			//		dojox/app application instance.
			// events:
			//		{event : handler}

			// if on iOS7 add the ios7body class to the body, and in _doResize adjust the height
			var ios7 = has("ios") >= 7;
			if(ios7){
				var body = dom.byId("theApp").parentNode;
				domClass.add(body, "ios7body");
			}
		},

		_doResize: function(view){
			// summary:
			//		resize view.
			//
			// view: Object
			//		view instance needs to do layout.
			var node = view.domNode;
			if(!node){
				this.app.log("Warning - View has not been loaded, in Layout _doResize view.domNode is not set for view.id="+view.id+" view=",view);
				return;
			}

			// If either height or width wasn't specified by the user, then query node for it.
			// But note that setting the margin box and then immediately querying dimensions may return
			// inaccurate results, so try not to depend on it.
			var mb = {};
			if( !("h" in mb) || !("w" in mb) ){
				mb = lang.mixin(domGeom.getMarginBox(node), mb);	// just use dojo/_base/html.marginBox() to fill in missing values
			}

			// Compute and save the size of my border box and content box
			// (w/out calling dojo/_base/html.contentBox() since that may fail if size was recently set)
			if(view !== this.app){
				var cs = domStyle.getComputedStyle(node);
				var me = domGeom.getMarginExtents(node, cs);
				var be = domGeom.getBorderExtents(node, cs);
				var bb = (view._borderBox = {
					w: mb.w - (me.w + be.w),
					h: mb.h - (me.h + be.h)
				});
				var pe = domGeom.getPadExtents(node, cs);
				view._contentBox = {
					l: domStyle.toPixelValue(node, cs.paddingLeft),
					t: domStyle.toPixelValue(node, cs.paddingTop),
					w: bb.w - pe.w,
					h: bb.h - pe.h
				};
			}else{
				// if we are layouting the top level app the above code does not work when hiding address bar
				// so let's use similar code to dojo mobile.
				var ios7 = has("ios") >= 7;
				if(ios7){
					view._contentBox = {
						l: 0,
						t: 0,
						h: win.global.innerHeight-27 || win.doc.documentElement.clientHeight -27,
						w: win.global.innerWidth || win.doc.documentElement.clientWidth
					};
				}else{
					view._contentBox = {
						l: 0,
						t: 0,
						h: win.global.innerHeight || win.doc.documentElement.clientHeight,
						w: win.global.innerWidth || win.doc.documentElement.clientWidth
					};
				}
			}

		//	this.inherited(arguments); do not call inherited for this instead call this._doLayout(view);
			this._doLayout(view);
		}
	});
});
