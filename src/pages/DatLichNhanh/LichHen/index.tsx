import { createBooking, deleteBooking, getBookingList, updateBooking, updateBookingStatus } from '@/services/DatLichNhanh/booking';
import { getServiceList } from '@/services/DatLichNhanh/service';
import { getStaffList } from '@/services/DatLichNhanh/staff';
import type { TBooking, TBookingStatus, TCreateBooking, TService, TStaff, TWorkingHour } from '@/services/DatLichNhanh/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, TimePicker, message } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

type TFormValues = {
	customerName: string;
	customerPhone?: string;
	staffId: number;
	serviceId: number;
	date: moment.Moment;
	startTime: moment.Moment;
	status?: TBookingStatus;
	note?: string;
};

const toMinutes = (hhmm: string) => {
	const [h, m] = hhmm.split(':').map((x) => Number(x));
	return (h || 0) * 60 + (m || 0);
};

const addMinutes = (hhmm: string, minutes: number) => {
	const total = toMinutes(hhmm) + minutes;
	const h = Math.floor(total / 60) % 24;
	const m = total % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
	const aS = toMinutes(aStart);
	const aE = toMinutes(aEnd);
	const bS = toMinutes(bStart);
	const bE = toMinutes(bEnd);
	return aS < bE && bS < aE;
};


const getDayOfWeek = (date: string) => {
	const m = moment(date, 'YYYY-MM-DD');
	const d = m.day(); 
	return d === 0 ? 7 : d;
};

const isWithinWorkingHours = (workingHours: TWorkingHour[] | undefined, date: string, startTime: string, endTime: string) => {
	if (!workingHours?.length) return false;
	const day = getDayOfWeek(date);
	const slots = workingHours.filter((w) => w.dayOfWeek === day);
	if (!slots.length) return false;
	return slots.some((w) => toMinutes(w.startTime) <= toMinutes(startTime) && toMinutes(endTime) <= toMinutes(w.endTime));
};

const statusLabel: Record<TBookingStatus, { text: string; color: string }> = {
	PENDING: { text: 'Chờ duyệt', color: 'orange' },
	CONFIRMED: { text: 'Xác nhận', color: 'blue' },
	COMPLETED: { text: 'Hoàn thành', color: 'green' },
	CANCELLED: { text: 'Hủy', color: 'red' },
};

const LichHenPage = () => {
	const [bookings, setBookings] = useState<TBooking[]>([]);
	const [staff, setStaff] = useState<TStaff[]>([]);
	const [services, setServices] = useState<TService[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<TBooking | null>(null);
	const [form] = Form.useForm<TFormValues>();

	const load = async () => {
		setLoading(true);
		try {
			const [b, s, sv] = await Promise.all([getBookingList(), getStaffList(), getServiceList()]);
			setBookings(b.data ?? []);
			setStaff(s.data ?? []);
			setServices((sv.data ?? []).filter((x) => x.active !== false));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const staffName = useMemo(() => new Map(staff.map((x) => [x.id, x.name])), [staff]);
	const serviceName = useMemo(() => new Map(services.map((x) => [x.id, x.name])), [services]);

	const validateBooking = (payload: TCreateBooking, ignoreId?: number) => {
		const st = staff.find((x) => x.id === payload.staffId);
		const sv = services.find((x) => x.id === payload.serviceId);
		if (!st) return 'Chưa chọn nhân viên hợp lệ';
		if (!sv) return 'Chưa chọn dịch vụ hợp lệ';

		if (!st.workingHours?.length) return 'Nhân viên hiện tại không có lịch làm';
		if (!isWithinWorkingHours(st.workingHours, payload.date, payload.startTime, payload.endTime))
			return 'Nhân viên hiện tại không có lịch làm trong ca này';

		const sameDay = bookings.filter((b) => b.staffId === payload.staffId && b.date === payload.date && b.id !== ignoreId);
		const activeSameDay = sameDay.filter((b) => b.status !== 'CANCELLED');

		if (st.maxBookingsPerDay && activeSameDay.length >= st.maxBookingsPerDay) {
			return `Nhân viên đã đạt giới hạn ${st.maxBookingsPerDay} lịch/ngày`;
		}

		for (const b of activeSameDay) {
			if (overlap(payload.startTime, payload.endTime, b.startTime, b.endTime)) {
				return `Nhân viên đã có lịch hẹn lúc (${b.startTime}-${b.endTime})`;
			}
		}

		return null;
	};

	const onCreate = () => {
		setEditing(null);
		form.resetFields();
		form.setFieldsValue({
			date: moment(),
			startTime: moment('09:00', 'HH:mm'),
			status: 'PENDING',
		} as any);
		setOpen(true);
	};

	const onEdit = (record: TBooking) => {
		setEditing(record);
		form.setFieldsValue({
			customerName: record.customerName,
			customerPhone: record.customerPhone,
			staffId: record.staffId,
			serviceId: record.serviceId,
			date: moment(record.date, 'YYYY-MM-DD'),
			startTime: moment(record.startTime, 'HH:mm'),
			status: record.status,
			note: record.note,
		} as any);
		setOpen(true);
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		const sv = services.find((x) => x.id === values.serviceId);
		if (!sv) return message.error('Dịch vụ không hợp lệ');

		const date = values.date.format('YYYY-MM-DD');
		const startTime = values.startTime.format('HH:mm');
		const endTime = addMinutes(startTime, sv.duration);

		const payload: TCreateBooking = {
			customerName: values.customerName,
			customerPhone: values.customerPhone,
			staffId: values.staffId,
			serviceId: values.serviceId,
			date,
			startTime,
			endTime,
			status: (values.status ?? 'PENDING') as TBookingStatus,
			note: values.note,
		};

		const err = validateBooking(payload, editing?.id);
		if (err) return message.error(err);

		if (editing) {
			await updateBooking(editing.id, payload);
			message.success('Đã cập nhật');
		} else {
			await createBooking(payload);
			message.success('Đã tạo lịch');
		}
		setOpen(false);
		load();
	};

	const columns = useMemo(
		() => [
			{ title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: 180 },
			{ title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone', width: 130 },
			{
				title: 'Nhân viên',
				dataIndex: 'staffId',
				key: 'staffId',
				width: 150,
				render: (val: number) => <span>{staffName.get(val) ?? val}</span>,
			},
			{
				title: 'Dịch vụ',
				dataIndex: 'serviceId',
				key: 'serviceId',
				width: 160,
				render: (val: number) => <span>{serviceName.get(val) ?? val}</span>,
			},
			{
				title: 'Ngày',
				dataIndex: 'date',
				key: 'date',
				width: 110,
				render: (val: string) => moment(val, 'YYYY-MM-DD').format('DD/MM/YYYY'),
			},
			{
				title: 'Giờ',
				key: 'time',
				width: 110,
				align: 'center' as const,
				render: (_: any, r: TBooking) => (
					<span>
						{r.startTime}-{r.endTime}
					</span>
				),
			},
			{
				title: 'Trạng thái',
				dataIndex: 'status',
				key: 'status',
				width: 120,
				align: 'center' as const,
				render: (val: TBookingStatus) => <Tag color={statusLabel[val].color}>{statusLabel[val].text}</Tag>,
			},
			{
				title: 'Thao tác',
				key: 'action',
				width: 260,
				fixed: 'right' as const,
				render: (_: any, r: TBooking) => (
					<Space>
						<Button type="link" icon={<EditOutlined />} onClick={() => onEdit(r)} />
						<Button
							type="link"
							onClick={async () => {
								await updateBookingStatus(r.id, 'CONFIRMED');
								load();
							}}
							disabled={r.status !== 'PENDING'}
						>
							Xác nhận
						</Button>
						<Button
							type="link"
							onClick={async () => {
								await updateBookingStatus(r.id, 'COMPLETED');
								load();
							}}
							disabled={r.status !== 'CONFIRMED'}
						>
							Hoàn thành
						</Button>
						<Button
							type="link"
							danger
							onClick={async () => {
								await updateBookingStatus(r.id, 'CANCELLED');
								load();
							}}
							disabled={r.status === 'CANCELLED' || r.status === 'COMPLETED'}
						>
							Hủy
						</Button>
						<Popconfirm
							title="Xóa lịch hẹn này?"
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={async () => {
								await deleteBooking(r.id);
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
		[serviceName, staffName],
	);

	return (
		<>
			<Space style={{ marginBottom: 12 }}>
				<Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
					Đặt lịch
				</Button>
				<Button onClick={load}>Tải lại</Button>
			</Space>

			<Table
				rowKey="id"
				loading={loading}
				columns={columns as any}
				dataSource={bookings}
				scroll={{ x: 1100 }}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title={editing ? 'Sửa lịch hẹn' : 'Đặt lịch hẹn'}
				visible={open}
				onCancel={() => setOpen(false)}
				onOk={onSubmit}
				okText="Lưu"
				cancelText="Đóng"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true, message: 'Nhập tên khách' }]}>
						<Input placeholder="Ví dụ: Nguyễn Văn A" />
					</Form.Item>
					<Form.Item label="SĐT" name="customerPhone">
						<Input placeholder="Ví dụ: 09..." />
					</Form.Item>
					<Form.Item label="Nhân viên" name="staffId" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
						<Select
							placeholder="Chọn nhân viên"
							options={staff.map((s) => ({ value: s.id, label: s.name }))}
						/>
					</Form.Item>
					<Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
						<Select
							placeholder="Chọn dịch vụ"
							options={services.map((s) => ({ value: s.id, label: `${s.name} (${s.duration}p)` }))}
						/>
					</Form.Item>
					<Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Chọn ngày' }]}>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Form.Item label="Giờ bắt đầu" name="startTime" rules={[{ required: true, message: 'Chọn giờ' }]}>
						<TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={5} />
					</Form.Item>
					<Form.Item shouldUpdate noStyle>
						{() => {
							const staffId = form.getFieldValue('staffId') as number | undefined;
							const date = form.getFieldValue('date') as moment.Moment | undefined;
							if (!staffId || !date) return null;
							const st = staff.find((x) => x.id === staffId);
							if (!st) return null;
							const day = getDayOfWeek(date.format('YYYY-MM-DD'));
							const slots = (st.workingHours ?? []).filter((w) => w.dayOfWeek === day);
							return (
								<div style={{ marginTop: -8, marginBottom: 12, color: slots.length ? '#666' : '#ff4d4f' }}>
									{slots.length
										? `Ca làm hôm nay: ${slots.map((s) => `${s.startTime}-${s.endTime}`).join(', ')}`
										: 'Nhân viên hiện tại không có lịch làm hôm nay'}
								</div>
							);
						}}
					</Form.Item>
					<Form.Item label="Trạng thái" name="status">
						<Select
							options={[
								{ value: 'PENDING', label: 'Chờ duyệt' },
								{ value: 'CONFIRMED', label: 'Xác nhận' },
								{ value: 'COMPLETED', label: 'Hoàn thành' },
								{ value: 'CANCELLED', label: 'Hủy' },
							]}
						/>
					</Form.Item>
					<Form.Item label="Ghi chú" name="note">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default LichHenPage;

