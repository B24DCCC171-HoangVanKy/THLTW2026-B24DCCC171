import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { getBMIStatus } from '@/services/Fitness/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const HealthMetricsPage = () => {
	const { page, limit, deleteModel, handleEdit, setCondition } = useModel('fitness.healthMetrics');

	const columns: IColumn<any>[] = [
		{ title: 'Ngày', dataIndex: 'ngay', width: 130, sortable: true, render: (val) => moment(val).format('DD/MM/YYYY') },
		{ title: 'Cân nặng (kg)', dataIndex: 'canNangKg', width: 120, align: 'right', sortable: true },
		{ title: 'Chiều cao (cm)', dataIndex: 'chieuCaoCm', width: 120, align: 'right', sortable: true },
		{
			title: 'BMI',
			dataIndex: 'bmi',
			width: 180,
			align: 'center',
			render: (val) => {
				const info = getBMIStatus(Number(val));
				return (
					<>
						<strong>{val}</strong> <Tag color={info.color}>{info.label}</Tag>
					</>
				);
			},
		},
		{ title: 'Nhịp tim nghỉ (bpm)', dataIndex: 'nhipTimNghiBpm', width: 140, align: 'right' },
		{ title: 'Giờ ngủ', dataIndex: 'gioNgu', width: 100, align: 'right' },
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
					<Popconfirm title='Xác nhận xóa chỉ số này?' onConfirm={() => deleteModel(record._id)}>
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
			title='Nhật ký chỉ số sức khỏe'
			modelName='fitness.healthMetrics'
			columns={columns}
			Form={Form}
			dependencies={[page, limit]}
			otherButtons={[
				<DatePicker.RangePicker
					key='range'
					format='DD/MM/YYYY'
					onChange={(values) =>
						setCondition((prev: any) => ({
							...prev,
							rangeDate: values?.length ? values.map((item) => item?.startOf('day').toISOString()) : undefined,
						}))
					}
				/>,
			]}
		/>
	);
};

export default HealthMetricsPage;
