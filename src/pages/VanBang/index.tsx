import { createRegistryBook, deleteRegistryBook, listRegistryBooks, type RegistryBook } from '@/services/vanBang';
import { Button, Form, InputNumber, Modal, Popconfirm, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';

const VanBangPage = () => {
	const [items, setItems] = useState<RegistryBook[]>(() => listRegistryBooks());
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<{ year: number }>();
	const currentYear = useMemo(() => new Date().getFullYear(), []);

	const reload = () => setItems(listRegistryBooks());

	const handleCreate = async () => {
		try {
			const values = await form.validateFields();
			createRegistryBook(values.year);
			message.success('Đã tạo sổ văn bằng');
			form.resetFields();
			setOpen(false);
			reload();
		} catch (error: any) {
			if (error?.errorFields) return;
			message.error(error?.message || 'Tạo sổ thất bại');
		}
	};

	const handleDelete = (id: string) => {
		try {
			deleteRegistryBook(id);
			message.success('Đã xóa sổ văn bằng');
			reload();
		} catch (error: any) {
			message.error(error?.message || 'Xóa sổ thất bại');
		}
	};

	return (
		<div>
			<Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
				<Typography.Title level={3} style={{ margin: 0 }}>
					Quản lý sổ văn bằng
				</Typography.Title>
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm sổ
				</Button>
			</Space>

			<Table<RegistryBook>
				rowKey='id'
				dataSource={items}
				pagination={false}
				bordered
				size='middle'
				columns={[
					{
						title: 'STT',
						key: 'stt',
						width: 90,
						align: 'center',
						render: (_value, _record, index) => index + 1,
					},
					{ title: 'Năm', dataIndex: 'year', key: 'year', width: 180, align: 'center' },
					{
						title: 'Số vào sổ hiện tại',
						dataIndex: 'lastEntryNumber',
						key: 'lastEntryNumber',
						width: 220,
						align: 'center',
					},
					{
						title: 'Thao tác',
						key: 'action',
						width: 180,
						align: 'center',
						render: (_, record) => (
							<Popconfirm title='Xóa sổ văn bằng này?' okText='Xóa' cancelText='Hủy' onConfirm={() => handleDelete(record.id)}>
								<Button danger>Xóa</Button>
							</Popconfirm>
						),
					},
				]}
			/>

			<Modal
				title='Thêm sổ văn bằng'
				visible={open}
				onCancel={() => {
					setOpen(false);
					form.resetFields();
				}}
				onOk={handleCreate}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical' initialValues={{ year: currentYear }}>
					<Form.Item
						name='year'
						label='Năm'
						rules={[
							{ required: true, message: 'Nhập năm' },
							{ type: 'number', min: 1900, max: 3000, message: 'Năm không hợp lệ' },
						]}
					>
						<InputNumber style={{ width: '100%' }} precision={0} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default VanBangPage;
