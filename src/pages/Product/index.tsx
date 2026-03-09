import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import {
	Badge,
	Button,
	Card,
	Col,
	DatePicker,
	Descriptions,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tabs,
	Tag,
} from 'antd';

type Product = {
	id: number;
	name: string;
	category: string;
	price: number;
	quantity: number;
};

type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

type OrderItem = {
	productId: number;
	productName: string;
	price: number;
	quantity: number;
};

type Order = {
	id: string;
	customerName: string;
	phone: string;
	address: string;
	products: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	createdAt: string;
	stockUpdated: boolean;
};

type ProductFormValues = Omit<Product, 'id'>;

const PRODUCT_STORAGE_KEY = 'bt2_products';
const ORDER_STORAGE_KEY = 'bt2_orders';

const initialProducts: Product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
	{ id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
	{ id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
	{ id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
	{ id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
	{ id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
	{ id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const initialOrders: Order[] = [
	{
		id: 'DH001',
		customerName: 'Nguyễn Văn A',
		phone: '0912345678',
		address: '123 Nguyễn Huệ, Q1, TP.HCM',
		products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
		totalAmount: 25000000,
		status: 'Chờ xử lý',
		createdAt: '2024-01-15',
		stockUpdated: false,
	},
];

const loadLocalData = <T,>(key: string, defaultValue: T): T => {
	if (typeof window === 'undefined') {
		return defaultValue;
	}

	try {
		const rawData = localStorage.getItem(key);
		return rawData ? (JSON.parse(rawData) as T) : defaultValue;
	} catch {
		return defaultValue;
	}
};

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const getProductStatus = (quantity: number) => {
	if (quantity === 0) {
		return { text: 'Hết hàng', color: 'red' };
	}
	if (quantity <= 10) {
		return { text: 'Sắp hết', color: 'orange' };
	}
	return { text: 'Còn hàng', color: 'green' };
};

const orderStatusOptions: OrderStatus[] = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

const ProductPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>(() =>
		loadLocalData<Product[]>(PRODUCT_STORAGE_KEY, initialProducts),
	);
	const [orders, setOrders] = useState<Order[]>(() => loadLocalData<Order[]>(ORDER_STORAGE_KEY, initialOrders));
	const [activeTab, setActiveTab] = useState('products');

	const [productVisible, setProductVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [productForm] = Form.useForm<ProductFormValues>();

	const [orderVisible, setOrderVisible] = useState(false);
	const [detailOrder, setDetailOrder] = useState<Order | null>(null);
	const [orderForm] = Form.useForm();
	const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
	const [orderQuantities, setOrderQuantities] = useState<Record<number, number>>({});

	const [productKeyword, setProductKeyword] = useState('');
	const [productCategory, setProductCategory] = useState<string | undefined>(undefined);
	const [productStatus, setProductStatus] = useState<string | undefined>(undefined);
	const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

	const [orderKeyword, setOrderKeyword] = useState('');
	const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | undefined>(undefined);
	const [orderDateRange, setOrderDateRange] = useState<[string, string] | null>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
		}
	}, [products]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
		}
	}, [orders]);

	const resetProductModal = useCallback(() => {
		setProductVisible(false);
		setEditingProduct(null);
		productForm.resetFields();
	}, [productForm]);

	const resetOrderModal = useCallback(() => {
		setOrderVisible(false);
		orderForm.resetFields();
		setSelectedProductIds([]);
		setOrderQuantities({});
	}, [orderForm]);

	const categoryOptions = useMemo(
		() => Array.from(new Set(products.map((item) => item.category))).map((item) => ({ label: item, value: item })),
		[products],
	);

	const filteredProducts = useMemo(() => {
		const keyword = productKeyword.trim().toLowerCase();

		return products.filter((item) => {
			const productInventoryStatus = getProductStatus(item.quantity).text;
			const matchKeyword = !keyword || item.name.toLowerCase().includes(keyword);
			const matchCategory = !productCategory || item.category === productCategory;
			const matchStatus = !productStatus || productInventoryStatus === productStatus;
			const matchMinPrice = minPrice === undefined || item.price >= minPrice;
			const matchMaxPrice = maxPrice === undefined || item.price <= maxPrice;

			return matchKeyword && matchCategory && matchStatus && matchMinPrice && matchMaxPrice;
		});
	}, [products, productKeyword, productCategory, productStatus, minPrice, maxPrice]);

	const filteredOrders = useMemo(() => {
		const keyword = orderKeyword.trim().toLowerCase();

		return orders.filter((item) => {
			const matchKeyword =
				!keyword ||
				item.customerName.toLowerCase().includes(keyword) ||
				item.id.toLowerCase().includes(keyword);
			const matchStatus = !orderStatusFilter || item.status === orderStatusFilter;
			const matchDate =
				!orderDateRange ||
				moment(item.createdAt).isBetween(orderDateRange[0], orderDateRange[1], 'day', '[]');

			return matchKeyword && matchStatus && matchDate;
		});
	}, [orders, orderKeyword, orderStatusFilter, orderDateRange]);

	const currentOrderTotal = useMemo(
		() =>
			selectedProductIds.reduce((total, productId) => {
				const product = products.find((item) => item.id === productId);
				const quantity = orderQuantities[productId] || 0;
				if (!product) {
					return total;
				}
				return total + product.price * quantity;
			}, 0),
		[selectedProductIds, orderQuantities, products],
	);

	const dashboardData = useMemo(() => {
		const totalProducts = products.length;
		const totalStockValue = products.reduce((total, item) => total + item.price * item.quantity, 0);
		const totalOrders = orders.length;
		const completedRevenue = orders
			.filter((item) => item.status === 'Hoàn thành')
			.reduce((total, item) => total + item.totalAmount, 0);

		return {
			totalProducts,
			totalStockValue,
			totalOrders,
			completedRevenue,
			waitingOrders: orders.filter((item) => item.status === 'Chờ xử lý').length,
			shippingOrders: orders.filter((item) => item.status === 'Đang giao').length,
			completedOrders: orders.filter((item) => item.status === 'Hoàn thành').length,
			canceledOrders: orders.filter((item) => item.status === 'Đã hủy').length,
		};
	}, [products, orders]);

	const openAddProductModal = () => {
		setEditingProduct(null);
		productForm.resetFields();
		setProductVisible(true);
	};

	const openEditProductModal = (record: Product) => {
		setEditingProduct(record);
		productForm.setFieldsValue(record);
		setProductVisible(true);
	};

	const handleSaveProduct = async () => {
		try {
			const values = await productForm.validateFields();

			if (editingProduct) {
				setProducts((prev) =>
					prev.map((item) => (item.id === editingProduct.id ? { ...editingProduct, ...values } : item)),
				);
				message.success('Cập nhật sản phẩm thành công');
			} else {
				const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;
				setProducts((prev) => [...prev, { id: nextId, ...values }]);
				message.success('Thêm sản phẩm thành công');
			}

			resetProductModal();
		} catch {
			message.error('Vui lòng kiểm tra lại thông tin sản phẩm');
		}
	};

	const handleDeleteProduct = (id: number) => {
		const usedInOrder = orders.some((order) => order.products.some((item) => item.productId === id));
		if (usedInOrder) {
			message.warning('Sản phẩm này đã tồn tại trong đơn hàng nên không thể xóa');
			return;
		}

		setProducts((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa sản phẩm thành công');
	};

	const handleChangeSelectedProducts = (values: number[]) => {
		setSelectedProductIds(values);
		setOrderQuantities((prev) => {
			const nextQuantities: Record<number, number> = {};
			values.forEach((id) => {
				nextQuantities[id] = prev[id] || 1;
			});
			return nextQuantities;
		});
	};

	const handleCreateOrder = async () => {
		try {
			const values = await orderForm.validateFields();

			if (!selectedProductIds.length) {
				message.error('Vui lòng chọn ít nhất một sản phẩm');
				return;
			}

			const items: OrderItem[] = [];

			for (let index = 0; index < selectedProductIds.length; index += 1) {
				const productId = selectedProductIds[index];
				const product = products.find((item) => item.id === productId);
				const quantity = orderQuantities[productId] || 0;

				if (!product || quantity <= 0) {
					message.error('Vui lòng nhập số lượng hợp lệ cho từng sản phẩm');
					return;
				}

				if (quantity > product.quantity) {
					message.error(`Số lượng đặt của ${product.name} vượt quá tồn kho`);
					return;
				}

				items.push({
					productId,
					productName: product.name,
					price: product.price,
					quantity,
				});
			}

			const nextOrderNumber = orders.length + 1;
			const newOrder: Order = {
				id: `DH${String(nextOrderNumber).padStart(3, '0')}`,
				customerName: values.customerName.trim(),
				phone: values.phone.trim(),
				address: values.address.trim(),
				products: items,
				totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
				status: 'Chờ xử lý',
				createdAt: moment().format('YYYY-MM-DD'),
				stockUpdated: false,
			};

			setOrders((prev) => [newOrder, ...prev]);
			message.success('Tạo đơn hàng thành công');
			resetOrderModal();
		} catch {
			message.error('Vui lòng kiểm tra lại thông tin đơn hàng');
		}
	};

	const handleUpdateOrderStatus = (record: Order, nextStatus: OrderStatus) => {
		if (record.status === nextStatus) {
			return;
		}

		let nextProducts = [...products];
		let stockUpdated = record.stockUpdated;

		if (record.status !== 'Hoàn thành' && nextStatus === 'Hoàn thành') {
			for (let index = 0; index < record.products.length; index += 1) {
				const orderItem = record.products[index];
				const product = nextProducts.find((item) => item.id === orderItem.productId);

				if (!product || product.quantity < orderItem.quantity) {
					message.error(`Không đủ tồn kho để hoàn thành đơn ${record.id}`);
					return;
				}
			}

			nextProducts = nextProducts.map((product) => {
				const orderItem = record.products.find((item) => item.productId === product.id);
				if (!orderItem) {
					return product;
				}
				return {
					...product,
					quantity: product.quantity - orderItem.quantity,
				};
			});
			stockUpdated = true;
		}

		if (record.status === 'Hoàn thành' && nextStatus !== 'Hoàn thành' && record.stockUpdated) {
			nextProducts = nextProducts.map((product) => {
				const orderItem = record.products.find((item) => item.productId === product.id);
				if (!orderItem) {
					return product;
				}
				return {
					...product,
					quantity: product.quantity + orderItem.quantity,
				};
			});
			stockUpdated = false;
		}

		setProducts(nextProducts);
		setOrders((prev) =>
			prev.map((item) =>
				item.id === record.id
					? {
							...item,
							status: nextStatus,
							stockUpdated,
					  }
					: item,
			),
		);
		message.success(`Đã cập nhật trạng thái đơn hàng ${record.id}`);
	};

	const productColumns = [
		{
			title: 'STT',
			key: 'index',
			width: 70,
			align: 'center' as const,
			render: (_: Product, __: Product, index: number) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			align: 'right' as const,
			sorter: (a: Product, b: Product) => a.price - b.price,
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Số lượng tồn kho',
			dataIndex: 'quantity',
			align: 'center' as const,
			sorter: (a: Product, b: Product) => a.quantity - b.quantity,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'quantity',
			align: 'center' as const,
			render: (value: number) => {
				const status = getProductStatus(value);
				return <Tag color={status.color}>{status.text}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: Product, record: Product) => (
				<Space>
					<Button type='link' onClick={() => openEditProductModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa sản phẩm này không?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => handleDeleteProduct(record.id)}
					>
						<Button danger type='link'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const orderColumns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'id',
		},
		{
			title: 'Tên khách hàng',
			dataIndex: 'customerName',
		},
		{
			title: 'Số sản phẩm',
			align: 'center' as const,
			render: (_: Order, record: Order) => record.products.length,
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			align: 'right' as const,
			sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Trạng thái',
			align: 'center' as const,
			render: (_: Order, record: Order) => (
				<Select<OrderStatus>
					value={record.status}
					style={{ width: 130 }}
					onChange={(value) => handleUpdateOrderStatus(record, value)}
				>
					{orderStatusOptions.map((item) => (
						<Select.Option key={item} value={item}>
							{item}
						</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			sorter: (a: Order, b: Order) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center' as const,
			render: (_: Order, record: Order) => (
				<Button type='link' onClick={() => setDetailOrder(record)}>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<div>
			<Card title='Quản lý đơn hàng và sản phẩm'>
				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<Tabs.TabPane tab='Quản lý sản phẩm' key='products'>
						<Space style={{ marginBottom: 16, width: '100%' }} wrap>
							<Input.Search
								placeholder='Tìm theo tên sản phẩm'
								allowClear
								style={{ width: 220 }}
								value={productKeyword}
								onChange={(e) => setProductKeyword(e.target.value)}
							/>
							<Select
								allowClear
								placeholder='Lọc theo danh mục'
								style={{ width: 180 }}
								value={productCategory}
								onChange={(value) => setProductCategory(value)}
								options={categoryOptions}
							/>
							<Select
								allowClear
								placeholder='Lọc theo trạng thái'
								style={{ width: 170 }}
								value={productStatus}
								onChange={(value) => setProductStatus(value)}
							>
								<Select.Option value='Còn hàng'>Còn hàng</Select.Option>
								<Select.Option value='Sắp hết'>Sắp hết</Select.Option>
								<Select.Option value='Hết hàng'>Hết hàng</Select.Option>
							</Select>
							<InputNumber
								placeholder='Giá từ'
								style={{ width: 140 }}
								min={0}
								value={minPrice}
								onChange={(value) => setMinPrice(value === null ? undefined : Number(value))}
							/>
							<InputNumber
								placeholder='Giá đến'
								style={{ width: 140 }}
								min={0}
								value={maxPrice}
								onChange={(value) => setMaxPrice(value === null ? undefined : Number(value))}
							/>
							<Button onClick={() => {
								setProductKeyword('');
								setProductCategory(undefined);
								setProductStatus(undefined);
								setMinPrice(undefined);
								setMaxPrice(undefined);
							}}>
								Xóa bộ lọc
							</Button>
							<Button type='primary' onClick={openAddProductModal}>
								Thêm sản phẩm
							</Button>
						</Space>

						<Table<Product>
							rowKey='id'
							columns={productColumns}
							dataSource={filteredProducts}
							pagination={{ pageSize: 5 }}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane tab='Quản lý đơn hàng' key='orders'>
						<Space style={{ marginBottom: 16, width: '100%' }} wrap>
							<Input.Search
								placeholder='Tìm theo tên khách hàng hoặc mã đơn'
								allowClear
								style={{ width: 280 }}
								value={orderKeyword}
								onChange={(e) => setOrderKeyword(e.target.value)}
							/>
							<Select
								allowClear
								placeholder='Lọc theo trạng thái'
								style={{ width: 170 }}
								value={orderStatusFilter}
								onChange={(value) => setOrderStatusFilter(value)}
							>
								{orderStatusOptions.map((item) => (
									<Select.Option key={item} value={item}>
										{item}
									</Select.Option>
								))}
							</Select>
							<DatePicker.RangePicker
								format='YYYY-MM-DD'
								onChange={(_, dateStrings) => {
									if (dateStrings[0] && dateStrings[1]) {
										setOrderDateRange([dateStrings[0], dateStrings[1]]);
									} else {
										setOrderDateRange(null);
									}
								}}
							/>
							<Button onClick={() => {
								setOrderKeyword('');
								setOrderStatusFilter(undefined);
								setOrderDateRange(null);
							}}>
								Xóa bộ lọc
							</Button>
							<Button type='primary' onClick={() => setOrderVisible(true)}>
								Tạo đơn hàng
							</Button>
						</Space>

						<Table<Order>
							rowKey='id'
							columns={orderColumns}
							dataSource={filteredOrders}
							pagination={{ pageSize: 5 }}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane tab='Thống kê tổng quan' key='dashboard'>
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={12} lg={6}>
								<Card>
									<Statistic title='Tổng số sản phẩm' value={dashboardData.totalProducts} />
								</Card>
							</Col>
							<Col xs={24} sm={12} lg={6}>
								<Card>
									<Statistic title='Tổng giá trị tồn kho' value={dashboardData.totalStockValue} formatter={(value) => formatCurrency(Number(value))} />
								</Card>
							</Col>
							<Col xs={24} sm={12} lg={6}>
								<Card>
									<Statistic title='Tổng số đơn hàng' value={dashboardData.totalOrders} />
								</Card>
							</Col>
							<Col xs={24} sm={12} lg={6}>
								<Card>
									<Statistic title='Doanh thu đơn hoàn thành' value={dashboardData.completedRevenue} formatter={(value) => formatCurrency(Number(value))} />
								</Card>
							</Col>
						</Row>

						<Card title='Số đơn hàng theo trạng thái' style={{ marginTop: 16 }}>
							<Space size='large' wrap>
								<Badge count={dashboardData.waitingOrders} title='Chờ xử lý' style={{ backgroundColor: '#faad14' }} />
								<Badge count={dashboardData.shippingOrders} title='Đang giao' style={{ backgroundColor: '#1890ff' }} />
								<Badge count={dashboardData.completedOrders} title='Hoàn thành' style={{ backgroundColor: '#52c41a' }} />
								<Badge count={dashboardData.canceledOrders} title='Đã hủy' style={{ backgroundColor: '#f5222d' }} />
							</Space>
						</Card>
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<Modal
				title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
				visible={productVisible}
				onCancel={resetProductModal}
				onOk={handleSaveProduct}
				okText='Lưu'
				cancelText='Hủy'
				destroyOnClose
			>
				<Form<ProductFormValues> layout='vertical' form={productForm} preserve={false}>
					<Form.Item
						label='Tên sản phẩm'
						name='name'
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Danh mục'
						name='category'
						rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Giá'
						name='price'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá sản phẩm' },
							{ type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0' },
						]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
					<Form.Item
						label='Số lượng tồn kho'
						name='quantity'
						rules={[
							{ required: true, message: 'Vui lòng nhập số lượng' },
							{ type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' },
						]}
					>
						<InputNumber style={{ width: '100%' }} min={0} precision={0} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Tạo đơn hàng mới'
				visible={orderVisible}
				onCancel={resetOrderModal}
				onOk={handleCreateOrder}
				okText='Lưu đơn hàng'
				cancelText='Hủy'
				width={720}
				destroyOnClose
			>
				<Form layout='vertical' form={orderForm} preserve={false}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label='Tên khách hàng'
								name='customerName'
								rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label='Số điện thoại'
								name='phone'
								rules={[
									{ required: true, message: 'Vui lòng nhập số điện thoại' },
									{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 số' },
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						label='Địa chỉ'
						name='address'
						rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Chọn sản phẩm'
						name='productIds'
						rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
					>
						<Select<number[]>
							mode='multiple'
							placeholder='Chọn một hoặc nhiều sản phẩm'
							onChange={handleChangeSelectedProducts}
						>
							{products.map((item) => (
								<Select.Option key={item.id} value={item.id}>
									{item.name} - tồn {item.quantity}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					{selectedProductIds.map((productId) => {
						const product = products.find((item) => item.id === productId);
						if (!product) {
							return null;
						}

						return (
							<Form.Item key={productId} label={`Số lượng đặt - ${product.name}`}>
								<InputNumber
									style={{ width: '100%' }}
									min={1}
									max={product.quantity}
									precision={0}
									value={orderQuantities[productId] || 1}
									onChange={(value) =>
										setOrderQuantities((prev) => ({
											...prev,
											[productId]: value ? Number(value) : 0,
										}))
									}
								/>
							</Form.Item>
						);
					})}

					<Card size='small'>
						<b>Tổng tiền tạm tính: {formatCurrency(currentOrderTotal)}</b>
					</Card>
				</Form>
			</Modal>

			<Modal
				title={`Chi tiết đơn hàng ${detailOrder?.id || ''}`}
				visible={!!detailOrder}
				onCancel={() => setDetailOrder(null)}
				footer={null}
				width={720}
			>
				{detailOrder && (
					<>
						<Descriptions column={1} bordered size='small'>
							<Descriptions.Item label='Tên khách hàng'>{detailOrder.customerName}</Descriptions.Item>
							<Descriptions.Item label='Số điện thoại'>{detailOrder.phone}</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ'>{detailOrder.address}</Descriptions.Item>
							<Descriptions.Item label='Trạng thái'>{detailOrder.status}</Descriptions.Item>
							<Descriptions.Item label='Ngày tạo'>
								{moment(detailOrder.createdAt).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Tổng tiền'>{formatCurrency(detailOrder.totalAmount)}</Descriptions.Item>
						</Descriptions>

						<Table<OrderItem>
							style={{ marginTop: 16 }}
							rowKey='productId'
							pagination={false}
							dataSource={detailOrder.products}
							columns={[
								{
									title: 'Tên sản phẩm',
									dataIndex: 'productName',
								},
								{
									title: 'Số lượng',
									dataIndex: 'quantity',
									align: 'center',
								},
								{
									title: 'Giá',
									dataIndex: 'price',
									align: 'right',
									render: (value: number) => formatCurrency(value),
								},
								{
									title: 'Thành tiền',
									align: 'right',
									render: (_: OrderItem, record: OrderItem) => formatCurrency(record.price * record.quantity),
								},
							]}
						/>
					</>
				)}
			</Modal>
		</div>
	);
};

export default ProductPage;
