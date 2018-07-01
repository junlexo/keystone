var keystone = require('keystone');
var GroupCustomer = keystone.list('GroupCustomer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'groupCustomer';
	locals.GroupCustomer = [];
	view.on('init', function (next) {

		var q = GroupCustomer.model.find().sort('name');
		q.exec(function (err, results) {
			locals.GroupCustomer = results;
			next(err);
		});

	});
	// add a GroupCustomer
	view.on('post',{}, function (next) {
		var Body = req.body;
		var application = new GroupCustomer.model();
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

	// Delete a GroupCustomer
	view.on('get', { remove: 'GroupCustomer' }, function (next) {

		if (!req.user) {
			req.flash('error', 'Bạn phải đăng nhập trước khi muốn xóa sản phẩm.');
			return next();
		}

		GroupCustomer.model.findOne({
				_id: req.query.group
			})
			.exec(function (err, group) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', 'Sản phẩm ' + req.query.group + ' không thể tìm thấy.');
						return next();
					}
					return res.err(err);
				}
				if (!group) {
					req.flash('error', 'Sản phẩm ' + req.query.group + ' không thể tìm thấy.');
					return next();
				}				
				group.remove(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Nhóm sản phẩm đã được xóa.');
					return res.redirect('/groupCustomer');
				});
			});
	});
	view.render('customer/groupCustomer');

}
