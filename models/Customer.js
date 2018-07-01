var keystone = require('keystone');
var Types = keystone.Field.Types;

var Customer = new keystone.List('Customer', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

Customer.add({
	name: { type: String, required: true },
	address: { type: String },
	phone: { type: String },
	target: { type: Types.Money },
	category: { type: Types.Relationship, initial: true, ref: 'GroupCustomer', index: true },
	type: { type: Types.Select, options: [
		{ value: 'buy', label: "Người Mua" },
		{ value: 'sell', label: "Người Bán" }
	], required: false },
	describe: { type: String },
});

Customer.track = true;
Customer.defaultSort = 'name';
Customer.defaultColumns = 'name, category';
Customer.register();
