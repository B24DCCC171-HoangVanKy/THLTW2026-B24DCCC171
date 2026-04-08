import { type IDiemDen } from './typing';

type TDiemDenMau = IDiemDen & { wikiTitle: string };
const danhSachDiemDenMau: TDiemDenMau[] = [
	{ id: 'dd-001', ten: 'Kyoto', diaDiem: 'Nhật Bản', loaiHinh: 'Văn hóa', giaUocTinh: 12500000, rating: 4.9, hinhAnh: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố cổ với đền chùa và mùa lá đỏ tuyệt đẹp.', wikiTitle: 'Kyoto' },
	{ id: 'dd-002', ten: 'Singapore Marina Bay', diaDiem: 'Singapore', loaiHinh: 'Thành phố', giaUocTinh: 11800000, rating: 4.8, hinhAnh: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Biểu tượng hiện đại của Singapore với cảnh đêm ấn tượng.', wikiTitle: 'Marina Bay' },
	{ id: 'dd-003', ten: 'Amsterdam', diaDiem: 'Hà Lan', loaiHinh: 'Thành phố', giaUocTinh: 17600000, rating: 4.7, hinhAnh: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố kênh đào nổi tiếng với kiến trúc cổ điển châu Âu.', wikiTitle: 'Amsterdam' },
	{ id: 'dd-004', ten: 'Swiss Alps', diaDiem: 'Thụy Sĩ', loaiHinh: 'Núi', giaUocTinh: 22000000, rating: 4.9, hinhAnh: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Khung cảnh núi tuyết hùng vĩ và làng cổ thơ mộng.', wikiTitle: 'Swiss Alps' },
	{ id: 'dd-005', ten: 'Paris', diaDiem: 'Pháp', loaiHinh: 'Thành phố', giaUocTinh: 21000000, rating: 4.8, hinhAnh: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Kinh đô ánh sáng với nghệ thuật, thời trang và ẩm thực.', wikiTitle: 'Paris' },
	{ id: 'dd-006', ten: 'Rome', diaDiem: 'Ý', loaiHinh: 'Văn hóa', giaUocTinh: 19000000, rating: 4.7, hinhAnh: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố lịch sử với đấu trường Colosseum nổi tiếng.', wikiTitle: 'Rome' },
	{ id: 'dd-007', ten: 'Seoul', diaDiem: 'Hàn Quốc', loaiHinh: 'Thành phố', giaUocTinh: 13500000, rating: 4.6, hinhAnh: 'https://images.unsplash.com/photo-1538485399081-7c897d57f5d9?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Đô thị hiện đại kết hợp văn hóa truyền thống đặc sắc.', wikiTitle: 'Seoul' },
	{ id: 'dd-008', ten: 'Bangkok', diaDiem: 'Thái Lan', loaiHinh: 'Thành phố', giaUocTinh: 8200000, rating: 4.5, hinhAnh: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Sôi động với đền chùa, phố ẩm thực và mua sắm.', wikiTitle: 'Bangkok' },
	{ id: 'dd-009', ten: 'Dubai', diaDiem: 'UAE', loaiHinh: 'Thành phố', giaUocTinh: 24000000, rating: 4.7, hinhAnh: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố xa hoa với kiến trúc hiện đại bậc nhất.', wikiTitle: 'Dubai' },
	{ id: 'dd-010', ten: 'Istanbul', diaDiem: 'Thổ Nhĩ Kỳ', loaiHinh: 'Văn hóa', giaUocTinh: 15000000, rating: 4.6, hinhAnh: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Giao thoa văn hóa Á - Âu với nhiều công trình biểu tượng.', wikiTitle: 'Istanbul' },
	{ id: 'dd-011', ten: 'Queenstown', diaDiem: 'New Zealand', loaiHinh: 'Núi', giaUocTinh: 23000000, rating: 4.8, hinhAnh: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thiên đường cho du lịch mạo hiểm giữa núi và hồ.', wikiTitle: 'Queenstown, New Zealand' },
	{ id: 'dd-012', ten: 'Machu Picchu', diaDiem: 'Peru', loaiHinh: 'Núi', giaUocTinh: 26500000, rating: 4.9, hinhAnh: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Di tích Inca cổ trên núi cao, điểm đến nổi tiếng thế giới.', wikiTitle: 'Machu Picchu' },
	{ id: 'dd-013', ten: 'Phuket', diaDiem: 'Thái Lan', loaiHinh: 'Biển', giaUocTinh: 9200000, rating: 4.4, hinhAnh: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Đảo biển nổi tiếng với bãi cát trắng và tour đảo.', wikiTitle: 'Phuket province' },
	{ id: 'dd-014', ten: 'Barcelona', diaDiem: 'Tây Ban Nha', loaiHinh: 'Thành phố', giaUocTinh: 17500000, rating: 4.7, hinhAnh: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố nghệ thuật với kiến trúc Gaudi độc đáo.', wikiTitle: 'Barcelona' },
	{ id: 'dd-015', ten: 'Cappadocia', diaDiem: 'Thổ Nhĩ Kỳ', loaiHinh: 'Văn hóa', giaUocTinh: 16800000, rating: 4.8, hinhAnh: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Nổi tiếng với khinh khí cầu và địa hình đá kỳ ảo.', wikiTitle: 'Cappadocia' },
	{ id: 'dd-016', ten: 'Sydney', diaDiem: 'Úc', loaiHinh: 'Thành phố', giaUocTinh: 24500000, rating: 4.7, hinhAnh: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', moTaNgan: 'Thành phố cảng với nhà hát Opera nổi tiếng.', wikiTitle: 'Sydney' },
];

type WikiSummaryResponse = {
	extract?: string;
	thumbnail?: {
		source?: string;
	};
};

const layThongTinTuWikipedia = async (tieuDeWiki: string): Promise<Partial<IDiemDen>> => {
	try {
		const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tieuDeWiki)}`;
		const response = await fetch(url);
		if (!response.ok) return {};

		const data = (await response.json()) as WikiSummaryResponse;
		return {
			moTaNgan: data.extract || undefined,
			hinhAnh: data.thumbnail?.source || undefined,
		};
	} catch (error) {
		return {};
	}
};

export async function layDanhSachDiemDen(): Promise<IDiemDen[]> {
	const ketQua = await Promise.all(
		danhSachDiemDenMau.map(async (item) => {
			const duLieuCongKhai = await layThongTinTuWikipedia(item.wikiTitle);
			return {
				...item,
				moTaNgan: duLieuCongKhai.moTaNgan || item.moTaNgan,
				hinhAnh: duLieuCongKhai.hinhAnh || item.hinhAnh,
			};
		}),
	);

	return ketQua.map(({ wikiTitle, ...item }) => item);
}
