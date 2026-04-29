import { Button, Card, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const loaiBaiTap = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const trangThai = ['Hoàn thành', 'Bỏ lỡ'];

const WorkoutLogForm = () => {
	const [form] = Form.useForm();
	const { record, edit, visibleForm, setVisibleForm, postModel, putModel, formSubmiting } = useModel('fitness.workoutLog');

	useEffect(() => {
		if (!visibleForm) form.resetFields();
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayTap: record.ngayTap ? moment(record.ngayTap) : undefined,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any) => {
		const payload = { ...values, ngayTap: values.ngayTap?.toISOString() };
		if (edit && record?._id) await putModel(record._id, payload);
		else await postModel(payload);
	};

	return (
		<Card title={edit ? 'Chỉnh sửa buổi tập' : 'Thêm buổi tập'}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ngayTap' label='Ngày tập' rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item name='tenBaiTap' label='Tên bài tập' rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
					<Input placeholder='Ví dụ: Chạy bộ, Tập tạ...' />
				</Form.Item>
				<Form.Item name='loaiBaiTap' label='Loại bài tập' rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
					<Select options={loaiBaiTap.map((item) => ({ value: item, label: item }))} />
				</Form.Item>
				<Form.Item name='thoiLuongPhut' label='Thời lượng (phút)' rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='caloDot' label='Calo đốt' rules={[{ required: true, message: 'Vui lòng nhập calo' }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='trangThai' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select options={trangThai.map((item) => ({ value: item, label: item }))} />
				</Form.Item>
				<Form.Item name='ghiChu' label='Ghi chú'>
					<Input.TextArea rows={3} />
				</Form.Item>
				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default WorkoutLogForm;
