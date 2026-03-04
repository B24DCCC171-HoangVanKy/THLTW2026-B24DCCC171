import { useEffect, useState } from 'react';
import { Alert, Button, Card, DatePicker, Form, Input, InputNumber, Popconfirm, Select, Space, Table, Tabs, Tag, message } from 'antd';

type Subject = {
	id: number;
	name: string;
};

type StudySession = {
	id: number;
	subjectId: number;
	date: string;
	monthKey: string;
	hours: number;
	content: string;
	note?: string;
};

type MonthlyGoal = {
	id: number;
	subjectId: number;
	month: string; 
	targetHours: number;
};

const SUBJECT_KEY = 'study_subjects';
const SESSION_KEY = 'study_sessions';
const GOAL_KEY = 'study_goals';

const loadData = <T,>(key: string, defaultValue: T): T => {
	if (typeof window === 'undefined') {
		return defaultValue;
	}

	try {
		const raw = localStorage.getItem(key);
		if (!raw) {
			return defaultValue;
		}
		return JSON.parse(raw) as T;
	} catch {
		return defaultValue;
	}
};

const saveData = (key: string, value: unknown) => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {

	}
};

const StudyManager = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [sessions, setSessions] = useState<StudySession[]>([]);
	const [goals, setGoals] = useState<MonthlyGoal[]>([]);

	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [editingSession, setEditingSession] = useState<StudySession | null>(null);
	const [selectedSubjectForSummary, setSelectedSubjectForSummary] = useState<number | null>(null);
	const [selectedMonthForSummary, setSelectedMonthForSummary] = useState<string>('');

	const [subjectForm] = Form.useForm<Subject>();
	const [sessionForm] = Form.useForm();
	const [goalForm] = Form.useForm<MonthlyGoal>();

	useEffect(() => {
		setSubjects(loadData<Subject[]>(SUBJECT_KEY, []));
		setSessions(loadData<StudySession[]>(SESSION_KEY, []));
		setGoals(loadData<MonthlyGoal[]>(GOAL_KEY, []));
	}, []);

	useEffect(() => {
		saveData(SUBJECT_KEY, subjects);
	}, [subjects]);

	useEffect(() => {
		saveData(SESSION_KEY, sessions);
	}, [sessions]);

	useEffect(() => {
		saveData(GOAL_KEY, goals);
	}, [goals]);

	const handleSaveSubject = (values: Subject) => {
		if (editingSubject) {
			const newList = subjects.map((item) =>
				item.id === editingSubject.id ? { ...editingSubject, name: values.name } : item,
			);
			setSubjects(newList);
			setEditingSubject(null);
			message.success('Cập nhật môn học thành công');
		} else {
			const newSubject: Subject = {
				id: Date.now(),
				name: values.name,
			};
			setSubjects([...subjects, newSubject]);
			message.success('Thêm môn học thành công');
		}

		subjectForm.resetFields();
	};

	const handleEditSubject = (record: Subject) => {
		setEditingSubject(record);
		subjectForm.setFieldsValue(record);
	};

	const handleDeleteSubject = (id: number) => {
		const newSubjects = subjects.filter((item) => item.id !== id);
		const newSessions = sessions.filter((item) => item.subjectId !== id);
		const newGoals = goals.filter((item) => item.subjectId !== id);

		setSubjects(newSubjects);
		setSessions(newSessions);
		setGoals(newGoals);
		message.info('Đã xoá môn học và dữ liệu liên quan');
	};

	const handleSaveSession = (rawValues: any) => {
		if (!rawValues.subjectId) {
			message.error('Vui lòng chọn môn học');
			return;
		}

		const dateValue = rawValues.date;
		const dateText =
			dateValue && typeof dateValue === 'object' && dateValue.format
				? dateValue.format('DD-MM-YYYY HH:mm')
				: String(dateValue || '');
		const monthKey =
			dateValue && typeof dateValue === 'object' && dateValue.format
				? dateValue.format('YYYY-MM')
				: '';

		const values: StudySession = {
			id: rawValues.id || 0,
			subjectId: rawValues.subjectId,
			date: dateText,
			monthKey,
			hours: rawValues.hours,
			content: rawValues.content,
			note: rawValues.note,
		};

		if (editingSession) {
			const newList = sessions.map((item) =>
				item.id === editingSession.id
					? {
							...editingSession,
							...values,
					  }
					: item,
			);
			setSessions(newList);
			setEditingSession(null);
			message.success('Cập nhật lịch học thành công');
		} else {
			const newSession: StudySession = {
				id: Date.now(),
				subjectId: values.subjectId,
				date: values.date,
				monthKey: values.monthKey,
				hours: values.hours,
				content: values.content,
				note: values.note,
			};
			setSessions([...sessions, newSession]);
			message.success('Thêm lịch học thành công');
		}

		sessionForm.resetFields();
	};

	const handleEditSession = (record: StudySession) => {
		setEditingSession(record);
		sessionForm.setFieldsValue({
			...record,
			date: undefined,
		});
	};

	const handleDeleteSession = (id: number) => {
		setSessions(sessions.filter((item) => item.id !== id));
		message.info('Đã xoá lịch học');
	};

	const handleSaveGoal = (rawValues: any) => {
		const monthValue = rawValues.month;
		const monthText =
			monthValue && typeof monthValue === 'object' && monthValue.format
				? monthValue.format('YYYY-MM')
				: String(monthValue || '');

		const values: MonthlyGoal = {
			id: rawValues.id || 0,
			subjectId: rawValues.subjectId,
			month: monthText,
			targetHours: rawValues.targetHours,
		};

		if (!values.subjectId || !values.month) {
			message.error('Vui lòng chọn môn học và tháng');
			return;
		}

		const existedIndex = goals.findIndex(
			(item) => item.subjectId === values.subjectId && item.month === values.month,
		);

		if (existedIndex >= 0) {
			const newGoals = [...goals];
			newGoals[existedIndex] = {
				...newGoals[existedIndex],
				targetHours: values.targetHours,
			};
			setGoals(newGoals);
			message.success('Cập nhật mục tiêu tháng thành công');
		} else {
			const newGoal: MonthlyGoal = {
				id: Date.now(),
				subjectId: values.subjectId,
				month: values.month,
				targetHours: values.targetHours,
			};
			setGoals([...goals, newGoal]);
			message.success('Thêm mục tiêu tháng thành công');
		}

		goalForm.resetFields();
	};

	const handleDeleteGoal = (id: number) => {
		setGoals(goals.filter((item) => item.id !== id));
		message.info('Đã xoá mục tiêu');
	};

	const getSubjectName = (id: number) => {
		const subject = subjects.find((item) => item.id === id);
		return subject ? subject.name : 'Không rõ';
	};

	const tinhSoGioDaHoc = (subjectId: number, month: string) =>
		sessions
			.filter((session) => session.subjectId === subjectId && session.monthKey === month)
			.reduce((total, item) => total + (item.hours || 0), 0);

	let currentGoalInfo: {
		hasGoal: boolean;
		learned: number;
		targetHours?: number;
		done?: boolean;
	} | null = null;

	if (selectedSubjectForSummary && selectedMonthForSummary) {
		const goal = goals.find(
			(item) =>
				item.subjectId === selectedSubjectForSummary && item.month === selectedMonthForSummary,
		);
		const learned = tinhSoGioDaHoc(selectedSubjectForSummary, selectedMonthForSummary);

		if (!goal) {
			currentGoalInfo = {
				hasGoal: false,
				learned,
			};
		} else {
			currentGoalInfo = {
				hasGoal: true,
				learned,
				targetHours: goal.targetHours,
				done: learned >= goal.targetHours,
			};
		}
	}

	const subjectColumns = [
		{
			title: 'Tên môn học',
			dataIndex: 'name',
		},
		{
			title: 'Thao tác',
			render: (record: Subject) => (
				<Space>
					<Button size='small' onClick={() => handleEditSubject(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xoá môn học này?'
						okText='Có'
						cancelText='Không'
						onConfirm={() => handleDeleteSubject(record.id)}
					>
						<Button size='small' danger>
							Xoá
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const sessionColumns = [
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			render: (value: number) => getSubjectName(value),
		},
		{
			title: 'Thời gian học (DD-MM-YYYY HH:MM)',
			dataIndex: 'date',
		},
		{
			title: 'Số giờ',
			dataIndex: 'hours',
		},
		{
			title: 'Nội dung đã học',
			dataIndex: 'content',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
		},
		{
			title: 'Thao tác',
			render: (record: StudySession) => (
				<Space>
					<Button size='small' onClick={() => handleEditSession(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xoá lịch học này?'
						okText='Có'
						cancelText='Không'
						onConfirm={() => handleDeleteSession(record.id)}
					>
						<Button size='small' danger>
							Xoá
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const goalColumns = [
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			render: (value: number) => getSubjectName(value),
		},
		{
			title: 'Tháng (MM-YYYY)',
			dataIndex: 'month',
		},
		{
			title: 'Mục tiêu (giờ)',
			dataIndex: 'targetHours',
		},
		{
			title: 'Đã học (giờ)',
			render: (record: MonthlyGoal) => tinhSoGioDaHoc(record.subjectId, record.month),
		},
		{
			title: 'Trạng thái',
			render: (record: MonthlyGoal) => {
				const learned = tinhSoGioDaHoc(record.subjectId, record.month);
				const done = learned >= record.targetHours;
				return (
					<Tag color={done ? 'green' : 'orange'}>
						{done ? 'Hoàn thành' : 'Chưa hoàn thành'}
					</Tag>
				);
			},
		},
		{
			title: 'Thao tác',
			render: (record: MonthlyGoal) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn xoá mục tiêu này?'
					okText='Có'
					cancelText='Không'
					onConfirm={() => handleDeleteGoal(record.id)}
				>
					<Button size='small' danger>
						Xoá
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<Card
			title='TH01 - Bài 2: Quản lý học tập'
			headStyle={{ textAlign: 'center', fontWeight: 'bold' }}
			style={{ maxWidth: 1000, margin: '0 auto' }}
		>
			<Tabs defaultActiveKey='subjects'>
				<Tabs.TabPane tab='Danh mục môn học' key='subjects'>
					<Space direction='vertical' style={{ width: '100%' }} size='large'>
						<Form form={subjectForm} layout='inline' onFinish={handleSaveSubject}>
							<Form.Item
								label='Tên môn học'
								name='name'
								rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
							>
								<Input placeholder='Ví dụ: Toán, Văn, Anh...' />
							</Form.Item>
							<Form.Item>
								<Space>
									<Button type='primary' htmlType='submit'>
										{editingSubject ? 'Lưu thay đổi' : 'Thêm môn học'}
									</Button>
									{editingSubject && (
										<Button
											onClick={() => {
												setEditingSubject(null);
												subjectForm.resetFields();
											}}
										>
											Huỷ sửa
										</Button>
									)}
								</Space>
							</Form.Item>
						</Form>
						<Table
							rowKey='id'
							dataSource={subjects}
							columns={subjectColumns}
							pagination={false}
							size='small'
							bordered
						/>
					</Space>
				</Tabs.TabPane>

				<Tabs.TabPane tab='Tiến độ học tập' key='sessions'>
					<Space direction='vertical' style={{ width: '100%' }} size='large'>
						<Form form={sessionForm} layout='vertical' onFinish={handleSaveSession}>
							<Form.Item
								label='Môn học'
								name='subjectId'
								rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
							>
								<Select
									placeholder='Chọn môn học'
									onChange={(value: number) => {
										setSelectedSubjectForSummary(value);
									}}
								>
									{subjects.map((subject) => (
										<Select.Option key={subject.id} value={subject.id}>
											{subject.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item
								label='Thời gian học (DD-MM-YYYY HH:MM)'
								name='date'
								rules={[{ required: true, message: 'Vui lòng nhập thời gian học' }]}
							>
								<DatePicker
									showTime={{ format: 'HH:mm' }}
									format='DD-MM-YYYY HH:mm'
									style={{ width: '100%' }}
									onChange={(value) => {
										if (value && value.format) {
											setSelectedMonthForSummary(value.format('YYYY-MM'));
										} else {
											setSelectedMonthForSummary('');
										}
									}}
									placeholder='Ví dụ: 04-03-2026 08:30'
								/>
							</Form.Item>
							<Form.Item
								label='Số giờ học'
								name='hours'
								rules={[{ required: true, message: 'Vui lòng nhập số giờ học' }]}
							>
								<InputNumber min={0} />
							</Form.Item>
							<Form.Item
								label='Nội dung đã học'
								name='content'
								rules={[{ required: true, message: 'Vui lòng ghi nội dung đã học' }]}
							>
								<Input.TextArea rows={2} />
							</Form.Item>
							<Form.Item label='Ghi chú' name='note'>
								<Input.TextArea rows={2} />
							</Form.Item>
							<Form.Item>
								<Space>
									<Button type='primary' htmlType='submit'>
										{editingSession ? 'Lưu thay đổi' : 'Thêm lịch học'}
									</Button>
									{editingSession && (
										<Button
											onClick={() => {
												setEditingSession(null);
												sessionForm.resetFields();
											}}
										>
											Huỷ sửa
										</Button>
									)}
								</Space>
							</Form.Item>
						</Form>
						{currentGoalInfo && (
							<Alert
								showIcon
								type={
									currentGoalInfo.hasGoal
										? currentGoalInfo.done
											? 'success'
											: 'warning'
										: 'info'
								}
								message={
									currentGoalInfo.hasGoal
										? `Mục tiêu tháng này: ${currentGoalInfo.targetHours} giờ`
										: 'Môn học này tháng này chưa có mục tiêu.'
								}
								description={
									currentGoalInfo.hasGoal
										? `Đã học: ${currentGoalInfo.learned} giờ. Trạng thái: ${
												currentGoalInfo.done ? 'Hoàn thành' : 'Chưa hoàn thành'
										  }.`
										: `Đã học: ${currentGoalInfo.learned} giờ.`
								}
							/>
						)}
						<Table
							rowKey='id'
							dataSource={sessions}
							columns={sessionColumns}
							pagination={false}
							size='small'
							bordered
						/>
					</Space>
				</Tabs.TabPane>

				<Tabs.TabPane tab='Mục tiêu hàng tháng' key='goals'>
					<Space direction='vertical' style={{ width: '100%' }} size='large'>
						<Form form={goalForm} layout='inline' onFinish={handleSaveGoal}>
							<Form.Item
								label='Môn học'
								name='subjectId'
								rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
							>
								<Select placeholder='Chọn môn học' style={{ width: 160 }}>
									{subjects.map((subject) => (
										<Select.Option key={subject.id} value={subject.id}>
											{subject.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item
								label='Tháng (MM-YYYY)'
								name='month'
								rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
							>
								<DatePicker
									picker='month'
									format='MM-YYYY'
									placeholder='Chọn tháng mục tiêu (ví dụ: 03-2026)'
								/>
							</Form.Item>
							<Form.Item
								label='Mục tiêu (giờ)'
								name='targetHours'
								rules={[{ required: true, message: 'Vui lòng nhập mục tiêu giờ học' }]}
							>
								<InputNumber min={0} />
							</Form.Item>
							<Form.Item>
								<Button type='primary' htmlType='submit'>
									Lưu mục tiêu
								</Button>
							</Form.Item>
						</Form>
						<Table
							rowKey='id'
							dataSource={goals}
							columns={goalColumns}
							pagination={false}
							size='small'
							bordered
						/>
					</Space>
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default StudyManager;

