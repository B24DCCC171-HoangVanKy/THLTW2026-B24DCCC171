import { EPostStatus, POST_STATUS_LABEL } from '@/services/Blog/constant';
import { Button, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';

interface PostFormProps {
	initialValues?: Partial<Blog.IPost>;
	tags: Blog.ITag[];
	loading?: boolean;
	onSubmit: (values: Partial<Blog.IPost>) => Promise<void> | void;
	onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialValues, tags, loading, onSubmit, onCancel }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			title: initialValues?.title ?? '',
			slug: initialValues?.slug ?? '',
			summary: initialValues?.summary ?? '',
			content: initialValues?.content ?? '',
			cover: initialValues?.cover ?? '',
			tags: initialValues?.tags ?? [],
			status: initialValues?.status ?? EPostStatus.DRAFT,
		});
	}, [form, initialValues]);

	return (
		<Form form={form} layout='vertical' onFinish={onSubmit}>
			<Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
				<Input />
			</Form.Item>

			<Form.Item name='slug' label='Slug'>
				<Input placeholder='Tự sinh nếu để trống' />
			</Form.Item>

			<Form.Item name='summary' label='Tóm tắt' rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
				<Input.TextArea rows={3} />
			</Form.Item>

			<Form.Item name='content' label='Nội dung' rules={[{ required: true, message: 'Nhập nội dung' }]}>
				<Input.TextArea rows={8} />
			</Form.Item>

			<Form.Item
				name='cover'
				label='Ảnh đại diện (URL)'
				rules={[{ required: true, message: 'Nhập URL ảnh đại diện' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item name='tags' label='Thẻ' rules={[{ required: true, message: 'Chọn ít nhất 1 thẻ' }]}>
				<Select
					mode='multiple'
					options={tags.map((tag) => ({ value: tag.slug, label: tag.name }))}
					placeholder='Chọn thẻ'
				/>
			</Form.Item>

			<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
				<Select
					options={[
						{ value: EPostStatus.DRAFT, label: POST_STATUS_LABEL[EPostStatus.DRAFT] },
						{ value: EPostStatus.PUBLISHED, label: POST_STATUS_LABEL[EPostStatus.PUBLISHED] },
					]}
				/>
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

export default PostForm;
