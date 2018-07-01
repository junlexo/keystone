exports.menu = [
	{
		'name' : 'Sản phẩm',
		'drop' : [
			{
				'title': 'Thêm Sản phẩm',
				'route': 'addProduct'
			},
			{
				'title': 'Danh sách Sản phẩm',
				'route': 'listProduct'
			},
			{
				'title': 'Phân nhóm Sản phẩm',
				'route': 'groupProduct'
			}
		],
		'title': 'product'
	},
	{
		'name' : 'Khách Hàng',
		'drop' :[
			{
				'title': 'Thêm Khách Hàng',
				'route': 'addClient'
			},
			{
				'title': 'Danh sách Khách Hàng',
				'route': 'listClient'
			},
			{
				'title': 'Phân nhóm Khách Hàng',
				'route': 'groupClient'
			}
		],
		'title': 'client'
	},
	{
		'name' : 'Thông tin Kho hàng',
		'drop' : [ ],
		'title': 'warehouse'
	},
];