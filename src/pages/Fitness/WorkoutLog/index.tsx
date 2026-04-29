import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Popconfirm, Select, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const WorkoutLogPage = () => {
	const { page, limit, deleteModel, handleEdit, setCondition } = useModel('fitness.workoutLog');

	const columns: IColumn<any>[] = [
		{ title: 'Ngày', dataIndex: 'ngayTap', width: 140, sortable: true, render: (val) => moment(val).format('DD/MM/YYYY') },
		{ title: 'Tên bài tập', dataIndex: 'tenBaiTap', width: 180, filterType: 'string', sortable: true },
		{ title: 'Loại bài tập', dataIndex: 'loaiBaiTap', width: 140, filterType: 'select', filterData: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'] },
		{ title: 'Thời lượng (phút)', dataIndex: 'thoiLuongPhut', width: 130, align: 'right', sortable: true },
		{ title: 'Calo đốt', dataIndex: 'caloDot', width: 110, align: 'right', sortable: true },
		{ title: 'Ghi chú', dataIndex: 'ghiChu', width: 220 },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 130,
			filterType: 'select',
			filterData: ['Hoàn thành', 'Bỏ lỡ'],
			render: (val) => <Tag color={val === 'Hoàn thành' ? 'green' : 'default'}>{val}</Tag>,
		},
		{
			title: 'Thao tác',
			width: 100,
			fixed: 'right',
			align: 'center',
			render: (record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Popconfirm title='Xác nhận xóa buổi tập này?' onConfirm={() => deleteModel(record._id)}>
						<Tooltip title='Xóa'>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Tooltip>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			title='Nhật ký tập luyện'
			modelName='fitness.workoutLog'
			columns={columns}
			Form={Form}
			dependencies={[page, limit]}
			otherButtons={[
				<Space key='range'>
					<DatePicker.RangePicker
						format='DD/MM/YYYY'
						onChange={(values) =>
							setCondition((prev: any) => ({
								...prev,
								rangeDate: values?.length ? values.map((item) => item?.startOf('day').toISOString()) : undefined,
							}))
						}
					/>
					<Select
						allowClear
						style={{ width: 180 }}
						placeholder='Lọc loại bài tập'
						onChange={(value) => setCondition((prev: any) => ({ ...prev, loaiLoc: value }))}
						options={['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map((item) => ({ value: item, label: item }))}
					/>
				</Space>,
			]}
		/>
	);
};

export default WorkoutLogPage;
