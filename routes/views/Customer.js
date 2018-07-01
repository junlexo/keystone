var keystone = require('keystone');
var Customer = keystone.list('Customer');
var GroupCustomer = keystone.list('GroupCustomer');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'Customer';
	locals.unit = Customer.fields.type.ops;
	locals.Customer = [];
	locals.category = [];
	view.on('init', function (next) {
		

		var q = Customer.model.find().sort('name');
		q.exec(function (err, results) {
			locals.Customer = results;	
			GroupCustomer.model.find().sort('name').exec(function (err, group){
				if(!err)					
					locals.category = group;
				next(err);
			});					
		});

	});
	// Delete a Customer
	view.on('get', { remove: 'customer' }, function (next) {

		if (!req.user) {
			req.flash('error', 'Bạn phải đăng nhập trước khi muốn xóa sản phẩm.');
			return next();
		}

		Customer.model.findOne({
				_id: req.query.customer
			})
			.exec(function (err, customer) {
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
				customer.remove(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Sản phẩm đã được xóa.');
					console.log(customer);
					return res.redirect('/Customer');
				});
			});
	});
	view.render('customer/Customer');
}
