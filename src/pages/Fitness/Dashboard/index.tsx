import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import { goalsService, healthService, workoutService } from '@/services/Fitness';
import { getProgressPercent, getStreakDays, getWeightLineData } from '@/services/Fitness/utils';
import { Card, Col, Row, Statistic, Timeline, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

const getWeekLabel = (dateIso: string) => {
	const d = new Date(dateIso);
	const day = d.getDate();
	if (day <= 7) return 'Tuần 1';
	if (day <= 14) return 'Tuần 2';
	if (day <= 21) return 'Tuần 3';
	return 'Tuần 4';
};

const DashboardPage = () => {
	const [workoutList, setWorkoutList] = useState<any[]>([]);
	const [healthList, setHealthList] = useState<any[]>([]);
	const [goalList, setGoalList] = useState<any[]>([]);

	const loadData = async () => {
		const [w, h, g] = await Promise.all([workoutService.getAll(), healthService.getAll(), goalsService.getAll()]);
		setWorkoutList(w);
		setHealthList(h);
		setGoalList(g);
	};

	useEffect(() => {
		loadData();
	}, []);

	const thongKeNhanh = useMemo(() => {
		const thisMonth = moment().month();
		const workoutThang = workoutList.filter((item) => moment(item.ngayTap).month() === thisMonth && item.trangThai === 'Hoàn thành');
		const tongBuoiTapThang = workoutThang.length;
		const tongCaloDot = workoutThang.reduce((sum, item) => sum + Number(item.caloDot || 0), 0);
		const streak = getStreakDays(workoutList);
		const percentMucTieu = goalList.length
			? Math.round(goalList.reduce((sum, item) => sum + getProgressPercent(item), 0) / goalList.length)
			: 0;
		return { tongBuoiTapThang, tongCaloDot, streak, percentMucTieu };
	}, [workoutList, goalList]);

	const chartBuoiTapTheoTuan = useMemo(() => {
		const base: Record<string, number> = { 'Tuần 1': 0, 'Tuần 2': 0, 'Tuần 3': 0, 'Tuần 4': 0 };
		workoutList.forEach((item) => {
			if (item.trangThai !== 'Hoàn thành') return;
			const key = getWeekLabel(item.ngayTap);
			base[key] += 1;
		});
		return {
			xAxis: Object.keys(base),
			yAxis: [Object.values(base)],
		};
	}, [workoutList]);

	const canNangData = useMemo(() => getWeightLineData(healthList), [healthList]);
	const recent5 = [...workoutList]
		.sort((a, b) => new Date(b.ngayTap).getTime() - new Date(a.ngayTap).getTime())
		.slice(0, 5);

	return (
		<div>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={12} lg={6}>
					<Card><Statistic title='Tổng buổi tập trong tháng' value={thongKeNhanh.tongBuoiTapThang} /></Card>
				</Col>
				<Col xs={24} md={12} lg={6}>
					<Card><Statistic title='Tổng calo đã đốt' value={thongKeNhanh.tongCaloDot} suffix='kcal' /></Card>
				</Col>
				<Col xs={24} md={12} lg={6}>
					<Card><Statistic title='Số ngày tập liên tiếp' value={thongKeNhanh.streak} suffix='ngày' /></Card>
				</Col>
				<Col xs={24} md={12} lg={6}>
					<Card><Statistic title='Mục tiêu hoàn thành' value={thongKeNhanh.percentMucTieu} suffix='%' /></Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 12 }}>
				<Col xs={24} lg={14}>
					<Card>
						<ColumnChart title='Số buổi tập theo tuần' xAxis={chartBuoiTapTheoTuan.xAxis} yAxis={chartBuoiTapTheoTuan.yAxis} yLabel={['Buổi tập']} formatY={(v) => `${v}`} />
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<Card>
						<LineChart title='Biến động cân nặng' xAxis={canNangData.xAxis} yAxis={canNangData.yAxis} yLabel={['Cân nặng (kg)']} formatY={(v) => `${v} kg`} />
					</Card>
				</Col>
			</Row>

			<Card title='5 buổi tập gần nhất' style={{ marginTop: 12 }}>
				<Timeline>
					{recent5.map((item) => (
						<Timeline.Item key={item._id} color={item.trangThai === 'Hoàn thành' ? 'green' : 'gray'}>
							<Typography.Text strong>{item.tenBaiTap}</Typography.Text> - {item.loaiBaiTap} ({item.thoiLuongPhut} phút, {item.caloDot} calo)
							<br />
							<Typography.Text type='secondary'>{moment(item.ngayTap).format('DD/MM/YYYY')} - {item.trangThai}</Typography.Text>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default DashboardPage;
