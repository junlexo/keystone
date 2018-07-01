var keystone = require('keystone');
var Product = keystone.list('Product');
var GroupProduct = keystone.list('GroupProduct');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'editPrduct';
	locals.unit = Product.fields.unit.ops;
	locals.filters = {
		product: req.params.product,
	};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.Product = [];
	locals.category = [];
	// Load the current Product
	view.on('init', function (next) {		
		var q = Product.model.findOne({
			// state: 'published',
			_id: locals.filters.product,
		});

		q.exec(function (err, result) {		
			locals.Product = result;
			var group = GroupProduct.model.find().sort('name');
			group.exec(function (err, results1) {
				locals.category = results1;		
				next(err);
			});			
		});

	});	
	view.on('post', { action: 'product.edit' }, function (next) {
		var Body = req.body;
		var productedit = Product.model.findOne({
			_id: locals.filters.product
		});
		productedit.exec(function (err, product) {
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
			product.name = Body.name;		
			product.category = Body.category;
			product.unit = Body.unit;
			product.price = Body.price;			
			product.minNumber = Body.minNumber;
			product.maxNumber = Body.maxNumber;

			product.save(function (err) {
				if (err)
					return res.err(err);
				req.flash('success', 'Cập nhật sản phẩm thành công.');
				return res.redirect('/Product');
			});

			//update price 
			var productedit = Product.model.findOne({
				_id: locals.filters.product
			});
		});
	});
	view.render('product/editProduct');

}
