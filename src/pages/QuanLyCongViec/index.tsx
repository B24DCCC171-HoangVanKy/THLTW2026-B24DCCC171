import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TaskForm from '@/components/TaskForm/taskform';

const { Text, Title } = Typography;

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
		<div>
			<Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
				<Title level={4} style={{ margin: 0 }}>
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
						<Col xs={24} md={12} xl={8} key={task.id} style={{ display: 'flex' }}>
							<Card
								title={task.tenTask}
								extra={<Tag>{task.trangThai}</Tag>}
								style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
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
								<Space direction='vertical' size={8} style={{ flex: 1 }}>
									<Text>{task.moTa || 'Không có mô tả'}</Text>
									<Text type='secondary'>Deadline: {new Date(task.deadline).toLocaleString()}</Text>
									<Text type='secondary'>Độ ưu tiên: {task.doUuTien}</Text>
									<Space wrap>
										{task.tags.map((tag) => (
											<Tag key={`${task.id}-${tag}`}>{tag}</Tag>
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
