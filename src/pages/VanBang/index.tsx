import {
	createRegistryBook,
	deleteRegistryBook,
	listRegistryBooks,
	type RegistryBook,
	createDiploma,
	createFieldDefinition,
	createGraduationDecision,
	deleteDiploma,
	deleteFieldDefinition,
	deleteGraduationDecision,
	listDiplomas,
	listFieldDefinitions,
	listGraduationDecisions,
	resetFakeDb,
	searchDiplomas,
	updateFieldDefinition,
	type Diploma,
	type DiplomaFieldDefinition,
	type DiplomaFieldType,
	type DynamicValues,
	type GraduationDecision,
} from '@/services/vanBang';
import {
	BookOutlined,
	FileDoneOutlined,
	FormOutlined,
	IdcardOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Descriptions,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Switch,
	Table,
	Tabs,
	Typography,
	message,
} from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import './index.less';

const SoVanBangTab = () => {
	const [items, setItems] = useState<RegistryBook[]>(() => listRegistryBooks());
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<{ year: number }>();
	const currentYear = useMemo(() => new Date().getFullYear(), []);
	const reload = () => setItems(listRegistryBooks());

	return (
		<div className='vanBang-tabPane'>
			<div className='vanBang-toolbar'>
				<div>
					<Typography.Title level={4} className='vanBang-sectionTitle'>
						Sổ văn bằng
					</Typography.Title>
					<p className='vanBang-hint'>Mỗi năm một sổ — số vào sổ tăng trong phạm vi sổ.</p>
				</div>
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm sổ
				</Button>
			</div>
			<Table<RegistryBook>
				rowKey='id'
				dataSource={items}
				pagination={false}
				bordered
				size='middle'
				columns={[
					{ title: 'STT', key: 'stt', width: 80, align: 'center', render: (_v, _r, i) => i + 1 },
					{ title: 'Năm', dataIndex: 'year', width: 150, align: 'center' },
					{ title: 'Số vào sổ hiện tại', dataIndex: 'lastEntryNumber', width: 220, align: 'center' },
					{
						title: 'Thao tác',
						width: 120,
						align: 'center',
						render: (_, record) => (
							<Popconfirm
								title='Xóa sổ này?'
								okText='Xóa'
								cancelText='Hủy'
								onConfirm={() => {
									try {
										deleteRegistryBook(record.id);
										message.success('Đã xóa');
										reload();
									} catch (e: any) {
										message.error(e?.message || 'Có lỗi');
									}
								}}
							>
								<Button danger size='small'>
									Xóa
								</Button>
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
				onOk={async () => {
					try {
						const values = await form.validateFields();
						createRegistryBook(values.year);
						message.success('Đã tạo sổ');
						setOpen(false);
						form.resetFields();
						reload();
					} catch (e: any) {
						if (!e?.errorFields) message.error(e?.message || 'Có lỗi');
					}
				}}
			>
				<Form form={form} layout='vertical' initialValues={{ year: currentYear }}>
					<Form.Item name='year' label='Năm' rules={[{ required: true }, { type: 'number', min: 1900, max: 3000 }]}>
						<InputNumber style={{ width: '100%' }} precision={0} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

const QuyetDinhTab = () => {
	const [items, setItems] = useState<GraduationDecision[]>(() => listGraduationDecisions());
	const [books] = useState<RegistryBook[]>(() => listRegistryBooks());
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<{ registryBookId: string; decisionNumber: string; issueDate: moment.Moment; summary: string }>();
	const bookMap = useMemo(() => Object.fromEntries(books.map((b) => [b.id, b])), [books]);
	const reload = () => setItems(listGraduationDecisions());

	return (
		<div className='vanBang-tabPane'>
			<div className='vanBang-toolbar'>
				<div>
					<Typography.Title level={4} className='vanBang-sectionTitle'>
						Quyết định tốt nghiệp
					</Typography.Title>
					<p className='vanBang-hint'>Gắn với sổ văn bằng — có thể nhiều quyết định trong một năm.</p>
				</div>
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm quyết định
				</Button>
			</div>
			<Table<GraduationDecision>
				rowKey='id'
				dataSource={items}
				pagination={false}
				bordered
				size='middle'
				scroll={{ x: 1000 }}
				columns={[
					{ title: 'STT', key: 'stt', width: 70, align: 'center', render: (_v, _r, i) => i + 1 },
					{ title: 'Số QĐ', dataIndex: 'decisionNumber', width: 200 },
					{ title: 'Ngày ban hành', dataIndex: 'issueDate', width: 140, align: 'center', render: (v: string) => moment(v).format('DD/MM/YYYY') },
					{ title: 'Năm sổ', width: 90, align: 'center', render: (_, r) => bookMap[r.registryBookId]?.year ?? '-' },
					{ title: 'Trích yếu', dataIndex: 'summary' },
					{ title: 'Lượt tra cứu', dataIndex: 'searchCount', width: 110, align: 'center' },
					{
						title: 'Thao tác',
						width: 100,
						align: 'center',
						render: (_, record) => (
							<Popconfirm
								title='Xóa quyết định này?'
								okText='Xóa'
								cancelText='Hủy'
								onConfirm={() => {
									try {
										deleteGraduationDecision(record.id);
										message.success('Đã xóa');
										reload();
									} catch (e: any) {
										message.error(e?.message || 'Có lỗi');
									}
								}}
							>
								<Button danger size='small'>
									Xóa
								</Button>
							</Popconfirm>
						),
					},
				]}
			/>
			<Modal
				title='Thêm quyết định tốt nghiệp'
				visible={open}
				onCancel={() => {
					setOpen(false);
					form.resetFields();
				}}
				onOk={async () => {
					try {
						const v = await form.validateFields();
						createGraduationDecision({
							registryBookId: v.registryBookId,
							decisionNumber: v.decisionNumber,
							issueDate: v.issueDate.format('YYYY-MM-DD'),
							summary: v.summary,
						});
						message.success('Đã tạo');
						setOpen(false);
						form.resetFields();
						reload();
					} catch (e: any) {
						if (!e?.errorFields) message.error(e?.message || 'Có lỗi');
					}
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='registryBookId' label='Sổ văn bằng' rules={[{ required: true }]}>
						<Select options={books.map((b) => ({ label: `Năm ${b.year}`, value: b.id }))} />
					</Form.Item>
					<Form.Item name='decisionNumber' label='Số quyết định' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='issueDate' label='Ngày ban hành' rules={[{ required: true }]}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item name='summary' label='Trích yếu' rules={[{ required: true }]}>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

const PhuLucTab = () => {
	const [items, setItems] = useState<DiplomaFieldDefinition[]>(() => listFieldDefinitions());
	const [openAdd, setOpenAdd] = useState(false);
	const [editing, setEditing] = useState<DiplomaFieldDefinition | null>(null);
	const [formAdd] = Form.useForm<{ key: string; label: string; fieldType: DiplomaFieldType; sortOrder?: number }>();
	const [formEdit] = Form.useForm<{ label: string; fieldType: DiplomaFieldType; sortOrder: number; isActive: boolean }>();
	const reload = () => setItems(listFieldDefinitions());

	return (
		<div className='vanBang-tabPane'>
			<div className='vanBang-toolbar'>
				<div>
					<Typography.Title level={4} className='vanBang-sectionTitle'>
						Cấu hình phụ lục
					</Typography.Title>
					<p className='vanBang-hint'>Định nghĩa trường động (chuỗi / số / ngày) dùng cho văn bằng.</p>
				</div>
				<Button type='primary' onClick={() => setOpenAdd(true)}>
					Thêm trường
				</Button>
			</div>
			<Table<DiplomaFieldDefinition>
				rowKey='id'
				dataSource={items}
				pagination={false}
				bordered
				size='middle'
				columns={[
					{ title: 'STT', key: 'stt', width: 70, align: 'center', render: (_v, _r, i) => i + 1 },
					{ title: 'Mã', dataIndex: 'key', width: 150 },
					{ title: 'Tên', dataIndex: 'label' },
					{ title: 'Kiểu', dataIndex: 'fieldType', width: 110, align: 'center' },
					{ title: 'Thứ tự', dataIndex: 'sortOrder', width: 90, align: 'center' },
					{ title: 'Trạng thái', dataIndex: 'isActive', width: 100, align: 'center', render: (v: boolean) => (v ? 'Bật' : 'Tắt') },
					{
						title: 'Thao tác',
						width: 180,
						align: 'center',
						render: (_, r) => (
							<Space>
								<Button
									size='small'
									onClick={() => {
										setEditing(r);
										formEdit.setFieldsValue({
											label: r.label,
											fieldType: r.fieldType,
											sortOrder: r.sortOrder,
											isActive: r.isActive,
										});
									}}
								>
									Sửa
								</Button>
								<Popconfirm
									title='Xóa trường này?'
									okText='Xóa'
									cancelText='Hủy'
									onConfirm={() => {
										try {
											deleteFieldDefinition(r.id);
											message.success('Đã xóa');
											reload();
										} catch (e: any) {
											message.error(e?.message || 'Có lỗi');
										}
									}}
								>
									<Button size='small' danger>
										Xóa
									</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>
			<Modal
				title='Thêm trường phụ lục'
				visible={openAdd}
				onCancel={() => {
					setOpenAdd(false);
					formAdd.resetFields();
				}}
				onOk={async () => {
					try {
						const v = await formAdd.validateFields();
						createFieldDefinition(v);
						message.success('Đã thêm');
						setOpenAdd(false);
						formAdd.resetFields();
						reload();
					} catch (e: any) {
						if (!e?.errorFields) message.error(e?.message || 'Có lỗi');
					}
				}}
			>
				<Form form={formAdd} layout='vertical' initialValues={{ fieldType: 'STRING' }}>
					<Form.Item name='key' label='Mã trường' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='label' label='Tên hiển thị' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='fieldType' label='Kiểu dữ liệu' rules={[{ required: true }]}>
						<Select options={[{ label: 'String', value: 'STRING' }, { label: 'Number', value: 'NUMBER' }, { label: 'Date', value: 'DATE' }]} />
					</Form.Item>
					<Form.Item name='sortOrder' label='Thứ tự'>
						<InputNumber style={{ width: '100%' }} precision={0} min={0} />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title='Sửa trường phụ lục'
				visible={!!editing}
				onCancel={() => setEditing(null)}
				onOk={async () => {
					if (!editing) return;
					try {
						const v = await formEdit.validateFields();
						updateFieldDefinition(editing.id, v);
						message.success('Đã cập nhật');
						setEditing(null);
						reload();
					} catch (e: any) {
						if (!e?.errorFields) message.error(e?.message || 'Có lỗi');
					}
				}}
			>
				<Form form={formEdit} layout='vertical'>
					<Form.Item name='label' label='Tên hiển thị' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='fieldType' label='Kiểu dữ liệu' rules={[{ required: true }]}>
						<Select options={[{ label: 'String', value: 'STRING' }, { label: 'Number', value: 'NUMBER' }, { label: 'Date', value: 'DATE' }]} />
					</Form.Item>
					<Form.Item name='sortOrder' label='Thứ tự' rules={[{ required: true }]}>
						<InputNumber style={{ width: '100%' }} precision={0} min={0} />
					</Form.Item>
					<Form.Item name='isActive' label='Đang dùng' valuePropName='checked'>
						<Switch />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

const VanBangInfoTab = () => {
	const [items, setItems] = useState<Diploma[]>(() => listDiplomas());
	const [decisions] = useState<GraduationDecision[]>(() => listGraduationDecisions());
	const [fields] = useState<DiplomaFieldDefinition[]>(() => listFieldDefinitions().filter((f) => f.isActive));
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm();
	const decisionMap = useMemo(() => Object.fromEntries(decisions.map((d) => [d.id, d])), [decisions]);
	const reload = () => setItems(listDiplomas());

	const normalizeDynamicValues = (values: Record<string, any>): DynamicValues => {
		const output: DynamicValues = {};
		for (const f of fields) {
			const raw = values[`dyn_${f.key}`];
			if (raw === undefined || raw === null || raw === '') continue;
			if (f.fieldType === 'DATE' && moment.isMoment(raw)) output[f.key] = raw.format('YYYY-MM-DD');
			else if (f.fieldType === 'NUMBER') output[f.key] = Number(String(raw).replace(',', '.'));
			else output[f.key] = String(raw);
		}
		return output;
	};

	return (
		<div className='vanBang-tabPane'>
			<div className='vanBang-toolbar'>
				<div>
					<Typography.Title level={4} className='vanBang-sectionTitle'>
						Thông tin văn bằng
					</Typography.Title>
					<p className='vanBang-hint'>Số vào sổ được cấp tự động theo sổ — điền trường phụ lục theo cấu hình.</p>
				</div>
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm văn bằng
				</Button>
			</div>
			<Table<Diploma>
				rowKey='id'
				dataSource={items}
				pagination={false}
				bordered
				size='middle'
				scroll={{ x: 1200 }}
				columns={[
					{ title: 'STT', key: 'stt', width: 70, align: 'center', render: (_v, _r, i) => i + 1 },
					{ title: 'Số vào sổ', dataIndex: 'entryNumber', width: 100, align: 'center' },
					{ title: 'Số hiệu', dataIndex: 'diplomaSerialNumber', width: 150 },
					{ title: 'MSV', dataIndex: 'studentId', width: 120 },
					{ title: 'Họ tên', dataIndex: 'fullName', width: 170 },
					{ title: 'Ngày sinh', dataIndex: 'birthDate', width: 120, align: 'center', render: (v: string) => moment(v).format('DD/MM/YYYY') },
					{ title: 'Số QĐ', width: 180, render: (_, r) => decisionMap[r.graduationDecisionId]?.decisionNumber ?? '-' },
					{
						title: 'Thao tác',
						width: 90,
						align: 'center',
						render: (_, r) => (
							<Popconfirm
								title='Xóa văn bằng này?'
								okText='Xóa'
								cancelText='Hủy'
								onConfirm={() => {
									deleteDiploma(r.id);
									message.success('Đã xóa');
									reload();
								}}
							>
								<Button danger size='small'>
									Xóa
								</Button>
							</Popconfirm>
						),
					},
				]}
			/>
			<Modal
				title='Thêm văn bằng'
				visible={open}
				width={680}
				onCancel={() => {
					setOpen(false);
					form.resetFields();
				}}
				onOk={async () => {
					try {
						const v = await form.validateFields();
						createDiploma({
							graduationDecisionId: v.graduationDecisionId,
							diplomaSerialNumber: v.diplomaSerialNumber,
							studentId: v.studentId,
							fullName: v.fullName,
							birthDate: v.birthDate.format('YYYY-MM-DD'),
							dynamicValues: normalizeDynamicValues(v),
						});
						message.success('Đã thêm văn bằng');
						setOpen(false);
						form.resetFields();
						reload();
					} catch (e: any) {
						if (!e?.errorFields) message.error(e?.message || 'Có lỗi');
					}
				}}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item name='graduationDecisionId' label='Quyết định' rules={[{ required: true }]}>
								<Select
									options={decisions.map((d) => ({
										value: d.id,
										label: `${d.decisionNumber} - ${moment(d.issueDate).format('DD/MM/YYYY')}`,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='diplomaSerialNumber' label='Số hiệu văn bằng' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='studentId' label='Mã sinh viên' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='birthDate' label='Ngày sinh' rules={[{ required: true }]}>
								<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='fullName' label='Họ tên' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Typography.Title level={5}>Trường phụ lục</Typography.Title>
					<Row gutter={12}>
						{fields.map((f) => (
							<Col span={12} key={f.id}>
								<Form.Item name={`dyn_${f.key}`} label={f.label}>
									{f.fieldType === 'DATE' ? <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' /> : <Input />}
								</Form.Item>
							</Col>
						))}
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

const TraCuuTab = () => {
	const [form] = Form.useForm();
	const [items, setItems] = useState<Diploma[]>([]);
	const [error, setError] = useState('');
	const decisionMap = useMemo(() => Object.fromEntries(listGraduationDecisions().map((d) => [d.id, d])), []);

	return (
		<div className='vanBang-tabPane'>
			<div className='vanBang-toolbar'>
				<div>
					<Typography.Title level={4} className='vanBang-sectionTitle'>
						Tra cứu văn bằng
					</Typography.Title>
					<p className='vanBang-hint'>Nhập ít nhất hai tham số (số hiệu, số vào sổ, MSV, họ tên hoặc ngày sinh).</p>
				</div>
			</div>
			<Form form={form} layout='vertical'>
				<Row gutter={12}>
					<Col span={12}>
						<Form.Item name='diplomaSerialNumber' label='Số hiệu văn bằng'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='entryNumber' label='Số vào sổ'>
							<InputNumber style={{ width: '100%' }} precision={0} min={1} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='studentId' label='Mã sinh viên'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='fullName' label='Họ tên'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='birthDate' label='Ngày sinh'>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
				</Row>
				<Button
					type='primary'
					onClick={async () => {
						setError('');
						try {
							const v = await form.validateFields();
							const res = searchDiplomas({
								diplomaSerialNumber: v.diplomaSerialNumber,
								entryNumber: v.entryNumber,
								studentId: v.studentId,
								fullName: v.fullName,
								birthDate: v.birthDate ? v.birthDate.format('YYYY-MM-DD') : undefined,
							});
							if (!res.ok) {
								setItems([]);
								setError(res.reason);
								return;
							}
							setItems(res.items);
						} catch (e: any) {
							if (!e?.errorFields) setError(e?.message || 'Có lỗi');
						}
					}}
				>
					Tra cứu
				</Button>
			</Form>
			{error && (
				<Typography.Paragraph type='danger' style={{ marginTop: 12 }}>
					{error}
				</Typography.Paragraph>
			)}
			<div style={{ marginTop: 20 }}>
				{items.map((d) => (
					<Card key={d.id} style={{ marginBottom: 12 }} title={`${d.fullName} - ${d.diplomaSerialNumber}`}>
						<Descriptions bordered size='small' column={1}>
							<Descriptions.Item label='Số vào sổ'>{d.entryNumber}</Descriptions.Item>
							<Descriptions.Item label='MSV'>{d.studentId}</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>{moment(d.birthDate).format('DD/MM/YYYY')}</Descriptions.Item>
							<Descriptions.Item label='Số QĐ'>{decisionMap[d.graduationDecisionId]?.decisionNumber}</Descriptions.Item>
							<Descriptions.Item label='Ngày QĐ'>
								{decisionMap[d.graduationDecisionId]
									? moment(decisionMap[d.graduationDecisionId].issueDate).format('DD/MM/YYYY')
									: '-'}
							</Descriptions.Item>
							<Descriptions.Item label='Trích yếu'>{decisionMap[d.graduationDecisionId]?.summary || '-'}</Descriptions.Item>
							<Descriptions.Item label='Phụ lục'>
								<pre style={{ margin: 0 }}>{JSON.stringify(d.dynamicValues, null, 2)}</pre>
							</Descriptions.Item>
						</Descriptions>
					</Card>
				))}
			</div>
		</div>
	);
};

const VanBangPage = () => {
	return (
		<div className='vanBang'>
			<div className='vanBang-hero'>
				<Typography.Title level={3} className='vanBang-heroTitle'>
					Quản lý văn bằng
				</Typography.Title>
			</div>
			<Card className='vanBang-card' bordered={false}>
				<div className='vanBang-toolbar' style={{ justifyContent: 'flex-end' }}>
					<Popconfirm
						title='Reset dữ liệu về db.json?'
						okText='Reset'
						cancelText='Hủy'
						onConfirm={() => {
							resetFakeDb();
							window.location.reload();
						}}
					>
						<Button>Reset dữ liệu</Button>
					</Popconfirm>
				</div>
				<Tabs defaultActiveKey='1' destroyInactiveTabPane type='card'>
					<Tabs.TabPane
						tab={
							<span>
								<BookOutlined /> Sổ văn bằng
							</span>
						}
						key='1'
					>
						<SoVanBangTab />
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<FileDoneOutlined /> Quyết định TN
							</span>
						}
						key='2'
					>
						<QuyetDinhTab />
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<FormOutlined /> Biểu mẫu phụ lục
							</span>
						}
						key='3'
					>
						<PhuLucTab />
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<IdcardOutlined /> Thông tin văn bằng
							</span>
						}
						key='4'
					>
						<VanBangInfoTab />
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<SearchOutlined /> Tra cứu
							</span>
						}
						key='5'
					>
						<TraCuuTab />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default VanBangPage;
