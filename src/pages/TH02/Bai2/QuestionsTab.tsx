import type { ColumnsType } from 'antd/es/table';
import {
	Button,
	Col,
	Form,
	Input,
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
import type { Difficulty, KnowledgeBlock, Question, Subject } from '@/models/th02bai2';

const { Text } = Typography;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
	{ value: 'De', label: 'Dễ', color: 'green' },
	{ value: 'TrungBinh', label: 'Trung bình', color: 'blue' },
	{ value: 'Kho', label: 'Khó', color: 'orange' },
	{ value: 'RatKho', label: 'Rất khó', color: 'red' },
];

const difficultyLabel = (d: Difficulty) => DIFFICULTY_OPTIONS.find((x) => x.value === d)?.label ?? d;
const difficultyColor = (d: Difficulty) => DIFFICULTY_OPTIONS.find((x) => x.value === d)?.color ?? 'default';

const QuestionsTab: React.FC = () => {
	const { blocks, subjects, questions, upsertQuestion, deleteQuestion } = useModel('th02bai2');

	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<Question | undefined>();
	const [form] = Form.useForm<{
		subjectId: string;
		blockId: string;
		difficulty: Difficulty;
		content: string;
	}>();

	const blockById = useMemo<Record<string, KnowledgeBlock>>(
		() => Object.fromEntries(blocks.map((b) => [b.id, b])),
		[blocks],
	);
	const subjectById = useMemo<Record<string, Subject>>(
		() => Object.fromEntries(subjects.map((s) => [s.id, s])),
		[subjects],
	);

	const columns: ColumnsType<Question> = [
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			width: 220,
			render: (value: string) => subjectById[value]?.name ?? '(Không rõ)',
		},
		{
			title: 'Khối KT',
			dataIndex: 'blockId',
			width: 220,
			render: (value: string) => blockById[value]?.name ?? '(Không rõ)',
		},
		{
			title: 'Độ khó',
			dataIndex: 'difficulty',
			width: 140,
			align: 'center',
			render: (value: Difficulty) => <Tag color={difficultyColor(value)}>{difficultyLabel(value)}</Tag>,
		},
		{
			title: 'Nội dung câu hỏi',
			dataIndex: 'content',
			render: (value: string) => <Text ellipsis={{ tooltip: value }}>{value}</Text>,
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
							form.setFieldsValue({
								subjectId: record.subjectId,
								blockId: record.blockId,
								difficulty: record.difficulty,
								content: record.content,
							});
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa câu hỏi này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => deleteQuestion(record.id)}
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
					<Text>Quản lý câu hỏi theo môn học, khối kiến thức và độ khó.</Text>
				</Col>
				<Col>
					<Button
						type='primary'
						onClick={() => {
							setEditing(undefined);
							form.resetFields();
							setVisible(true);
						}}
						disabled={disabledAdd}
					>
						Thêm câu hỏi
					</Button>
				</Col>
			</Row>
			{disabledAdd ? (
				<div style={{ marginBottom: 12 }}>
					<Text type='warning'>Cần tạo ít nhất 1 môn học và 1 khối kiến thức trước khi thêm câu hỏi.</Text>
				</div>
			) : null}

			<Table rowKey='id' dataSource={questions} columns={columns} size='small' bordered />

			<Modal
				visible={visible}
				title={editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
				onCancel={() => setVisible(false)}
				okText='Lưu'
				cancelText='Hủy'
				onOk={async () => {
					const values = await form.validateFields();
					upsertQuestion({ id: editing?.id, ...values });
					setVisible(false);
				}}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={12}>
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
						<Col span={12}>
							<Form.Item
								name='blockId'
								label='Khối kiến thức'
								rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
							>
								<Select
									options={blocks.map((b) => ({ value: b.id, label: b.name }))}
									placeholder='Chọn khối'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item
								name='difficulty'
								label='Độ khó'
								rules={[{ required: true, message: 'Chọn độ khó' }]}
							>
								<Select
									options={DIFFICULTY_OPTIONS.map((d) => ({ value: d.value, label: d.label }))}
									placeholder='Chọn độ khó'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name='content'
						label='Nội dung câu hỏi'
						rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}
					>
						<Input.TextArea rows={5} placeholder='Nhập nội dung câu hỏi tự luận...' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default QuestionsTab;

