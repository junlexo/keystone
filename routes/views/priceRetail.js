var keystone = require('keystone');
var Product = keystone.list('Product');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'PriceRetail';
	locals.PriceRetail = [];
	view.on('init', function (next) {
		var q = Product.model.find().sort('name');
		q.exec(function (err, results) {
			locals.PriceRetail = results;
			next(err);		
		});
	});
	// add a PriceRetail
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
			product.price = Body.price;

			product.save(function (err) {
				if (err)
				{					
					return res.err(err);				
				}
				req.flash('success', 'Cập nhật Giá bán sỉ thành công.');
				return res.redirect('/Retail/price');
			});
		});		
	});
	view.render('price/PriceRetail');

}
