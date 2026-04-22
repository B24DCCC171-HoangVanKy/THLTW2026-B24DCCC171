import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import TagForm from '../components/TagForm';
import '../style.less';

type TTagRow = Blog.ITag & { usageCount: number };

const ManageTagsPage: React.FC = () => {
	const { tags, loading, formSubmiting, fetchTags, createTag, updateTag, deleteTag } = useModel('blog.tag');
	const { posts, fetchPosts } = useModel('blog.post');

	const [tuKhoa, setTuKhoa] = useState<string>('');
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [tagDangSua, setTagDangSua] = useState<Blog.ITag | undefined>(undefined);

	useEffect(() => {
		fetchTags();
		fetchPosts();
	}, [fetchTags, fetchPosts]);

	const dsTag = useMemo<TTagRow[]>(() => {
		const kw = tuKhoa.trim().toLowerCase();
		return tags
			.map((tag) => ({
				...tag,
				usageCount: posts.filter((bai) => bai.tags.includes(tag.slug)).length,
			}))
			.filter((tag) => (kw ? tag.name.toLowerCase().includes(kw) || tag.slug.toLowerCase().includes(kw) : true));
	}, [tags, posts, tuKhoa]);

	const moFormThem = () => {
		setTagDangSua(undefined);
		setVisibleForm(true);
	};

	const moFormSua = (tag: Blog.ITag) => {
		setTagDangSua(tag);
		setVisibleForm(true);
	};

	const dongForm = () => {
		setVisibleForm(false);
		setTagDangSua(undefined);
	};

	const luuTag = async (values: { name: string; slug?: string }) => {
		if (tagDangSua?.id) await updateTag(tagDangSua.id, values);
		else await createTag(values);
		await fetchPosts();
		dongForm();
	};

	const xoaTag = async (id: string) => {
		await deleteTag(id);
		await fetchPosts();
	};

	const columns: ColumnsType<TTagRow> = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
		},
		{
			title: 'Số bài viết sử dụng',
			dataIndex: 'usageCount',
			key: 'usageCount',
			width: 180,
			align: 'center',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			align: 'center',
			render: (_, tag) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => moFormSua(tag)} />
					<Popconfirm title='Xác nhận xóa thẻ này?' onConfirm={() => xoaTag(tag.id)}>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card bordered={false} className='blog-manage'>
			<div className='blog-manage__header'>
				<Input
					allowClear
					placeholder='Tìm tên thẻ'
					value={tuKhoa}
					onChange={(e) => setTuKhoa(e.target.value)}
					style={{ width: 260 }}
				/>
				<Button type='primary' icon={<PlusOutlined />} onClick={moFormThem}>
					Thêm thẻ
				</Button>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={dsTag}
				columns={columns}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				visible={visibleForm}
				onCancel={dongForm}
				footer={null}
				destroyOnClose
				width={520}
				title={tagDangSua ? 'Sửa thẻ' : 'Thêm thẻ'}
			>
				<TagForm initialValues={tagDangSua} loading={formSubmiting} onSubmit={luuTag} onCancel={dongForm} />
			</Modal>
		</Card>
	);
};

export default ManageTagsPage;
