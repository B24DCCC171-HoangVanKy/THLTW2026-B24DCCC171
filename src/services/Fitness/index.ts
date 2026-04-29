import type { ExerciseRecord, GoalRecord, HealthMetricRecord, WorkoutLogRecord } from './typing';
import { createId, LS_KEYS, tinhBMI } from './utils';
import { initExercises, initGoals, initHealthMetrics, initWorkoutLog } from './mockData';

const readLS = <T,>(key: string, fallback: T[]): T[] => {
	const raw = localStorage.getItem(key);
	if (raw) return JSON.parse(raw) as T[];
	localStorage.setItem(key, JSON.stringify(fallback));
	return fallback;
};

const writeLS = <T,>(key: string, data: T[]) => {
	localStorage.setItem(key, JSON.stringify(data));
	return data;
};

export const workoutService = {
	getAll: () => Promise.resolve(readLS<WorkoutLogRecord>(LS_KEYS.workout, initWorkoutLog)),
	create: (payload: Omit<WorkoutLogRecord, '_id' | 'createdAt'>) => {
		const list = readLS<WorkoutLogRecord>(LS_KEYS.workout, initWorkoutLog);
		const item: WorkoutLogRecord = { ...payload, _id: createId(), createdAt: new Date().toISOString() };
		writeLS(LS_KEYS.workout, [item, ...list]);
		return Promise.resolve(item);
	},
	update: (id: string, payload: Partial<WorkoutLogRecord>) => {
		const list = readLS<WorkoutLogRecord>(LS_KEYS.workout, initWorkoutLog).map((it) =>
			it._id === id ? { ...it, ...payload } : it,
		);
		writeLS(LS_KEYS.workout, list);
		return Promise.resolve(list.find((it) => it._id === id));
	},
	remove: (id: string) => {
		const list = readLS<WorkoutLogRecord>(LS_KEYS.workout, initWorkoutLog).filter((it) => it._id !== id);
		writeLS(LS_KEYS.workout, list);
		return Promise.resolve(true);
	},
};

export const healthService = {
	getAll: () => Promise.resolve(readLS<HealthMetricRecord>(LS_KEYS.health, initHealthMetrics)),
	create: (payload: Omit<HealthMetricRecord, '_id' | 'createdAt' | 'bmi'>) => {
		const list = readLS<HealthMetricRecord>(LS_KEYS.health, initHealthMetrics);
		const item: HealthMetricRecord = {
			...payload,
			bmi: tinhBMI(payload.canNangKg, payload.chieuCaoCm),
			_id: createId(),
			createdAt: new Date().toISOString(),
		};
		writeLS(LS_KEYS.health, [item, ...list]);
		return Promise.resolve(item);
	},
	update: (id: string, payload: Partial<HealthMetricRecord>) => {
		const list = readLS<HealthMetricRecord>(LS_KEYS.health, initHealthMetrics).map((it) => {
			if (it._id !== id) return it;
			const next = { ...it, ...payload };
			return { ...next, bmi: tinhBMI(next.canNangKg, next.chieuCaoCm) };
		});
		writeLS(LS_KEYS.health, list);
		return Promise.resolve(list.find((it) => it._id === id));
	},
	remove: (id: string) => {
		const list = readLS<HealthMetricRecord>(LS_KEYS.health, initHealthMetrics).filter((it) => it._id !== id);
		writeLS(LS_KEYS.health, list);
		return Promise.resolve(true);
	},
};

export const goalsService = {
	getAll: () => Promise.resolve(readLS<GoalRecord>(LS_KEYS.goals, initGoals)),
	create: (payload: Omit<GoalRecord, '_id' | 'createdAt'>) => {
		const list = readLS<GoalRecord>(LS_KEYS.goals, initGoals);
		const item: GoalRecord = { ...payload, _id: createId(), createdAt: new Date().toISOString() };
		writeLS(LS_KEYS.goals, [item, ...list]);
		return Promise.resolve(item);
	},
	update: (id: string, payload: Partial<GoalRecord>) => {
		const list = readLS<GoalRecord>(LS_KEYS.goals, initGoals).map((it) => (it._id === id ? { ...it, ...payload } : it));
		writeLS(LS_KEYS.goals, list);
		return Promise.resolve(list.find((it) => it._id === id));
	},
	remove: (id: string) => {
		const list = readLS<GoalRecord>(LS_KEYS.goals, initGoals).filter((it) => it._id !== id);
		writeLS(LS_KEYS.goals, list);
		return Promise.resolve(true);
	},
};

export const exerciseService = {
	getAll: () => Promise.resolve(readLS<ExerciseRecord>(LS_KEYS.exercise, initExercises)),
	create: (payload: Omit<ExerciseRecord, '_id' | 'createdAt'>) => {
		const list = readLS<ExerciseRecord>(LS_KEYS.exercise, initExercises);
		const item: ExerciseRecord = { ...payload, _id: createId(), createdAt: new Date().toISOString() };
		writeLS(LS_KEYS.exercise, [item, ...list]);
		return Promise.resolve(item);
	},
	update: (id: string, payload: Partial<ExerciseRecord>) => {
		const list = readLS<ExerciseRecord>(LS_KEYS.exercise, initExercises).map((it) =>
			it._id === id ? { ...it, ...payload } : it,
		);
		writeLS(LS_KEYS.exercise, list);
		return Promise.resolve(list.find((it) => it._id === id));
	},
	remove: (id: string) => {
		const list = readLS<ExerciseRecord>(LS_KEYS.exercise, initExercises).filter((it) => it._id !== id);
		writeLS(LS_KEYS.exercise, list);
		return Promise.resolve(true);
	},
};
