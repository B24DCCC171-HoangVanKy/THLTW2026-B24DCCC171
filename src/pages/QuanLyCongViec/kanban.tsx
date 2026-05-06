import { Button, Popconfirm, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import KanbanBoard from '@/components/KanbanBoard/kanbanboard';

const { Title } = Typography;

const KanbanCongViecPage: React.FC = () => {
	const { danhSachTask, taiDanhSachTask, capNhatTrangThaiTask, taiLaiDuLieuGoc } = useModel('congviec');

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div>
			<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
				<Title level={4} style={{ margin: 0 }}>
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
