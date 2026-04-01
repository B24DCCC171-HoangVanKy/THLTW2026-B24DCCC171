import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

type HangCLB = { ten: string };

const ModQuanLyDanhMucCLB = () => {
	const { applications, danhMucClb, themCauLacBo, capNhatTenCauLacBo, xoaCauLacBo } = useModel('cauLacBo');
	const [moThem, setMoThem] = useState(false);
	const [moSua, setMoSua] = useState(false);
	const [tenDangSua, setTenDangSua] = useState('');
	const [formThem] = Form.useForm();
	const [formSua] = Form.useForm();

	const duLieuBang = useMemo<HangCLB[]>(() => danhMucClb.map((ten) => ({ ten })), [danhMucClb]);

	const demDonTheoClb = (ten: string) => applications.filter((a) => a.cauLacBo === ten).length;

	const cot: ColumnsType<HangCLB> = [
		{
			title: 'STT',
			width: 70,
			render: (_t, _r, i) => i + 1,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'ten',
			ellipsis: true,
		},
		{
			title: 'Số đơn đang gắn',
			key: 'count',
			width: 140,
			render: (_t, r) => demDonTheoClb(r.ten),
		},
		{
			title: 'Thao tác',
			key: 'act',
			width: 200,
			render: (_t, r) => (
				<Space>
					<Button
						type='link'
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setTenDangSua(r.ten);
							formSua.setFieldsValue({ tenMoi: r.ten });
							setMoSua(true);
						}}
					>
						Sửa tên
					</Button>
					<Popconfirm
						title='Xóa CLB này khỏi danh mục?'
						description='Chỉ xóa được khi không còn đơn đăng ký nào chọn CLB này.'
						onConfirm={() => {
							if (xoaCauLacBo(r.ten)) {
								message.success('Đã xóa');
							} else {
								message.error('Không xóa được: vẫn còn đơn đang dùng tên CLB này.');
							}
						}}
					>
						<Button type='link' size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setMoThem(true)}>
					Thêm câu lạc bộ
				</Button>
			</Space>

			<Table
				size='small'
				rowKey={(r) => r.ten}
				pagination={false}
				dataSource={duLieuBang}
				columns={cot}
			/>

			<Modal
				title='Thêm câu lạc bộ'
				visible={moThem}
				onCancel={() => setMoThem(false)}
				footer={null}
				destroyOnClose
			>
				<Form
					form={formThem}
					layout='vertical'
					onFinish={(v) => {
						if (themCauLacBo(v.ten)) {
							message.success('Đã thêm');
							setMoThem(false);
							formThem.resetFields();
						} else {
							message.error('Tên trùng hoặc để trống.');
						}
					}}
				>
					<Form.Item name='ten' label='Tên CLB' rules={[{ required: true, message: 'Nhập tên' }]}>
						<Input placeholder='VD: CLB Cờ vua' />
					</Form.Item>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</Form>
			</Modal>

			<Modal
				title='Đổi tên câu lạc bộ'
				visible={moSua}
				onCancel={() => setMoSua(false)}
				footer={null}
				destroyOnClose
			>
				<Typography.Paragraph type='secondary'>Đang sửa: {tenDangSua}</Typography.Paragraph>
				<Form
					form={formSua}
					layout='vertical'
					onFinish={(v) => {
						if (capNhatTenCauLacBo(tenDangSua, v.tenMoi)) {
							message.success('Đã cập nhật tên — mọi đơn gắn CLB cũ đã được đổi theo.');
							setMoSua(false);
						} else {
							message.error('Tên mới trống, trùng tên khác, hoặc không tìm thấy CLB cũ.');
						}
					}}
				>
					<Form.Item name='tenMoi' label='Tên mới' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</Form>
			</Modal>
		</div>
	);
};

export default ModQuanLyDanhMucCLB;
