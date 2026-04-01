import ColumnChart from '@/components/Chart/ColumnChart';
import { TRANG_THAI_LABEL } from '@/services/CauLacBo/constants';
import { Col, Row, Statistic, Typography } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';

const ModBaoCaoThongKe = () => {
	const { applications, danhMucClb } = useModel('cauLacBo');

	const tongPending = applications.filter((a) => a.trangThai === 'pending').length;
	const tongApproved = applications.filter((a) => a.trangThai === 'approved').length;
	const tongRejected = applications.filter((a) => a.trangThai === 'rejected').length;

	const duLieuBieuDo = useMemo(() => {
		const pending: number[] = [];
		const approved: number[] = [];
		const rejected: number[] = [];
		for (const tenClb of danhMucClb) {
			const trongClb = applications.filter((a) => a.cauLacBo === tenClb);
			pending.push(trongClb.filter((a) => a.trangThai === 'pending').length);
			approved.push(trongClb.filter((a) => a.trangThai === 'approved').length);
			rejected.push(trongClb.filter((a) => a.trangThai === 'rejected').length);
		}
		return { pending, approved, rejected };
	}, [applications, danhMucClb]);

	return (
		<div>
			<Typography.Title level={4}>Tổng quan</Typography.Title>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} md={6}>
					<Statistic title='Số câu lạc bộ (danh mục)' value={danhMucClb.length} />
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Statistic title={TRANG_THAI_LABEL.pending} value={tongPending} />
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Statistic title={TRANG_THAI_LABEL.approved} value={tongApproved} valueStyle={{ color: '#3f8600' }} />
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Statistic title={TRANG_THAI_LABEL.rejected} value={tongRejected} valueStyle={{ color: '#cf1322' }} />
				</Col>
			</Row>

			{danhMucClb.length === 0 ? (
				<Typography.Paragraph type='secondary'>Chưa có câu lạc bộ trong danh mục — hãy thêm tại tab Danh mục CLB.</Typography.Paragraph>
			) : (
				<ColumnChart
					title='Số lượt đăng ký theo CLB và trạng thái'
					xAxis={danhMucClb}
					yLabel={[TRANG_THAI_LABEL.pending, TRANG_THAI_LABEL.approved, TRANG_THAI_LABEL.rejected]}
					yAxis={[duLieuBieuDo.pending, duLieuBieuDo.approved, duLieuBieuDo.rejected]}
					height={400}
					type='bar'
					colors={['#faad14', '#52c41a', '#ff4d4f']}
					formatY={(v) => String(v)}
				/>
			)}
		</div>
	);
};

export default ModBaoCaoThongKe;
