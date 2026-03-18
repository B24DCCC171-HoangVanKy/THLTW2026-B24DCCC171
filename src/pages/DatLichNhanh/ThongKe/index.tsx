import { getBookingList } from '@/services/DatLichNhanh/booking';
import { getServiceList } from '@/services/DatLichNhanh/service';
import { getStaffList } from '@/services/DatLichNhanh/staff';
import type { TBooking, TService, TStaff } from '@/services/DatLichNhanh/types';
import { Card, DatePicker, Select, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

type TGroupMode = 'day' | 'month';
type TRevenueMode = 'service' | 'staff';

const ThongKePage = () => {
	const [bookings, setBookings] = useState<TBooking[]>([]);
	const [staff, setStaff] = useState<TStaff[]>([]);
	const [services, setServices] = useState<TService[]>([]);
	const [loading, setLoading] = useState(false);

	const [groupMode, setGroupMode] = useState<TGroupMode>('day');
	const [revenueMode, setRevenueMode] = useState<TRevenueMode>('service');
	const [from, setFrom] = useState<moment.Moment | null>(moment().startOf('month'));
	const [to, setTo] = useState<moment.Moment | null>(moment().endOf('month'));

	const load = async () => {
		setLoading(true);
		try {
			const [b, st, sv] = await Promise.all([getBookingList(), getStaffList(), getServiceList()]);
			setBookings(b.data ?? []);
			setStaff(st.data ?? []);
			setServices(sv.data ?? []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const staffName = useMemo(() => new Map(staff.map((x) => [x.id, x.name])), [staff]);
	const serviceName = useMemo(() => new Map(services.map((x) => [x.id, x.name])), [services]);

	const filteredBookings = useMemo(() => {
		return bookings.filter((b) => {
			const date = moment(b.date, 'YYYY-MM-DD');
			if (from && date.isBefore(from, 'day')) return false;
			if (to && date.isAfter(to, 'day')) return false;
			return true;
		});
	}, [bookings, from, to]);

	const bookingStats = useMemo(() => {
		type Row = { key: string; label: string; total: number; completed: number };
		const map = new Map<string, Row>();
		for (const b of filteredBookings) {
			const key =
				groupMode === 'day'
					? moment(b.date, 'YYYY-MM-DD').format('YYYY-MM-DD')
					: moment(b.date, 'YYYY-MM-DD').format('YYYY-MM');
			const label =
				groupMode === 'day'
					? moment(b.date, 'YYYY-MM-DD').format('DD/MM/YYYY')
					: moment(b.date, 'YYYY-MM-DD').format('MM/YYYY');
			const cur = map.get(key) ?? { key, label, total: 0, completed: 0 };
			cur.total += 1;
			if (b.status === 'COMPLETED') cur.completed += 1;
			map.set(key, cur);
		}
		return Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : 1));
	}, [filteredBookings, groupMode]);

	const bookingColumns = [
		{ title: groupMode === 'day' ? 'Ngày' : 'Tháng', dataIndex: 'label', key: 'label' },
		{ title: 'Tổng lịch', dataIndex: 'total', key: 'total', width: 120, align: 'center' as const },
		{
			title: 'Hoàn thành',
			dataIndex: 'completed',
			key: 'completed',
			width: 120,
			align: 'center' as const,
			render: (v: number, r: any) => (
				<span>
					{v} / {r.total}
				</span>
			),
		},
	];

	const revenueStats = useMemo(() => {
		type Row = { key: string | number; label: string; count: number; revenue: number };
		const map = new Map<string | number, Row>();
		for (const b of filteredBookings) {
			if (b.status !== 'COMPLETED') continue;
			const sv = services.find((s) => s.id === b.serviceId);
			const price = sv?.price ?? 0;
			const key = revenueMode === 'service' ? b.serviceId : b.staffId;
			const label =
				revenueMode === 'service'
					? serviceName.get(b.serviceId) ?? `Dịch vụ #${b.serviceId}`
					: staffName.get(b.staffId) ?? `Nhân viên #${b.staffId}`;
			const cur = map.get(key) ?? { key, label, count: 0, revenue: 0 };
			cur.count += 1;
			cur.revenue += price;
			map.set(key, cur);
		}
		return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
	}, [filteredBookings, revenueMode, serviceName, services, staffName]);

	const revenueColumns = [
		{ title: revenueMode === 'service' ? 'Dịch vụ' : 'Nhân viên', dataIndex: 'label', key: 'label' },
		{ title: 'Số lịch hoàn thành', dataIndex: 'count', key: 'count', width: 160, align: 'center' as const },
		{
			title: 'Doanh thu (VND)',
			dataIndex: 'revenue',
			key: 'revenue',
			width: 160,
			align: 'right' as const,
			render: (v: number) => <span>{v.toLocaleString('vi-VN')}</span>,
		},
	];

	return (
		<Space direction="vertical" style={{ width: '100%' }} size="large">
			<Card
				title="Thống kê lịch hẹn"
				extra={
					<Space>
						<Tag color="blue">Dựa trên danh sách booking hiện có</Tag>
						<DatePicker.RangePicker
							value={[from, to] as any}
							format="DD/MM/YYYY"
							onChange={(vals) => {
								setFrom(vals?.[0] ?? null);
								setTo(vals?.[1] ?? null);
							}}
						/>
						<Select<TGroupMode>
							value={groupMode}
							style={{ width: 150 }}
							onChange={(v) => setGroupMode(v)}
							options={[
								{ value: 'day', label: 'Theo ngày' },
								{ value: 'month', label: 'Theo tháng' },
							]}
						/>
					</Space>
				}
			>
				<Table
					rowKey="key"
					loading={loading}
					columns={bookingColumns as any}
					dataSource={bookingStats}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<Card
				title="Thống kê doanh thu"
				extra={
					<Select<TRevenueMode>
						value={revenueMode}
						style={{ width: 220 }}
						onChange={(v) => setRevenueMode(v)}
						options={[
							{ value: 'service', label: 'Theo dịch vụ' },
							{ value: 'staff', label: 'Theo nhân viên' },
						]}
					/>
				}
			>
				<Table
					rowKey="key"
					loading={loading}
					columns={revenueColumns as any}
					dataSource={revenueStats}
					pagination={{ pageSize: 10 }}
				/>
			</Card>
		</Space>
	);
};

export default ThongKePage;

