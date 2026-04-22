import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Space, Spin, Tag, Typography } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { useEffect, useMemo, useState } from 'react';
import { history, useModel, useParams } from 'umi';
import PostCard from '../components/PostCard';
import { layBaiLienQuan } from '../utils';
import '../style.less';

const { Title, Text } = Typography;

const BlogPostDetailPage: React.FC = () => {
	const { slug = '' } = useParams<{ slug: string }>();
	const { posts, loading, fetchPosts, fetchPostBySlug, incrementView } = useModel('blog.post');
	const { tags, fetchTags } = useModel('blog.tag');
	const [bai, setBai] = useState<Blog.IPost | undefined>();

	useEffect(() => {
		const taiDuLieu = async () => {
			await Promise.all([fetchPosts(), fetchTags()]);
			const baiTheoSlug = await fetchPostBySlug(slug);
			if (baiTheoSlug?.id) {
				await incrementView(baiTheoSlug.id);
				await fetchPosts();
				const baiMoi = await fetchPostBySlug(slug);
				setBai(baiMoi);
				return;
			}
			setBai(baiTheoSlug);
		};
		taiDuLieu();
	}, [slug, fetchPosts, fetchTags, fetchPostBySlug, incrementView]);

	const baiLienQuan = useMemo(() => layBaiLienQuan(posts, bai, 3), [posts, bai]);

	const tenTag = (slugTag: string) => tags.find((t) => t.slug === slugTag)?.name ?? slugTag;

	if (!loading && !bai) {
		return (
			<Card bordered={false}>
				<Empty description='Không tìm thấy bài viết' />
				<div className='blog-detail__back'>
					<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')}>
						Quay lại danh sách
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Spin spinning={loading}>
			<Card bordered={false} className='blog-detail'>
				<div className='blog-detail__back'>
					<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')}>
						Quay lại danh sách
					</Button>
				</div>

				{bai && (
					<>
						<Title level={2} className='blog-detail__title'>
							{bai.title}
						</Title>

						<Space wrap size={16} className='blog-detail__meta'>
							<Text>
								<UserOutlined /> {bai.author}
							</Text>
							<Text>
								<CalendarOutlined /> {moment(bai.createdAt).format('DD/MM/YYYY')}
							</Text>
							<Text>
								<EyeOutlined /> {bai.viewCount}
							</Text>
						</Space>

						<div className='blog-detail__tag-list'>
							{bai.tags.map((slugTag) => (
								<Tag key={slugTag} color='blue'>
									{tenTag(slugTag)}
								</Tag>
							))}
						</div>

						{bai.cover && (
							<div
								className='blog-detail__cover'
								style={{
									backgroundImage: `url(${bai.cover})`,
								}}
							/>
						)}

						<div className='blog-detail__markdown'>
							<ReactMarkdown>{bai.content}</ReactMarkdown>
						</div>

						<div className='blog-detail__related'>
							<Title level={4}>Bài viết liên quan</Title>
							{baiLienQuan.length === 0 ? (
								<Empty description='Chưa có bài liên quan' />
							) : (
								<Row gutter={[16, 16]}>
									{baiLienQuan.map((baiKhac) => (
										<Col key={baiKhac.id} xs={24} sm={12} md={8}>
											<PostCard post={baiKhac} tags={tags} />
										</Col>
									))}
								</Row>
							)}
						</div>
					</>
				)}
			</Card>
		</Spin>
	);
};

export default BlogPostDetailPage;
