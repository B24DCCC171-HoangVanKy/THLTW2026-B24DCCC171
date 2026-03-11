import type { ColumnsType } from 'antd/es/table';
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Typography, Row, Col } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import type { KnowledgeBlock } from '@/models/th02bai2';

const { Text } = Typography;

const BlocksTab: React.FC = () => {
	const { blocks, upsertBlock, deleteBlock } = useModel('th02bai2');
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<KnowledgeBlock | undefined>();
	const [form] = Form.useForm<{ name: string }>();

	const columns: ColumnsType<KnowledgeBlock> = [
		{ title: 'Tên khối kiến thức', dataIndex: 'name' },
		{
			title: 'Thao tác',
			align: 'center',
			width: 220,
			render: (_, record) => (
				<Space>
					<Button
						onClick={() => {
							setEditing(record);
							form.setFieldsValue({ name: record.name });
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa khối kiến thức này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => deleteBlock(record.id)}
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
					<Text>Quản lý danh sách khối kiến thức (VD: Tổng quan, Chuyên sâu...).</Text>
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
						Thêm khối
					</Button>
				</Col>
			</Row>

			<Table rowKey='id' dataSource={blocks} columns={columns} size='small' bordered />

			<Modal
				visible={visible}
				title={editing ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
				onCancel={() => setVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
				onOk={async () => {
					const values = await form.validateFields();
					upsertBlock({ id: editing?.id, name: values.name });
					setVisible(false);
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Tên khối kiến thức'
						rules={[{ required: true, message: 'Nhập tên khối kiến thức' }]}
					>
						<Input placeholder='VD: Tổng quan' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default BlocksTab;

