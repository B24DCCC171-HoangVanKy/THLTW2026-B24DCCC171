export interface IDiemDen {
	id: string;
	ten: string;
	diaDiem: string;
	loaiHinh: 'Biển' | 'Núi' | 'Thành phố' | 'Văn hóa';
	giaUocTinh: number;
	rating: number;
	hinhAnh: string;
	moTaNgan: string;
}

export type TSapXep = 'giaTang' | 'giaGiam' | 'ratingGiam' | 'ratingTang';
