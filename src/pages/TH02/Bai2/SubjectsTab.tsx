import type { ColumnsType } from 'antd/es/table';
import { Button, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import type { Subject } from '@/models/th02bai2';

const { Text } = Typography;

const SubjectsTab: React.FC = () => {
	const { subjects, upsertSubject, deleteSubject } = useModel('th02bai2');
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<Subject | undefined>();
	const [form] = Form.useForm<{ code: string; name: string; credits: number }>();

	const columns: ColumnsType<Subject> = [
		{ title: 'Mã môn', dataIndex: 'code', width: 140 },
		{ title: 'Tên môn', dataIndex: 'name' },
		{ title: 'Số tín chỉ', dataIndex: 'credits', width: 120, align: 'center' },
		{
			title: 'Thao tác',
			align: 'center',
			width: 220,
			render: (_, record) => (
				<Space>
					<Button
						onClick={() => {
							setEditing(record);
							form.setFieldsValue({
								code: record.code,
								name: record.name,
								credits: record.credits,
							});
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa môn học này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => deleteSubject(record.id)}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Row justify='space-between' align='middle' style={{ marginBottom: 12 }}>
				<Col>
					<Text>Quản lý môn học (học phần): mã môn, tên môn, số tín chỉ.</Text>
				</Col>
				<Col>
					<Button
						type='primary'
						onClick={() => {
							setEditing(undefined);
							form.resetFields();
							setVisible(true);
						}}
					>
						Thêm môn
					</Button>
				</Col>
			</Row>

			<Table rowKey='id' dataSource={subjects} columns={columns} size='small' bordered />

			<Modal
				visible={visible}
				title={editing ? 'Sửa môn học' : 'Thêm môn học'}
				onCancel={() => setVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
				onOk={async () => {
					const values = await form.validateFields();
					upsertSubject({ id: editing?.id, ...values });
					setVisible(false);
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='code' label='Mã môn' rules={[{ required: true, message: 'Nhập mã môn' }]}>
						<Input placeholder='VD: RIPT1307' />
					</Form.Item>
					<Form.Item name='name' label='Tên môn' rules={[{ required: true, message: 'Nhập tên môn' }]}>
						<Input placeholder='VD: Lập trình Web' />
					</Form.Item>
					<Form.Item
						name='credits'
						label='Số tín chỉ'
						rules={[{ required: true, message: 'Nhập số tín chỉ' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='VD: 3' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default SubjectsTab;

