define(["dojo/_base/declare", "dojox/mobile/ListItem", "dojox/mobile/EdgeToEdgeStoreList"], function(declare, ListItem){
	var ContactListItem = declare(ListItem, {
		target: "detail",
		clickable: true
	});

	return {
		ContactListItem: ContactListItem
	};
});