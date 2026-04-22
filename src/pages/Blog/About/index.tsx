import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getAuthor } from '@/services/Blog';
import '../style.less';

const { Title, Paragraph, Text, Link } = Typography;

const BlogAboutPage: React.FC = () => {
	const [tacGia, setTacGia] = useState<Blog.IAuthor | undefined>();

	useEffect(() => {
		getAuthor().then(setTacGia);
	}, []);

	return (
		<Card bordered={false} className='blog-about'>
			{tacGia && (
				<Row gutter={[24, 24]}>
					<Col xs={24} md={8}>
						<div className='blog-about__profile'>
							<div
								className='blog-about__avatar'
								style={{ backgroundImage: `url(${tacGia.avatar})` }}
							/>
							<Title level={4}>{tacGia.name}</Title>
						</div>
					</Col>
					<Col xs={24} md={16}>
						<Space direction='vertical' size={16} style={{ width: '100%' }}>
							<div>
								<Title level={5}>Tiểu sử</Title>
								<Paragraph>{tacGia.bio}</Paragraph>
							</div>

							<div>
								<Title level={5}>Kỹ năng</Title>
								<div className='blog-about__skill-list'>
									{tacGia.skills.map((kyNang) => (
										<Tag key={kyNang} color='blue'>
											{kyNang}
										</Tag>
									))}
								</div>
							</div>

							<div>
								<Title level={5}>Mạng xã hội</Title>
								<Space wrap size={12}>
									{tacGia.socials.map((mxh) => (
										<Text key={mxh.label}>
											<Link href={mxh.url} target='_blank'>
												{mxh.label}
											</Link>
										</Text>
									))}
								</Space>
							</div>
						</Space>
					</Col>
				</Row>
			)}
		</Card>
	);
};

export default BlogAboutPage;
