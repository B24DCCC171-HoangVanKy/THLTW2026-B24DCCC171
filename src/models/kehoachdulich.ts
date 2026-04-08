import { layDanhSachDiemDen } from '@/services/KeHoachDuLich/diemdens';
import {
	capNhatDiemDenQuanTri,
	datLaiDuLieuQuanTri,
	hopNhatDiemDen,
	themDiemDenQuanTri,
	xoaDiemDenQuanTri,
} from '@/services/KeHoachDuLich/quantridiemden';
import {
	type IDiemDen,
	type TSapXep,
} from '@/services/KeHoachDuLich/typing';
import { useState } from 'react';

type TLichTheoNgay = Record<number, IDiemDen[]>;
type TChiPhi = {
	anUong: number;
	diChuyen: number;
	luuTru: number;
	thamQuan: number;
	tong: number;
};

const sapXepDanhSach = (data: IDiemDen[], dsSapXep: TSapXep[] = []): IDiemDen[] => {
	if (!dsSapXep.length) return data;
	const danhSach = [...data];
	return danhSach.sort((a, b) => {
		for (const kieuSapXep of dsSapXep) {
			if (kieuSapXep === 'giaTang' && a.giaUocTinh !== b.giaUocTinh) return a.giaUocTinh - b.giaUocTinh;
			if (kieuSapXep === 'giaGiam' && a.giaUocTinh !== b.giaUocTinh) return b.giaUocTinh - a.giaUocTinh;
			if (kieuSapXep === 'ratingGiam' && a.rating !== b.rating) return b.rating - a.rating;
			if (kieuSapXep === 'ratingTang' && a.rating !== b.rating) return a.rating - b.rating;
		}
		return 0;
	});
};

const tinhChiPhi = (lichTrinh: TLichTheoNgay): TChiPhi => {
	let thamQuan = 0;
	let anUong = 0;
	let diChuyen = 0;
	let luuTru = 0;

	Object.values(lichTrinh).forEach((dsDiaDiem) => {
		if (!dsDiaDiem.length) return;
		luuTru += 700000;
		dsDiaDiem.forEach((d) => {
			thamQuan += Math.round(d.giaUocTinh * 0.25);
			anUong += 200000;
		});
		diChuyen += Math.max(0, dsDiaDiem.length - 1) * 150000;
	});

	return {
		anUong,
		diChuyen,
		luuTru,
		thamQuan,
		tong: anUong + diChuyen + luuTru + thamQuan,
	};
};

const dongBoLichVoiDanhSach = (lich: TLichTheoNgay, dsMoi: IDiemDen[]): TLichTheoNgay => {
	const banDo = new Map(dsMoi.map((d) => [d.id, d]));
	const ketQua: TLichTheoNgay = {};
	Object.entries(lich).forEach(([k, ds]) => {
		ketQua[Number(k)] = ds.map((d) => banDo.get(d.id)).filter(Boolean) as IDiemDen[];
	});
	return ketQua;
};

export default () => {
	const [loading, setLoading] = useState(false);
	const [danhSachTuApi, setDanhSachTuApi] = useState<IDiemDen[]>([]);
	const [danhSachGoc, setDanhSachGoc] = useState<IDiemDen[]>([]);
	const [danhSachHienThi, setDanhSachHienThi] = useState<IDiemDen[]>([]);
	const [loaiHinhDangLoc, setLoaiHinhDangLoc] = useState<IDiemDen['loaiHinh'] | undefined>(undefined);
	const [diemDanhGiaToiThieu, setDiemDanhGiaToiThieu] = useState<number>(0);
	const [giaToiThieu, setGiaToiThieu] = useState<number | undefined>(undefined);
	const [giaToiDa, setGiaToiDa] = useState<number | undefined>(undefined);
	const [kieuSapXep, setKieuSapXep] = useState<TSapXep[]>([]);
	const [soNgay, setSoNgay] = useState<number>(3);
	const [lichTrinh, setLichTrinh] = useState<TLichTheoNgay>({ 1: [], 2: [], 3: [] });
	const [nganSachMucTieu, setNganSachMucTieu] = useState<number>(15000000);
	const [chiPhi, setChiPhi] = useState<TChiPhi>({
		anUong: 0,
		diChuyen: 0,
		luuTru: 0,
		thamQuan: 0,
		tong: 0,
	});

	const apDungLocVaSapXep = (
		nguonDuLieu: IDiemDen[],
		loaiHinh?: IDiemDen['loaiHinh'],
		diemDanhGia?: number,
		giaMin?: number,
		giaMax?: number,
		sapXep: TSapXep[] = [],
	) => {
		const duLieuLoc = nguonDuLieu.filter((item) => {
			const dungLoai = !loaiHinh || item.loaiHinh === loaiHinh;
			const dungDiemDanhGia = (diemDanhGia ?? 0) <= item.rating;
			const dungGiaMin = giaMin === undefined || item.giaUocTinh >= giaMin;
			const dungGia = giaMax === undefined || item.giaUocTinh <= giaMax;
			return dungLoai && dungDiemDanhGia && dungGiaMin && dungGia;
		});

		setDanhSachHienThi(sapXepDanhSach(duLieuLoc, sapXep));
	};

	const capNhatChiPhi = (lichMoi: TLichTheoNgay) => {
		setChiPhi(tinhChiPhi(lichMoi));
	};

	const apDungHopNhatQuanTri = (coSoTuApi: IDiemDen[]) => {
		const merged = hopNhatDiemDen(coSoTuApi);
		setDanhSachGoc(merged);
		setLichTrinh((lichCu) => {
			const lichMoi = dongBoLichVoiDanhSach(lichCu, merged);
			setChiPhi(tinhChiPhi(lichMoi));
			return lichMoi;
		});
		apDungLocVaSapXep(merged, loaiHinhDangLoc, diemDanhGiaToiThieu, giaToiThieu, giaToiDa, kieuSapXep);
	};

	const taiDanhSachDiemDen = async () => {
		setLoading(true);
		try {
			const data = await layDanhSachDiemDen();
			setDanhSachTuApi(data);
			apDungHopNhatQuanTri(data);
		} finally {
			setLoading(false);
		}
	};

	const capNhatBoLoc = (payload: {
		loaiHinh?: IDiemDen['loaiHinh'];
		diemDanhGiaToiThieu?: number;
		giaToiThieu?: number;
		giaToiDa?: number;
	}) => {	
		const loaiMoi = payload.loaiHinh;
		const diemMoi = payload.diemDanhGiaToiThieu ?? 0;
		const giaMinMoi = payload.giaToiThieu;
		const giaMoi = payload.giaToiDa;

		setLoaiHinhDangLoc(loaiMoi);
		setDiemDanhGiaToiThieu(diemMoi);
		setGiaToiThieu(giaMinMoi);
		setGiaToiDa(giaMoi);

		apDungLocVaSapXep(danhSachGoc, loaiMoi, diemMoi, giaMinMoi, giaMoi, kieuSapXep);
	};

	const capNhatSapXep = (sapXep: TSapXep[] = []) => {
		setKieuSapXep(sapXep);
		apDungLocVaSapXep(danhSachGoc, loaiHinhDangLoc, diemDanhGiaToiThieu, giaToiThieu, giaToiDa, sapXep);
	};

	const datSoNgay = (giaTri: number) => {
		const soNgayMoi = Math.max(1, giaTri || 1);
		setSoNgay(soNgayMoi);
		const lichMoi: TLichTheoNgay = {};
		for (let i = 1; i <= soNgayMoi; i += 1) {
			lichMoi[i] = lichTrinh[i] || [];
		}
		setLichTrinh(lichMoi);
		capNhatChiPhi(lichMoi);
	};

	const themDiaDiemVaoNgay = (ngay: number, diaDiem: IDiemDen) => {
		const dsNgay = lichTrinh[ngay] || [];
		if (dsNgay.find((d) => d.id === diaDiem.id)) return;
		const lichMoi = { ...lichTrinh, [ngay]: [...dsNgay, diaDiem] };
		setLichTrinh(lichMoi);
		capNhatChiPhi(lichMoi);
	};

	const xoaDiaDiemKhoiNgay = (ngay: number, idDiaDiem: string) => {
		const lichMoi = {
			...lichTrinh,
			[ngay]: (lichTrinh[ngay] || []).filter((d) => d.id !== idDiaDiem),
		};
		setLichTrinh(lichMoi);
		capNhatChiPhi(lichMoi);
	};

	const sapXepDiaDiemTrongNgay = (ngay: number, index: number, huong: 'len' | 'xuong') => {
		const ds = [...(lichTrinh[ngay] || [])];
		const indexMoi = huong === 'len' ? index - 1 : index + 1;
		if (indexMoi < 0 || indexMoi >= ds.length) return;
		const temp = ds[index];
		ds[index] = ds[indexMoi];
		ds[indexMoi] = temp;
		const lichMoi = { ...lichTrinh, [ngay]: ds };
		setLichTrinh(lichMoi);
		capNhatChiPhi(lichMoi);
	};

	const quanTriThemDiemDen = (duLieu: Omit<IDiemDen, 'id'>) => {
		themDiemDenQuanTri(duLieu);
		apDungHopNhatQuanTri(danhSachTuApi);
	};

	const quanTriSuaDiemDen = (id: string, duLieu: Partial<IDiemDen>) => {
		capNhatDiemDenQuanTri(id, duLieu);
		apDungHopNhatQuanTri(danhSachTuApi);
	};

	const quanTriXoaDiemDen = (id: string) => {
		xoaDiemDenQuanTri(id);
		apDungHopNhatQuanTri(danhSachTuApi);
	};

	const datLaiQuanTriVeMacDinh = async () => {
		datLaiDuLieuQuanTri();
		await taiDanhSachDiemDen();
	};

	const tongDiaDiemDaChon = Object.values(lichTrinh).reduce((sum, ds) => sum + ds.length, 0);
	const uocTinhTongThoiGianDiChuyenGio = Math.round((chiPhi.diChuyen / 150000) * 1.5 * 10) / 10;
	const vuotNganSach = chiPhi.tong > nganSachMucTieu;

	return {
		loading,
		danhSachHienThi,
		danhSachGoc,
		loaiHinhDangLoc,
		diemDanhGiaToiThieu,
		giaToiThieu,
		giaToiDa,
		kieuSapXep,
		soNgay,
		lichTrinh,
		nganSachMucTieu,
		chiPhi,
		tongDiaDiemDaChon,
		uocTinhTongThoiGianDiChuyenGio,
		vuotNganSach,
		taiDanhSachDiemDen,
		capNhatBoLoc,
		capNhatSapXep,
		datSoNgay,
		themDiaDiemVaoNgay,
		xoaDiaDiemKhoiNgay,
		sapXepDiaDiemTrongNgay,
		setNganSachMucTieu,
		quanTriThemDiemDen,
		quanTriSuaDiemDen,
		quanTriXoaDiemDen,
		datLaiQuanTriVeMacDinh,
	};
};
