var keystone = require('keystone');
var Types = keystone.Field.Types;

var GroupCustomer = new keystone.List('GroupCustomer', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

GroupCustomer.add({
	name: { type: String, required: true }	
});

GroupCustomer.track = true;
GroupCustomer.defaultSort = 'name';
GroupCustomer.defaultColumns = 'name';
GroupCustomer.register();
