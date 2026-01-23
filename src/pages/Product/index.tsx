import { useMemo, useState } from 'react';
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Space,
	Table,
} from 'antd';

type Product = {
	id: number;
	name: string;
	price: number;
	quantity: number;
};

const initialProducts: Product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
	{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
	{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
	{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const ProductPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [searchValue, setSearchValue] = useState<string>('');
	const [visible, setVisible] = useState<boolean>(false);
	const [form] = Form.useForm<Product>();

	const filteredProducts = useMemo(() => {
		const keyword = searchValue.trim().toLowerCase();
		if (!keyword) return products;
		return products.filter((item) => item.name.toLowerCase().includes(keyword));
	}, [products, searchValue]);

	const handleAddProduct = async () => {
		try {
			const values = await form.validateFields();
			const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
			setProducts([...products, { ...values, id: nextId }]);
			message.success('Thêm sản phẩm thành công');
			setVisible(false);
			form.resetFields();
		} catch (error) {
			// Validation errors are handled by Ant Design Form
		}
	};

	const handleDeleteProduct = (id: number) => {
		setProducts((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa sản phẩm thành công');
	};

	const columns = [
		{
			title: 'STT',
			key: 'index',
			align: 'center' as const,
			width: 80,
			render: (_: Product, __: Product, index: number) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'right' as const,
			render: (value: number) => value.toLocaleString('vi-VN'),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: Product, record: Product) => (
				<Popconfirm
					title='Bạn có chắc muốn xóa sản phẩm này?'
					okText='Xóa'
					cancelText='Hủy'
					onConfirm={() => handleDeleteProduct(record.id)}
				>
					<Button danger size='small'>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
				<Input.Search
					placeholder='Tìm kiếm sản phẩm theo tên'
					allowClear
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					style={{ maxWidth: 360 }}
				/>
				<Button type='primary' onClick={() => setVisible(true)}>
					Thêm sản phẩm
				</Button>
			</Space>

			<Table<Product> rowKey='id' columns={columns} dataSource={filteredProducts} pagination={false} />

			<Modal
				title='Thêm sản phẩm mới'
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={handleAddProduct}
				okText='Lưu'
				cancelText='Hủy'
				destroyOnClose
			>
				<Form<Product> layout='vertical' form={form} preserve={false}>
					<Form.Item
						label='Tên sản phẩm'
						name='name'
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
					>
						<Input placeholder='Nhập tên sản phẩm' />
					</Form.Item>

					<Form.Item
						label='Giá'
						name='price'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá' },
							{
								type: 'number',
								min: 1,
								message: 'Giá phải là số dương',
							},
						]}
					>
						<InputNumber style={{ width: '100%' }} min={1} placeholder='Nhập giá sản phẩm' />
					</Form.Item>

					<Form.Item
						label='Số lượng'
						name='quantity'
						rules={[
							{ required: true, message: 'Vui lòng nhập số lượng' },
							{
								type: 'number',
								min: 1,
								transform: (value) => (value === undefined ? value : Number(value)),
								message: 'Số lượng phải là số nguyên dương',
							},
						]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={1}
							precision={0}
							step={1}
							placeholder='Nhập số lượng'
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ProductPage;
