import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TaskForm from '@/components/TaskForm/taskform';
import './style.less';

const { Text, Title } = Typography;
const mauTagCoDinh = 'geekblue';
const mauDoUuTien: Record<string, string> = {
	Cao: 'red',
	'Trung bình': 'blue',
	Thấp: 'green',
};

const mauTrangThai: Record<string, string> = {
	'Cần làm': 'blue',
	'Đang làm': 'green',
	'Hoàn thành': 'red',
};

const QuanLyCongViecPage: React.FC = () => {
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

	useEffect(() => {
		taiDanhSachTask();
	}, []);

	return (
		<div className='congviec-page-container'>
			<Space className='congviec-page-header'>
				<Title level={4} className='congviec-page-title'>
					Quản lý công việc
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
					<Button type='primary' icon={<PlusOutlined />} onClick={moFormThem}>
						Thêm task
					</Button>
				</Space>
			</Space>

			{danhSachTask.length === 0 ? (
				<Card>
					<Empty description='Chưa có task nào' />
				</Card>
			) : (
				<Row gutter={[16, 16]}>
					{danhSachTask.map((task) => (
						<Col xs={24} md={12} xl={8} key={task.id} className='congviec-task-col'>
							<Card
								title={task.tenTask}
								extra={<Tag color={mauTrangThai[task.trangThai]}>{task.trangThai}</Tag>}
								className='congviec-task-card'
								bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
								actions={[
									<EditOutlined key='edit' onClick={() => moFormSua(task)} />,
									<Popconfirm
										key='delete'
										title='Xóa task này?'
										okText='Xóa'
										cancelText='Hủy'
										onConfirm={() => xoaTaskTheoId(task.id)}
									>
										<DeleteOutlined />
									</Popconfirm>,
								]}
							>
								<Space direction='vertical' size={8} className='congviec-task-content'>
									<Text>{task.moTa || 'Không có mô tả'}</Text>
									<Text>
										Deadline: {new Date(task.deadline).toLocaleString()}
									</Text>
									<Space>
										<Text type='secondary'>Độ ưu tiên:</Text>
										<Tag color={mauDoUuTien[task.doUuTien]}>{task.doUuTien}</Tag>
									</Space>
									<Space wrap>
										{task.tags.map((tag) => (
											<Tag color={mauTagCoDinh} key={`${task.id}-${tag}`}>
												{tag}
											</Tag>
										))}
									</Space>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			)}

			<TaskForm visible={moTaskForm} taskDangSua={taskDangSua} onDong={dongFormTask} onLuu={luuTask} />
		</div>
	);
};

export default QuanLyCongViecPage;
