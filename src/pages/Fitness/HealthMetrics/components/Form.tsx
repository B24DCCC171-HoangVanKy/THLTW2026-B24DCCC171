import { Button, Card, DatePicker, Form, InputNumber } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const HealthMetricsForm = () => {
	const [form] = Form.useForm();
	const { record, edit, visibleForm, setVisibleForm, postModel, putModel, formSubmiting } = useModel('fitness.healthMetrics');

	useEffect(() => {
		if (!visibleForm) form.resetFields();
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngay: record.ngay ? moment(record.ngay) : undefined,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any) => {
		const payload = { ...values, ngay: values.ngay?.toISOString() };
		if (edit && record?._id) await putModel(record._id, payload);
		else await postModel(payload);
	};

	return (
		<Card title={edit ? 'Chỉnh sửa chỉ số' : 'Thêm chỉ số sức khỏe'}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ngay' label='Ngày' rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item name='canNangKg' label='Cân nặng (kg)' rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
					<InputNumber style={{ width: '100%' }} min={1} step={0.1} />
				</Form.Item>
				<Form.Item name='chieuCaoCm' label='Chiều cao (cm)' rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
					<InputNumber style={{ width: '100%' }} min={50} step={1} />
				</Form.Item>
				<Form.Item name='nhipTimNghiBpm' label='Nhịp tim nghỉ (bpm)' rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}>
					<InputNumber style={{ width: '100%' }} min={30} max={220} />
				</Form.Item>
				<Form.Item name='gioNgu' label='Giờ ngủ' rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}>
					<InputNumber style={{ width: '100%' }} min={0} max={24} step={0.5} />
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

export default HealthMetricsForm;
