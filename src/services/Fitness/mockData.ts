import type { ExerciseRecord, GoalRecord, HealthMetricRecord, WorkoutLogRecord } from './typing';

const now = new Date();
const isoDay = (offset: number) => {
	const d = new Date(now);
	d.setDate(d.getDate() + offset);
	return d.toISOString();
};

export const initWorkoutLog: WorkoutLogRecord[] = [
	{
		_id: 'w1',
		ngayTap: isoDay(-1),
		tenBaiTap: 'Chạy bộ',
		loaiBaiTap: 'Cardio',
		thoiLuongPhut: 45,
		caloDot: 420,
		ghiChu: 'Giữ pace ổn định',
		trangThai: 'Hoàn thành',
		createdAt: isoDay(-1),
	},
	{
		_id: 'w2',
		ngayTap: isoDay(-2),
		tenBaiTap: 'Tập tạ thân trên',
		loaiBaiTap: 'Strength',
		thoiLuongPhut: 60,
		caloDot: 380,
		trangThai: 'Hoàn thành',
		createdAt: isoDay(-2),
	},
	{
		_id: 'w3',
		ngayTap: isoDay(-3),
		tenBaiTap: 'Yoga phục hồi',
		loaiBaiTap: 'Yoga',
		thoiLuongPhut: 30,
		caloDot: 150,
		trangThai: 'Bỏ lỡ',
		createdAt: isoDay(-3),
	},
];

export const initHealthMetrics: HealthMetricRecord[] = [
	{ _id: 'h1', ngay: isoDay(-21), canNangKg: 72.5, chieuCaoCm: 172, bmi: 24.5, nhipTimNghiBpm: 72, gioNgu: 6.5, createdAt: isoDay(-21) },
	{ _id: 'h2', ngay: isoDay(-14), canNangKg: 71.8, chieuCaoCm: 172, bmi: 24.3, nhipTimNghiBpm: 70, gioNgu: 7, createdAt: isoDay(-14) },
	{ _id: 'h3', ngay: isoDay(-7), canNangKg: 71.2, chieuCaoCm: 172, bmi: 24.1, nhipTimNghiBpm: 69, gioNgu: 7.2, createdAt: isoDay(-7) },
	{ _id: 'h4', ngay: isoDay(0), canNangKg: 70.9, chieuCaoCm: 172, bmi: 24, nhipTimNghiBpm: 68, gioNgu: 7.5, createdAt: isoDay(0) },
];

export const initGoals: GoalRecord[] = [
	{
		_id: 'g1',
		tenMucTieu: 'Giảm cân về 68kg',
		loaiMucTieu: 'Giảm cân',
		giaTriMucTieu: 68,
		giaTriHienTai: 70.9,
		deadline: isoDay(60),
		trangThai: 'Đang thực hiện',
		createdAt: isoDay(-20),
	},
	{
		_id: 'g2',
		tenMucTieu: 'Hoàn thành 20 buổi HIIT',
		loaiMucTieu: 'Cải thiện sức bền',
		giaTriMucTieu: 20,
		giaTriHienTai: 8,
		deadline: isoDay(45),
		trangThai: 'Đang thực hiện',
		createdAt: isoDay(-10),
	},
];

export const initExercises: ExerciseRecord[] = [
	{
		_id: 'e1',
		tenBaiTap: 'Push-up',
		nhomCo: 'Chest',
		mucDo: 'Dễ',
		moTaNgan: 'Hít đất cơ bản cho ngực và tay sau.',
		huongDanDayDu: 'Giữ lưng thẳng, hạ người đến khi khuỷu tay khoảng 90 độ, đẩy lên có kiểm soát.',
		caloMoiGio: 420,
		createdAt: isoDay(-30),
	},
	{
		_id: 'e2',
		tenBaiTap: 'Squat',
		nhomCo: 'Legs',
		mucDo: 'Trung bình',
		moTaNgan: 'Bài tập chân và core nền tảng.',
		huongDanDayDu: 'Đứng rộng bằng vai, hạ hông ra sau xuống đến khi đùi song song sàn, đứng lên siết mông.',
		caloMoiGio: 500,
		createdAt: isoDay(-28),
	},
	{
		_id: 'e3',
		tenBaiTap: 'Burpee',
		nhomCo: 'Full Body',
		mucDo: 'Khó',
		moTaNgan: 'Bài toàn thân cường độ cao.',
		huongDanDayDu: 'Từ đứng xuống plank, chống đẩy nhanh, bật nhảy và vươn tay qua đầu. Giữ nhịp thở đều.',
		caloMoiGio: 780,
		createdAt: isoDay(-26),
	},
];
