import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, InputNumber, Popconfirm, Progress, Row, Segmented, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { getProgressPercent } from '@/services/Fitness/utils';
import GoalDrawerForm from './components/GoalDrawerForm';

const GoalsPage = () => {
	const {
		dsMucTieu,
		loading,
		getModel,
		setRecord,
		setIsEdit,
		setVisibleForm,
		putModel,
		deleteModel,
		trangThaiLoc,
		setTrangThaiLoc,
	} = useModel('fitness.goals');

	useEffect(() => {
		getModel();
	}, [trangThaiLoc]);

	return (
		<Card
			title='Quản lý mục tiêu'
			extra={
				<Space>
					<Segmented
						value={trangThaiLoc}
						onChange={(val) => setTrangThaiLoc(val as any)}
						options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setRecord(undefined);
							setIsEdit(false);
							setVisibleForm(true);
						}}
					>
						Thêm mục tiêu
					</Button>
				</Space>
			}
			loading={loading}
		>
			<Row gutter={[16, 16]}>
				{dsMucTieu.map((item) => {
					const percent = getProgressPercent(item);
					return (
						<Col xs={24} md={12} lg={8} key={item._id}>
							<Card
								size='small'
								title={item.tenMucTieu}
								extra={<Tag color={item.trangThai === 'Đã đạt' ? 'green' : item.trangThai === 'Đã hủy' ? 'default' : 'blue'}>{item.trangThai}</Tag>}
								actions={[
									<EditOutlined
										key='edit'
										onClick={() => {
											setRecord(item);
											setIsEdit(true);
											setVisibleForm(true);
										}}
									/>,
									<Popconfirm key='del' title='Xác nhận xóa mục tiêu?' onConfirm={() => deleteModel(item._id)}>
										<DeleteOutlined />
									</Popconfirm>,
								]}
							>
								<Typography.Paragraph>Loại: {item.loaiMucTieu}</Typography.Paragraph>
								<Typography.Paragraph>Giá trị mục tiêu: {item.giaTriMucTieu}</Typography.Paragraph>
								<Space>
									Giá trị hiện tại:
									<InputNumber
										value={item.giaTriHienTai}
										min={0}
										onBlur={(e) => putModel(item._id, { giaTriHienTai: Number((e.target as HTMLInputElement).value || 0) })}
									/>
								</Space>
								<Progress percent={percent} />
								<Typography.Text type='secondary'>Deadline: {moment(item.deadline).format('DD/MM/YYYY')}</Typography.Text>
							</Card>
						</Col>
					);
				})}
			</Row>
			{!dsMucTieu.length && <Empty description='Chưa có mục tiêu' />}
			<GoalDrawerForm />
		</Card>
	);
};

export default GoalsPage;
