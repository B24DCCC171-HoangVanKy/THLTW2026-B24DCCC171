import { Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DashboardThongKe from '@/components/DashboardThongKe/dashboardthongke';

const { Title } = Typography;

const DashboardCongViecPage: React.FC = () => {
	const { danhSachTask, taiDanhSachTask } = useModel('congviec');

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div>
			<Title level={4}>Dashboard công việc</Title>
			<DashboardThongKe danhSachTask={danhSachTask} />
		</div>
	);
};

export default DashboardCongViecPage;
