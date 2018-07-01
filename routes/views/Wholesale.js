var keystone = require('keystone');
var Wholesale = keystone.list('Wholesale');
var Customer = keystone.list('Customer');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'Wholesale';
	locals.Wholesale = [];
	locals.Customer = [];	
	view.on('init', function (next) {		
		var q = Wholesale.model.find().sort('name');
		q.exec(function (err, results) {							
			if(err)					
			{				
				next(err);					
			}
			locals.Wholesale = results;
			Customer.model.find().sort('name').exec(function (errCus, cus){
				if(!err)					
				{
					locals.Customer = cus;					
				}
				next(errCus);
			});					
		});
	});
	// Delete a Wholesale
	view.on('get', { remove: 'wholesale' }, function (next) {

		// if (!req.user) {
		// 	req.flash('error', 'Bạn phải đăng nhập trước khi muốn xóa sản phẩm.');
		// 	return next();
		// }

		Wholesale.model.findOne({
				_id: req.query.wholesale
			})
			.exec(function (err, wholesale) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', 'Đơn hàng ' + req.query.wholesale + ' không thể tìm thấy.');
						return next();
					}
					return res.err(err);
				}
				if (!wholesale) {
					req.flash('error', 'Đơn hàng ' + req.query.wholesale + ' không thể tìm thấy.');
					return next();
				}				
				wholesale.remove(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Đơn hàng đã được xóa.');
					console.log(wholesale);
					return res.redirect('/Wholesale');
				});
			});
	});
	view.render('sale/Wholesale');

}
