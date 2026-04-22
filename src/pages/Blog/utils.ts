export const locBaiViet = (
	dsBaiViet: Blog.IPost[],
	opts: { tag?: string; tuKhoa?: string; chiLayDaDang?: boolean },
): Blog.IPost[] => {
	const { tag, tuKhoa, chiLayDaDang } = opts;
	const tuKhoaLower = tuKhoa?.trim().toLowerCase() ?? '';

	return dsBaiViet.filter((bai) => {
		if (chiLayDaDang && bai.status !== 'published') return false;
		if (tag && !bai.tags.includes(tag)) return false;
		if (!tuKhoaLower) return true;
		return (
			bai.title.toLowerCase().includes(tuKhoaLower) ||
			bai.summary.toLowerCase().includes(tuKhoaLower) ||
			bai.content.toLowerCase().includes(tuKhoaLower)
		);
	});
};

export const phanTrang = <T>(danhSach: T[], trang: number, kichThuoc: number): T[] => {
	const batDau = (trang - 1) * kichThuoc;
	return danhSach.slice(batDau, batDau + kichThuoc);
};

export const layBaiLienQuan = (
	dsBaiViet: Blog.IPost[],
	baiHienTai?: Blog.IPost,
	gioiHan = 3,
): Blog.IPost[] => {
	if (!baiHienTai) return [];
	return dsBaiViet
		.filter((bai) => bai.status === 'published')
		.filter((bai) => bai.id !== baiHienTai.id)
		.filter((bai) => bai.tags.some((tag) => baiHienTai.tags.includes(tag)))
		.slice(0, gioiHan);
};
