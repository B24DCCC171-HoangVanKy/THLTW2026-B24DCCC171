import { STORAGE_KEYS } from './constant';
import { SEED_AUTHOR, SEED_POSTS, SEED_TAGS } from './seed';

const delay = <T>(data: T, ms = 150): Promise<T> =>
	new Promise((resolve) => setTimeout(() => resolve(data), ms));

const readJSON = <T>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
};

const writeJSON = (key: string, data: any) => {
	localStorage.setItem(key, JSON.stringify(data));
};

const ensureSeed = () => {
	if (typeof window === 'undefined') return;
	if (!localStorage.getItem(STORAGE_KEYS.SEEDED)) {
		writeJSON(STORAGE_KEYS.POSTS, SEED_POSTS);
		writeJSON(STORAGE_KEYS.TAGS, SEED_TAGS);
		writeJSON(STORAGE_KEYS.AUTHOR, SEED_AUTHOR);
		localStorage.setItem(STORAGE_KEYS.SEEDED, '1');
	}
};

const genId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const slugify = (input: string): string => {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

const taoSlugDuyNhat = <T extends { id: string; slug: string }>(
	base: string,
	danhSach: T[],
	boQuaId?: string,
	fallback = 'muc',
): string => {
	let slug = base || fallback;
	let dem = 2;
	while (danhSach.some((item) => item.slug === slug && item.id !== boQuaId)) {
		slug = `${base}-${dem}`;
		dem += 1;
	}
	return slug;
};

const readPosts = () => readJSON<Blog.IPost[]>(STORAGE_KEYS.POSTS, []);
const readTags = () => readJSON<Blog.ITag[]>(STORAGE_KEYS.TAGS, []);

export async function getPosts(params?: Blog.IListPostParams): Promise<Blog.IPost[]> {
	ensureSeed();
	let dsBaiViet = readPosts();

	if (params?.status) dsBaiViet = dsBaiViet.filter((p) => p.status === params.status);
	if (params?.tag) dsBaiViet = dsBaiViet.filter((p) => p.tags.includes(params.tag!));
	if (params?.keyword) {
		const tuKhoa = params.keyword.trim().toLowerCase();
		dsBaiViet = dsBaiViet.filter(
			(p) =>
				p.title.toLowerCase().includes(tuKhoa) ||
				p.summary.toLowerCase().includes(tuKhoa) ||
				p.content.toLowerCase().includes(tuKhoa),
		);
	}

	const dsSapXep = [...dsBaiViet].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return delay(dsSapXep);
}

export async function getPostBySlug(slug: string): Promise<Blog.IPost | undefined> {
	ensureSeed();
	return delay(readPosts().find((p) => p.slug === slug));
}

export async function createPost(payload: Partial<Blog.IPost>): Promise<Blog.IPost> {
	ensureSeed();
	const dsBaiViet = readPosts();
	const nowIso = new Date().toISOString();
	const slugGoc = payload.slug?.trim() ? slugify(payload.slug) : slugify(payload.title ?? '');
	const baiMoi: Blog.IPost = {
		id: genId('p'),
		title: payload.title ?? '',
		slug: taoSlugDuyNhat(slugGoc, dsBaiViet, undefined, 'bai-viet'),
		summary: payload.summary ?? '',
		content: payload.content ?? '',
		cover: payload.cover ?? '',
		tags: payload.tags ?? [],
		author: payload.author ?? readJSON<Blog.IAuthor>(STORAGE_KEYS.AUTHOR, SEED_AUTHOR).name,
		status: payload.status ?? 'draft',
		viewCount: 0,
		createdAt: nowIso,
		updatedAt: nowIso,
	};
	writeJSON(STORAGE_KEYS.POSTS, [baiMoi, ...dsBaiViet]);
	return delay(baiMoi);
}

export async function updatePost(
	id: string,
	payload: Partial<Blog.IPost>,
): Promise<Blog.IPost | undefined> {
	ensureSeed();
	const dsBaiViet = readPosts();
	const index = dsBaiViet.findIndex((p) => p.id === id);
	if (index === -1) return delay(undefined);

	const slugMoi = payload.slug
		? taoSlugDuyNhat(slugify(payload.slug), dsBaiViet, id, 'bai-viet')
		: dsBaiViet[index].slug;

	const baiSauCapNhat: Blog.IPost = {
		...dsBaiViet[index],
		...payload,
		slug: slugMoi,
		updatedAt: new Date().toISOString(),
	};
	dsBaiViet[index] = baiSauCapNhat;
	writeJSON(STORAGE_KEYS.POSTS, dsBaiViet);
	return delay(baiSauCapNhat);
}

export async function deletePost(id: string): Promise<boolean> {
	ensureSeed();
	const conLai = readPosts().filter((p) => p.id !== id);
	writeJSON(STORAGE_KEYS.POSTS, conLai);
	return delay(true);
}

export async function incrementViewCount(id: string): Promise<number> {
	ensureSeed();
	const dsBaiViet = readPosts();
	const index = dsBaiViet.findIndex((p) => p.id === id);
	if (index === -1) return delay(0);

	const soLuotMoi = (dsBaiViet[index].viewCount ?? 0) + 1;
	dsBaiViet[index] = { ...dsBaiViet[index], viewCount: soLuotMoi };
	writeJSON(STORAGE_KEYS.POSTS, dsBaiViet);
	return delay(soLuotMoi);
}

export async function getTags(): Promise<Blog.ITag[]> {
	ensureSeed();
	return delay(readTags());
}

export async function createTag(payload: { name: string; slug?: string }): Promise<Blog.ITag> {
	ensureSeed();
	const dsTag = readTags();
	const slugGoc = payload.slug?.trim() ? slugify(payload.slug) : slugify(payload.name);
	const tagMoi: Blog.ITag = {
		id: genId('t'),
		name: payload.name.trim(),
		slug: taoSlugDuyNhat(slugGoc, dsTag, undefined, 'tag'),
		createdAt: new Date().toISOString(),
	};
	writeJSON(STORAGE_KEYS.TAGS, [...dsTag, tagMoi]);
	return delay(tagMoi);
}

export async function updateTag(
	id: string,
	payload: Partial<Blog.ITag>,
): Promise<Blog.ITag | undefined> {
	ensureSeed();
	const dsTag = readTags();
	const index = dsTag.findIndex((t) => t.id === id);
	if (index === -1) return delay(undefined);

	const slugCu = dsTag[index].slug;
	const slugMoi = payload.slug
		? taoSlugDuyNhat(slugify(payload.slug), dsTag, id, 'tag')
		: slugCu;

	const tagSauCapNhat: Blog.ITag = { ...dsTag[index], ...payload, slug: slugMoi };
	dsTag[index] = tagSauCapNhat;
	writeJSON(STORAGE_KEYS.TAGS, dsTag);

	if (slugMoi !== slugCu) dongBoSlugTagTrongBaiViet(slugCu, slugMoi);

	return delay(tagSauCapNhat);
}

export async function deleteTag(id: string): Promise<boolean> {
	ensureSeed();
	const dsTag = readTags();
	const tagCanXoa = dsTag.find((t) => t.id === id);
	writeJSON(STORAGE_KEYS.TAGS, dsTag.filter((t) => t.id !== id));

	if (tagCanXoa) goBoTagKhoiBaiViet(tagCanXoa.slug);

	return delay(true);
}

const dongBoSlugTagTrongBaiViet = (slugCu: string, slugMoi: string) => {
	const dsBaiViet = readPosts();
	const dsMoi = dsBaiViet.map((p) => ({
		...p,
		tags: p.tags.map((t) => (t === slugCu ? slugMoi : t)),
	}));
	writeJSON(STORAGE_KEYS.POSTS, dsMoi);
};

const goBoTagKhoiBaiViet = (slug: string) => {
	const dsBaiViet = readPosts();
	const dsMoi = dsBaiViet.map((p) => ({
		...p,
		tags: p.tags.filter((s) => s !== slug),
	}));
	writeJSON(STORAGE_KEYS.POSTS, dsMoi);
};

export async function getAuthor(): Promise<Blog.IAuthor> {
	ensureSeed();
	return delay(readJSON<Blog.IAuthor>(STORAGE_KEYS.AUTHOR, SEED_AUTHOR));
}
