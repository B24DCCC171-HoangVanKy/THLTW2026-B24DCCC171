import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const GoalDrawerForm = () => {
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, record, isEdit, postModel, putModel, formSubmiting } = useModel('fitness.goals');

	useEffect(() => {
		if (!visibleForm) form.resetFields();
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				deadline: record.deadline ? moment(record.deadline) : undefined,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any) => {
		const payload = { ...values, deadline: values.deadline?.toISOString() };
		if (isEdit && record?._id) await putModel(record._id, payload);
		else await postModel(payload);
	};

	return (
		<Drawer visible={visibleForm} onClose={() => setVisibleForm(false)} title={isEdit ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu'} width={520}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='tenMucTieu' label='Tên mục tiêu' rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='loaiMucTieu' label='Loại mục tiêu' rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}>
					<Select options={['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'].map((item) => ({ value: item, label: item }))} />
				</Form.Item>
				<Form.Item name='giaTriMucTieu' label='Giá trị mục tiêu' rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}>
					<InputNumber style={{ width: '100%' }} min={1} />
				</Form.Item>
				<Form.Item name='giaTriHienTai' label='Giá trị hiện tại' rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}>
					<InputNumber style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item name='trangThai' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select options={['Đang thực hiện', 'Đã đạt', 'Đã hủy'].map((item) => ({ value: item, label: item }))} />
				</Form.Item>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{isEdit ? 'Lưu lại' : 'Thêm mới'}
				</Button>
			</Form>
		</Drawer>
	);
};

export default GoalDrawerForm;
