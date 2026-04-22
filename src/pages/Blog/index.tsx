import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { Link, useModel } from 'umi';
import PostCard from './components/PostCard';
import SearchBox from './components/SearchBox';
import TagFilter from './components/TagFilter';
import { locBaiViet, phanTrang } from './utils';
import './style.less';

const BlogHomePage: React.FC = () => {
	const {
		posts,
		loading,
		fetchPosts,
		keyword,
		setKeyword,
		activeTag,
		setActiveTag,
		page,
		setPage,
		pageSize,
	} = useModel('blog.post');

	const { tags, fetchTags } = useModel('blog.tag');

	useEffect(() => {
		fetchPosts();
		fetchTags();
	}, [fetchPosts, fetchTags]);

	useEffect(() => {
		setPage(1);
	}, [activeTag, keyword, setPage]);

	const dsBaiViet = useMemo(
		() => locBaiViet(posts, { tag: activeTag, tuKhoa: keyword, chiLayDaDang: true }),
		[posts, activeTag, keyword],
	);

	const dsHienThi = useMemo(
		() => phanTrang(dsBaiViet, page, pageSize),
		[dsBaiViet, page, pageSize],
	);

	const chuyenTag = (slug: string) => {
		setActiveTag(slug === activeTag ? undefined : slug);
	};

	return (
		<Card bordered={false} className='blog-home'>
			<div className='blog-home__toolbar'>
				<SearchBox value={keyword} onChange={setKeyword} />
				<TagFilter tags={tags} activeTag={activeTag} onChange={setActiveTag} />
				<div className='blog-home__about-link'>
					<Link to='/blog/about'>Giới thiệu tác giả</Link>
				</div>
			</div>

			<Spin spinning={loading}>
				{dsBaiViet.length === 0 ? (
					<div className='blog-home__empty'>
						<Empty description='Không tìm thấy bài viết phù hợp' />
					</div>
				) : (
					<Row gutter={[16, 16]}>
						{dsHienThi.map((bai) => (
							<Col key={bai.id} xs={24} sm={12} md={8}>
								<PostCard post={bai} tags={tags} onTagClick={chuyenTag} />
							</Col>
						))}
					</Row>
				)}
			</Spin>

			{dsBaiViet.length > pageSize && (
				<div className='blog-home__pagination'>
					<Pagination
						current={page}
						pageSize={pageSize}
						total={dsBaiViet.length}
						showSizeChanger={false}
						onChange={(trang) => setPage(trang)}
					/>
				</div>
			)}
		</Card>
	);
};

export default BlogHomePage;
