import { TRANG_THAI_LABEL } from '@/services/CauLacBo/constants';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

const ModThanhVienCLB = () => {
	const { applications, danhMucClb, chuyenCauLacBo } = useModel('cauLacBo');
	const [clbLoc, setClbLoc] = useState<string | undefined>(undefined);
	const [chonHang, setChonHang] = useState<React.Key[]>([]);
	const [moChuyen, setMoChuyen] = useState(false);
	const [clbMoi, setClbMoi] = useState<string>('');

	const thanhVien = useMemo(
		() => applications.filter((a) => a.trangThai === 'approved'),
		[applications],
	);

	const duLieuBang = useMemo(() => {
		if (!clbLoc) return thanhVien;
		return thanhVien.filter((a) => a.cauLacBo === clbLoc);
	}, [thanhVien, clbLoc]);

	const cot: ColumnsType<CauLacBo.IApplication> = [
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 140 },
		{ title: 'Email', dataIndex: 'email', width: 170 },
		{ title: 'SĐT', dataIndex: 'sdt', width: 110 },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 90 },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', ellipsis: true },
		{ title: 'Sở trường', dataIndex: 'soTruong', ellipsis: true },
		{
			title: 'CLB hiện tại',
			dataIndex: 'cauLacBo',
			width: 150,
			render: (t: string) => <Tag color='blue'>{t}</Tag>,
		},
		{ title: 'Lý do ĐK', dataIndex: 'lyDoDangKy', ellipsis: true, width: 160 },
		{
			title: 'Trạng thái',
			render: () => <Tag color='green'>{TRANG_THAI_LABEL.approved}</Tag>,
		},
		{
			title: 'Cập nhật',
			dataIndex: 'updatedAt',
			width: 130,
			render: (t: string) => moment(t).format('DD/MM/YYYY HH:mm'),
		},
	];

	const thucHienChuyen = () => {
		const ids = chonHang as string[];
		chuyenCauLacBo(ids, clbMoi);
		setMoChuyen(false);
		setChonHang([]);
	};

	return (
		<div>
			<Card size='small' style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 8 }}>
				<Space wrap align='center'>
					<Typography.Text strong>Lọc theo câu lạc bộ:</Typography.Text>
					<Select
						allowClear
						placeholder='Tất cả CLB'
						style={{ minWidth: 220 }}
						value={clbLoc}
						onChange={(v) => setClbLoc(v)}
						options={danhMucClb.map((c) => ({ value: c, label: c }))}
					/>
					{chonHang.length > 0 && (
						<Button
							type='primary'
							icon={<SwapOutlined />}
							disabled={danhMucClb.length === 0}
							onClick={() => {
								setClbMoi(danhMucClb[0] || '');
								setMoChuyen(true);
							}}
						>
							Chuyển {chonHang.length} thành viên sang CLB khác
						</Button>
					)}
				</Space>
			</Card>

			<Table
				size='small'
				rowKey='id'
				scroll={{ x: 1400 }}
				dataSource={duLieuBang}
				columns={cot}
				rowSelection={{
					selectedRowKeys: chonHang,
					onChange: (keys) => setChonHang(keys),
				}}
			/>

			<Modal
				title='Chuyển câu lạc bộ'
				visible={moChuyen}
				onOk={thucHienChuyen}
				onCancel={() => setMoChuyen(false)}
				okText='Xác nhận'
				cancelText='Hủy'
			>
				<Typography.Paragraph>
					Bạn đang chuyển <strong>{chonHang.length}</strong> thành viên sang câu lạc bộ mới.
				</Typography.Paragraph>
				<Form layout='vertical'>
					<Form.Item label='CLB đích'>
						<Select
							style={{ width: '100%' }}
							value={clbMoi}
							onChange={(v) => setClbMoi(v)}
							options={danhMucClb.map((c) => ({ value: c, label: c }))}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ModThanhVienCLB;
