import { goalsService } from '@/services/Fitness';
import type { GoalRecord } from '@/services/Fitness/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [dsMucTieu, setDsMucTieu] = useState<GoalRecord[]>([]);
	const [record, setRecord] = useState<Partial<GoalRecord>>();
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [trangThaiLoc, setTrangThaiLoc] = useState<'Tất cả' | GoalRecord['trangThai']>('Tất cả');

	const getModel = async () => {
		setLoading(true);
		try {
			const all = await goalsService.getAll();
			const filtered = trangThaiLoc === 'Tất cả' ? all : all.filter((item) => item.trangThai === trangThaiLoc);
			setDsMucTieu(filtered);
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (payload: Partial<GoalRecord>) => {
		setFormSubmiting(true);
		try {
			await goalsService.create(payload as any);
			message.success('Thêm mục tiêu thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<GoalRecord>) => {
		setFormSubmiting(true);
		try {
			await goalsService.update(id, payload);
			message.success('Cập nhật thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		await goalsService.remove(id);
		message.success('Xóa thành công');
		await getModel();
	};

	return {
		dsMucTieu,
		record,
		setRecord,
		loading,
		formSubmiting,
		visibleForm,
		setVisibleForm,
		isEdit,
		setIsEdit,
		trangThaiLoc,
		setTrangThaiLoc,
		getModel,
		postModel,
		putModel,
		deleteModel,
	};
};
