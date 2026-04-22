import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';
import moment from 'moment';
import { Link } from 'umi';

const { Meta } = Card;
const { Paragraph, Title } = Typography;

interface PostCardProps {
	post: Blog.IPost;
	tags: Blog.ITag[];
	onTagClick?: (slug: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, tags, onTagClick }) => {
	const layTenTag = (slug: string) => tags.find((t) => t.slug === slug)?.name ?? slug;

	const onClickTag = (e: React.MouseEvent, slug: string) => {
		if (!onTagClick) return;
		e.preventDefault();
		e.stopPropagation();
		onTagClick(slug);
	};

	return (
		<Card
			hoverable
			className='blog-post-card'
			cover={
				<Link to={`/blog/post/${post.slug}`}>
					<div
						className='blog-post-card__cover'
						style={{ backgroundImage: `url(${post.cover})` }}
					/>
				</Link>
			}
		>
			<Meta
				title={
					<Link to={`/blog/post/${post.slug}`} className='blog-post-card__title-link'>
						<Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
							{post.title}
						</Title>
					</Link>
				}
				description={
					<>
						<Paragraph type='secondary' ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
							{post.summary}
						</Paragraph>

						<div className='blog-post-card__meta'>
							<span>
								<UserOutlined /> {post.author}
							</span>
							<span>
								<CalendarOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}
							</span>
							<span>
								<EyeOutlined /> {post.viewCount}
							</span>
						</div>

						<div className='blog-post-card__tags'>
							{post.tags.map((slug) => (
								<Tag
									key={slug}
									color='blue'
									style={{ cursor: onTagClick ? 'pointer' : 'default' }}
									onClick={(e) => onClickTag(e, slug)}
								>
									{layTenTag(slug)}
								</Tag>
							))}
						</div>
					</>
				}
			/>
		</Card>
	);
};

export default PostCard;
