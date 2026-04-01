declare module CauLacBo {
	type TrangThaiDon = 'pending' | 'approved' | 'rejected';

	interface IApplication {
		id: string;
		hoTen: string;
		email: string;
		sdt: string;
		gioiTinh: string;
		diaChi: string;
		soTruong: string;
		cauLacBo: string;
		lyDoDangKy: string;
		trangThai: TrangThaiDon;
		ghiChu: string;
		createdAt: string;
		updatedAt: string;
	}

	interface IHistoryEntry {
		id: string;
		message: string;
		createdAt: string;
	}
}
