import { useCallback, useState } from 'react';
import * as blogService from '@/services/Blog';
import { POSTS_PER_PAGE } from '@/services/Blog/constant';

export default () => {
	const [posts, setPosts] = useState<Blog.IPost[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const [keyword, setKeyword] = useState<string>('');
	const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
	const [statusFilter, setStatusFilter] = useState<Blog.TPostStatus | undefined>(undefined);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(POSTS_PER_PAGE);

	const [currentPost, setCurrentPost] = useState<Blog.IPost | undefined>(undefined);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const data = await blogService.getPosts();
			setPosts(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchPostBySlug = useCallback(async (slug: string) => {
		setLoading(true);
		try {
			const data = await blogService.getPostBySlug(slug);
			setCurrentPost(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const createPost = async (payload: Partial<Blog.IPost>) => {
		setFormSubmiting(true);
		try {
			const res = await blogService.createPost(payload);
			await fetchPosts();
			return res;
		} finally {
			setFormSubmiting(false);
		}
	};

	const updatePost = async (id: string, payload: Partial<Blog.IPost>) => {
		setFormSubmiting(true);
		try {
			const res = await blogService.updatePost(id, payload);
			await fetchPosts();
			return res;
		} finally {
			setFormSubmiting(false);
		}
	};

	const deletePost = async (id: string) => {
		await blogService.deletePost(id);
		await fetchPosts();
	};

	const incrementView = async (id: string) => {
		return blogService.incrementViewCount(id);
	};

	const resetFilters = () => {
		setKeyword('');
		setActiveTag(undefined);
		setStatusFilter(undefined);
		setPage(1);
	};

	return {
		posts,
		setPosts,
		loading,
		formSubmiting,

		keyword,
		setKeyword,
		activeTag,
		setActiveTag,
		statusFilter,
		setStatusFilter,

		page,
		setPage,
		pageSize,
		setPageSize,

		currentPost,
		setCurrentPost,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,

		fetchPosts,
		fetchPostBySlug,
		createPost,
		updatePost,
		deletePost,
		incrementView,
		resetFilters,
	};
};
