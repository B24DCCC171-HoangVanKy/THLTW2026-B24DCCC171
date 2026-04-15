export type TLoaiPhong = 'LyThuyet' | 'ThucHanh' | 'HoiTruong';

export interface INguoiPhuTrach {
	id: string;
	ten: string;
}

export interface IPhongHoc {
	id: string;
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: TLoaiPhong;
	nguoiPhuTrachId: string;
	nguoiPhuTrachTen: string;
	createdAt: string;
	updatedAt: string;
}

