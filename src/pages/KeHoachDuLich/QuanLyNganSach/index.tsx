import {
	Alert,
	Card,
	Col,
	InputNumber,
	Progress,
	Row,
	Space,
	Statistic,
	Typography,
} from 'antd';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const QuanLyNganSachPage = () => {
	const { chiPhi, nganSachMucTieu, setNganSachMucTieu, vuotNganSach, tongDiaDiemDaChon } = useModel('kehoachdulich');

	const tile = [
		{ key: 'anUong', label: 'Ăn uống', value: chiPhi.anUong, color: '#13c2c2' },
		{ key: 'diChuyen', label: 'Di chuyển', value: chiPhi.diChuyen, color: '#722ed1' },
		{ key: 'luuTru', label: 'Lưu trú', value: chiPhi.luuTru, color: '#fa8c16' },
		{ key: 'thamQuan', label: 'Tham quan', value: chiPhi.thamQuan, color: '#52c41a' },
	];

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} md={10}>
						<Title level={4} style={{ marginBottom: 8 }}>
							Quản lý ngân sách
						</Title>
						<Text type='secondary'>Theo dõi chi phí theo từng hạng mục từ lịch trình đã tạo.</Text>
					</Col>
					<Col xs={24} md={14}>
						<Space wrap>
							<Text strong>Ngân sách mục tiêu:</Text>
							<InputNumber
								min={1000000}
								step={500000}
								value={nganSachMucTieu}
								onChange={(v) => setNganSachMucTieu(Number(v || 1000000))}
								formatter={(value) => Number(value || 0).toLocaleString('vi-VN')}
								parser={(value) => Number((value || '').split('.').join(''))}
								addonAfter='VNĐ'
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			{vuotNganSach ? (
				<Alert
					type='error'
					showIcon
					message='Cảnh báo vượt ngân sách'
					description={`Bạn đã vượt ${Math.max(0, chiPhi.tong - nganSachMucTieu).toLocaleString('vi-VN')} VNĐ.`}
				/>
			) : (
				<Alert
					type='success'
					showIcon
					message='Ngân sách an toàn'
					description={`Còn lại ${Math.max(0, nganSachMucTieu - chiPhi.tong).toLocaleString('vi-VN')} VNĐ.`}
				/>
			)}

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Tổng chi phí dự kiến' value={chiPhi.tong} formatter={(v) => `${Number(v).toLocaleString('vi-VN')} VNĐ`} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Ngân sách mục tiêu' value={nganSachMucTieu} formatter={(v) => `${Number(v).toLocaleString('vi-VN')} VNĐ`} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Số điểm đến đã chọn' value={tongDiaDiemDaChon} />
					</Card>
				</Col>
			</Row>

			<Card title='Phân bổ chi phí theo hạng mục'>
				<Space direction='vertical' size={12} style={{ width: '100%' }}>
					{tile.map((t) => (
						<div key={t.key}>
							<Row justify='space-between'>
								<Col>
									<Text strong>{t.label}</Text>
								</Col>
								<Col>
									<Text>{t.value.toLocaleString('vi-VN')} VNĐ</Text>
								</Col>
							</Row>
							<Progress
								percent={chiPhi.tong ? Math.round((t.value / chiPhi.tong) * 100) : 0}
								strokeColor={t.color}
								showInfo
							/>
						</div>
					))}
				</Space>
			</Card>
		</Space>
	);
};

export default QuanLyNganSachPage;
