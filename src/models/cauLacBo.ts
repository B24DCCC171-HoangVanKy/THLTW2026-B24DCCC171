import { DANH_SACH_CLB } from '@/services/CauLacBo/constants';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_APP = 'cauLacBo_applications';
const STORAGE_HIST = 'cauLacBo_history';
const STORAGE_CLUBS = 'cauLacBo_clubs';
const STORAGE_MAU_VERSION = 'cauLacBo_mauVersion';
const MAU_DU_LIEU_VERSION = 2;

function taoId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
	return new Date().toISOString();
}

function tenClb(clubs: string[], i: number): string {
	return clubs[i] ?? clubs[0] ?? 'CLB';
}

function duLieuMau(clubs: string[]): CauLacBo.IApplication[] {
	const t = nowIso();
	return [
		{
			id: taoId(),
			hoTen: 'Nguyễn Thiên Thanh',
			email: 'nthanh@gmail.com',
			sdt: '0909111111',
			gioiTinh: 'Nam',
			diaChi: 'Thái Bình',
			soTruong: 'Ca hát, sáng tác',
			cauLacBo: tenClb(clubs, 0),
			lyDoDangKy: 'Muốn giao lưu cùng anh em trong CLB',
			trangThai: 'pending',
			ghiChu: '',
			createdAt: t,
			updatedAt: t,
		},
		{
			id: taoId(),
			hoTen: 'Phan Thị Mỹ Tâm',
			email: 'pmytam@gmail.com',
			sdt: '0909888888',
			gioiTinh: 'Nữ',
			diaChi: 'Đà Nẵng',
			soTruong: 'Thanh nhạc, piano',
			cauLacBo: tenClb(clubs, 1),
			lyDoDangKy: 'Tìm nơi chia sẻ đam mê âm nhạc',
			trangThai: 'approved',
			ghiChu: '',
			createdAt: t,
			updatedAt: t,
		},
		{
			id: taoId(),
			hoTen: 'Cristiano Ronaldo',
			email: 'cronaldo@gmail.com',
			sdt: '0909666666',
			gioiTinh: 'Nam',
			diaChi: 'Lisbon, Bồ Đào Nha',
			soTruong: 'Bóng đá, thể lực',
			cauLacBo: tenClb(clubs, 2),
			lyDoDangKy: 'Đăng ký vì yêu thích phong trào thể thao CLB',
			trangThai: 'rejected',
			ghiChu: 'Đủ số lượng thành viên',
			createdAt: t,
			updatedAt: t,
		},
	];
}

function logDuyetTuChoi(lyDo: string): string {
	return `Admin đã từ chối lúc ${moment().format('HH:mm')} ngày ${moment().format(
		'DD/MM/YYYY',
	)} với lý do: ${lyDo}`;
}

function logDuyetDongY(soLuong: number): string {
	return `Admin đã duyệt ${soLuong} đơn lúc ${moment().format('HH:mm')} ngày ${moment().format(
		'DD/MM/YYYY',
	)}`;
}

function docNhomClbTuStorage(): string[] {
	const rawClubs = localStorage.getItem(STORAGE_CLUBS);
	if (!rawClubs) {
		const seed = [...DANH_SACH_CLB];
		localStorage.setItem(STORAGE_CLUBS, JSON.stringify(seed));
		return seed;
	}
	try {
		const parsed = JSON.parse(rawClubs);
		if (!Array.isArray(parsed) || parsed.length === 0) {
			const seed = [...DANH_SACH_CLB];
			localStorage.setItem(STORAGE_CLUBS, JSON.stringify(seed));
			return seed;
		}
		return parsed.map((x: unknown) => String(x));
	} catch {
		const seed = [...DANH_SACH_CLB];
		localStorage.setItem(STORAGE_CLUBS, JSON.stringify(seed));
		return seed;
	}
}

export default () => {
	const [applications, setApplications] = useState<CauLacBo.IApplication[]>([]);
	const [history, setHistory] = useState<CauLacBo.IHistoryEntry[]>([]);
	const [danhMucClb, setDanhMucClb] = useState<string[]>([]);

	const capNhatDanhSachDon = useCallback(
		(updater: (prev: CauLacBo.IApplication[]) => CauLacBo.IApplication[]) => {
			setApplications((prev) => {
				const next = updater(prev);
				localStorage.setItem(STORAGE_APP, JSON.stringify(next));
				return next;
			});
		},
		[],
	);

	const themLichSu = useCallback((message: string) => {
		const entry: CauLacBo.IHistoryEntry = {
			id: taoId(),
			message,
			createdAt: nowIso(),
		};
		setHistory((prev) => {
			const next = [entry, ...prev];
			localStorage.setItem(STORAGE_HIST, JSON.stringify(next));
			return next;
		});
	}, []);

	useEffect(() => {
		const clubs = docNhomClbTuStorage();
		setDanhMucClb(clubs);

		const verLuu = localStorage.getItem(STORAGE_MAU_VERSION);
		if (verLuu !== String(MAU_DU_LIEU_VERSION)) {
			localStorage.removeItem(STORAGE_APP);
			localStorage.removeItem(STORAGE_HIST);
			localStorage.setItem(STORAGE_MAU_VERSION, String(MAU_DU_LIEU_VERSION));
		}

		const raw = localStorage.getItem(STORAGE_APP);
		const rawH = localStorage.getItem(STORAGE_HIST);
		if (!raw) {
			const seed = duLieuMau(clubs);
			localStorage.setItem(STORAGE_APP, JSON.stringify(seed));
			setApplications(seed);
		} else {
			try {
				setApplications(JSON.parse(raw));
			} catch {
				const seed = duLieuMau(clubs);
				localStorage.setItem(STORAGE_APP, JSON.stringify(seed));
				setApplications(seed);
			}
		}
		setHistory(rawH ? JSON.parse(rawH) : []);
	}, []);

	const docDanhMucClb = (): string[] => {
		const raw = localStorage.getItem(STORAGE_CLUBS);
		if (!raw) return [];
		try {
			const p = JSON.parse(raw);
			return Array.isArray(p) ? p.map((x: unknown) => String(x)) : [];
		} catch {
			return [];
		}
	};

	const themCauLacBo = useCallback(
		(ten: string): boolean => {
			const t = ten.trim();
			if (!t) return false;
			const prev = docDanhMucClb();
			if (prev.some((x) => x.toLowerCase() === t.toLowerCase())) return false;
			const next = [...prev, t];
			localStorage.setItem(STORAGE_CLUBS, JSON.stringify(next));
			setDanhMucClb(next);
			themLichSu(`Đã thêm câu lạc bộ "${t}"`);
			return true;
		},
		[themLichSu],
	);

	const capNhatTenCauLacBo = useCallback(
		(tenCu: string, tenMoi: string): boolean => {
			const moi = tenMoi.trim();
			if (!moi) return false;
			const prev = docDanhMucClb();
			if (!prev.includes(tenCu)) return false;
			if (prev.some((x) => x !== tenCu && x.toLowerCase() === moi.toLowerCase())) return false;
			const next = prev.map((x) => (x === tenCu ? moi : x));
			localStorage.setItem(STORAGE_CLUBS, JSON.stringify(next));
			setDanhMucClb(next);
			capNhatDanhSachDon((apps) =>
				apps.map((a) =>
					a.cauLacBo === tenCu ? { ...a, cauLacBo: moi, updatedAt: nowIso() } : a,
				),
			);
			themLichSu(`Đã đổi tên CLB "${tenCu}" → "${moi}"`);
			return true;
		},
		[capNhatDanhSachDon, themLichSu],
	);

	const xoaCauLacBo = useCallback(
		(ten: string): boolean => {
			const raw = localStorage.getItem(STORAGE_APP);
			const apps: CauLacBo.IApplication[] = raw ? JSON.parse(raw) : [];
			if (apps.some((a) => a.cauLacBo === ten)) {
				return false;
			}
			const prev = docDanhMucClb();
			const next = prev.filter((x) => x !== ten);
			localStorage.setItem(STORAGE_CLUBS, JSON.stringify(next));
			setDanhMucClb(next);
			themLichSu(`Đã xóa câu lạc bộ "${ten}" khỏi danh mục`);
			return true;
		},
		[themLichSu],
	);

	const themDon = useCallback(
		(payload: Omit<CauLacBo.IApplication, 'id' | 'createdAt' | 'updatedAt' | 'trangThai'>) => {
			const t = nowIso();
			const rec: CauLacBo.IApplication = {
				...payload,
				id: taoId(),
				trangThai: 'pending',
				createdAt: t,
				updatedAt: t,
			};
			capNhatDanhSachDon((prev) => [rec, ...prev]);
		},
		[capNhatDanhSachDon],
	);

	const capNhatDon = useCallback(
		(id: string, patch: Partial<CauLacBo.IApplication>) => {
			capNhatDanhSachDon((prev) =>
				prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: nowIso() } : a)),
			);
		},
		[capNhatDanhSachDon],
	);

	const xoaDon = useCallback(
		(id: string) => {
			capNhatDanhSachDon((prev) => prev.filter((a) => a.id !== id));
		},
		[capNhatDanhSachDon],
	);

	const doiTrangThai = useCallback(
		(ids: string[], trangThai: CauLacBo.TrangThaiDon, lyDoTuChoi?: string) => {
			if (trangThai === 'rejected' && (!lyDoTuChoi || !lyDoTuChoi.trim())) {
				return;
			}
			const lyDo = lyDoTuChoi?.trim() || '';
			capNhatDanhSachDon((prev) =>
				prev.map((a) => {
					if (!ids.includes(a.id)) return a;
					if (trangThai === 'rejected') {
						return {
							...a,
							trangThai: 'rejected' as const,
							ghiChu: lyDo,
							updatedAt: nowIso(),
						};
					}
					if (trangThai === 'approved') {
						return { ...a, trangThai: 'approved' as const, updatedAt: nowIso() };
					}
					return { ...a, trangThai: 'pending' as const, ghiChu: '', updatedAt: nowIso() };
				}),
			);
			if (trangThai === 'approved') {
				themLichSu(logDuyetDongY(ids.length));
			} else if (trangThai === 'rejected') {
				themLichSu(logDuyetTuChoi(lyDo));
			}
		},
		[capNhatDanhSachDon, themLichSu],
	);

	const chuyenCauLacBo = useCallback(
		(ids: string[], cauLacBoMoi: string) => {
			capNhatDanhSachDon((prev) =>
				prev.map((a) =>
					ids.includes(a.id) && a.trangThai === 'approved'
						? { ...a, cauLacBo: cauLacBoMoi, updatedAt: nowIso() }
						: a,
				),
			);
			themLichSu(
				`Đã chuyển ${ids.length} thành viên sang "${cauLacBoMoi}" lúc ${moment().format(
					'HH:mm DD/MM/YYYY',
				)}`,
			);
		},
		[capNhatDanhSachDon, themLichSu],
	);

	return {
		applications,
		history,
		danhMucClb,
		themCauLacBo,
		capNhatTenCauLacBo,
		xoaCauLacBo,
		themDon,
		capNhatDon,
		xoaDon,
		doiTrangThai,
		chuyenCauLacBo,
		themLichSu,
	};
};
