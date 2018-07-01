var keystone = require('keystone');
var Types = keystone.Field.Types;

var Product = new keystone.List('Product', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

Product.add({
	name: { type: String, required: true },
	category: { type: Types.Relationship, initial: true, ref: 'GroupProduct', index: true},
	unit: { type: Types.Select, options: [
		{ value: 'cai', label: "Cái" },
		{ value: 'hop', label: "Hộp" },
		{ value: 'vi', label: "Vĩ" },
	], required: false },
	price: { type: Types.Money },
	whole: { type: Types.Money },
	minNumber: { type: Types.Number},
	maxNumber: { type: Types.Number},
});

Product.track = true;
Product.defaultSort = 'name';
Product.defaultColumns = 'name, category';
Product.register();
