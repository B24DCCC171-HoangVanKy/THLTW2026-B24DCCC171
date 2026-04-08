import { type IDiemDen } from '@/services/KeHoachDuLich/typing';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Rate,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import {
	useEffect,
	useState,
} from 'react';
import { useModel } from 'umi';

const { Paragraph, Text } = Typography;

const TUY_CHON_LOAI_HINH: { label: string; value: IDiemDen['loaiHinh'] }[] = [
	{ label: 'Biển', value: 'Biển' },
	{ label: 'Núi', value: 'Núi' },
	{ label: 'Thành phố', value: 'Thành phố' },
	{ label: 'Văn hóa', value: 'Văn hóa' },
];

const ANH_MAC_DINH =
	'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=80';

const AdminPage = () => {
	const {
		loading,
		danhSachGoc,
		taiDanhSachDiemDen,
		quanTriThemDiemDen,
		quanTriSuaDiemDen,
		quanTriXoaDiemDen,
		datLaiQuanTriVeMacDinh,
	} = useModel('kehoachdulich');
	const [form] = Form.useForm<IDiemDen>();
	const [moModal, setMoModal] = useState(false);
	const [banGhiDangSua, setBanGhiDangSua] = useState<IDiemDen | null>(null);

	const dinhDangTien = (value?: string | number) => {
		if (value === undefined || value === null || value === '') return '';
		return Number(value).toLocaleString('vi-VN');
	};
	const boDauCham = (value?: string) => (value ? Number(value.split('.').join('')) : 0);

	useEffect(() => {
		taiDanhSachDiemDen();
	}, []);

	const moThemMoi = () => {
		setBanGhiDangSua(null);
		form.resetFields();
		form.setFieldsValue({
			rating: 4.5,
			loaiHinh: 'Thành phố',
			giaUocTinh: 10_000_000,
			hinhAnh: ANH_MAC_DINH,
		});
		setMoModal(true);
	};

	const moChinhSua = (record: IDiemDen) => {
		setBanGhiDangSua(record);
		form.setFieldsValue(record);
		setMoModal(true);
	};

	const xuLyLuu = async () => {
		try {
			const giaTri = await form.validateFields();
			const payload: Partial<IDiemDen> = { ...giaTri };
			delete payload.id;
			if (banGhiDangSua) {
				quanTriSuaDiemDen(banGhiDangSua.id, payload);
				message.success('Đã cập nhật điểm đến.');
			} else {
				quanTriThemDiemDen(payload as Omit<IDiemDen, 'id'>);
				message.success('Đã thêm điểm đến mới.');
			}
			setMoModal(false);
		} catch {
			/* validateFields */
		}
	};

	const xuLyXoa = (record: IDiemDen) => {
		quanTriXoaDiemDen(record.id);
		message.success('Đã xóa điểm đến.');
	};

	const xuLyKhoiPhucMacDinh = async () => {
		await datLaiQuanTriVeMacDinh();
		message.success('Đã xóa chỉnh sửa cục bộ và tải lại danh sách từ API.');
	};

	const columns = [
		{
			title: 'Ảnh',
			dataIndex: 'hinhAnh',
			width: 72,
			render: (url: string) => (
				<Avatar shape='square' size={48} src={url || ANH_MAC_DINH} style={{ objectFit: 'cover' }} />
			),
		},
		{ title: 'Tên điểm đến', dataIndex: 'ten', width: 160, ellipsis: true },
		{ title: 'Địa điểm', dataIndex: 'diaDiem', width: 120, ellipsis: true },
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			width: 110,
			render: (v: IDiemDen['loaiHinh']) => <Tag color='blue'>{v}</Tag>,
		},
		{
			title: 'Giá ước tính',
			dataIndex: 'giaUocTinh',
			width: 130,
			render: (n: number) => <Text>{Number(n).toLocaleString('vi-VN')} đ</Text>,
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			width: 160,
			render: (n: number) => <Rate disabled allowHalf value={n} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right' as const,
			width: 120,
			render: (_: unknown, record: IDiemDen) => (
				<Space size={0}>
					<Button type='link' icon={<EditOutlined />} onClick={() => moChinhSua(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa điểm đến này?' okText='Xóa' cancelText='Hủy' onConfirm={() => xuLyXoa(record)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title='Admin'
			extra={
				<Space wrap>
					<Popconfirm
						title='Xóa toàn bộ chỉnh sửa cục bộ và tải lại dữ liệu gốc?'
						okText='Khôi phục'
						cancelText='Hủy'
						onConfirm={xuLyKhoiPhucMacDinh}
					>
						<Button icon={<RollbackOutlined />} loading={loading}>
							Khôi phục gốc
						</Button>
					</Popconfirm>
					<Button type='primary' icon={<PlusOutlined />} onClick={moThemMoi}>
						Thêm điểm đến
					</Button>
				</Space>
			}
		>
			<Paragraph type='secondary' style={{ marginBottom: 16 }}>
				Thêm, sửa hoặc ẩn điểm đến. Thay đổi được lưu trên trình duyệt (localStorage) và áp dụng cho Khám phá, Lịch
				trình và Ngân sách.
			</Paragraph>
			<Spin spinning={loading}>
				<Table<IDiemDen>
					rowKey='id'
					columns={columns}
					dataSource={danhSachGoc}
					pagination={{ pageSize: 8, showSizeChanger: true }}
					scroll={{ x: 960 }}
				/>
			</Spin>
			<Modal
				title={banGhiDangSua ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
				visible={moModal}
				onOk={xuLyLuu}
				onCancel={() => setMoModal(false)}
				width={560}
				okText='Lưu'
				cancelText='Hủy'
				destroyOnClose
			>
				<Form form={form} layout='vertical' preserve={false}>
					<Form.Item name='ten' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên' }]}>
						<Input placeholder='Ví dụ: Hội An' />
					</Form.Item>
					<Form.Item name='diaDiem' label='Địa điểm / quốc gia' rules={[{ required: true, message: 'Nhập địa điểm' }]}>
						<Input placeholder='Ví dụ: Việt Nam' />
					</Form.Item>
					<Form.Item name='loaiHinh' label='Loại hình' rules={[{ required: true }]}>
						<Select options={TUY_CHON_LOAI_HINH} placeholder='Chọn loại hình' />
					</Form.Item>
					<Form.Item name='giaUocTinh' label='Giá ước tính (VNĐ)' rules={[{ required: true, message: 'Nhập giá' }]}>
						<InputNumber
							min={0}
							step={100_000}
							style={{ width: '100%' }}
							formatter={dinhDangTien}
							parser={boDauCham}
							addonAfter='đ'
						/>
					</Form.Item>
					<Form.Item name='rating' label='Đánh giá' rules={[{ required: true }]}>
						<Rate allowHalf />
					</Form.Item>
					<Form.Item name='hinhAnh' label='URL ảnh' rules={[{ required: true, message: 'Nhập URL ảnh' }]}>
						<Input placeholder='https://...' />
					</Form.Item>
					<Form.Item name='moTaNgan' label='Mô tả ngắn' rules={[{ required: true, message: 'Nhập mô tả' }]}>
						<Input.TextArea rows={3} placeholder='Giới thiệu ngắn về điểm đến' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AdminPage;
