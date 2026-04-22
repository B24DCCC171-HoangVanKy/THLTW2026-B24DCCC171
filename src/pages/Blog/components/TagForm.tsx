import { Button, Form, Input, Space } from 'antd';
import { useEffect } from 'react';

interface TagFormProps {
	initialValues?: Partial<Blog.ITag>;
	loading?: boolean;
	onSubmit: (values: { name: string; slug?: string }) => Promise<void> | void;
	onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ initialValues, loading, onSubmit, onCancel }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			name: initialValues?.name ?? '',
			slug: initialValues?.slug ?? '',
		});
	}, [form, initialValues]);

	return (
		<Form form={form} layout='vertical' onFinish={onSubmit}>
			<Form.Item name='name' label='Tên thẻ' rules={[{ required: true, message: 'Nhập tên thẻ' }]}>
				<Input />
			</Form.Item>

			<Form.Item name='slug' label='Slug'>
				<Input placeholder='Tự sinh nếu để trống' />
			</Form.Item>

			<Space>
				<Button htmlType='submit' type='primary' loading={loading}>
					Lưu
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</Space>
		</Form>
	);
};

export default TagForm;
