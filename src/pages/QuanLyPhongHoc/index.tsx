import { type IPhongHoc } from '@/services/PhongHoc/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Form,
	InputNumber,
	Modal,
	Popconfirm,
	Space,
	Table,
	Tag,
	Typography,
	Input,
	Select,
	message,
	Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const nhanLoaiPhong: Record<IPhongHoc['loaiPhong'], { text: string; color: string }> = {
	LyThuyet: { text: 'Lý thuyết', color: 'blue' },
	ThucHanh: { text: 'Thực hành', color: 'purple' },
	HoiTruong: { text: 'Hội trường', color: 'green' },
};

type TFormPhongHoc = {
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: IPhongHoc['loaiPhong'];
	nguoiPhuTrachId: string;
};

const QuanLyPhongHocPage = () => {
	const {
		loading,
		danhSachGoc,
		danhSachHienThi,
		danhSachNguoiPhuTrach,
		tuKhoa,
		loaiPhongDangLoc,
		nguoiPhuTrachDangLoc,
		sapXepSoChoNgoi,
		taiDuLieu,
		datLaiDuLieu,
		capNhatTuKhoa,
		capNhatLoaiPhong,
		capNhatNguoiPhuTrach,
		capNhatSapXepSoChoNgoi,
		taoMoiPhongHoc,
		chinhSuaPhongHoc,
		xoaPhongHocTheoId,
	} = useModel('phonghoc');
	const [form] = Form.useForm<TFormPhongHoc>();
	const [moModal, setMoModal] = useState(false);
	const [banGhiDangSua, setBanGhiDangSua] = useState<IPhongHoc | null>(null);

	useEffect(() => {
		taiDuLieu();
	}, []);

	const moThemMoi = () => {
		setBanGhiDangSua(null);
		form.resetFields();
		form.setFieldsValue({
			soChoNgoi: 30,
			loaiPhong: 'LyThuyet',
			nguoiPhuTrachId: danhSachNguoiPhuTrach[0]?.id,
		});
		setMoModal(true);
	};

	const moChinhSua = (record: IPhongHoc) => {
		setBanGhiDangSua(record);
		form.setFieldsValue({
			maPhong: record.maPhong,
			tenPhong: record.tenPhong,
			soChoNgoi: record.soChoNgoi,
			loaiPhong: record.loaiPhong,
			nguoiPhuTrachId: record.nguoiPhuTrachId,
		});
		setMoModal(true);
	};

	const kiemTraTrung = (field: 'maPhong' | 'tenPhong', value?: string) => {
		const duLieu = (value || '').trim().toLowerCase();
		if (!duLieu) return false;
		return danhSachGoc.some(
			(item) =>
				item.id !== banGhiDangSua?.id &&
				(field === 'maPhong' ? item.maPhong.toLowerCase() : item.tenPhong.toLowerCase()) === duLieu,
		);
	};

	const luuPhongHoc = async () => {
		try {
			const values = await form.validateFields();
			if (banGhiDangSua) {
				await chinhSuaPhongHoc(banGhiDangSua.id, values);
				message.success('Đã cập nhật phòng học');
			} else {
				await taoMoiPhongHoc(values);
				message.success('Đã thêm phòng học mới');
			}
			setMoModal(false);
		} catch {



		}
	};

	const xuLyXoa = async (record: IPhongHoc) => {
		if (record.soChoNgoi >= 30) return;
		await xoaPhongHocTheoId(record.id);
		message.success('Đã xóa phòng học');
	};

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card
				title={
					<Space direction='vertical' size={0}>
						<Title level={4} style={{ margin: 0 }}>
							Quản lý phòng học
						</Title>
					</Space>
				}
				extra={
					<Space>
						<Button icon={<ReloadOutlined />} loading={loading} onClick={taiDuLieu}>
							Tải lại
						</Button>
						<Button type='primary' icon={<PlusOutlined />} onClick={moThemMoi}>
							Thêm phòng
						</Button>
						<Button danger loading={loading} onClick={datLaiDuLieu}>
							Reset dữ liệu mẫu
						</Button>
					</Space>
				}
			>
				<Space wrap size={12} style={{ marginBottom: 16 }}>
					<Input
						allowClear
						placeholder='Tìm theo mã phòng hoặc tên phòng'
						value={tuKhoa}
						onChange={(e) => capNhatTuKhoa(e.target.value)}
						style={{ width: 280 }}
					/>
					<Select
						allowClear
						placeholder='Lọc loại phòng'
						value={loaiPhongDangLoc}
						onChange={capNhatLoaiPhong}
						style={{ width: 180 }}
						options={[
							{ value: 'LyThuyet', label: 'Lý thuyết' },
							{ value: 'ThucHanh', label: 'Thực hành' },
							{ value: 'HoiTruong', label: 'Hội trường' },
						]}
					/>
					<Select
						allowClear
						placeholder='Lọc người phụ trách'
						value={nguoiPhuTrachDangLoc}
						onChange={capNhatNguoiPhuTrach}
						style={{ width: 220 }}
						options={danhSachNguoiPhuTrach.map((item) => ({
							value: item.id,
							label: item.ten,
						}))}
					/>
					<Select
						allowClear
						placeholder='Sắp xếp số chỗ ngồi'
						value={sapXepSoChoNgoi}
						onChange={capNhatSapXepSoChoNgoi}
						style={{ width: 200 }}
						options={[
							{ value: 'tang', label: 'Số chỗ ngồi: tăng dần' },
							{ value: 'giam', label: 'Số chỗ ngồi: giảm dần' },
						]}
					/>
				</Space>

				<Table<IPhongHoc>
					rowKey='id'
					loading={loading}
					dataSource={danhSachHienThi}
					pagination={{ pageSize: 8, showSizeChanger: true }}
					columns={[
						{
							title: 'Mã phòng',
							dataIndex: 'maPhong',
							width: 110,
						},
						{
							title: 'Tên phòng',
							dataIndex: 'tenPhong',
							ellipsis: true,
						},
						{
							title: 'Số chỗ',
							dataIndex: 'soChoNgoi',
							width: 90,
							align: 'center',
						},
						{
							title: 'Loại phòng',
							dataIndex: 'loaiPhong',
							width: 120,
							render: (v: IPhongHoc['loaiPhong']) => {
								const meta = nhanLoaiPhong[v];
								return <Tag color={meta.color}>{meta.text}</Tag>;
							},
						},
						{
							title: 'Người phụ trách',
							dataIndex: 'nguoiPhuTrachTen',
							width: 170,
							ellipsis: true,
						},
						{
							title: 'Thao tác',
							key: 'thaoTac',
							width: 130,
							fixed: 'right',
							render: (_: unknown, record: IPhongHoc) => (
								<Space size={0}>
									<Button type='link' icon={<EditOutlined />} onClick={() => moChinhSua(record)}>
										Sửa
									</Button>
									{record.soChoNgoi < 30 ? (
										<Popconfirm
											title='Bạn có chắc muốn xóa phòng này?'
											okText='Xóa'
											cancelText='Hủy'
											onConfirm={() => xuLyXoa(record)}
										>
											<Button type='link' danger icon={<DeleteOutlined />}>
												Xóa
											</Button>
										</Popconfirm>
									) : (
										<Tooltip title='Chỉ được xóa phòng dưới 30 chỗ ngồi'>
											<Button type='link' danger disabled icon={<DeleteOutlined />}>
												Xóa
											</Button>
										</Tooltip>
									)}
								</Space>
							),
						},
					]}
				/>
				<Modal
					title={banGhiDangSua ? 'Chỉnh sửa phòng học' : 'Thêm phòng học'}
					visible={moModal}
					onOk={luuPhongHoc}
					onCancel={() => setMoModal(false)}
					okText='Lưu'
					cancelText='Hủy'
					destroyOnClose
				>
					<Form<TFormPhongHoc> layout='vertical' form={form} preserve={false}>
						<Form.Item
							name='maPhong'
							label='Mã phòng'
							rules={[
								{ required: true, message: 'Vui lòng nhập mã phòng' },
								{ max: 10, message: 'Mã phòng tối đa 10 ký tự' },
								{
									validator: async (_, value) => {
										if (kiemTraTrung('maPhong', value)) {
											throw new Error('Mã phòng đã tồn tại');
										}
									},
								},
							]}
						>
							<Input placeholder='Ví dụ: A1' />
						</Form.Item>
						<Form.Item
							name='tenPhong'
							label='Tên phòng'
							rules={[
								{ required: true, message: 'Vui lòng nhập tên phòng' },
								{ max: 50, message: 'Tên phòng tối đa 50 ký tự' },
								{
									validator: async (_, value) => {
										if (kiemTraTrung('tenPhong', value)) {
											throw new Error('Tên phòng đã tồn tại');
										}
									},
								},
							]}
						>
							<Input placeholder='Ví dụ: Phòng thực hành B3' />
						</Form.Item>
						<Form.Item
							name='nguoiPhuTrachId'
							label='Người phụ trách'
							rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
						>
							<Select
								placeholder='Chọn người phụ trách'
								options={danhSachNguoiPhuTrach.map((item) => ({
									value: item.id,
									label: item.ten,
								}))}
							/>
						</Form.Item>
						<Form.Item
							name='soChoNgoi'
							label='Số chỗ ngồi'
							rules={[
								{ required: true, message: 'Vui lòng nhập số chỗ ngồi' },
								{
									type: 'number',
									min: 10,
									max: 200,
									message: 'Số chỗ ngồi phải từ 10 đến 200',
								},
							]}
						>
							<InputNumber min={10} max={200} style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item
							name='loaiPhong'
							label='Loại phòng'
							rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
						>
							<Select
								placeholder='Chọn loại phòng'
								options={[
									{ value: 'LyThuyet', label: 'Lý thuyết' },
									{ value: 'ThucHanh', label: 'Thực hành' },
									{ value: 'HoiTruong', label: 'Hội trường' },
								]}
							/>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</Space>
	);
};

export default QuanLyPhongHocPage;

