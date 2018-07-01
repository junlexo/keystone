var keystone = require('keystone');
var Types = keystone.Field.Types;

var ListProductBuy = new keystone.List('ListProductBuy', {
	autokey: { from: 'name', path: 'key', unique: true },
	nodelete: false
});

ListProductBuy.add({
	idReceipt: { type: String, ref: 'Wholesale', index: true },
	product: { type: Types.Relationship, many: true, ref: 'Product', index: true },
	amountProduct: { type: Types.Number, default: 0 },
	typeProduct: { type: Types.Select, options: [
				{ value: 'buy', label: "Bán" },
				{ value: 'promotion', label: "Khuyến mãi" },
			], required: false, default: 'buy' }
});	

ListProductBuy.track = true;
ListProductBuy.defaultColumns = 'idReceipt';
ListProductBuy.register();
