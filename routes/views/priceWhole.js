var keystone = require('keystone');
var Product = keystone.list('Product');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'PriceWholesale';
	locals.PriceWholesale = [];
	view.on('init', function (next) {
		var q = Product.model.find().sort('name');
		q.exec(function (err, results) {
			locals.PriceWholesale = results;
			next(err);		
		});
	});
	// add a PriceWholesale
	view.on('post',{}, function (next) {
		var Body = req.body;
		var application = Product.model.findOne({
			_id: Body.idProduct
		});
		application.exec(function (err, product) {
			if (err) {
				if (err.name === 'CastError') {
					req.flash('error', 'Sản phẩm ' + _idProduct + ' không thể tìm thấy.');
					return next();
				}
				return res.err(err);
			}
			if (!product) {
				req.flash('error', 'Sản phẩm ' + _idProduct + ' không thể tìm thấy.');
				return next();
			}			
			product.whole = Body.whole;

			product.save(function (err) {
				if (err)
				{					
					return res.err(err);				
				}
				req.flash('success', 'Cập nhật Giá bán sỉ thành công.');
				return res.redirect('/Wholesale/price');
			});
		});		
	});
	view.render('price/PriceWhole');

}
