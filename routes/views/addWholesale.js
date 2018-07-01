var keystone = require('keystone');
var Wholesale = keystone.list('Wholesale');
var Product = keystone.list('Product');
var Customer = keystone.list('Customer');
var ListProduct = keystone.list('ListProductBuy');
var GroupProduct = keystone.list('GroupProduct');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'addWholesale';
	locals.typeProduct = ListProduct.fields.typeProduct.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.codeBill = "";
	view.on('init', function(next){
		var q = Customer.model.find().sort('name');
		q.exec(function (err, customer) {
			locals.Customer = customer;		
			
			//Tim ma hoa don moi
			var month = (new Date()).getMonth() + 1;
			month + 1 < 10 ? month = "0"+month : month;
			var year = (new Date()).getFullYear().toString();
			var stringFind = "HD" + month +  year;
			locals.codeBill = stringFind + "-";	
			var bill = Wholesale.model.find({"code":new RegExp(stringFind)});			
			bill.exec(function (errBill, bill1) {
				if(bill1.length)
				{				
					var number = parseInt(bill1[bill1.length - 1].code.substring(9, 15)) + 1;
					var len = number.toString().length;
					for(var i = len; i < 5; i++)
						locals.codeBill += "0";
					locals.codeBill += number;
				}
				else
				{
					locals.codeBill += "00001";
				}
				var appProduct = Product.model.find().sort('name');
				appProduct.exec(function(errPro, product){
					if(errPro)
					{
						locals.validationErrors = err.errors;
					}
					else
					{
						locals.Product = product;
					}
					GroupProduct.model.find().sort('name').exec(function (errGroup, group){
						if(!errGroup)					
						{
							locals.category = group;					
						}
						next(err);
					});		
				});
			});	
			
		});
	});
	view.on('get', { data : 'owe' }, function (next) {	
		var bill = Wholesale.model.find({"idCustomer":req.query.customer});
		bill.exec(function(err, data){
			if(data)
			{
				var oldOwe = 0;
				for(var i = 0; i < data.length; i++)
					if(data[i].totalMoney - data[i].totalPay > 0)
						oldOwe += data[i].totalMoney - data[i].totalPay;
				return res.send(oldOwe.toString());
			}
			else
				return res.send('0');
		});		
	});
	view.on('post', { action: 'wholesale.create' }, function (next) {		
		var applicationWhole = new Wholesale.model();		
		var updaterWhole = applicationWhole.getUpdateHandler(req);					
		updaterWhole.process({
			'code'		 : req.body.code,
			'dateCreate' : req.body.dateCreate,
			'datePay'	 : req.body.datePay,
			'idCustomer' : req.body.idCustomer,
			'describe'	 : req.body.describe,
			'totalMoney' : req.body.totalMoney,
			'totalPay'   : 0
		}, {
			flashErrors: true
		}, function (err) {

			if (err) {
				locals.validationErrors = err.errors;
			} else {
				var listPro = [];
				// var lengList = req.body.product.length;	
				if(req.body.numberProduct > 1)
				{
					for(var i = 0; i < req.body.numberProduct; i++)
					{					
						listPro.push({
							'idReceipt' 	: req.body.code,
							'product' 		: req.body.product[i],
							'amountProduct'	: req.body.amountProduct[i],
							'typeProduct' 	: req.body.typeProduct[i],	
						});
					}
				}
				else
					if(req.body.numberProduct > 0)
					{
						listPro.push({
							'idReceipt' 	: req.body.code,
							'product' 		: req.body.product,
							'amountProduct'	: req.body.amountProduct,
							'typeProduct' 	: req.body.typeProduct,	
						});
					}
				// console.log(listPro);																
				listPro.forEach(function(doc,index){
					var applicationListProduct = new ListProduct.model();
					var updaterListProduct = applicationListProduct.getUpdateHandler(req);
					updaterListProduct.process(doc, {
						flashErrors: true
					}, function (err2) {						
						if (err2) {
							locals.validationErrors = err2.errors;							
						} else {														
							locals.enquirySubmitted = true;	
							next();						
						}												
					});					
				});
				
			}			
		});
	});

	view.render('sale/addWholeSale', {
		section: 'addWholesale',
	});
}