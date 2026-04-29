import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import { healthService } from '@/services/Fitness';
import type { HealthMetricRecord } from '@/services/Fitness/typing';
import { applyFilters, applySort } from '@/services/Fitness/utils';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [danhSach, setDanhSach] = useState<HealthMetricRecord[]>([]);
	const [record, setRecord] = useState<Partial<HealthMetricRecord>>();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [edit, setEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [filters, setFilters] = useState<TFilter<HealthMetricRecord>[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>();
	const [condition, setCondition] = useState<any>(undefined);
	const [sort, setSort] = useState<Record<string, 1 | -1 | undefined>>();
	const initFilter: TFilter<HealthMetricRecord>[] = [];

	const getModel = async () => {
		setLoading(true);
		try {
			const all = await healthService.getAll();
			const dateRangeFilter: TFilter<HealthMetricRecord>[] = condition?.rangeDate
				? [{ field: 'ngay', operator: EOperatorType.BETWEEN, values: condition.rangeDate }]
				: [];
			const filtered = applyFilters(applySort(all, sort), [...filters, ...dateRangeFilter]);
			setTotal(filtered.length);
			setDanhSach(filtered.slice((page - 1) * limit, page * limit));
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (payload: Partial<HealthMetricRecord>) => {
		setFormSubmiting(true);
		try {
			await healthService.create(payload as any);
			message.success('Thêm mới thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<HealthMetricRecord>) => {
		setFormSubmiting(true);
		try {
			await healthService.update(id, payload);
			message.success('Lưu thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		await healthService.remove(id);
		message.success('Xóa thành công');
		await getModel();
	};

	const handleEdit = (rec?: HealthMetricRecord) => {
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
