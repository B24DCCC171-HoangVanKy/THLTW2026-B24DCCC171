import {
	datLaiDuLieuPhongHocMacDinh,
	layDanhSachNguoiPhuTrach,
	layDanhSachPhongHoc,
} from '@/services/PhongHoc';
import {
	type INguoiPhuTrach,
	type IPhongHoc,
	type TLoaiPhong,
} from '@/services/PhongHoc/typing';
import { useState } from 'react';

type TSapXepSoChoNgoi = 'tang' | 'giam' | undefined;

const locVaSapXep = (
	danhSach: IPhongHoc[],
	tuKhoa: string,
	loaiPhong?: TLoaiPhong,
	nguoiPhuTrachId?: string,
	sapXepSoChoNgoi?: TSapXepSoChoNgoi,
) => {
	const tuKhoaChuan = tuKhoa.trim().toLowerCase();
	const daLoc = danhSach.filter((item) => {
		const dungTuKhoa =
			!tuKhoaChuan ||
			item.maPhong.toLowerCase().includes(tuKhoaChuan) ||
			item.tenPhong.toLowerCase().includes(tuKhoaChuan);
		const dungLoaiPhong = !loaiPhong || item.loaiPhong === loaiPhong;
		const dungNguoiPhuTrach = !nguoiPhuTrachId || item.nguoiPhuTrachId === nguoiPhuTrachId;
		return dungTuKhoa && dungLoaiPhong && dungNguoiPhuTrach;
	});

	if (!sapXepSoChoNgoi) return daLoc;
	const ketQua = [...daLoc];
	return ketQua.sort((a, b) =>
		sapXepSoChoNgoi === 'tang' ? a.soChoNgoi - b.soChoNgoi : b.soChoNgoi - a.soChoNgoi,
	);
};

export default () => {
	const [loading, setLoading] = useState(false);
	const [danhSachGoc, setDanhSachGoc] = useState<IPhongHoc[]>([]);
	const [danhSachHienThi, setDanhSachHienThi] = useState<IPhongHoc[]>([]);
	const [danhSachNguoiPhuTrach, setDanhSachNguoiPhuTrach] = useState<INguoiPhuTrach[]>([]);
	const [tuKhoa, setTuKhoa] = useState('');
	const [loaiPhongDangLoc, setLoaiPhongDangLoc] = useState<TLoaiPhong | undefined>(undefined);
	const [nguoiPhuTrachDangLoc, setNguoiPhuTrachDangLoc] = useState<string | undefined>(undefined);
	const [sapXepSoChoNgoi, setSapXepSoChoNgoi] = useState<TSapXepSoChoNgoi>(undefined);

	const apDungLoc = (payload?: {
		tuKhoa?: string;
		loaiPhongDangLoc?: TLoaiPhong;
		nguoiPhuTrachDangLoc?: string;
		sapXepSoChoNgoi?: TSapXepSoChoNgoi;
	}) => {
		const tuKhoaMoi = payload?.tuKhoa ?? tuKhoa;
		const loaiMoi = payload?.loaiPhongDangLoc ?? loaiPhongDangLoc;
		const nguoiMoi = payload?.nguoiPhuTrachDangLoc ?? nguoiPhuTrachDangLoc;
		const sapXepMoi = payload?.sapXepSoChoNgoi ?? sapXepSoChoNgoi;
		setDanhSachHienThi(locVaSapXep(danhSachGoc, tuKhoaMoi, loaiMoi, nguoiMoi, sapXepMoi));
	};

	const taiDuLieu = async () => {
		setLoading(true);
		try {
			const [phongHoc, nguoiPhuTrach] = await Promise.all([
				layDanhSachPhongHoc(),
				layDanhSachNguoiPhuTrach(),
			]);
			setDanhSachGoc(phongHoc);
			setDanhSachNguoiPhuTrach(nguoiPhuTrach);
			setDanhSachHienThi(locVaSapXep(phongHoc, tuKhoa, loaiPhongDangLoc, nguoiPhuTrachDangLoc, sapXepSoChoNgoi));
		} finally {
			setLoading(false);
		}
	};

	const datLaiDuLieu = async () => {
		setLoading(true);
		try {
			const data = await datLaiDuLieuPhongHocMacDinh();
			setDanhSachGoc(data);
			setDanhSachHienThi(locVaSapXep(data, tuKhoa, loaiPhongDangLoc, nguoiPhuTrachDangLoc, sapXepSoChoNgoi));
		} finally {
			setLoading(false);
		}
	};

	const capNhatTuKhoa = (giaTri: string) => {
		setTuKhoa(giaTri);
		apDungLoc({ tuKhoa: giaTri });
	};

	const capNhatLoaiPhong = (giaTri?: TLoaiPhong) => {
		setLoaiPhongDangLoc(giaTri);
		apDungLoc({ loaiPhongDangLoc: giaTri });
	};

	const capNhatNguoiPhuTrach = (giaTri?: string) => {
		setNguoiPhuTrachDangLoc(giaTri);
		apDungLoc({ nguoiPhuTrachDangLoc: giaTri });
	};

	const capNhatSapXepSoChoNgoi = (giaTri?: TSapXepSoChoNgoi) => {
		setSapXepSoChoNgoi(giaTri);
		apDungLoc({ sapXepSoChoNgoi: giaTri });
	};

	return {
		loading,
		danhSachHienThi,
		danhSachNguoiPhuTrach,
		tuKhoa,
		loaiPhongDangLoc,
		nguoiPhuTrachDangLoc,
		sapXepSoChoNgoi,
		taiDuLieu,
		datLaiDuLieu,
		capNhatTuKhoa,
		capNhatLoaiPhong,
		capNhatNguoiPhuTrach,
		capNhatSapXepSoChoNgoi,
	};
};

