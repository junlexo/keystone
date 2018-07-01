const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

keystone.pre('routes', function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Trang Chủ',        key: 'home',        href: '/' },
	    { label: 'Danh Mục',        key: 'menu',       pages: [
	        { label: 'Hàng hóa',      subkey: 'Product', subpages :[
	        	{ label: 'Thêm Hàng hóa',      subkey: 'addProduct', href: "/Product/create" },
	        	{ label: 'Danh sách Hàng hóa',      subkey: 'Product', href: "/Product" },
	        	{ label: 'Phân nhóm Hàng hóa',      subkey: 'groupProduct', href: "/groupProduct" },
	        ] },
	        { label: 'Khách hàng',     subkey: 'Customer',      subpages: [
	        	{ label: 'Thêm Khách hàng',      subkey: 'addCustomer', href: "/Customer/create" },
	        	{ label: 'Danh sách Khách hàng',      subkey: 'Customer', href: "/Customer" },
	        	{ label: 'Phân nhóm Khách hàng',      subkey: 'groupCustomer', href: "/groupCustomer" },
	        ] },
	        { label: 'Thông tin kho hàng',     subkey: 'infoStorage',      href: "/infoStorage"    }
	        ] },
	    { label: 'Quản lý bán hàng',        key: 'mSellProduct',       pages: [
	        { label: 'Bán sỉ',      subkey: 'Wholesale', subpages :[
	        	{ label: 'Tạo hóa đơn bán sỉ',      subkey: 'addWholesale', href: "/Wholesale/create" },
	        	{ label: 'Danh sách hóa đơn bán sỉ ',      subkey: 'Wholesale', href: "/Wholesale" },
	        	{ label: 'Bảng giá bán sỉ',      subkey: 'PriceWholesale', href: "/Wholesale/price" },
	        ] },
	        { label: 'Bán lẻ',     subkey: 'Retail',      subpages: [
	        	{ label: 'Tạo hóa đơn bán lẻ',      subkey: 'addRetail', href: "/addRetail" },
	        	{ label: 'Danh sách hóa đơn bán lẻ',      subkey: 'Retail', href: "/Retail" },
	        	{ label: 'Bảng giá bán lẻ',      subkey: 'PriceRetail', href: "/Retail/price" },
	        ] },
	        { label: 'Phiếu trả hàng',     subkey: 'Return',  subpages: [
	        	{ label: 'Phiếu nhập hàng bán trả lại',      subkey: 'addReturn', href: "/addReturn" },
	        	{ label: 'Danh sách phiếu trả hàng',      subkey: 'Return', href: "/Return" }
	        ]},
	        { label: 'Thống kê bán hàng',     subkey: 'Statistic',  subpages: [
	        	{ label: 'Thống kê bán hàng',      subkey: 'buyStatistic', href: "/buyStatistic" },
	        	{ label: 'Thống kê chi tiết bán hàng',      subkey: 'detailStatistic', href: "/detailStatistic" }
	        ]}
	    ]},
	    { label: 'Quản lý kho',        key: 'mStorage',       pages: [
	        { label: 'Lập phiếu nhập kho',      subkey: 'addOrder', href: "/addOrder" },
	        { label: 'Danh sách phiếu nhập kho',      subkey: 'Order', href: "/Order" },	       
	        { label: 'Thống kê kho',     subkey: 'statisticStorage',  subpages: [
	        	{ label: 'Thống kê tồn kho',      subkey: 'statisticMoreStorage', href: "/statisticMoreStorage" },
	        	{ label: 'Thống kê chi tiết tồn kho',      subkey: 'detailMoreStorage', href: "/detailMoreStorage" }
	        ]}
	    ]},
		// { label: 'Blog', key: 'blog', href: '/blog' },
		// { label: 'Gallery', key: 'gallery', href: '/gallery' },
		// { label: 'Contact', key: 'contact', href: '/contact' },
		// { label: 'Customer', key: 'customer', href: '/customer' },
	];
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.menu);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
    middleware.theme(req, res, next);
    keystone.pre('render', middleware.menu);
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	download: importRoutes('./download'),
	views: importRoutes('./views'),
};

exports = module.exports = function (app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.all('/Product', routes.views.Product);
	app.all('/Product/create', routes.views.addProduct);
	app.all('/Product/:product?', routes.views.editProduct);
	app.all('/groupProduct', routes.views.groupProduct);  
	app.all('/Customer', routes.views.Customer);
	app.all('/Customer/create', routes.views.addCustomer);
	app.all('/Customer/:customer?', routes.views.editCustomer);
	app.all('/groupCustomer', routes.views.groupCustomer);
	app.all('/Wholesale/price', routes.views.priceWhole);
	app.all('/Wholesale/create', routes.views.addWholesale);
	app.all('/Wholesale', routes.views.Wholesale);
	app.all('/Retail/price', routes.views.priceRetail);
	// app.all('/Wholesale/create', routes.views.addWholesale);
	// // Downloads
	app.get('/download/users', routes.download.users);

}
