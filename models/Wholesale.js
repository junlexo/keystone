var keystone = require('keystone');
var Types = keystone.Field.Types;

var Wholesale = new keystone.List('Wholesale', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

Wholesale.add({
	code: { type: String, required: false },
	dateCreate: { type: Types.Date },
	datePay: { type: Types.Date },
	idCustomer: { type: Types.Relationship, initial: true, ref: 'Customer', index: true},
	describe: { type: String },	
	totalMoney: { type: Types.Number },
	totalPay: { type: Types.Number }
});

Wholesale.track = true;
Wholesale.defaultSort = 'name';
Wholesale.defaultColumns = 'name, idCustomer';
Wholesale.register();
