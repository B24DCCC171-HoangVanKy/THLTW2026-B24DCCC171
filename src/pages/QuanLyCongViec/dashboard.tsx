import { Card, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DashboardThongKe from '@/components/DashboardThongKe/dashboardthongke';
import './style.less';

const { Title } = Typography;

const DashboardCongViecPage: React.FC = () => {
	const { danhSachTask, taiDanhSachTask } = useModel('congviec');

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div className='congviec-page-container'>
			<Card className='congviec-dashboard-title-card'>
				<Title level={4} className='congviec-page-title'>
					Dashboard công việc
				</Title>
			</Card>
			<DashboardThongKe danhSachTask={danhSachTask} />
		</div>
	);
};

export default DashboardCongViecPage;
