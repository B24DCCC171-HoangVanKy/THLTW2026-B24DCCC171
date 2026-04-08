import { type IDiemDen } from './typing';

const KHOA_LUU_TRU = 'khdl_quan_tri_diem_den_v1';

export type TTrangThaiQuanTri = {
	idsDaXoa: string[];
	diemDenThem: IDiemDen[];
	capNhatTheoId: Record<string, Partial<IDiemDen>>;
};

export function docTrangThaiQuanTri(): TTrangThaiQuanTri {
	try {
		const raw = localStorage.getItem(KHOA_LUU_TRU);
		if (!raw) return { idsDaXoa: [], diemDenThem: [], capNhatTheoId: {} };
		const parsed = JSON.parse(raw) as TTrangThaiQuanTri;
		return {
			idsDaXoa: Array.isArray(parsed.idsDaXoa) ? parsed.idsDaXoa : [],
			diemDenThem: Array.isArray(parsed.diemDenThem) ? parsed.diemDenThem : [],
			capNhatTheoId: parsed.capNhatTheoId && typeof parsed.capNhatTheoId === 'object' ? parsed.capNhatTheoId : {},
		};
	} catch {
		return { idsDaXoa: [], diemDenThem: [], capNhatTheoId: {} };
	}
}

export function luuTrangThaiQuanTri(trangThai: TTrangThaiQuanTri) {
	localStorage.setItem(KHOA_LUU_TRU, JSON.stringify(trangThai));
}

export function hopNhatDiemDen(tuApi: IDiemDen[]): IDiemDen[] {
	const { idsDaXoa, diemDenThem, capNhatTheoId } = docTrangThaiQuanTri();
	const tuApiDaLoc = tuApi
		.filter((d) => !idsDaXoa.includes(d.id))
		.map((d) => ({ ...d, ...(capNhatTheoId[d.id] || {}) }));
	const diemThemDaChinh = diemDenThem.map((d) => ({ ...d, ...(capNhatTheoId[d.id] || {}) }));
	return [...tuApiDaLoc, ...diemThemDaChinh];
}

export function themDiemDenQuanTri(item: Omit<IDiemDen, 'id'>): IDiemDen {
	const s = docTrangThaiQuanTri();
	const id = `admin-${Date.now()}`;
	const moi: IDiemDen = { ...item, id };
	s.diemDenThem = [...s.diemDenThem, moi];
	luuTrangThaiQuanTri(s);
	return moi;
}

export function capNhatDiemDenQuanTri(id: string, partial: Partial<IDiemDen>) {
	const anToan = { ...partial };
	delete anToan.id;
	const s = docTrangThaiQuanTri();
	const chiSo = s.diemDenThem.findIndex((d) => d.id === id);
	if (chiSo >= 0) {
		s.diemDenThem[chiSo] = { ...s.diemDenThem[chiSo], ...anToan, id };
	} else {
		s.capNhatTheoId[id] = { ...s.capNhatTheoId[id], ...anToan };
	}
	luuTrangThaiQuanTri(s);
}

export function xoaDiemDenQuanTri(id: string) {
	const s = docTrangThaiQuanTri();
	const chiSo = s.diemDenThem.findIndex((d) => d.id === id);
	if (chiSo >= 0) {
		s.diemDenThem = s.diemDenThem.filter((d) => d.id !== id);
	} else {
		if (!s.idsDaXoa.includes(id)) s.idsDaXoa = [...s.idsDaXoa, id];
	}
	delete s.capNhatTheoId[id];
	luuTrangThaiQuanTri(s);
}

export function datLaiDuLieuQuanTri() {
	localStorage.removeItem(KHOA_LUU_TRU);
}
