import { datLaiDuLieuPhongHocMacDinh, layDanhSachPhongHoc } from '@/services/PhongHoc';
import { type IPhongHoc } from '@/services/PhongHoc/typing';
import {
	Button,
	Card,
	Space,
	Table,
	Tag,
	Typography,
} from 'antd';
import {
	ReloadOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const nhanLoaiPhong: Record<IPhongHoc['loaiPhong'], { text: string; color: string }> = {
	LyThuyet: { text: 'Lý thuyết', color: 'blue' },
	ThucHanh: { text: 'Thực hành', color: 'purple' },
	HoiTruong: { text: 'Hội trường', color: 'green' },
};

const QuanLyPhongHocPage = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<IPhongHoc[]>([]);

	const taiDuLieu = async () => {
		setLoading(true);
		try {
			const ds = await layDanhSachPhongHoc();
			setData(ds);
		} finally {
			setLoading(false);
		}
	};

	const datLai = async () => {
		setLoading(true);
		try {
			const ds = await datLaiDuLieuPhongHocMacDinh();
			setData(ds);
		} finally {
			setLoading(false);
		}
	};

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
						<Button danger loading={loading} onClick={datLai}>
							Reset dữ liệu mẫu
						</Button>
					</Space>
				}
			>
				<Table<IPhongHoc>
					rowKey='id'
					loading={loading}
					dataSource={data}
					pagination={{ pageSize: 8, showSizeChanger: true }}
					columns={[
						{ title: 'Mã phòng', dataIndex: 'maPhong', width: 110 },
						{ title: 'Tên phòng', dataIndex: 'tenPhong', ellipsis: true },
						{
							title: 'Số chỗ',
							dataIndex: 'soChoNgoi',
							width: 90,
							sorter: (a, b) => a.soChoNgoi - b.soChoNgoi,
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
						{ title: 'Người phụ trách', dataIndex: 'nguoiPhuTrachTen', width: 170, ellipsis: true },
					]}
				/>
			</Card>
		</Space>
	);
};

export default QuanLyPhongHocPage;

