import { Tag } from 'antd';

interface TagFilterProps {
	tags: Blog.ITag[];
	activeTag?: string;
	onChange: (slug?: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, activeTag, onChange }) => {
	return (
		<div className='blog-tag-filter'>
			<Tag.CheckableTag checked={!activeTag} onChange={() => onChange(undefined)}>
				Tất cả
			</Tag.CheckableTag>
			{tags.map((tag) => (
				<Tag.CheckableTag
					key={tag.id}
					checked={activeTag === tag.slug}
					onChange={(checked) => onChange(checked ? tag.slug : undefined)}
				>
					{tag.name}
				</Tag.CheckableTag>
			))}
		</div>
	);
};

export default TagFilter;
