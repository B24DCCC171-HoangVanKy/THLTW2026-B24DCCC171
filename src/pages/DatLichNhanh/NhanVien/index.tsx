import { createStaff, deleteStaff, getStaffList, updateStaff } from '@/services/DatLichNhanh/staff';
import type { TCreateStaff, TStaff, TWorkingHour } from '@/services/DatLichNhanh/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, TimePicker, message } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

const dayLabel = (d?: number) => {
	switch (d) {
		case 1:
			return 'T2';
		case 2:
			return 'T3';
		case 3:
			return 'T4';
		case 4:
			return 'T5';
		case 5:
			return 'T6';
		case 6:
			return 'T7';
		case 7:
			return 'CN';
		default:
			return `D${d ?? ''}`;
	}
};

type TFormValues = {
	name: string;
	phone?: string;
	maxBookingsPerDay?: number;
	workingHours?: { dayOfWeek: number; start: moment.Moment; end: moment.Moment }[];
};

const toMinutes = (m: moment.Moment) => m.hours() * 60 + m.minutes();

const defaultWorkingHours = (): { dayOfWeek: number; start: moment.Moment; end: moment.Moment }[] =>
	[1, 2, 3, 4, 5, 6].map((d) => ({
		dayOfWeek: d,
		start: moment('09:00', 'HH:mm'),
		end: moment('17:00', 'HH:mm'),
	}));

const toWorkingHours = (val?: { dayOfWeek: number; start: moment.Moment; end: moment.Moment }[]): TWorkingHour[] | undefined => {
	if (!val?.length) return undefined;
	const out: TWorkingHour[] = val
		.filter((x) => x?.dayOfWeek && x?.start && x?.end)
		.map((x) => ({
			dayOfWeek: x.dayOfWeek,
			startTime: x.start.format('HH:mm'),
			endTime: x.end.format('HH:mm'),
		}));
	return out.length ? out : undefined;
};

const validateNoOverlapWorkingHours = (val?: { dayOfWeek: number; start: moment.Moment; end: moment.Moment }[]) => {
	if (!val?.length) return Promise.resolve();

	const byDay = new Map<number, { start: moment.Moment; end: moment.Moment }[]>();
	for (const slot of val) {
		if (!slot?.dayOfWeek || !slot?.start || !slot?.end) continue;
		if (!byDay.has(slot.dayOfWeek)) byDay.set(slot.dayOfWeek, []);
		byDay.get(slot.dayOfWeek)!.push({ start: slot.start, end: slot.end });
	}

	for (const [day, slots] of byDay.entries()) {
		// Check start < end
		for (const s of slots) {
			if (toMinutes(s.start) >= toMinutes(s.end)) {
				return Promise.reject(new Error(`Giờ bắt đầu phải nhỏ hơn giờ kết thúc (Thứ ${day})`));
			}
		}

		const sorted = [...slots].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
		for (let i = 1; i < sorted.length; i++) {
			const prev = sorted[i - 1];
			const cur = sorted[i];
			if (toMinutes(cur.start) < toMinutes(prev.end)) {
				return Promise.reject(new Error(`Các ca không được trùng nhau trong cùng 1 ngày (Thứ ${day + 1})`));
			}
		}
	}

	return Promise.resolve();
};

const NhanVienPage = () => {
	const [data, setData] = useState<TStaff[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<TStaff | null>(null);
	const [form] = Form.useForm<TFormValues>();

	const load = async () => {
		setLoading(true);
		try {
			const res = await getStaffList();
			setData(res.data ?? []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const columns = useMemo(
		() => [
			{ title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
			{ title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 140 },
			{
				title: 'Giới hạn/ngày',
				dataIndex: 'maxBookingsPerDay',
				key: 'maxBookingsPerDay',
				width: 120,
				align: 'center' as const,
			},
			{
				title: 'Lịch làm việc',
				dataIndex: 'workingHours',
				key: 'workingHours',
				render: (val: TWorkingHour[] | undefined) => {
					if (!val?.length) return <span>-</span>;
					return (
						<Space size={[4, 4]} wrap>
							{val.map((w, idx) => (
								<Tag key={`${w.dayOfWeek}-${w.startTime}-${idx}`}>
									{dayLabel(w.dayOfWeek)} {w.startTime}-{w.endTime}
								</Tag>
							))}
						</Space>
					);
				},
			},
			{
				title: 'Thao tác',
				key: 'action',
				width: 120,
				align: 'center' as const,
				render: (_: any, record: TStaff) => (
					<Space>
						<Button
							type="link"
							icon={<EditOutlined />}
							onClick={() => {
								setEditing(record);
								form.setFieldsValue({
									name: record.name,
									phone: record.phone,
									maxBookingsPerDay: record.maxBookingsPerDay,
								workingHours: (record.workingHours ?? []).map((w) => ({
									dayOfWeek: w.dayOfWeek,
									start: moment(w.startTime, 'HH:mm'),
									end: moment(w.endTime, 'HH:mm'),
								})),
								});
								setOpen(true);
							}}
						/>
						<Popconfirm
							title="Xóa nhân viên này?"
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={async () => {
								await deleteStaff(record.id);
								message.success('Đã xóa');
								load();
							}}
						>
							<Button danger type="link" icon={<DeleteOutlined />} />
						</Popconfirm>
					</Space>
				),
			},
		],
		[form],
	);

	const onCreate = () => {
		setEditing(null);
		form.resetFields();
		form.setFieldsValue({ workingHours: defaultWorkingHours() } as any);
		setOpen(true);
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		const payload: TCreateStaff = {
			name: values.name,
			phone: values.phone,
			maxBookingsPerDay: values.maxBookingsPerDay,
			workingHours: toWorkingHours(values.workingHours) ?? toWorkingHours(defaultWorkingHours()),
		};

		if (editing) {
			await updateStaff(editing.id, payload);
			message.success('Đã cập nhật');
		} else {
			await createStaff(payload);
			message.success('Đã thêm mới');
		}
		setOpen(false);
		load();
	};

	return (
		<>
			<Space style={{ marginBottom: 12 }}>
				<Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
					Thêm nhân viên
				</Button>
				<Button onClick={load}>Tải lại</Button>
			</Space>

			<Table
				rowKey="id"
				loading={loading}
				columns={columns as any}
				dataSource={data}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title={editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}
				visible={open}
				onCancel={() => setOpen(false)}
				onOk={onSubmit}
				okText="Lưu"
				cancelText="Đóng"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: 'Nhập tên nhân viên' }]}>
						<Input placeholder="Ví dụ: Nguyễn Văn A" />
					</Form.Item>
					<Form.Item label="Số điện thoại" name="phone">
						<Input placeholder="Ví dụ: 090..." />
					</Form.Item>
					<Form.Item label="Số khách tối đa/ngày" name="maxBookingsPerDay">
						<InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 5" />
					</Form.Item>
					<Form.List name="workingHours">
						{(fields, { add, remove }) => (
							<>
								<div style={{ marginBottom: 8, color: '#666' }}>Lịch làm việc theo tuần (T2–T7). Có thể thêm/xóa ca.</div>
								{fields.map((field) => (
									<Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
										<Form.Item
											{...field}
											label="Thứ"
											name={[field.name, 'dayOfWeek']}
											rules={[{ required: true, message: 'Chọn thứ' }]}
										>
											<Select
												style={{ width: 110 }}
												options={[
													{ value: 1, label: 'T2' },
													{ value: 2, label: 'T3' },
													{ value: 3, label: 'T4' },
													{ value: 4, label: 'T5' },
													{ value: 5, label: 'T6' },
													{ value: 6, label: 'T7' },
												]}
											/>
										</Form.Item>
										<Form.Item
											{...field}
											label="Bắt đầu"
											name={[field.name, 'start']}
											rules={[{ required: true, message: 'Chọn giờ' }]}
										>
											<TimePicker format="HH:mm" minuteStep={5} />
										</Form.Item>
										<Form.Item
											{...field}
											label="Kết thúc"
											name={[field.name, 'end']}
											rules={[{ required: true, message: 'Chọn giờ' }]}
										>
											<TimePicker format="HH:mm" minuteStep={5} />
										</Form.Item>
										<Button type="link" danger onClick={() => remove(field.name)}>
											Xóa
										</Button>
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add({ dayOfWeek: 1, start: moment('09:00', 'HH:mm'), end: moment('17:00', 'HH:mm') })} block>
										Thêm ca làm
									</Button>
								</Form.Item>
								<Form.Item shouldUpdate noStyle>
									{() => {
										const errs = form.getFieldError('workingHours');
										if (!errs?.length) return null;
										return (
											<div style={{ marginTop: -4, marginBottom: 8, color: '#ff4d4f' }}>
												{errs[0]}
											</div>
										);
									}}
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.Item
						name="workingHours"
						rules={[
							{
								validator: async (_, val) => validateNoOverlapWorkingHours(val),
							},
						]}
						hidden
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default NhanVienPage;

