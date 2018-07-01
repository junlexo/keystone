var keystone = require('keystone');
var Customer = keystone.list('Customer');
var GroupCustomer = keystone.list('GroupCustomer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'addCustomer';
	locals.unit = Customer.fields.type.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.category = [];
	view.on('init', function(next){
		var group = GroupCustomer.model.find().sort('name');
		group.exec(function (err, results) {
			locals.category = results;	
			next(err);		
		});		
	});
	view.on('post', { action: 'customer.create' }, function (next) {		
		var application = new Customer.model();
		var updater = application.getUpdateHandler(req);		
		updater.process(req.body, {
			flashErrors: true
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {								
				locals.enquirySubmitted = true;
			}
			next();
		});

	});

	view.render('customer/addCustomer', {
		section: 'addCustomer',
	});

}
