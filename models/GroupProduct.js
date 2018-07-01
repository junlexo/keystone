var keystone = require('keystone');
var Types = keystone.Field.Types;

var GroupProduct = new keystone.List('GroupProduct', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

GroupProduct.add({
	name: { type: String, required: true }	
});

GroupProduct.track = true;
GroupProduct.defaultSort = 'name';
GroupProduct.defaultColumns = 'name';
GroupProduct.register();
