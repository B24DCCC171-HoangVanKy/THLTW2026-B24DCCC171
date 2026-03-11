import type { ColumnsType } from 'antd/es/table';
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Typography,
} from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import type {
	Difficulty,
	ExamStructureItem,
	ExamTemplate,
	KnowledgeBlock,
	Subject,
} from '@/models/th02bai2';

const { Text } = Typography;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
	{ value: 'De', label: 'Dễ' },
	{ value: 'TrungBinh', label: 'Trung bình' },
	{ value: 'Kho', label: 'Khó' },
	{ value: 'RatKho', label: 'Rất khó' },
];

const TemplatesTab: React.FC = () => {
	const { subjects, blocks, templates, upsertTemplate, deleteTemplate } = useModel('th02bai2');
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<ExamTemplate | undefined>();
	const [form] = Form.useForm<{ name: string; subjectId: string }>();
	const [rows, setRows] = useState<ExamStructureItem[]>([]);

	const subjectById: Record<string, Subject> = Object.fromEntries(subjects.map((s) => [s.id, s]));
	const blockById: Record<string, KnowledgeBlock> = Object.fromEntries(blocks.map((b) => [b.id, b]));

	const addRow = () => {
		if (blocks.length === 0) return;
		setRows((prev) => [
			...prev,
			{
				id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
				blockId: blocks[0].id,
				difficulty: 'De',
				quantity: 1,
			},
		]);
	};

	const updateRow = (id: string, patch: Partial<ExamStructureItem>) => {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	};

	const deleteRow = (id: string) => {
		setRows((prev) => prev.filter((r) => r.id !== id));
	};

	const structureColumns: ColumnsType<ExamStructureItem> = [
		{
			title: 'Khối kiến thức',
			dataIndex: 'blockId',
			render: (value: string, record) => (
				<Select
					style={{ width: '100%' }}
					value={value}
					onChange={(v) => updateRow(record.id, { blockId: v })}
					options={blocks.map((b) => ({ value: b.id, label: b.name }))}
				/>
			),
		},
		{
			title: 'Độ khó',
			dataIndex: 'difficulty',
			width: 180,
			render: (value: Difficulty, record) => (
				<Select
					style={{ width: '100%' }}
					value={value}
					onChange={(v) => updateRow(record.id, { difficulty: v })}
					options={DIFFICULTY_OPTIONS.map((d) => ({ value: d.value, label: d.label }))}
				/>
			),
		},
		{
			title: 'Số câu',
			dataIndex: 'quantity',
			width: 140,
			render: (value: number, record) => (
				<InputNumber
					min={1}
					style={{ width: '100%' }}
					value={value}
					onChange={(v) => updateRow(record.id, { quantity: Number(v ?? 1) })}
				/>
			),
		},
		{
			title: 'Xóa',
			width: 80,
			align: 'center',
			render: (_, record) => (
				<Button danger onClick={() => deleteRow(record.id)}>
					X
				</Button>
			),
		},
	];

	const templateColumns: ColumnsType<ExamTemplate> = [
		{ title: 'Tên cấu trúc', dataIndex: 'name' },
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			width: 260,
			render: (value: string) => subjectById[value]?.name ?? '(Không rõ)',
		},
		{
			title: 'Chi tiết',
			dataIndex: 'structure',
			render: (value: ExamStructureItem[]) =>
				value
					.map((r) => {
						const blockName = blockById[r.blockId]?.name ?? '';
						const diff = DIFFICULTY_OPTIONS.find((d) => d.value === r.difficulty)?.label ?? r.difficulty;
						return `${blockName} - ${diff}: ${r.quantity} câu`;
					})
					.join('; '),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 220,
			render: (_, record) => (
				<Space>
					<Button
						onClick={() => {
							setEditing(record);
							form.setFieldsValue({ name: record.name, subjectId: record.subjectId });
							setRows(record.structure);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa cấu trúc này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => deleteTemplate(record.id)}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const disabledAdd = subjects.length === 0 || blocks.length === 0;

	return (
		<>
			<Row justify='space-between' align='middle' style={{ marginBottom: 12 }}>
				<Col>
					<Text>Lưu cấu trúc đề để dùng lại sau này.</Text>
				</Col>
				<Col>
					<Button
						type='primary'
						onClick={() => {
							setEditing(undefined);
							form.resetFields();
							setRows([]);
							setVisible(true);
						}}
						disabled={disabledAdd}
					>
						Thêm cấu trúc
					</Button>
				</Col>
			</Row>
			{disabledAdd ? (
				<div style={{ marginBottom: 12 }}>
					<Text type='warning'>Cần có ít nhất 1 môn và 1 khối kiến thức trước khi tạo cấu trúc đề.</Text>
				</div>
			) : null}

			<Table rowKey='id' dataSource={templates} columns={templateColumns} size='small' bordered />

			<Modal
				visible={visible}
				title={editing ? 'Sửa cấu trúc đề' : 'Thêm cấu trúc đề'}
				onCancel={() => setVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
				width={900}
				onOk={async () => {
					const values = await form.validateFields();
					if (rows.length === 0) {
						Modal.warning({ title: 'Thiếu cấu trúc', content: 'Bạn cần thêm ít nhất 1 dòng cấu trúc.' });
						return;
					}
					if (rows.some((r) => !r.blockId)) {
						Modal.warning({
							title: 'Thiếu khối kiến thức',
							content: 'Vui lòng chọn khối kiến thức cho tất cả dòng.',
						});
						return;
					}
					upsertTemplate({
						id: editing?.id,
						name: values.name,
						subjectId: values.subjectId,
						structure: rows,
					});
					setVisible(false);
				}}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item
								name='name'
								label='Tên cấu trúc'
								rules={[{ required: true, message: 'Nhập tên cấu trúc' }]}
							>
								<Input placeholder='VD: Đề giữa kỳ' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='subjectId'
								label='Môn học'
								rules={[{ required: true, message: 'Chọn môn học' }]}
							>
								<Select
									options={subjects.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
									placeholder='Chọn môn'
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<div style={{ marginTop: 8 }}>
					<Space style={{ marginBottom: 8 }}>
						<Button type='dashed' onClick={addRow} disabled={blocks.length === 0}>
							Thêm dòng cấu trúc
						</Button>
						{blocks.length === 0 ? <Text type='warning'>Chưa có khối kiến thức.</Text> : null}
					</Space>
					<Table
						rowKey='id'
						dataSource={rows}
						pagination={false}
						columns={structureColumns}
						size='small'
						bordered
					/>
				</div>
			</Modal>
		</>
	);
};

export default TemplatesTab;

