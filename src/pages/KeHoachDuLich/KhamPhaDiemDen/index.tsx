import {
	type IDiemDen,
	type TSapXep,
} from '@/services/KeHoachDuLich/typing';
import {
	Button,
	Card,
	Col,
	Divider,
	Empty,
	InputNumber,
	Modal,
	Popover,
	Rate,
	Row,
	Select,
	Space,
	Spin,
	Tag,
	Typography,
} from 'antd';
import {
	useEffect,
	useState,
} from 'react';
import { useModel } from 'umi';

const { Title, Text, Paragraph } = Typography;
const ANH_MAC_DINH = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';

const KhamPhaDiemDenPage = () => {
	const {
		loading,
		danhSachHienThi,
		loaiHinhDangLoc,
		diemDanhGiaToiThieu,
		giaToiThieu,
		giaToiDa,
		kieuSapXep,
		taiDanhSachDiemDen,
		capNhatBoLoc,
		capNhatSapXep,
	} = useModel('kehoachdulich');
	const [moBoLoc, setMoBoLoc] = useState(false);
	const [diaDiemDangChon, setDiaDiemDangChon] = useState<IDiemDen | undefined>(undefined);
	const dinhDangTien = (value?: string | number) => {
		if (value === undefined || value === null || value === '') return '';
		return Number(value).toLocaleString('vi-VN');
	};
	const boDauCham = (value?: string) => (value ? Number(value.split('.').join('')) : 0);
	const xuLyAnhLoi = (e: any) => {
		e.currentTarget.src = ANH_MAC_DINH;
	};

	useEffect(() => {
		taiDanhSachDiemDen();
	}, []);

	const boLocNangCao = (
		<Space direction='vertical' size={12} style={{ width: 320 }}>
			<Select
				allowClear
				placeholder='Lọc theo loại hình'
				style={{ width: '100%' }}
				value={loaiHinhDangLoc}
				onChange={(value?: IDiemDen['loaiHinh']) =>
					capNhatBoLoc({ loaiHinh: value, diemDanhGiaToiThieu, giaToiThieu, giaToiDa })
				}
				options={[
					{ label: 'Biển', value: 'Biển' },
					{ label: 'Núi', value: 'Núi' },
					{ label: 'Thành phố', value: 'Thành phố' },
					{ label: 'Văn hóa', value: 'Văn hóa' },
				]}
			/>
			<InputNumber
				min={0}
				step={100000}
				placeholder='Giá từ'
				style={{ width: '100%' }}
				value={giaToiThieu}
				formatter={dinhDangTien}
				parser={boDauCham}
				addonAfter='VNĐ'
				onChange={(value) =>
					capNhatBoLoc({
						loaiHinh: loaiHinhDangLoc,
						diemDanhGiaToiThieu,
						giaToiThieu: value ?? undefined,
						giaToiDa,
					})
				}
			/>
			<InputNumber
				min={0}
				step={100000}
				placeholder='Giá đến'
				style={{ width: '100%' }}
				value={giaToiDa}
				formatter={dinhDangTien}
				parser={boDauCham}
				addonAfter='VNĐ'
				onChange={(value) =>
					capNhatBoLoc({
						loaiHinh: loaiHinhDangLoc,
						diemDanhGiaToiThieu,
						giaToiThieu,
						giaToiDa: value ?? undefined,
					})
				}
			/>
			<Select
				style={{ width: '100%' }}
				placeholder='Đánh giá tối thiểu'
				value={diemDanhGiaToiThieu || undefined}
				onChange={(value?: number) =>
					capNhatBoLoc({
						loaiHinh: loaiHinhDangLoc,
						diemDanhGiaToiThieu: value ?? 0,
						giaToiThieu,
						giaToiDa,
					})
				}
				options={[
					{ label: 'Từ 2.0', value: 2 },
					{ label: 'Từ 3.0', value: 3 },
					{ label: 'Từ 4.0', value: 4 },
					{ label: 'Từ 4.5', value: 4.5 },
				]}
				allowClear
			/>
			<Select
				placeholder='Sắp xếp'
				mode='multiple'
				style={{ width: '100%' }}
				value={kieuSapXep}
				onChange={(value: TSapXep[]) => capNhatSapXep(value)}
				options={[
					{ label: 'Giá thấp đến cao', value: 'giaTang' },
					{ label: 'Giá cao đến thấp', value: 'giaGiam' },
					{ label: 'Đánh giá cao nhất', value: 'ratingGiam' },
					{ label: 'Đánh giá thấp nhất', value: 'ratingTang' },
				]}
			/>
			<Divider style={{ margin: '4px 0' }} />
			<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
				<Button
					onClick={() => {
						capNhatBoLoc({
							loaiHinh: undefined,
							diemDanhGiaToiThieu: 0,
							giaToiThieu: undefined,
							giaToiDa: undefined,
						});
						capNhatSapXep([]);
					}}
				>
					Xóa bộ lọc
				</Button>
				<Button type='primary' onClick={() => setMoBoLoc(false)}>
					Đóng
				</Button>
			</Space>
		</Space>
	);

	return (
		<Card bordered={false}>
			<Space direction='vertical' size={16} style={{ width: '100%' }}>
				<div>
					<Title level={3} style={{ marginBottom: 4 }}>
						Khám phá điểm đến
					</Title>
					<Text type='secondary'>Lọc và sắp xếp điểm đến phù hợp cho kế hoạch du lịch của bạn.</Text>
				</div>

				<Popover
					content={boLocNangCao}
					title='Bộ lọc nâng cao'
					trigger='click'
					placement='bottomLeft'
					visible={moBoLoc}
					onVisibleChange={setMoBoLoc}
				>
					<Button type='primary'>Bộ lọc</Button>
				</Popover>

				<Spin spinning={loading}>
					{danhSachHienThi.length ? (
						<Row gutter={[16, 16]}>
							{danhSachHienThi.map((item) => (
								<Col xs={24} sm={12} lg={8} key={item.id}>
									<Card
										hoverable
										onClick={() => setDiaDiemDangChon(item)}
										style={{ cursor: 'pointer' }}
										cover={
											<img
												alt={item.ten}
												src={item.hinhAnh}
												onError={xuLyAnhLoi}
												style={{ height: 180, objectFit: 'cover' }}
											/>
										}
									>
										<Space direction='vertical' size={8} style={{ width: '100%' }}>
											<div>
												<Title level={5} style={{ marginBottom: 0 }}>
													{item.ten}
												</Title>
												<Text type='secondary'>{item.diaDiem}</Text>
											</div>
											<Tag color='blue'>{item.loaiHinh}</Tag>
											<div>
												<Rate disabled allowHalf value={item.rating} />
												<div>
													<Text>{item.rating.toFixed(1)}</Text>
												</div>
											</div>
											<Text strong>{item.giaUocTinh.toLocaleString('vi-VN')} VND</Text>
											<Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
												{item.moTaNgan}
											</Paragraph>
										</Space>
									</Card>
								</Col>
							))}
						</Row>
					) : (
						<Empty description='Không tìm thấy điểm đến phù hợp' />
					)}
				</Spin>
			</Space>

			<Modal
				visible={!!diaDiemDangChon}
				title={diaDiemDangChon?.ten}
				footer={null}
				onCancel={() => setDiaDiemDangChon(undefined)}
			>
				{diaDiemDangChon ? (
					<Space direction='vertical' size={12} style={{ width: '100%' }}>
						<img
							src={diaDiemDangChon.hinhAnh}
							alt={diaDiemDangChon.ten}
							onError={xuLyAnhLoi}
							style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }}
						/>
						<Text type='secondary'>{diaDiemDangChon.diaDiem}</Text>
						<Tag color='blue'>{diaDiemDangChon.loaiHinh}</Tag>
						<div>
							<Rate disabled allowHalf value={diaDiemDangChon.rating} />
							<div>
								<Text>{diaDiemDangChon.rating.toFixed(1)}</Text>
							</div>
						</div>
						<Text strong>{diaDiemDangChon.giaUocTinh.toLocaleString('vi-VN')} VND</Text>
						<Paragraph style={{ marginBottom: 0 }}>{diaDiemDangChon.moTaNgan}</Paragraph>
					</Space>
				) : null}
			</Modal>
		</Card>
	);
};

export default KhamPhaDiemDenPage;
