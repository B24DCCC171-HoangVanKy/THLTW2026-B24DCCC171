import { exerciseService } from '@/services/Fitness';
import type { ExerciseRecord } from '@/services/Fitness/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [dsBaiTap, setDsBaiTap] = useState<ExerciseRecord[]>([]);
	const [record, setRecord] = useState<Partial<ExerciseRecord>>();
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [keyword, setKeyword] = useState('');
	const [nhomCoLoc, setNhomCoLoc] = useState<string>('Tất cả');
	const [mucDoLoc, setMucDoLoc] = useState<string>('Tất cả');

	const getModel = async () => {
		setLoading(true);
		try {
			const all = await exerciseService.getAll();
			const filtered = all.filter((item) => {
				const byName = item.tenBaiTap.toLowerCase().includes(keyword.toLowerCase());
				const byNhom = nhomCoLoc === 'Tất cả' || item.nhomCo === nhomCoLoc;
				const byMucDo = mucDoLoc === 'Tất cả' || item.mucDo === mucDoLoc;
				return byName && byNhom && byMucDo;
			});
			setDsBaiTap(filtered);
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (payload: Partial<ExerciseRecord>) => {
		setFormSubmiting(true);
		try {
			await exerciseService.create(payload as any);
			message.success('Thêm bài tập thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<ExerciseRecord>) => {
		setFormSubmiting(true);
		try {
			await exerciseService.update(id, payload);
			message.success('Cập nhật thành công');
			setVisibleForm(false);
			await getModel();
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		await exerciseService.remove(id);
		message.success('Xóa thành công');
		await getModel();
	};

	return {
		dsBaiTap,
		record,
		setRecord,
		loading,
		formSubmiting,
		visibleForm,
		setVisibleForm,
		visibleDetail,
		setVisibleDetail,
		isEdit,
		setIsEdit,
		keyword,
		setKeyword,
		nhomCoLoc,
		setNhomCoLoc,
		mucDoLoc,
		setMucDoLoc,
		getModel,
		postModel,
		putModel,
		deleteModel,
	};
};
