import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Col, List, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { history } from 'umi';
import { type TaskItem } from '@/services/TaskLocal/tasklocalservice';

const { Text } = Typography;
const mauTagCoDinh = 'geekblue';

interface DashboardThongKeProps {
	danhSachTask: TaskItem[];
}

const DashboardThongKe: React.FC<DashboardThongKeProps> = ({ danhSachTask }) => {
	const hienTai = Date.now();
	const motNgayMs = 24 * 60 * 60 * 1000;

	const tongTask = danhSachTask.length;
	const taskCanLam = danhSachTask.filter((task) => task.trangThai === 'Cần làm').length;
	const taskDangLam = danhSachTask.filter((task) => task.trangThai === 'Đang làm').length;
	const taskHoanThanh = danhSachTask.filter((task) => task.trangThai === 'Hoàn thành').length;
	const taskQuaHanList = danhSachTask.filter((task) => {
		const denHan = new Date(task.deadline).getTime();
		return denHan < hienTai && task.trangThai !== 'Hoàn thành';
	});
	const taskQuaHan = taskQuaHanList.length;
	const taskSapDenHanList = danhSachTask
		.filter((task) => {
			const denHan = new Date(task.deadline).getTime();
			return denHan >= hienTai && denHan <= hienTai + 7 * motNgayMs && task.trangThai !== 'Hoàn thành';
		})
		.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

	const tiLeHoanThanh = tongTask > 0 ? Math.round((taskHoanThanh / tongTask) * 100) : 0;

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card
						className='dashboard-kpi-card dashboard-kpi-card-1'
						hoverable
						onClick={() => history.push('/quan-ly-cong-viec/danh-sach')}
					>
						<Statistic title='Tổng số task' value={tongTask} prefix={<UnorderedListOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						className='dashboard-kpi-card dashboard-kpi-card-2'
						hoverable
						onClick={() => history.push('/quan-ly-cong-viec/danh-sach?trangThai=Cần%20làm')}
					>
						<Statistic title='Cần làm' value={taskCanLam} prefix={<ClockCircleOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						className='dashboard-kpi-card dashboard-kpi-card-3'
						hoverable
						onClick={() => history.push('/quan-ly-cong-viec/danh-sach?trangThai=Đang%20làm')}
					>
						<Statistic title='Đang làm' value={taskDangLam} prefix={<CalendarOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						className='dashboard-kpi-card dashboard-kpi-card-4'
						hoverable
						onClick={() => history.push('/quan-ly-cong-viec/danh-sach?trangThai=Hoàn%20thành')}
					>
						<Statistic title='Hoàn thành' value={taskHoanThanh} prefix={<CheckCircleOutlined />} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className='dashboard-row-gap'>
				<Col xs={24} lg={12}>
					<Card className='dashboard-section-card' title='Tiến độ hoàn thành'>
						<Space direction='vertical' className='dashboard-full-width'>
							<Progress percent={tiLeHoanThanh} status='active' strokeColor='#1677ff' />
							<Text type='secondary'>
								{taskHoanThanh}/{tongTask} task đã hoàn thành
							</Text>
						</Space>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card className='dashboard-section-card' title='Task quá hạn'>
						<Statistic value={taskQuaHan} valueStyle={{ color: '#cf1322' }} suffix='task' />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className='dashboard-row-gap'>
				<Col xs={24} lg={12}>
					<Card className='dashboard-section-card' title='Task sắp đến hạn (7 ngày)'>
						<List
							size='small'
							dataSource={taskSapDenHanList.slice(0, 6)}
							locale={{ emptyText: 'Không có task sắp đến hạn' }}
							renderItem={(task) => (
								<List.Item className='dashboard-list-item'>
									<Space direction='vertical' size={2}>
										<Text strong>{task.tenTask}</Text>
										<Text type='secondary'>{new Date(task.deadline).toLocaleString()}</Text>
									</Space>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card className='dashboard-section-card' title='Task quá hạn cần xử lý'>
						<List
							size='small'
							dataSource={taskQuaHanList.slice(0, 6)}
							locale={{ emptyText: 'Không có task quá hạn' }}
							renderItem={(task) => (
								<List.Item className='dashboard-list-item dashboard-list-item-overdue'>
									<Space direction='vertical' size={2}>
										<Text strong>{task.tenTask}</Text>
										<Space>
											<Tag color={mauTagCoDinh}>Quá hạn</Tag>
											<Text type='secondary'>{new Date(task.deadline).toLocaleString()}</Text>
										</Space>
									</Space>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default DashboardThongKe;
