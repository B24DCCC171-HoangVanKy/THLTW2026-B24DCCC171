import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, Popconfirm, Row, Select, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DetailModal from './components/DetailModal';
import ExerciseFormModal from './components/Form';

const ExerciseLibraryPage = () => {
	const {
		dsBaiTap,
		loading,
		getModel,
		setRecord,
		setIsEdit,
		setVisibleForm,
		setVisibleDetail,
		deleteModel,
		keyword,
		setKeyword,
		nhomCoLoc,
		setNhomCoLoc,
		mucDoLoc,
		setMucDoLoc,
	} = useModel('fitness.exerciseLibrary');

	useEffect(() => {
		getModel();
	}, [keyword, nhomCoLoc, mucDoLoc]);

	return (
		<Card
			title='Thư viện bài tập'
			loading={loading}
			extra={
				<Space>
					<Input.Search allowClear placeholder='Tìm theo tên bài tập' onSearch={(v) => setKeyword(v)} style={{ width: 220 }} />
					<Select
						style={{ width: 170 }}
						value={nhomCoLoc}
						onChange={setNhomCoLoc}
						options={['Tất cả', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'].map((item) => ({
							value: item,
							label: item,
						}))}
					/>
					<Select
						style={{ width: 140 }}
						value={mucDoLoc}
						onChange={setMucDoLoc}
						options={['Tất cả', 'Dễ', 'Trung bình', 'Khó'].map((item) => ({ value: item, label: item }))}
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
						Thêm bài tập
					</Button>
				</Space>
			}
		>
			<Row gutter={[16, 16]}>
				{dsBaiTap.map((item) => (
					<Col span={8} key={item._id}>
						<Card
							hoverable
							onClick={() => {
								setRecord(item);
								setVisibleDetail(true);
							}}
							actions={[
								<EditOutlined
									key='edit'
									onClick={(e) => {
										e.stopPropagation();
										setRecord(item);
										setIsEdit(true);
										setVisibleForm(true);
									}}
								/>,
								<Popconfirm
									key='del'
									title='Xác nhận xóa bài tập?'
									onConfirm={(e) => {
										e?.stopPropagation();
										deleteModel(item._id);
									}}
								>
									<DeleteOutlined onClick={(e) => e.stopPropagation()} />
								</Popconfirm>,
							]}
						>
							<Typography.Title level={5}>{item.tenBaiTap}</Typography.Title>
							<Typography.Paragraph>Nhóm cơ: {item.nhomCo}</Typography.Paragraph>
							<Tag color={item.mucDo === 'Khó' ? 'red' : item.mucDo === 'Trung bình' ? 'gold' : 'green'}>{item.mucDo}</Tag>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>{item.moTaNgan}</Typography.Paragraph>
							<Typography.Text strong>{item.caloMoiGio} calo/giờ</Typography.Text>
						</Card>
					</Col>
				))}
			</Row>
			{!dsBaiTap.length && <Empty description='Không có bài tập phù hợp' />}
			<ExerciseFormModal />
			<DetailModal />
		</Card>
	);
};

export default ExerciseLibraryPage;
