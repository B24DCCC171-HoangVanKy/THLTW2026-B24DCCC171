import { type INguoiPhuTrach, type IPhongHoc, type TLoaiPhong } from './typing';

const LS_PHONG_HOC = 'phonghoc';
const LS_PHONG_HOC_ID = 'phonghoc_id';

const dsNguoiPhuTrach: INguoiPhuTrach[] = [
	{ id: 'GV01', ten: 'Hoàng Văn Kỳ' },
	{ id: 'GV02', ten: 'Trịnh Trần Phương Tuấn' },
	{ id: 'GV03', ten: 'Nguyễn Sơn Tùng' },
	{ id: 'GV04', ten: 'Đoàn Văn Hậu' },
];

const taoIdDeNhin = (): string => {
	const raw = localStorage.getItem(LS_PHONG_HOC_ID);
	const hienTai = raw ? Number(raw) : 3;
	const tiepTheo = Number.isFinite(hienTai) ? hienTai + 1 : 4;
	localStorage.setItem(LS_PHONG_HOC_ID, String(tiepTheo));
	return `PH-${String(tiepTheo).padStart(3, '0')}`;
};

const layHienTaiIso = () => new Date().toISOString();

const layTenNguoiPhuTrach = (id: string) => dsNguoiPhuTrach.find((x) => x.id === id)?.ten || 'Không rõ';

const duLieuMacDinh = (): IPhongHoc[] => {
	const now = layHienTaiIso();
	localStorage.setItem(LS_PHONG_HOC_ID, '4');
	return [
		{
			id: 'PH-001',
			maPhong: 'A1',
			tenPhong: 'Phòng Lý thuyết A1',
			soChoNgoi: 55,
			loaiPhong: 'LyThuyet',
			nguoiPhuTrachId: 'GV01',
			nguoiPhuTrachTen: layTenNguoiPhuTrach('GV01'),
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'PH-002',
			maPhong: 'B3',
			tenPhong: 'Phòng Thực hành B3',
			soChoNgoi: 28,
			loaiPhong: 'ThucHanh',
			nguoiPhuTrachId: 'GV02',
			nguoiPhuTrachTen: layTenNguoiPhuTrach('GV02'),
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'PH-003',
			maPhong: 'C2',
			tenPhong: 'Phòng Lý thuyết C2',
			soChoNgoi: 80,
			loaiPhong: 'LyThuyet',
			nguoiPhuTrachId: 'GV03',
			nguoiPhuTrachTen: layTenNguoiPhuTrach('GV03'),
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'PH-004',
			maPhong: 'D5',
			tenPhong: 'Hội trường D5',
			soChoNgoi: 160,
			loaiPhong: 'HoiTruong',
			nguoiPhuTrachId: 'GV04',
			nguoiPhuTrachTen: layTenNguoiPhuTrach('GV04'),
			createdAt: now,
			updatedAt: now,
		},
	];
};

const docLocal = (): IPhongHoc[] => {
	try {
		const raw = localStorage.getItem(LS_PHONG_HOC);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as IPhongHoc[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const ghiLocal = (data: IPhongHoc[]) => {
	localStorage.setItem(LS_PHONG_HOC, JSON.stringify(data));
};

export async function layDanhSachNguoiPhuTrach(): Promise<INguoiPhuTrach[]> {
	return dsNguoiPhuTrach;
}

export async function layDanhSachPhongHoc(): Promise<IPhongHoc[]> {
	const data = docLocal();
	if (data.length) return data;
	const seed = duLieuMacDinh();
	ghiLocal(seed);
	return seed;
}

export async function taoPhongHoc(payload: {
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: TLoaiPhong;
	nguoiPhuTrachId: string;
}): Promise<IPhongHoc> {
	const now = layHienTaiIso();
	const npt = dsNguoiPhuTrach.find((x) => x.id === payload.nguoiPhuTrachId);
	const moi: IPhongHoc = {
		id: taoIdDeNhin(),
		maPhong: payload.maPhong.trim(),
		tenPhong: payload.tenPhong.trim(),
		soChoNgoi: payload.soChoNgoi,
		loaiPhong: payload.loaiPhong,
		nguoiPhuTrachId: payload.nguoiPhuTrachId,
		nguoiPhuTrachTen: npt?.ten || 'Không rõ',
		createdAt: now,
		updatedAt: now,
	};

	const ds = await layDanhSachPhongHoc();
	const dsMoi = [moi, ...ds];
	ghiLocal(dsMoi);
	return moi;
}

export async function capNhatPhongHoc(
	id: string,
	payload: Partial<{
		maPhong: string;
		tenPhong: string;
		soChoNgoi: number;
		loaiPhong: TLoaiPhong;
		nguoiPhuTrachId: string;
	}>,
): Promise<IPhongHoc | undefined> {
	const ds = await layDanhSachPhongHoc();
	const index = ds.findIndex((x) => x.id === id);
	if (index < 0) return undefined;

	const now = layHienTaiIso();
	const cu = ds[index];
	const npt = payload.nguoiPhuTrachId ? dsNguoiPhuTrach.find((x) => x.id === payload.nguoiPhuTrachId) : undefined;
	const moi: IPhongHoc = {
		...cu,
		maPhong: payload.maPhong !== undefined ? payload.maPhong.trim() : cu.maPhong,
		tenPhong: payload.tenPhong !== undefined ? payload.tenPhong.trim() : cu.tenPhong,
		soChoNgoi: payload.soChoNgoi !== undefined ? payload.soChoNgoi : cu.soChoNgoi,
		loaiPhong: payload.loaiPhong !== undefined ? payload.loaiPhong : cu.loaiPhong,
		nguoiPhuTrachId: payload.nguoiPhuTrachId !== undefined ? payload.nguoiPhuTrachId : cu.nguoiPhuTrachId,
		nguoiPhuTrachTen: payload.nguoiPhuTrachId !== undefined ? npt?.ten || 'Không rõ' : cu.nguoiPhuTrachTen,
		updatedAt: now,
	};

	const dsMoi = [...ds];
	dsMoi[index] = moi;
	ghiLocal(dsMoi);
	return moi;
}

export async function xoaPhongHoc(id: string): Promise<boolean> {
	const ds = await layDanhSachPhongHoc();
	const dsMoi = ds.filter((x) => x.id !== id);
	if (dsMoi.length === ds.length) return false;
	ghiLocal(dsMoi);
	return true;
}

export async function datLaiDuLieuPhongHocMacDinh(): Promise<IPhongHoc[]> {
	const seed = duLieuMacDinh();
	ghiLocal(seed);
	return seed;
}

