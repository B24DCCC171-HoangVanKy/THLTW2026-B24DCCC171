import { useState } from 'react';
import {
	doiTrangThaiTask,
	lamMoiDuLieuGoc,
	layDanhSachTask,
	suaTask,
	themTask,
	xoaTask,
	type DoUuTienTask,
	type TaskItem,
	type TrangThaiTask,
} from '@/services/TaskLocal/tasklocalservice';

export interface FormTaskData {
	tenTask: string;
	moTa?: string;
	deadline: string;
	doUuTien: DoUuTienTask;
	trangThai: TrangThaiTask;
	tags?: string[];
}

export default () => {
	const [danhSachTask, setDanhSachTask] = useState<TaskItem[]>([]);
	const [taskDangSua, setTaskDangSua] = useState<TaskItem | undefined>();
	const [moTaskForm, setMoTaskForm] = useState<boolean>(false);

	const taiDanhSachTask = (): void => {
		setDanhSachTask(layDanhSachTask());
	};

	const moFormThem = (): void => {
		setTaskDangSua(undefined);
		setMoTaskForm(true);
	};

	const moFormSua = (taskItem: TaskItem): void => {
		setTaskDangSua(taskItem);
		setMoTaskForm(true);
	};

	const dongFormTask = (): void => {
		setMoTaskForm(false);
		setTaskDangSua(undefined);
	};

	const luuTask = (duLieuForm: FormTaskData): void => {
		const danhSachMoi = taskDangSua
			? suaTask(taskDangSua.id, duLieuForm)
			: themTask({
					...duLieuForm,
					tags: duLieuForm.tags || [],
				});
		setDanhSachTask(danhSachMoi);
		dongFormTask();
	};

	const xoaTaskTheoId = (taskId: string): void => {
		const danhSachMoi = xoaTask(taskId);
		setDanhSachTask(danhSachMoi);
	};

	const capNhatTrangThaiTask = (taskId: string, trangThai: TrangThaiTask): void => {
		const danhSachMoi = doiTrangThaiTask(taskId, trangThai);
		setDanhSachTask(danhSachMoi);
	};

	const taiLaiDuLieuGoc = (): void => {
		const danhSachMoi = lamMoiDuLieuGoc();
		setDanhSachTask(danhSachMoi);
	};

	return {
		danhSachTask,
		taskDangSua,
		moTaskForm,
		taiDanhSachTask,
		moFormThem,
		moFormSua,
		dongFormTask,
		luuTask,
		xoaTaskTheoId,
		capNhatTrangThaiTask,
		taiLaiDuLieuGoc,
	};
};
