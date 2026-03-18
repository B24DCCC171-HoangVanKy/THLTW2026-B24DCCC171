import { createService, deleteService, getServiceList, updateService } from '@/services/DatLichNhanh/service';
import type { TCreateService, TService } from '@/services/DatLichNhanh/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Switch, Table, Tag, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

type TFormValues = {
	name: string;
	duration: number;
	price: number;
	active?: boolean;
};

const money = (v?: number) => {
	if (typeof v !== 'number') return '-';
	return v.toLocaleString('vi-VN');
};

const DichVuPage = () => {
	const [data, setData] = useState<TService[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<TService | null>(null);
	const [form] = Form.useForm<TFormValues>();

	const load = async () => {
		setLoading(true);
		try {
			const res = await getServiceList();
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
			{ title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
			{
				title: 'Thời lượng (phút)',
				dataIndex: 'duration',
				key: 'duration',
				width: 150,
				align: 'center' as const,
			},
			{
				title: 'Giá (VND)',
				dataIndex: 'price',
				key: 'price',
				width: 150,
				align: 'right' as const,
				render: (val: number) => <span>{money(val)}</span>,
			},
			{
				title: 'Trạng thái',
				dataIndex: 'active',
				key: 'active',
				width: 120,
				align: 'center' as const,
				render: (val: boolean | undefined) =>
					val === false ? <Tag color="red">Ngưng</Tag> : <Tag color="green">Đang dùng</Tag>,
			},
			{
				title: 'Thao tác',
				key: 'action',
				width: 120,
				align: 'center' as const,
				render: (_: any, record: TService) => (
					<Space>
						<Button
							type="link"
							icon={<EditOutlined />}
							onClick={() => {
								setEditing(record);
								form.setFieldsValue({
									name: record.name,
									duration: record.duration,
									price: record.price,
									active: record.active !== false,
								});
								setOpen(true);
							}}
						/>
						<Popconfirm
							title="Xóa dịch vụ này?"
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={async () => {
								await deleteService(record.id);
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
		form.setFieldsValue({ active: true } as any);
		setOpen(true);
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		const payload: TCreateService = {
			name: values.name,
			duration: values.duration,
			price: values.price,
			active: values.active !== false,
		};

		if (editing) {
			await updateService(editing.id, payload);
			message.success('Đã cập nhật');
		} else {
			await createService(payload);
			message.success('Đã thêm mới');
		}
		setOpen(false);
		load();
	};

	return (
		<>
			<Space style={{ marginBottom: 12 }}>
				<Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
					Thêm dịch vụ
				</Button>
				<Button onClick={load}>Tải lại</Button>
			</Space>

			<Table rowKey="id" loading={loading} columns={columns as any} dataSource={data} pagination={{ pageSize: 10 }} />

			<Modal
				title={editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
				visible={open}
				onCancel={() => setOpen(false)}
				onOk={onSubmit}
				okText="Lưu"
				cancelText="Đóng"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}>
						<Input placeholder="Ví dụ: Cắt tóc nam" />
					</Form.Item>
					<Form.Item
						label="Thời lượng (phút)"
						name="duration"
						rules={[{ required: true, message: 'Nhập thời lượng' }]}
					>
						<InputNumber min={5} step={5} style={{ width: '100%' }} placeholder="Ví dụ: 30" />
					</Form.Item>
					<Form.Item label="Giá (VND)" name="price" rules={[{ required: true, message: 'Nhập giá' }]}>
						<InputNumber min={0} step={10000} style={{ width: '100%' }} placeholder="Ví dụ: 100000" />
					</Form.Item>
					<Form.Item label="Đang cung cấp" name="active" valuePropName="checked">
						<Switch />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default DichVuPage;

