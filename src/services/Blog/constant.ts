export const STORAGE_KEYS = {
	POSTS: 'blog.posts',
	TAGS: 'blog.tags',
	AUTHOR: 'blog.author',
	SEEDED: 'blog.seeded.v1',
};

export const POSTS_PER_PAGE = 9;

export const SEARCH_DEBOUNCE_MS = 300;

export enum EPostStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
}

export const POST_STATUS_LABEL: Record<Blog.TPostStatus, string> = {
	draft: 'Nháp',
	published: 'Đã đăng',
};

export const POST_STATUS_COLOR: Record<Blog.TPostStatus, string> = {
	draft: 'default',
	published: 'green',
};
