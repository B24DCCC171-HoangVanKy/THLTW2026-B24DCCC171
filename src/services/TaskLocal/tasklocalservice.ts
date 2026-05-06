export const khoaTaskLocal = 'quanlycongviec_tasks';

export type TrangThaiTask = 'Cần làm' | 'Đang làm' | 'Hoàn thành';
export type DoUuTienTask = 'Cao' | 'Trung bình' | 'Thấp';

export interface TaskItem {
	id: string;
	tenTask: string;
	moTa: string;
	deadline: string;
	doUuTien: DoUuTienTask;
	trangThai: TrangThaiTask;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

interface TaskInput {
	tenTask: string;
	moTa?: string;
	deadline: string;
	doUuTien: DoUuTienTask;
	trangThai: TrangThaiTask;
	tags?: string[];
}

const danhSachMau: TaskItem[] = [
	{
		id: 'task-mau-1',
		tenTask: 'Hoàn thành bản phác thảo trang công việc',
		moTa: 'Phác thảo giao diện danh sách công việc và biểu mẫu nhập liệu.',
		deadline: new Date(Date.now() + 86400000).toISOString(),
		doUuTien: 'Cao',
		trangThai: 'Cần làm',
		tags: ['Giao diện', 'Thiết kế'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'task-mau-2',
		tenTask: 'Tích hợp lưu trữ cục bộ',
		moTa: 'Lưu dữ liệu công việc và tải lại sau khi làm mới trang.',
		deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
		doUuTien: 'Trung bình',
		trangThai: 'Đang làm',
		tags: ['Dữ liệu', 'Chức năng'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

const parseDuLieu = (duLieu: string | null): TaskItem[] => {
	if (!duLieu) return [];
	try {
		const ketQua = JSON.parse(duLieu);
		if (!Array.isArray(ketQua)) return [];
		return ketQua as TaskItem[];
	} catch (error) {
		return [];
	}
};

const chuanHoaTrangThai = (trangThai: string): TrangThaiTask => {
	if (trangThai === 'canLam') return 'Cần làm';
	if (trangThai === 'dangLam') return 'Đang làm';
	if (trangThai === 'hoanThanh') return 'Hoàn thành';
	if (trangThai === 'Cần làm' || trangThai === 'Đang làm' || trangThai === 'Hoàn thành') return trangThai;
	return 'Cần làm';
};

const chuanHoaDoUuTien = (doUuTien: string): DoUuTienTask => {
	if (doUuTien === 'cao') return 'Cao';
	if (doUuTien === 'trungBinh') return 'Trung bình';
	if (doUuTien === 'thap') return 'Thấp';
	if (doUuTien === 'Cao' || doUuTien === 'Trung bình' || doUuTien === 'Thấp') return doUuTien;
	return 'Trung bình';
};

const chuanHoaTask = (task: TaskItem): TaskItem => ({
	...task,
	trangThai: chuanHoaTrangThai(task.trangThai),
	doUuTien: chuanHoaDoUuTien(task.doUuTien),
});

export const layDanhSachTask = (): TaskItem[] => {
	const duLieu = localStorage.getItem(khoaTaskLocal);
	const danhSach = parseDuLieu(duLieu).map(chuanHoaTask);
	if (danhSach.length > 0) return danhSach;
	localStorage.setItem(khoaTaskLocal, JSON.stringify(danhSachMau));
	return danhSachMau;
};

export const luuDanhSachTask = (danhSachTask: TaskItem[]): void => {
	localStorage.setItem(khoaTaskLocal, JSON.stringify(danhSachTask));
};

export const lamMoiDuLieuGoc = (): TaskItem[] => {
	const danhSachKhoiTao = danhSachMau.map((task) => ({
		...task,
		id: taoIdTask(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}));
	luuDanhSachTask(danhSachKhoiTao);
	return danhSachKhoiTao;
};

const taoIdTask = (): string => `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const themTask = (duLieuTask: TaskInput): TaskItem[] => {
	const danhSachHienTai = layDanhSachTask();
	const thoiGian = new Date().toISOString();
	const taskMoi: TaskItem = {
		id: taoIdTask(),
		tenTask: duLieuTask.tenTask.trim(),
		moTa: duLieuTask.moTa?.trim() || '',
		deadline: duLieuTask.deadline,
		doUuTien: chuanHoaDoUuTien(duLieuTask.doUuTien),
		trangThai: chuanHoaTrangThai(duLieuTask.trangThai),
		tags: duLieuTask.tags || [],
		createdAt: thoiGian,
		updatedAt: thoiGian,
	};
	const danhSachMoi = [taskMoi, ...danhSachHienTai];
	luuDanhSachTask(danhSachMoi);
	return danhSachMoi;
};

export const suaTask = (taskId: string, duLieuCapNhat: TaskInput): TaskItem[] => {
	const danhSachHienTai = layDanhSachTask();
	const danhSachMoi = danhSachHienTai.map((task) => {
		if (task.id !== taskId) return task;
		return {
			...task,
			tenTask: duLieuCapNhat.tenTask.trim(),
			moTa: duLieuCapNhat.moTa?.trim() || '',
			deadline: duLieuCapNhat.deadline,
			doUuTien: chuanHoaDoUuTien(duLieuCapNhat.doUuTien),
			trangThai: chuanHoaTrangThai(duLieuCapNhat.trangThai),
			tags: duLieuCapNhat.tags || [],
			updatedAt: new Date().toISOString(),
		};
	});
	luuDanhSachTask(danhSachMoi);
	return danhSachMoi;
};

export const xoaTask = (taskId: string): TaskItem[] => {
	const danhSachMoi = layDanhSachTask().filter((task) => task.id !== taskId);
	luuDanhSachTask(danhSachMoi);
	return danhSachMoi;
};

export const doiTrangThaiTask = (taskId: string, trangThai: TrangThaiTask): TaskItem[] => {
	const danhSachMoi = layDanhSachTask().map((task) => {
		if (task.id !== taskId) return task;
		return {
			...task,
			trangThai: chuanHoaTrangThai(trangThai),
													updatedAt: new Date().toISOString(),
		};
	});
	luuDanhSachTask(danhSachMoi);
	return danhSachMoi;
};
