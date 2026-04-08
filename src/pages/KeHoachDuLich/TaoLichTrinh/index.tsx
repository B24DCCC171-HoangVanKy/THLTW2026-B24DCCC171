import { type IDiemDen } from '@/services/KeHoachDuLich/typing';
import {
	Button,
	Card,
	Col,
	Divider,
	Input,
	InputNumber,
	Pagination,
	Row,
	Select,
	Space,
	Tag,
	Typography,
} from 'antd';
import {
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const TaoLichTrinhPage = () => {
	const {
		danhSachGoc,
		soNgay,
		lichTrinh,
		taiDanhSachDiemDen,
		datSoNgay,
		themDiaDiemVaoNgay,
		xoaDiaDiemKhoiNgay,
		sapXepDiaDiemTrongNgay,
		tongDiaDiemDaChon,
		uocTinhTongThoiGianDiChuyenGio,
	} = useModel('kehoachdulich');
	const [ngayDangChon, setNgayDangChon] = useState<number>(1);
	const [tuKhoa, setTuKhoa] = useState('');
	const [trang, setTrang] = useState(1);
	const kichThuocTrang = 6;

	useEffect(() => {
		if (!danhSachGoc.length) taiDanhSachDiemDen();
	}, []);

	const dsNgay = useMemo(() => Array.from({ length: soNgay }, (_, i) => i + 1), [soNgay]);
	useEffect(() => {
		if (ngayDangChon > soNgay) setNgayDangChon(soNgay);
	}, [soNgay]);

	const danhSachLoc = useMemo(() => {
		const tuKhoaThuong = tuKhoa.trim().toLowerCase();
		if (!tuKhoaThuong) return danhSachGoc;
		return danhSachGoc.filter(
			(d) =>
				d.ten.toLowerCase().includes(tuKhoaThuong) ||
				d.diaDiem.toLowerCase().includes(tuKhoaThuong) ||
				d.loaiHinh.toLowerCase().includes(tuKhoaThuong),
		);
	}, [danhSachGoc, tuKhoa]);

	const batDau = (trang - 1) * kichThuocTrang;
	const danhSachHienThiTrai = danhSachLoc.slice(batDau, batDau + kichThuocTrang);

	useEffect(() => {
		setTrang(1);
	}, [tuKhoa]);

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} lg={10}>
				<Card
					title='Chọn điểm đến'
					extra={
						<Space>
							<Text>Số ngày:</Text>
							<InputNumber min={1} max={14} value={soNgay} onChange={(v) => datSoNgay(Number(v || 1))} />
						</Space>
					}
				>
					<Space direction='vertical' size={12} style={{ width: '100%' }}>
						<Row gutter={[8, 8]}>
							<Col span={24}>
								<Input
									allowClear
									placeholder='Tìm theo tên, địa điểm hoặc loại hình'
									value={tuKhoa}
									onChange={(e) => setTuKhoa(e.target.value)}
								/>
							</Col>
						</Row>
						<div style={{ maxHeight: '68vh', overflowY: 'auto', paddingRight: 4 }}>
							<Space direction='vertical' size={12} style={{ width: '100%' }}>
								{danhSachHienThiTrai.map((d: IDiemDen) => (
									<Card size='small' key={d.id}>
										<Space direction='vertical' style={{ width: '100%' }}>
											<div>
												<Text strong>{d.ten}</Text>
												<div>
													<Text type='secondary'>{d.diaDiem}</Text>
												</div>
											</div>
											<Space wrap>
												<Tag color='blue'>{d.loaiHinh}</Tag>
												<Tag>{d.giaUocTinh.toLocaleString('vi-VN')} VND</Tag>
												<Select
													size='small'
													style={{ minWidth: 120 }}
													value={ngayDangChon}
													onChange={(value) => setNgayDangChon(value)}
													options={dsNgay.map((ngay) => ({ label: `Ngày ${ngay}`, value: ngay }))}
												/>
												<Button
													size='small'
													type='primary'
													onClick={() => themDiaDiemVaoNgay(ngayDangChon, d)}
												>
													Thêm vào ngày đã chọn
												</Button>
											</Space>
										</Space>
									</Card>
								))}
							</Space>
						</div>
						<Pagination
							current={trang}
							pageSize={kichThuocTrang}
							total={danhSachLoc.length}
							onChange={(page) => setTrang(page)}
							showSizeChanger={false}
							size='small'
						/>
					</Space>
				</Card>
			</Col>
			<Col xs={24} lg={14}>
				<Card title='Lịch trình theo ngày'>
					<div style={{ maxHeight: '76vh', overflowY: 'auto', paddingRight: 4 }}>
						<Space direction='vertical' size={16} style={{ width: '100%' }}>
						<Text>
							Đã chọn <b>{tongDiaDiemDaChon}</b> điểm đến - Ước tính thời gian di chuyển:{' '}
							<b>{uocTinhTongThoiGianDiChuyenGio} giờ</b>
						</Text>
						{dsNgay.map((ngay) => (
							<Card key={ngay} size='small' title={`Ngày ${ngay}`}>
								{(lichTrinh[ngay] || []).length === 0 ? (
									<Text type='secondary'>Chưa có điểm đến trong ngày này.</Text>
								) : (
									<Space direction='vertical' size={8} style={{ width: '100%' }}>
										{(lichTrinh[ngay] || []).map((d, idx) => (
											<div key={d.id}>
												<Space style={{ width: '100%', justifyContent: 'space-between' }}>
													<div>
														<Text strong>{d.ten}</Text> - <Text type='secondary'>{d.diaDiem}</Text>
													</div>
													<Space>
														<Button size='small' onClick={() => sapXepDiaDiemTrongNgay(ngay, idx, 'len')}>
															Lên
														</Button>
														<Button size='small' onClick={() => sapXepDiaDiemTrongNgay(ngay, idx, 'xuong')}>
															Xuống
														</Button>
														<Button danger size='small' onClick={() => xoaDiaDiemKhoiNgay(ngay, d.id)}>
															Xóa
														</Button>
													</Space>
												</Space>
												{idx < (lichTrinh[ngay] || []).length - 1 ? <Divider style={{ margin: '8px 0' }} /> : null}
											</div>
										))}
									</Space>
								)}
							</Card>
						))}
						</Space>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default TaoLichTrinhPage;
