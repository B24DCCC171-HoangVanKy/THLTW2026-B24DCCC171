export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'Hoàn thành' | 'Bỏ lỡ';

export type GoalType = 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
export type GoalStatus = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';

export type ExerciseDifficulty = 'Dễ' | 'Trung bình' | 'Khó';
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';

export interface WorkoutLogRecord {
	_id: string;
	ngayTap: string;
	tenBaiTap: string;
	loaiBaiTap: WorkoutType;
	thoiLuongPhut: number;
	caloDot: number;
	ghiChu?: string;
	trangThai: WorkoutStatus;
	createdAt: string;
}

export interface HealthMetricRecord {
	_id: string;
	ngay: string;
	canNangKg: number;
	chieuCaoCm: number;
	bmi: number;
	nhipTimNghiBpm: number;
	gioNgu: number;
	createdAt: string;
}

export interface GoalRecord {
	_id: string;
	tenMucTieu: string;
	loaiMucTieu: GoalType;
	giaTriMucTieu: number;
	giaTriHienTai: number;
	deadline: string;
	trangThai: GoalStatus;
	createdAt: string;
}

export interface ExerciseRecord {
	_id: string;
	tenBaiTap: string;
	nhomCo: MuscleGroup;
	mucDo: ExerciseDifficulty;
	moTaNgan: string;
	huongDanDayDu: string;
	caloMoiGio: number;
	createdAt: string;
}
