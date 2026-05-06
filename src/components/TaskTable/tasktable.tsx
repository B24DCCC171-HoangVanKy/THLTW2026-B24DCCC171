import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useMemo, useState } from 'react';
import { type TaskItem, type TrangThaiTask } from '@/services/TaskLocal/tasklocalservice';

interface TaskTableProps {
	danhSachTask: TaskItem[];
	onSua: (task: TaskItem) => void;
	onXoa: (taskId: string) => void;
	trangThaiLocMacDinh?: TrangThaiTask | 'tatCa';
}

type KieuSapXep = 'macDinh' | 'deadlineTang' | 'deadlineGiam';

const TaskTable: React.FC<TaskTableProps> = ({
	danhSachTask,
	onSua,
	onXoa,
	trangThaiLocMacDinh = 'tatCa',
}) => {
	const [tuKhoaTim, setTuKhoaTim] = useState<string>('');
	const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiTask | 'tatCa'>(trangThaiLocMacDinh);
	const [kieuSapXep, setKieuSapXep] = useState<KieuSapXep>('macDinh');

	useEffect(() => {
		setTrangThaiLoc(trangThaiLocMacDinh);
	}, [trangThaiLocMacDinh]);

	const duLieuTable = useMemo(() => {
		let ketQua = [...danhSachTask];
		if (tuKhoaTim.trim()) {
			const tuKhoa = tuKhoaTim.trim().toLowerCase();
			ketQua = ketQua.filter((task) => task.tenTask.toLowerCase().includes(tuKhoa));
		}
		if (trangThaiLoc !== 'tatCa') {
			ketQua = ketQua.filter((task) => task.trangThai === trangThaiLoc);
		}
		if (kieuSapXep === 'deadlineTang') {
			ketQua.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
		}
		if (kieuSapXep === 'deadlineGiam') {
			ketQua.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
		}
		return ketQua;
	}, [danhSachTask, tuKhoaTim, trangThaiLoc, kieuSapXep]);

	const columns: ColumnsType<TaskItem> = [
		{
			title: 'Tên task',
			dataIndex: 'tenTask',
			key: 'tenTask',
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			render: (deadline: string) => new Date(deadline).toLocaleString(),
		},
		{
			title: 'Độ ưu tiên',
			dataIndex: 'doUuTien',
			key: 'doUuTien',
			render: (doUuTien: string) => <Tag>{doUuTien}</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (trangThai: string) => <Tag color='blue'>{trangThai}</Tag>,
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (
				<Space wrap>
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 140,
			render: (_, task) => (
				<Space>
					<Button icon={<EditOutlined />} size='small' onClick={() => onSua(task)} />
					<Popconfirm
						title='Xóa task này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => onXoa(task.id)}
					>
						<Button danger icon={<DeleteOutlined />} size='small' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space wrap style={{ marginBottom: 16 }}>
				<Input
					allowClear
					placeholder='Tìm theo tên task'
					value={tuKhoaTim}
					onChange={(event) => setTuKhoaTim(event.target.value)}
					style={{ width: 240 }}
				/>
				<Select
					value={trangThaiLoc}
					onChange={setTrangThaiLoc}
					style={{ width: 180 }}
					options={[
						{ label: 'Tất cả trạng thái', value: 'tatCa' },
						{ label: 'Cần làm', value: 'Cần làm' },
						{ label: 'Đang làm', value: 'Đang làm' },
						{ label: 'Hoàn thành', value: 'Hoàn thành' },
					]}
				/>
				<Select
					value={kieuSapXep}
					onChange={setKieuSapXep}
					style={{ width: 180 }}
					options={[
						{ label: 'Không sắp xếp', value: 'macDinh' },
						{ label: 'Deadline tăng dần', value: 'deadlineTang' },
						{ label: 'Deadline giảm dần', value: 'deadlineGiam' },
					]}
				/>
			</Space>
			<Table rowKey='id' columns={columns} dataSource={duLieuTable} pagination={{ pageSize: 6 }} />
		</div>
	);
};

export default TaskTable;
