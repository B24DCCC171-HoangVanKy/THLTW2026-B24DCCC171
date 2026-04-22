import { useCallback, useState } from 'react';
import * as blogService from '@/services/Blog';

export default () => {
	const [tags, setTags] = useState<Blog.ITag[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const [currentTag, setCurrentTag] = useState<Blog.ITag | undefined>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);

	const fetchTags = useCallback(async () => {
		setLoading(true);
		try {
			const data = await blogService.getTags();
			setTags(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const createTag = async (payload: { name: string; slug?: string }) => {
		setFormSubmiting(true);
		try {
			const res = await blogService.createTag(payload);
			await fetchTags();
			return res;
		} finally {
			setFormSubmiting(false);
		}
	};

	const updateTag = async (id: string, payload: Partial<Blog.ITag>) => {
		setFormSubmiting(true);
		try {
			const res = await blogService.updateTag(id, payload);
			await fetchTags();
			return res;
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteTag = async (id: string) => {
		await blogService.deleteTag(id);
		await fetchTags();
	};

	return {
		tags,
		setTags,
		loading,
		formSubmiting,

		currentTag,
		setCurrentTag,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,

		fetchTags,
		createTag,
		updateTag,
		deleteTag,
	};
};
