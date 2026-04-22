declare namespace Blog {
	export type TPostStatus = 'draft' | 'published';

	export interface IAuthor {
		name: string;
		avatar: string;
		bio: string;
		skills: string[];
		socials: { label: string; url: string; icon?: string }[];
	}

	export interface ITag {
		id: string;
		name: string;
		slug: string;
		createdAt: string;
	}

	export interface IPost {
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		cover: string;
		tags: string[];
		author: string;
		status: TPostStatus;
		viewCount: number;
		createdAt: string;
		updatedAt: string;
	}

	export interface IListPostParams {
		keyword?: string;
		tag?: string;
		status?: TPostStatus;
	}
}
