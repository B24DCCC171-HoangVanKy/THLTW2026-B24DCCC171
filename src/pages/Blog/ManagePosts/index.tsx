import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import { EPostStatus, POST_STATUS_LABEL } from '@/services/Blog/constant';
import PostForm from '../components/PostForm';
import '../style.less';

const ManagePostsPage: React.FC = () => {
	const { posts, loading, formSubmiting, fetchPosts, createPost, updatePost, deletePost } = useModel('blog.post');
	const { tags, fetchTags } = useModel('blog.tag');

	const [tuKhoa, setTuKhoa] = useState<string>('');
	const [trangThai, setTrangThai] = useState<Blog.TPostStatus | undefined>(undefined);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [baiDangSua, setBaiDangSua] = useState<Blog.IPost | undefined>(undefined);

	useEffect(() => {
		fetchPosts();
		fetchTags();
	}, [fetchPosts, fetchTags]);

	const tenTag = (slug: string) => tags.find((tag) => tag.slug === slug)?.name ?? slug;

	const dsHienThi = useMemo(() => {
		const kw = tuKhoa.trim().toLowerCase();
		return posts
			.filter((bai) => (trangThai ? bai.status === trangThai : true))
			.filter((bai) => (kw ? bai.title.toLowerCase().includes(kw) : true));
	}, [posts, tuKhoa, trangThai]);

	const moFormThem = () => {
		setBaiDangSua(undefined);
		setVisibleForm(true);
	};

	const moFormSua = (bai: Blog.IPost) => {
		setBaiDangSua(bai);
		setVisibleForm(true);
	};

	const dongForm = () => {
		setVisibleForm(false);
		setBaiDangSua(undefined);
	};

	const luuBai = async (values: Partial<Blog.IPost>) => {
		if (baiDangSua?.id) await updatePost(baiDangSua.id, values);
		else await createPost(values);
		dongForm();
	};

	const xoaBai = async (id: string) => {
		await deletePost(id);
	};

	const columns: ColumnsType<Blog.IPost> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			width: 280,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: Blog.TPostStatus) => (
				<Tag color={status === EPostStatus.PUBLISHED ? 'green' : 'default'}>
					{POST_STATUS_LABEL[status]}
				</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			width: 260,
			render: (slugs: string[]) => (
				<Space wrap>
					{slugs.map((slug) => (
						<Tag key={slug} color='blue'>
							{tenTag(slug)}
						</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			key: 'viewCount',
			width: 100,
			align: 'center',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			align: 'center',
			render: (_, bai) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => moFormSua(bai)} />
					<Popconfirm title='Xác nhận xóa bài viết này?' onConfirm={() => xoaBai(bai.id)}>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card bordered={false} className='blog-manage'>
			<div className='blog-manage__header'>
				<Space wrap>
					<Input
						allowClear
						placeholder='Tìm theo tiêu đề'
						value={tuKhoa}
						onChange={(e) => setTuKhoa(e.target.value)}
						style={{ width: 260 }}
					/>
					<Select
						allowClear
						placeholder='Lọc trạng thái'
						value={trangThai}
						onChange={(v) => setTrangThai(v)}
						style={{ width: 180 }}
						options={[
							{ value: EPostStatus.DRAFT, label: POST_STATUS_LABEL[EPostStatus.DRAFT] },
							{ value: EPostStatus.PUBLISHED, label: POST_STATUS_LABEL[EPostStatus.PUBLISHED] },
						]}
					/>
				</Space>

				<Button type='primary' icon={<PlusOutlined />} onClick={moFormThem}>
					Thêm bài viết
				</Button>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={dsHienThi}
				columns={columns}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				visible={visibleForm}
				onCancel={dongForm}
				footer={null}
				destroyOnClose
				width={760}
				title={baiDangSua ? 'Sửa bài viết' : 'Thêm bài viết'}
			>
				<PostForm
					initialValues={baiDangSua}
					tags={tags}
					loading={formSubmiting}
					onSubmit={luuBai}
					onCancel={dongForm}
				/>
			</Modal>
		</Card>
	);
};

export default ManagePostsPage;
