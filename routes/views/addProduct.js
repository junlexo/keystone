var keystone = require('keystone');
var Product = keystone.list('Product');
var GroupProduct = keystone.list('GroupProduct');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'addProduct';
	locals.unit = Product.fields.unit.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.category = [];
	view.on('init', function(next){
		var group = GroupProduct.model.find().sort('name');
		group.exec(function (err, results) {
			locals.category = results;	
			next(err);		
		});		
	});
	view.on('post', { action: 'product.create' }, function (next) {			
		var application = new Product.model();
		var updater = application.getUpdateHandler(req);		
		updater.process(req.body, {
			flashErrors: true
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {		
					
				var idProduct = updater.item._id;
				var price = updater.item.price;

				locals.enquirySubmitted = true;		
			}	
			next();					
		});

	});

	view.render('product/addProduct', {
		section: 'addProduct',
	});

}
