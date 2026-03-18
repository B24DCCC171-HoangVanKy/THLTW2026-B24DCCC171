import { createStaff, deleteStaff, getStaffList, updateStaff } from '@/services/DatLichNhanh/staff';
import type { TCreateStaff, TStaff, TWorkingHour } from '@/services/DatLichNhanh/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
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
	workingHoursText?: string;
};

const parseWorkingHours = (text?: string): TWorkingHour[] | undefined => {
	const raw = (text ?? '').trim();
	if (!raw) return undefined;

	// Format: "1 09:00-17:00; 5 09:00-12:00" (day start-end; ...)
	const parts = raw
		.split(';')
		.map((x) => x.trim())
		.filter(Boolean);

	const result: TWorkingHour[] = [];
	for (const p of parts) {
		const [dayStr, timeStr] = p.split(/\s+/);
		const day = Number(dayStr);
		if (!day || !timeStr) continue;
		const [startTime, endTime] = timeStr.split('-');
		if (!startTime || !endTime) continue;
		result.push({ dayOfWeek: day, startTime: startTime.trim(), endTime: endTime.trim() });
	}
	return result.length ? result : undefined;
};

const formatWorkingHours = (workingHours?: TWorkingHour[]) => {
	if (!workingHours?.length) return '';
	return workingHours
		.map((w) => `${w.dayOfWeek} ${w.startTime}-${w.endTime}`)
		.join('; ');
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
									workingHoursText: formatWorkingHours(record.workingHours),
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
		setOpen(true);
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		const payload: TCreateStaff = {
			name: values.name,
			phone: values.phone,
			maxBookingsPerDay: values.maxBookingsPerDay,
			workingHours: parseWorkingHours(values.workingHoursText),
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
					<Form.Item
						label="Lịch làm việc (nhập nhanh)"
						name="workingHoursText"
						tooltip='Format: "1 09:00-17:00; 5 09:00-12:00" (1=T2 ... 7=CN)'
					>
						<Input.TextArea rows={3} placeholder='Ví dụ: "1 09:00-17:00; 2 09:00-17:00; 5 09:00-12:00"' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default NhanVienPage;

