var keystone = require('keystone');
var Customer = keystone.list('Customer');
var GroupCustomer = keystone.list('GroupCustomer');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'editPrduct';
	locals.unit = Customer.fields.type.ops;
	locals.filters = {
		customer: req.params.customer,
	};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.Customer = [];
	locals.category = [];
	// Load the current Customer
	view.on('init', function (next) {
		var q = Customer.model.findOne({
			// state: 'published',
			_id: locals.filters.customer,
		});
		q.exec(function (err, result) {		
			var group = GroupCustomer.model.find().sort('name');
			locals.Customer = result;
			group.exec(function (err2, results) {
				locals.category = results;		
				next(err2);
			});
		});

	});	
	view.on('post', { action: 'customer.edit' }, function (next) {
		var Body = req.body;
		var customeredit = Customer.model.findOne({
			_id: locals.filters.customer
		});
		customeredit.exec(function (err, customer) {
			if (err) {
				if (err.name === 'CastError') {
					req.flash('error', 'Sản phẩm ' + req.query.customer + ' không thể tìm thấy.');
					return next();
				}
				return res.err(err);
			}
			if (!customer) {
				req.flash('error', 'Sản phẩm ' + req.query.customer + ' không thể tìm thấy.');
				return next();
			}	
			customer.name = Body.name;		
			customer.address = Body.address;	
			customer.phone = Body.phone;		
			customer.target = Body.target;				
			customer.category = Body.category;
			customer.type = Body.type;
			customer.describe = Body.describe;

			customer.save(function (err) {
				if (err)
					return res.err(err);
				req.flash('success', 'Cập nhật thông tin khách hàng thành công.');
				return res.redirect('/Customer');
			});
		});

	});
	view.render('customer/editCustomer');

}
