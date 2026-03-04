import { useState, useMemo } from 'react';
import {
	Alert,
	Button,
	Card,
	Col,
	InputNumber,
	List,
	Progress,
	Row,
	Space,
	Statistic,
	Typography,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const MAX_ATTEMPTS = 10;

type GameStatus = 'idle' | 'low' | 'high' | 'correct' | 'gameOver';

interface GuessRecord {
	attempt: number;
	guess: number;
	result: string;
}

const taoSoNgauNhien = () => Math.floor(Math.random() * 100) + 1;

const Bai1 = () => {
	const [soBiMat, setSoBiMat] = useState<number>(() => taoSoNgauNhien());
	const [giaTriDoan, setGiaTriDoan] = useState<number | null>(null);
	const [soLanDoan, setSoLanDoan] = useState<number>(0);
	const [trangThai, setTrangThai] = useState<GameStatus>('idle');
	const [lichSu, setLichSu] = useState<GuessRecord[]>([]);

	const daKetThuc = useMemo(
		() => trangThai === 'correct' || trangThai === 'gameOver',
		[trangThai],
	);

	const soLuotConLai = useMemo(
		() => Math.max(MAX_ATTEMPTS - soLanDoan, 0),
		[soLanDoan],
	);

	const xuLyDoanSo = () => {
		if (giaTriDoan === null) {
			return;
		}

		if (daKetThuc) {
			return;
		}

		const lanThu = soLanDoan + 1;
		let trangThaiMoi: GameStatus = trangThai;
		let thongDiep = '';

		if (giaTriDoan === soBiMat) {
			trangThaiMoi = 'correct';
			thongDiep = 'Chúc mừng! Bạn đã đoán đúng!';
		} else if (lanThu >= MAX_ATTEMPTS) {
			trangThaiMoi = 'gameOver';
			thongDiep = `Bạn đã hết lượt! Số đúng là ${soBiMat}.`;
		} else if (giaTriDoan < soBiMat) {
			trangThaiMoi = 'low';
			thongDiep = 'Bạn đoán quá thấp!';
		} else {
			trangThaiMoi = 'high';
			thongDiep = 'Bạn đoán quá cao!';
		}

		setSoLanDoan(lanThu);
		setTrangThai(trangThaiMoi);
		setLichSu((prev) => [
			{
				attempt: lanThu,
				guess: giaTriDoan,
				result: thongDiep,
			},
			...prev,
		]);
	};

	const choiLai = () => {
		setSoBiMat(taoSoNgauNhien());
		setGiaTriDoan(null);
		setSoLanDoan(0);
		setTrangThai('idle');
		setLichSu([]);
	};

	const noiDungThongBao = useMemo(() => {
		if (trangThai === 'idle') {
			return (
				<Alert
					type='info'
					showIcon
					message='Hệ thống đã sinh ra một số ngẫu nhiên từ 1 đến 100.'
					description='Bạn có tối đa 10 lượt đoán. Sau mỗi lần đoán, hệ thống sẽ cho biết bạn đang đoán thấp hơn, cao hơn hay đúng với số bí mật.'
				/>
			);
		}

		if (trangThai === 'correct') {
			return (
				<Alert
					type='success'
					showIcon
					message='Chúc mừng! Bạn đã đoán đúng!'
					description={`Bạn đã dùng ${soLanDoan} lượt để đoán chính xác số ${soBiMat}.`}
				/>
			);
		}

		if (trangThai === 'gameOver') {
			return (
				<Alert
					type='error'
					showIcon
					message='Bạn đã hết lượt!'
					description={`Số đúng là ${soBiMat}. Hãy bấm "Chơi lại" để bắt đầu ván mới.`}
				/>
			);
		}

		if (trangThai === 'low') {
			return (
				<Alert
					type='warning'
					showIcon
					message='Bạn đoán quá thấp!'
					description='Hãy thử một số lớn hơn.'
				/>
			);
		}

		return (
			<Alert
				type='warning'
				showIcon
				message='Bạn đoán quá cao!'
				description='Hãy thử một số nhỏ hơn.'
			/>
		);
	}, [soBiMat, soLanDoan, trangThai]);

	return (
		<Card
			title='TH01 - Bài 1: Trò chơi đoán số'
			extra={
				<Button onClick={choiLai} disabled={soLanDoan === 0 && trangThai === 'idle'}>
					Chơi lại
				</Button>
			}
		>
			<Row gutter={[24, 24]}>
				<Col xs={24} md={14}>
					<Space direction='vertical' size='large' style={{ width: '100%' }}>
						<div>
							<Title level={4}>Mô tả bài toán</Title>
							<Paragraph>
								Hệ thống sinh ngẫu nhiên một số nguyên trong khoảng từ{' '}
								<Text strong>{1}</Text> đến <Text strong>{100}</Text>. Người
								chơi nhập dự đoán của mình và hệ thống sẽ phản hồi là{' '}
								<Text strong>“quá thấp”</Text>, <Text strong>“quá cao”</Text> hay{' '}
								<Text strong>“đã đoán đúng”</Text>.
							</Paragraph>
							<Paragraph>
								Bạn có tối đa <Text strong>{MAX_ATTEMPTS} lượt</Text>. Nếu sau{' '}
								<Text strong>{MAX_ATTEMPTS}</Text> lượt mà vẫn chưa đoán đúng, hệ thống sẽ
								thông báo <Text strong>“Bạn đã hết lượt! Số đúng là ...”</Text>.
							</Paragraph>
						</div>

						{noiDungThongBao}

						<Space>
							<InputNumber
								min={1}
								max={100}
								value={giaTriDoan ?? undefined}
								placeholder='Nhập số bạn đoán'
								onChange={(value) => {
									if (typeof value === 'number') {
										setGiaTriDoan(value);
									} else {
										setGiaTriDoan(null);
									}
								}}
								disabled={daKetThuc}
							/>
							<Button
								type='primary'
								onClick={xuLyDoanSo}
								disabled={giaTriDoan === null || daKetThuc}
							>
								Đoán
							</Button>
						</Space>
					</Space>
				</Col>
				<Col xs={24} md={10}>
					<Space
						direction='vertical'
						size='large'
						style={{ width: '100%' }}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Statistic
									title='Số lượt đã dùng'
									value={soLanDoan}
									suffix={`/ ${MAX_ATTEMPTS}`}
								/>
							</Col>
							<Col span={12}>
								<Statistic title='Lượt còn lại' value={soLuotConLai} />
							</Col>
						</Row>
						<Progress
							percent={Number(((soLanDoan / MAX_ATTEMPTS) * 100).toFixed(0))}
							status={trangThai === 'correct' ? 'success' : trangThai === 'gameOver' ? 'exception' : 'active'}
						/>
						<List
							header='Lịch sử các lần đoán'
							dataSource={lichSu}
							locale={{ emptyText: 'Chưa có lượt đoán nào.' }}
							size='small'
							renderItem={(item) => (
								<List.Item>
									<Text type='secondary'>Lần {item.attempt}:</Text>
									<Space style={{ marginLeft: 8 }}>
										<Text strong>{item.guess}</Text>
										<Text>- {item.result}</Text>
									</Space>
								</List.Item>
							)}
						/>
					</Space>
				</Col>
			</Row>
		</Card>
	);
};

export default Bai1;

