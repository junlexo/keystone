var keystone = require('keystone');
var Product = keystone.list('Product');
var GroupProduct = keystone.list('GroupProduct');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'Product';
	locals.Product = [];
	locals.category = [];
	view.on('init', function (next) {		
		var q = Product.model.find().sort('name');
		q.exec(function (err, results) {
			locals.Product = results;			
			GroupProduct.model.find().sort('name').exec(function (err, group){
				if(!err)					
				{
					locals.category = group;					
				}
				next(err);
			});			
		});
	});
	// Delete a Product
	view.on('get', { remove: 'product' }, function (next) {

		if (!req.user) {
			req.flash('error', 'Bạn phải đăng nhập trước khi muốn xóa sản phẩm.');
			return next();
		}

		Product.model.findOne({
				_id: req.query.product
			})
			.exec(function (err, product) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', 'Sản phẩm ' + req.query.product + ' không thể tìm thấy.');
						return next();
					}
					return res.err(err);
				}
				if (!product) {
					req.flash('error', 'Sản phẩm ' + req.query.product + ' không thể tìm thấy.');
					return next();
				}				
				product.remove(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Sản phẩm đã được xóa.');
					console.log(product);
					return res.redirect('/Product');
				});
			});
	});
	view.render('product/Product');

}
