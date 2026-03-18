import { deleteReview, getReviewList, updateReview } from '@/services/DatLichNhanh/review';
import { getServiceList } from '@/services/DatLichNhanh/service';
import { getStaffList } from '@/services/DatLichNhanh/staff';
import type { TReview, TService, TStaff } from '@/services/DatLichNhanh/types';
import { DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

type TReplyForm = { reply?: string };

const starTag = (rating: number) => {
	const color = rating >= 4 ? 'green' : rating >= 3 ? 'blue' : 'red';
	return <Tag color={color}>{rating}★</Tag>;
};

const DanhGiaPage = () => {
	const [reviews, setReviews] = useState<TReview[]>([]);
	const [staff, setStaff] = useState<TStaff[]>([]);
	const [services, setServices] = useState<TService[]>([]);
	const [loading, setLoading] = useState(false);

	const [openReply, setOpenReply] = useState(false);
	const [selected, setSelected] = useState<TReview | null>(null);
	const [form] = Form.useForm<TReplyForm>();

	const [filterStaffId, setFilterStaffId] = useState<number | undefined>(undefined);

	const load = async () => {
		setLoading(true);
		try {
			const [r, st, sv] = await Promise.all([getReviewList(), getStaffList(), getServiceList()]);
			setReviews(r.data ?? []);
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

	const filtered = useMemo(() => {
		const list = reviews.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
		return filterStaffId ? list.filter((x) => x.staffId === filterStaffId) : list;
	}, [reviews, filterStaffId]);

	const avgByStaff = useMemo(() => {
		const map = new Map<number, { sum: number; count: number }>();
		for (const r of reviews) {
			const cur = map.get(r.staffId) ?? { sum: 0, count: 0 };
			cur.sum += r.rating;
			cur.count += 1;
			map.set(r.staffId, cur);
		}
		return new Map<number, number>([...map.entries()].map(([k, v]) => [k, v.count ? Math.round((v.sum / v.count) * 10) / 10 : 0]));
	}, [reviews]);

	const columns = useMemo(
		() => [
			{
				title: 'Nhân viên',
				dataIndex: 'staffId',
				key: 'staffId',
				render: (v: number) => staffName.get(v) ?? v,
			},
			{
				title: 'Dịch vụ',
				dataIndex: 'serviceId',
				key: 'serviceId',
				render: (v: number) => serviceName.get(v) ?? v,
			},
			{ title: 'Đánh giá', dataIndex: 'rating', key: 'rating', width: 110, align: 'center' as const, render: starTag },
			{ title: 'Nội dung', dataIndex: 'comment', key: 'comment', render: (v: string) => v || '-' },
			{
				title: 'Phản hồi',
				dataIndex: 'reply',
				key: 'reply',
				render: (v: string) => v || '-',
			},
			{
				title: 'Thao tác',
				key: 'action',
				width: 120,
				align: 'center' as const,
				render: (_: any, r: TReview) => (
					<Space>
						<Button
							type="link"
							icon={<MessageOutlined />}
							onClick={() => {
								setSelected(r);
								form.setFieldsValue({ reply: r.reply });
								setOpenReply(true);
							}}
						/>
						<Popconfirm
							title="Xóa đánh giá này?"
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={async () => {
								await deleteReview(r.id);
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
		[form, serviceName, staffName],
	);

	return (
		<>
			<Space style={{ marginBottom: 12 }} wrap>
				<Select
					allowClear
					style={{ width: 280 }}
					placeholder="Lọc theo nhân viên"
					value={filterStaffId}
					onChange={(v) => setFilterStaffId(v)}
					options={staff.map((s) => ({
						value: s.id,
						label: `${s.name} (TB: ${avgByStaff.get(s.id) ?? 0}★)`,
					}))}
				/>
				<Button onClick={load}>Tải lại</Button>
			</Space>

			<Table rowKey="id" loading={loading} columns={columns as any} dataSource={filtered} pagination={{ pageSize: 10 }} />

			<Modal
				title="Phản hồi đánh giá"
				visible={openReply}
				onCancel={() => setOpenReply(false)}
				onOk={async () => {
					const values = await form.validateFields();
					if (!selected) return;
					await updateReview(selected.id, { reply: values.reply });
					message.success('Đã lưu phản hồi');
					setOpenReply(false);
					load();
				}}
				okText="Lưu"
				cancelText="Đóng"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item label="Nội dung phản hồi" name="reply">
						<Input.TextArea rows={4} placeholder="Nhập phản hồi..." />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default DanhGiaPage;

