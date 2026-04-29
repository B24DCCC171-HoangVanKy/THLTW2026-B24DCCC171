import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import { message } from 'antd';
import { useState } from 'react';
import { workoutService } from '@/services/Fitness';
import type { WorkoutLogRecord } from '@/services/Fitness/typing';
import { applyFilters, applySort } from '@/services/Fitness/utils';

export default () => {
	const [danhSach, setDanhSach] = useState<WorkoutLogRecord[]>([]);
	const [record, setRecord] = useState<Partial<WorkoutLogRecord>>();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [edit, setEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [filters, setFilters] = useState<TFilter<WorkoutLogRecord>[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>();
	const [condition, setCondition] = useState<any>(undefined);
	const [sort, setSort] = useState<Record<string, 1 | -1 | undefined>>();
	const initFilter: TFilter<WorkoutLogRecord>[] = [];

	const getModel = async () => {
		setLoading(true);
		try {
			const all = await workoutService.getAll();
			const dateRangeFilter: TFilter<WorkoutLogRecord>[] = condition?.rangeDate
				? [{ field: 'ngayTap', operator: EOperatorType.BETWEEN, values: condition.rangeDate }]
				: [];
			const typeFilter: TFilter<WorkoutLogRecord>[] = condition?.loaiLoc
				? [{ field: 'loaiBaiTap', operator: EOperatorType.INCLUDE, values: [condition.loaiLoc] }]
				: [];
			const filtered = applyFilters(applySort(all, sort), [...filters, ...dateRangeFilter, ...typeFilter]);
			setTotal(filtered.length);
			setDanhSach(filtered.slice((page - 1) * limit, page * limit));
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (payload: Partial<WorkoutLogRecord>) => {
		setFormSubmiting(true);
		try {
			await workoutService.create(payload as any);
			message.success('Thêm mới thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<WorkoutLogRecord>) => {
		setFormSubmiting(true);
		try {
			await workoutService.update(id, payload);
			message.success('Lưu thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		await workoutService.remove(id);
		message.success('Xóa thành công');
		await getModel();
	};

	const handleEdit = (rec?: WorkoutLogRecord) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	return {
		danhSach,
		record,
		setRecord,
		page,
		setPage,
		limit,
		setLimit,
		total,
		loading,
		formSubmiting,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		filters,
		setFilters,
		selectedIds,
		setSelectedIds,
		initFilter,
		condition,
		setCondition,
		sort,
		setSort,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
	};
};
