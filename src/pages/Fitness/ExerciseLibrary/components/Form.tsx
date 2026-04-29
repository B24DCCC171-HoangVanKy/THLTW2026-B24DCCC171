import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ExerciseFormModal = () => {
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, record, isEdit, postModel, putModel, formSubmiting } = useModel('fitness.exerciseLibrary');

	useEffect(() => {
		if (!visibleForm) form.resetFields();
		else if (record?._id) form.setFieldsValue(record);
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any) => {
		if (isEdit && record?._id) await putModel(record._id, values);
		else await postModel(values);
	};

	return (
		<Modal visible={visibleForm} footer={null} onCancel={() => setVisibleForm(false)} title={isEdit ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='tenBaiTap' label='Tên bài tập' rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='nhomCo' label='Nhóm cơ' rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
					<Select
						options={['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'].map((item) => ({ value: item, label: item }))}
					/>
				</Form.Item>
				<Form.Item name='mucDo' label='Mức độ' rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
					<Select options={['Dễ', 'Trung bình', 'Khó'].map((item) => ({ value: item, label: item }))} />
				</Form.Item>
				<Form.Item name='moTaNgan' label='Mô tả ngắn' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='huongDanDayDu' label='Hướng dẫn đầy đủ' rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name='caloMoiGio' label='Calo đốt/giờ' rules={[{ required: true, message: 'Vui lòng nhập calo' }]}>
					<InputNumber style={{ width: '100%' }} min={1} />
				</Form.Item>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{isEdit ? 'Lưu lại' : 'Thêm mới'}
				</Button>
			</Form>
		</Modal>
	);
};

export default ExerciseFormModal;
