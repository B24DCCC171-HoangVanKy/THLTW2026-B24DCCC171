import { DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { type FormTaskData } from '@/models/congviec';
import { type TaskItem } from '@/services/TaskLocal/tasklocalservice';

const { TextArea } = Input;

interface TaskFormProps {
	visible: boolean;
	taskDangSua?: TaskItem;
	onDong: () => void;
	onLuu: (duLieu: FormTaskData) => void;
}

interface FormValue {
	tenTask: string;
	moTa?: string;
	deadline: moment.Moment;
	doUuTien: 'Cao' | 'Trung bình' | 'Thấp';
	trangThai: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
	tags?: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, taskDangSua, onDong, onLuu }) => {
	const [form] = Form.useForm<FormValue>();

	useEffect(() => {
		if (!visible) return;
		form.setFieldsValue({
			tenTask: taskDangSua?.tenTask || '',
			moTa: taskDangSua?.moTa || '',
			deadline: taskDangSua?.deadline ? moment(taskDangSua.deadline) : undefined,
			doUuTien: taskDangSua?.doUuTien || 'Trung bình',
			trangThai: taskDangSua?.trangThai || 'Cần làm',
			tags: taskDangSua?.tags || [],
		});
	}, [visible, taskDangSua, form]);

	return (
		<Modal
			destroyOnClose
			visible={visible}
			onCancel={onDong}
			okText={taskDangSua ? 'Lưu cập nhật' : 'Thêm task'}
			cancelText='Hủy'
			title={taskDangSua ? 'Chỉnh sửa task' : 'Thêm task mới'}
			onOk={() => {
				form.submit();
			}}
		>
			<Form<FormValue>
				layout='vertical'
				form={form}
				onFinish={(values) => {
					onLuu({
						tenTask: values.tenTask,
						moTa: values.moTa,
						deadline: values.deadline.toISOString(),
						doUuTien: values.doUuTien,
						trangThai: values.trangThai,
						tags: values.tags || [],
					});
					form.resetFields();
				}}
			>
				<Form.Item
					label='Tên task'
					name='tenTask'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên task' },
						{ min: 3, message: 'Tên task tối thiểu 3 ký tự' },
					]}
				>
					<Input placeholder='Nhập tên task' />
				</Form.Item>

				<Form.Item label='Mô tả' name='moTa'>
					<TextArea placeholder='Mô tả ngắn gọn task' rows={3} />
				</Form.Item>

				<Form.Item
					label='Deadline'
					name='deadline'
					rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
				>
					<DatePicker
						showTime
						format='DD/MM/YYYY HH:mm'
						style={{ width: '100%' }}
						placeholder='Chọn ngày giờ deadline'
					/>
				</Form.Item>

				<Form.Item label='Độ ưu tiên' name='doUuTien' rules={[{ required: true }]}>
					<Select
						options={[
							{ label: 'Cao', value: 'Cao' },
							{ label: 'Trung bình', value: 'Trung bình' },
							{ label: 'Thấp', value: 'Thấp' },
						]}
					/>
				</Form.Item>

				<Form.Item label='Trạng thái' name='trangThai' rules={[{ required: true }]}>
					<Select
						options={[
							{ label: 'Cần làm', value: 'Cần làm' },
							{ label: 'Đang làm', value: 'Đang làm' },
							{ label: 'Hoàn thành', value: 'Hoàn thành' },
						]}
					/>
				</Form.Item>

				<Form.Item label='Tags' name='tags'>
					<Select
						mode='tags'
						tokenSeparators={[',']}
						placeholder='Nhập tag, nhấn Enter để tạo'
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskForm;
