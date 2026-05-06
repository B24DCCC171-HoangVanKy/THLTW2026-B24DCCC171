import { Button, Popconfirm, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import KanbanBoard from '@/components/KanbanBoard/kanbanboard';
import './style.less';

const { Title } = Typography;

const KanbanCongViecPage: React.FC = () => {
	const { danhSachTask, taiDanhSachTask, capNhatTrangThaiTask, taiLaiDuLieuGoc } = useModel('congviec');

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div className='congviec-page-container'>
			<Space className='congviec-page-header'>
				<Title level={4} className='congviec-page-title'>
					Kanban công việc
				</Title>
				<Popconfirm
					title='Làm mới dữ liệu gốc?'
					okText='Đồng ý'
					cancelText='Hủy'
					onConfirm={taiLaiDuLieuGoc}
				>
					<Button>Làm mới dữ liệu gốc</Button>
				</Popconfirm>
			</Space>
			<KanbanBoard danhSachTask={danhSachTask} onDoiTrangThai={capNhatTrangThaiTask} />
		</div>
	);
};

export default KanbanCongViecPage;
