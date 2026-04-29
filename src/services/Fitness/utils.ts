import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import type { GoalRecord, HealthMetricRecord, WorkoutLogRecord } from './typing';

export const LS_KEYS = {
	workout: 'fitness_workout_log',
	health: 'fitness_health_metrics',
	goals: 'fitness_goals',
	exercise: 'fitness_exercises',
};

export const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

export const tinhBMI = (canNangKg: number, chieuCaoCm: number) => {
	if (!canNangKg || !chieuCaoCm) return 0;
	const hMet = chieuCaoCm / 100;
	return Number((canNangKg / (hMet * hMet)).toFixed(1));
};

export const getBMIStatus = (bmi: number) => {
	if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' as const };
	if (bmi < 25) return { label: 'Bình thường', color: 'green' as const };
	if (bmi < 30) return { label: 'Thừa cân', color: 'gold' as const };
	return { label: 'Béo phì', color: 'red' as const };
};

const toValue = (item: any, field: any) => {
	if (Array.isArray(field)) return item?.[field[0]]?.[field[1]];
	return item?.[field];
};

const hasInDateRange = (value: string, start?: string, end?: string) => {
	if (!value || !start || !end) return true;
	const t = new Date(value).getTime();
	return t >= new Date(start).getTime() && t <= new Date(end).getTime();
};

export const applyFilters = <T extends Record<string, any>>(data: T[], filters?: TFilter<T>[]) => {
	if (!filters?.length) return data;
	return data.filter((item) =>
		filters.every((f) => {
			const val = toValue(item, f.field);
			const values = f.values || [];
			switch (f.operator) {
				case EOperatorType.CONTAIN:
					return String(val ?? '')
						.toLowerCase()
						.includes(String(values[0] ?? '').toLowerCase());
				case EOperatorType.INCLUDE:
					return values.includes(val as never);
				case EOperatorType.BETWEEN:
					return hasInDateRange(String(val ?? ''), String(values[0] ?? ''), String(values[1] ?? ''));
				default:
					return true;
			}
		}),
	);
};

export const applySort = <T extends Record<string, any>>(data: T[], sort?: Record<string, 1 | -1 | undefined>) => {
	if (!sort) return data;
	const [field, dir] = Object.entries(sort)[0] || [];
	if (!field || !dir) return data;
	return [...data].sort((a, b) => {
		const av = a[field];
		const bv = b[field];
		if (av === bv) return 0;
		if (av > bv) return dir === 1 ? 1 : -1;
		return dir === 1 ? -1 : 1;
	});
};

export const getProgressPercent = (mucTieu: GoalRecord) => {
	if (!mucTieu.giaTriMucTieu) return 0;
	return Math.max(0, Math.min(100, Math.round((mucTieu.giaTriHienTai / mucTieu.giaTriMucTieu) * 100)));
};

export const getStreakDays = (workoutList: WorkoutLogRecord[]) => {
	const doneDays = new Set(
		workoutList
			.filter((item) => item.trangThai === 'Hoàn thành')
			.map((item) => new Date(item.ngayTap).toISOString().slice(0, 10)),
	);
	let streak = 0;
	const d = new Date();
	while (true) {
		const key = d.toISOString().slice(0, 10);
		if (!doneDays.has(key)) break;
		streak += 1;
		d.setDate(d.getDate() - 1);
	}
	return streak;
};

export const getWeightLineData = (healthList: HealthMetricRecord[]) => {
	const sorted = [...healthList].sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime());
	return {
		xAxis: sorted.map((item) => new Date(item.ngay).toLocaleDateString('vi-VN')),
		yAxis: [sorted.map((item) => item.canNangKg)],
	};
};
