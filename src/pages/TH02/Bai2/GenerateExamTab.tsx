import type { ColumnsType } from 'antd/es/table';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	Popconfirm,
} from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type {
	Difficulty,
	Exam,
	ExamStructureItem,
	ExamTemplate,
	KnowledgeBlock,
	Question,
	Subject,
} from '@/models/th02bai2';

const { Text } = Typography;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
	{ value: 'De', label: 'Dễ', color: 'green' },
	{ value: 'TrungBinh', label: 'Trung bình', color: 'blue' },
	{ value: 'Kho', label: 'Khó', color: 'orange' },
	{ value: 'RatKho', label: 'Rất khó', color: 'red' },
];

const difficultyLabel = (d: Difficulty) => DIFFICULTY_OPTIONS.find((x) => x.value === d)?.label ?? d;
const difficultyColor = (d: Difficulty) => DIFFICULTY_OPTIONS.find((x) => x.value === d)?.color ?? 'default';

const pickRandom = <T,>(items: T[], count: number): T[] => {
	const cloned = [...items];
	for (let i = cloned.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[cloned[i], cloned[j]] = [cloned[j], cloned[i]];
	}
	return cloned.slice(0, count);
};

const GenerateExamTab: React.FC = () => {
	const { subjects, blocks, questions, templates, exams, saveExam, deleteExam } = useModel('th02bai2');

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm<{ name: string; subjectId: string; templateId?: string }>();
	const [rows, setRows] = useState<ExamStructureItem[]>([]);
	const [preview, setPreview] = useState<Exam | undefined>();

	const subjectById: Record<string, Subject> = Object.fromEntries(subjects.map((s) => [s.id, s]));
	const blockById: Record<string, KnowledgeBlock> = Object.fromEntries(blocks.map((b) => [b.id, b]));

	const examColumns: ColumnsType<Exam> = [
		{ title: 'Tên đề', dataIndex: 'name' },
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			width: 260,
			render: (value: string) => subjectById[value]?.name ?? '(Không rõ)',
		},
		{
			title: 'Thời gian tạo',
			dataIndex: 'createdAt',
			width: 220,
			render: (value: string) => new Date(value).toLocaleString(),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 220,
			render: (_, record) => (
				<Space>
					<Button onClick={() => setPreview(record)}>Xem</Button>
					<Popconfirm
						title='Xóa đề thi này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => deleteExam(record.id)}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

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

	const generateExamQuestionIds = (subjectId: string, structure: ExamStructureItem[]): string[] => {
		const pickedIds: string[] = [];
		for (const row of structure) {
			const pool = questions.filter(
				(q) =>
					q.subjectId === subjectId &&
					q.blockId === row.blockId &&
					q.difficulty === row.difficulty &&
					!pickedIds.includes(q.id),
			);
			if (pool.length < row.quantity) {
				const blockName = blockById[row.blockId]?.name ?? '';
				throw new Error(
					`Không đủ câu hỏi cho khối "${blockName}" - độ khó "${difficultyLabel(
						row.difficulty,
					)}". Cần ${row.quantity}, hiện có ${pool.length}.`,
				);
			}
			const picked = pickRandom(pool, row.quantity);
			pickedIds.push(...picked.map((x) => x.id));
		}
		return pickedIds;
	};

	const previewRows = useMemo(() => {
		if (!preview) return [];
		const list = preview.questionIds
			.map((id) => questions.find((q) => q.id === id))
			.filter(Boolean) as Question[];
		return list.map((q, idx) => ({
			key: q.id,
			stt: idx + 1,
			content: q.content,
			block: blockById[q.blockId]?.name ?? '',
			diff: q.difficulty,
		}));
	}, [preview, questions, blockById]);

	const disabledCreate = subjects.length === 0 || blocks.length === 0;

	return (
		<>
			<Row justify='space-between' align='middle' style={{ marginBottom: 12 }}>
				<Col>
					<Text>
						Chọn môn + cấu trúc (khối kiến thức, độ khó, số lượng) để tạo đề tự động từ ngân hàng câu hỏi.
					</Text>
				</Col>
				<Col>
					<Button
						type='primary'
						onClick={() => {
							form.resetFields();
							setRows([]);
							setVisible(true);
						}}
						disabled={disabledCreate}
					>
						Tạo đề mới
					</Button>
				</Col>
			</Row>
			{disabledCreate ? (
				<div style={{ marginBottom: 12 }}>
					<Text type='warning'>Cần có ít nhất 1 môn học và 1 khối kiến thức trước khi tạo đề.</Text>
				</div>
			) : null}

			<Card type='inner' title='Danh sách đề đã lưu'>
				<Table rowKey='id' dataSource={exams} columns={examColumns} size='small' bordered />
			</Card>

			<Modal
				visible={visible}
				title='Tạo đề thi'
				onCancel={() => setVisible(false)}
				okText='Tạo & Lưu'
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
					try {
						const ids = generateExamQuestionIds(values.subjectId, rows);
						saveExam({
							name: values.name,
							subjectId: values.subjectId,
							structure: rows,
							questionIds: ids,
						});
						setVisible(false);
						Modal.success({ title: 'Tạo đề thành công', content: `Đã tạo ${ids.length} câu hỏi.` });
					} catch (e: any) {
						Modal.error({ title: 'Không thể tạo đề', content: e?.message ?? 'Có lỗi xảy ra' });
					}
				}}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item name='name' label='Tên đề' rules={[{ required: true, message: 'Nhập tên đề' }]}>
								<Input placeholder='VD: Đề số 1' />
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
					<Row gutter={12}>
						<Col span={24}>
							<Form.Item name='templateId' label='Áp dụng cấu trúc có sẵn (nếu muốn)'>
								<Select
									allowClear
									placeholder='Chọn cấu trúc đề đã lưu'
									options={templates.map((t: ExamTemplate) => ({
										value: t.id,
										label: `${t.name} - ${subjectById[t.subjectId]?.name ?? ''}`,
									}))}
									onChange={(templateId) => {
										if (!templateId) return;
										const tpl = templates.find((t) => t.id === templateId);
										if (tpl) {
											setRows(tpl.structure);
											form.setFieldsValue({ subjectId: tpl.subjectId });
										}
									}}
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

			<Modal
				visible={!!preview}
				title={preview ? `Xem đề: ${preview.name}` : 'Xem đề'}
				onCancel={() => setPreview(undefined)}
				footer={null}
				width={900}
			>
				{preview ? (
					<div>
						<Row gutter={12} style={{ marginBottom: 12 }}>
							<Col span={12}>
								<Text>
									<strong>Môn học:</strong> {subjectById[preview.subjectId]?.name ?? ''}
								</Text>
							</Col>
							<Col span={12}>
								<Text>
									<strong>Thời gian tạo:</strong> {new Date(preview.createdAt).toLocaleString()}
								</Text>
							</Col>
						</Row>
						<Table
							dataSource={previewRows}
							pagination={false}
							size='small'
							bordered
							columns={[
								{ title: 'STT', dataIndex: 'stt', width: 80, align: 'center' },
								{ title: 'Khối KT', dataIndex: 'block', width: 200 },
								{
									title: 'Độ khó',
									dataIndex: 'diff',
									width: 140,
									align: 'center',
									render: (value: Difficulty) => (
										<Tag color={difficultyColor(value)}>{difficultyLabel(value)}</Tag>
									),
								},
								{ title: 'Nội dung', dataIndex: 'content' },
							]}
						/>
					</div>
				) : null}
			</Modal>
		</>
	);
};

export default GenerateExamTab;

