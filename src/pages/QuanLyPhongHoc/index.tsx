import { type IPhongHoc } from '@/services/PhongHoc/typing';
import { ReloadOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Space,
	Table,
	Tag,
	Typography,
	Input,
	Select,
} from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const nhanLoaiPhong: Record<IPhongHoc['loaiPhong'], { text: string; color: string }> = {
	LyThuyet: { text: 'Lý thuyết', color: 'blue' },
	ThucHanh: { text: 'Thực hành', color: 'purple' },
	HoiTruong: { text: 'Hội trường', color: 'green' },
};

const QuanLyPhongHocPage = () => {
	const {
		loading,
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
	} = useModel('phonghoc');

	useEffect(() => {
		taiDuLieu();
	}, []);

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
					]}
				/>
			</Card>
		</Space>
	);
};

export default QuanLyPhongHocPage;

