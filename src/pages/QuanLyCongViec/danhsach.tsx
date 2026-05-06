import { Button, Popconfirm, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useLocation, useModel } from 'umi';
import TaskForm from '@/components/TaskForm/taskform';
import TaskTable from '@/components/TaskTable/tasktable';
import { type TrangThaiTask } from '@/services/TaskLocal/tasklocalservice';

const { Title } = Typography;

const DanhSachCongViecPage: React.FC = () => {
	const location = useLocation();
	const {
		danhSachTask,
		taskDangSua,
		moTaskForm,
		taiDanhSachTask,
		moFormThem,
		moFormSua,
		dongFormTask,
		luuTask,
		xoaTaskTheoId,
		taiLaiDuLieuGoc,
	} = useModel('congviec');

	const trangThaiLocMacDinh = useMemo<TrangThaiTask | 'tatCa'>(() => {
		const query = new URLSearchParams(location.search);
		const trangThai = query.get('trangThai');
		if (trangThai === 'Cần làm' || trangThai === 'Đang làm' || trangThai === 'Hoàn thành') {
			return trangThai;
		}
		return 'tatCa';
	}, [location.search]);

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div>
			<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
				<Title level={4} style={{ margin: 0 }}>
					Danh sách task
				</Title>
				<Space>
					<Popconfirm
						title='Làm mới dữ liệu gốc?'
						okText='Đồng ý'
						cancelText='Hủy'
						onConfirm={taiLaiDuLieuGoc}
					>
						<Button>Làm mới dữ liệu gốc</Button>
					</Popconfirm>
					<Button type='primary' onClick={moFormThem}>
						Thêm task
					</Button>
				</Space>
			</Space>

			<TaskTable
				danhSachTask={danhSachTask}
				onSua={moFormSua}
				onXoa={xoaTaskTheoId}
				trangThaiLocMacDinh={trangThaiLocMacDinh}
			/>

			<TaskForm visible={moTaskForm} taskDangSua={taskDangSua} onDong={dongFormTask} onLuu={luuTask} />
		</div>
	);
};

export default DanhSachCongViecPage;
