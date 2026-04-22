const now = new Date();

const daysAgo = (n: number): string => {
	const d = new Date(now);
	d.setDate(d.getDate() - n);
	return d.toISOString();
};

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;

export const SEED_TAGS: Blog.ITag[] = [
	{ id: 't1', name: 'React', slug: 'react', createdAt: daysAgo(60) },
	{ id: 't2', name: 'TypeScript', slug: 'typescript', createdAt: daysAgo(59) },
	{ id: 't3', name: 'JavaScript', slug: 'javascript', createdAt: daysAgo(58) },
	{ id: 't4', name: 'CSS', slug: 'css', createdAt: daysAgo(57) },
	{ id: 't5', name: 'Node.js', slug: 'nodejs', createdAt: daysAgo(56) },
	{ id: 't6', name: 'Next.js', slug: 'nextjs', createdAt: daysAgo(55) },
	{ id: 't7', name: 'UI/UX', slug: 'ui-ux', createdAt: daysAgo(54) },
	{ id: 't8', name: 'DevOps', slug: 'devops', createdAt: daysAgo(53) },
];

export const SEED_AUTHOR: Blog.IAuthor = {
	name: 'Nguyễn Văn A',
	avatar: 'https://i.pravatar.cc/200?img=12',
	bio: 'Sinh viên PTIT, yêu thích phát triển web và chia sẻ kiến thức về React, TypeScript và Node.js.',
	skills: ['React', 'TypeScript', 'Node.js', 'Ant Design', 'UmiJS', 'Git'],
	socials: [
		{ label: 'GitHub', url: 'https://github.com' },
		{ label: 'Facebook', url: 'https://facebook.com' },
		{ label: 'Email', url: 'mailto:author@example.com' },
	],
};

const markdownBody = (title: string) => `# ${title}

Đây là **nội dung mẫu** cho bài viết. Bạn có thể thay thế nội dung này bằng bài viết thực tế của mình.

## Mở đầu

Trong bài viết này chúng ta sẽ tìm hiểu về chủ đề: _${title}_.

- Điểm chính 1
- Điểm chính 2
- Điểm chính 3

## Ví dụ code

\`\`\`ts
export const hello = (name: string) => \`Xin chào, \${name}!\`;
\`\`\`

## Kết luận

Cảm ơn bạn đã đọc bài viết. Hãy để lại góp ý nếu bạn thấy hữu ích.`;

type TSeedPostInput = {
	title: string;
	slug: string;
	summary: string;
	tags: string[];
	status?: Blog.TPostStatus;
	daysOld: number;
};

const rawPosts: TSeedPostInput[] = [
	{
		title: 'Bắt đầu với React 17 và Hooks',
		slug: 'bat-dau-voi-react-17-va-hooks',
		summary: 'Tổng quan về cách khởi tạo dự án React 17 và sử dụng Hooks hiệu quả.',
		tags: ['react', 'javascript'],
		daysOld: 1,
	},
	{
		title: 'TypeScript cho người mới: 10 điều cần biết',
		slug: 'typescript-cho-nguoi-moi',
		summary: 'Những khái niệm cốt lõi của TypeScript giúp bạn viết code an toàn hơn.',
		tags: ['typescript', 'javascript'],
		daysOld: 2,
	},
	{
		title: 'Ant Design Pro: xây dashboard trong 30 phút',
		slug: 'antd-pro-dashboard-30-phut',
		summary: 'Hướng dẫn nhanh Ant Design Pro để xây giao diện quản trị gọn gàng.',
		tags: ['react', 'ui-ux'],
		daysOld: 3,
	},
	{
		title: 'Hiểu về useEffect và dependency array',
		slug: 'hieu-ve-useeffect',
		summary: 'Những lỗi thường gặp khi dùng useEffect và cách tránh.',
		tags: ['react'],
		daysOld: 4,
	},
	{
		title: 'CSS Grid vs Flexbox: khi nào dùng gì?',
		slug: 'css-grid-vs-flexbox',
		summary: 'So sánh Grid và Flexbox với các ví dụ layout thực tế.',
		tags: ['css', 'ui-ux'],
		daysOld: 5,
	},
	{
		title: 'Xây REST API với Node.js và Express',
		slug: 'rest-api-nodejs-express',
		summary: 'Bộ khung REST API cơ bản với middleware, router và error handler.',
		tags: ['nodejs', 'javascript'],
		daysOld: 6,
	},
	{
		title: 'Next.js 13: App Router có gì mới?',
		slug: 'nextjs-13-app-router',
		summary: 'Điểm qua các tính năng nổi bật của App Router trong Next.js.',
		tags: ['nextjs', 'react'],
		daysOld: 7,
	},
	{
		title: 'Debounce và Throttle trong JavaScript',
		slug: 'debounce-va-throttle',
		summary: 'Giải thích và triển khai debounce/throttle để tối ưu hiệu năng.',
		tags: ['javascript'],
		daysOld: 8,
	},
	{
		title: 'Chuẩn hóa commit với Husky và Lint-staged',
		slug: 'chuan-hoa-commit-husky',
		summary: 'Thiết lập quy trình pre-commit tự động cho team frontend.',
		tags: ['devops'],
		daysOld: 9,
	},
	{
		title: 'Tối ưu hiệu năng ứng dụng React',
		slug: 'toi-uu-hieu-nang-react',
		summary: 'Memoization, code splitting và những mẹo profiling thực tế.',
		tags: ['react'],
		daysOld: 10,
	},
	{
		title: 'Viết Custom Hook tái sử dụng',
		slug: 'viet-custom-hook',
		summary: 'Gợi ý tư duy để tách logic ra hook dùng chung.',
		tags: ['react', 'typescript'],
		daysOld: 11,
	},
	{
		title: 'Tailwind vs CSS-in-JS: chọn giải pháp nào?',
		slug: 'tailwind-vs-css-in-js',
		summary: 'Ưu nhược điểm để chọn hướng styling cho dự án mới.',
		tags: ['css', 'ui-ux'],
		daysOld: 12,
	},
	{
		title: 'Testing React với React Testing Library',
		slug: 'testing-react-rtl',
		summary: 'Nguyên tắc kiểm thử theo hành vi người dùng.',
		tags: ['react'],
		daysOld: 13,
	},
	{
		title: 'Tìm hiểu về Closure trong JavaScript',
		slug: 'closure-javascript',
		summary: 'Giải thích closure qua ví dụ dễ hiểu.',
		tags: ['javascript'],
		daysOld: 14,
	},
	{
		title: 'Typescript Generics dễ hiểu cho người mới',
		slug: 'typescript-generics',
		summary: 'Cách dùng Generics để viết hàm tái sử dụng an toàn kiểu.',
		tags: ['typescript'],
		daysOld: 15,
	},
	{
		title: 'CI/CD cơ bản cho dự án frontend',
		slug: 'cicd-frontend-basic',
		summary: 'Dựng pipeline build/deploy đơn giản với GitHub Actions.',
		tags: ['devops'],
		daysOld: 16,
	},
	{
		title: 'Quản lý form lớn với Ant Design',
		slug: 'quan-ly-form-lon-antd',
		summary: 'Chia nhỏ form, validate tập trung và lưu nháp.',
		tags: ['react', 'ui-ux'],
		daysOld: 17,
	},
	{
		title: 'Responsive design cho ứng dụng quản trị',
		slug: 'responsive-quan-tri',
		summary: 'Nguyên tắc thiết kế responsive cho dashboard nhiều bảng.',
		tags: ['css', 'ui-ux'],
		daysOld: 18,
	},
	{
		title: 'Hiểu sâu về event loop trong Node.js',
		slug: 'event-loop-nodejs',
		summary: 'Cách Node.js xử lý bất đồng bộ qua event loop.',
		tags: ['nodejs', 'javascript'],
		daysOld: 19,
	},
	{
		title: 'SSR vs CSR vs SSG trong Next.js',
		slug: 'ssr-csr-ssg-nextjs',
		summary: 'Phân biệt các chiến lược render và khi nào dùng.',
		tags: ['nextjs', 'react'],
		daysOld: 20,
	},
	{
		title: 'Clean code JavaScript: 10 thói quen tốt',
		slug: 'clean-code-javascript',
		summary: 'Những thói quen giúp code dễ đọc, dễ bảo trì.',
		tags: ['javascript'],
		daysOld: 21,
	},
	{
		title: 'Tổ chức thư mục dự án React Enterprise',
		slug: 'to-chuc-thu-muc-react',
		summary: 'Gợi ý tổ chức theo feature-first thay vì layer-first.',
		tags: ['react', 'typescript'],
		daysOld: 22,
	},
	{
		title: 'Bảo mật API với JWT và Refresh Token',
		slug: 'bao-mat-api-jwt',
		summary: 'Luồng xác thực an toàn với JWT và refresh token.',
		tags: ['nodejs'],
		daysOld: 23,
		status: 'draft',
	},
	{
		title: 'Làm quen với Mermaid để vẽ sơ đồ',
		slug: 'lam-quen-mermaid',
		summary: 'Dùng Mermaid để tạo sơ đồ ngay trong tài liệu Markdown.',
		tags: ['ui-ux'],
		daysOld: 24,
		status: 'draft',
	},
];

export const SEED_POSTS: Blog.IPost[] = rawPosts.map((p, index) => ({
	id: `p${index + 1}`,
	title: p.title,
	slug: p.slug,
	summary: p.summary,
	content: markdownBody(p.title),
	cover: cover(p.slug),
	tags: p.tags,
	author: SEED_AUTHOR.name,
	status: p.status ?? 'published',
	viewCount: Math.floor(Math.random() * 200),
	createdAt: daysAgo(p.daysOld),
	updatedAt: daysAgo(p.daysOld),
}));
