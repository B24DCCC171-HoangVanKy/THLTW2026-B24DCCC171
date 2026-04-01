import DetailModal from '@/pages/CauLacBo/components/DetailModal';
import HistoryDrawer from '@/pages/CauLacBo/components/HistoryDrawer';
import RegistrationFormModal, { type LuuDonPayload } from '@/pages/CauLacBo/components/RegistrationFormModal';
import { TRANG_THAI_LABEL } from '@/services/CauLacBo/constants';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HistoryOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const { TextArea } = Input;

const mauTrangThai: Record<CauLacBo.TrangThaiDon, string> = {
	pending: 'gold',
	approved: 'green',
	rejected: 'red',
};

const ModDangKyThanhVien = () => {
	const {
		applications,
		history,
		danhMucClb,
		themDon,
		capNhatDon,
		xoaDon,
		doiTrangThai,
	} = useModel('cauLacBo');

	const [chonTheoHang, setChonTheoHang] = useState<React.Key[]>([]);
	const [moForm, setMoForm] = useState(false);
	const [moChiTiet, setMoChiTiet] = useState(false);
	const [moLichSu, setMoLichSu] = useState(false);
	const [banGhiForm, setBanGhiForm] = useState<CauLacBo.IApplication | undefined>();

	const [xacNhanLoai, setXacNhanLoai] = useState<'approved' | 'rejected' | null>(null);
	const [idsDangXuLy, setIdsDangXuLy] = useState<string[]>([]);
	const [lyDoTuChoi, setLyDoTuChoi] = useState('');

	const cot: ColumnsType<CauLacBo.IApplication> = [
			{ title: 'Họ tên', dataIndex: 'hoTen', width: 140, ellipsis: true },
			{ title: 'Email', dataIndex: 'email', width: 160, ellipsis: true },
			{ title: 'SĐT', dataIndex: 'sdt', width: 110 },
			{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 90 },
			{ title: 'Địa chỉ', dataIndex: 'diaChi', width: 120, ellipsis: true },
			{ title: 'Sở trường', dataIndex: 'soTruong', width: 120, ellipsis: true },
			{ title: 'CLB', dataIndex: 'cauLacBo', width: 130, ellipsis: true },
			{ title: 'Lý do ĐK', dataIndex: 'lyDoDangKy', width: 160, ellipsis: true },
			{
				title: 'Trạng thái',
				dataIndex: 'trangThai',
				width: 110,
				render: (s: CauLacBo.TrangThaiDon) => (
					<Tag color={mauTrangThai[s]} icon={s === 'pending' ? <ClockCircleOutlined /> : undefined}>
						{TRANG_THAI_LABEL[s]}
					</Tag>
				),
			},
			{ title: 'Ghi chú', dataIndex: 'ghiChu', width: 140, ellipsis: true },
			{
				title: 'Cập nhật',
				dataIndex: 'updatedAt',
				width: 120,
				render: (t: string) => moment(t).format('DD/MM/YYYY HH:mm'),
			},
			{
				title: 'Thao tác',
				key: 'action',
				fixed: 'right',
				width: 200,
				render: (_, r) => (
					<Space size={0} wrap>
						<Button type='link' size='small' icon={<EyeOutlined />} onClick={() => moChiTietBanGhi(r)}>
							Xem
						</Button>
						<Button type='link' size='small' icon={<EditOutlined />} onClick={() => moSuaBanGhi(r)}>
							Sửa
						</Button>
						<Popconfirm title='Xóa đơn này?' onConfirm={() => xoaDon(r.id)}>
							<Button type='link' size='small' danger icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
						{r.trangThai === 'pending' && (
							<>
								<Button
									type='link'
									size='small'
									style={{ color: '#52c41a' }}
									icon={<CheckCircleOutlined />}
									onClick={() => moXacNhanDuyet([r.id], 'approved')}
								>
									Duyệt
								</Button>
								<Button
									type='link'
									size='small'
									danger
									icon={<CloseCircleOutlined />}
									onClick={() => moXacNhanDuyet([r.id], 'rejected')}
								>
									Từ chối
								</Button>
							</>
						)}
					</Space>
				),
			},
		];

	const moChiTietBanGhi = (r: CauLacBo.IApplication) => {
		setBanGhiForm(r);
		setMoChiTiet(true);
	};

	const moSuaBanGhi = (r: CauLacBo.IApplication) => {
		setMoChiTiet(false);
		setBanGhiForm(r);
		setMoForm(true);
	};

	const moThemMoi = () => {
		setBanGhiForm(undefined);
		setMoForm(true);
	};

	const moXacNhanDuyet = (ids: string[], loai: 'approved' | 'rejected') => {
		setIdsDangXuLy(ids);
		setXacNhanLoai(loai);
		setLyDoTuChoi('');
	};

	const dongXacNhan = () => {
		setXacNhanLoai(null);
		setIdsDangXuLy([]);
		setLyDoTuChoi('');
	};

	const xacNhanThucHien = () => {
		const idsChoDuyet = idsDangXuLy.filter(
			(id) => applications.find((x) => x.id === id)?.trangThai === 'pending',
		);
		if (idsChoDuyet.length === 0) {
			dongXacNhan();
			setChonTheoHang([]);
			return;
		}
		if (xacNhanLoai === 'rejected') {
			doiTrangThai(idsChoDuyet, 'rejected', lyDoTuChoi);
		} else if (xacNhanLoai === 'approved') {
			doiTrangThai(idsChoDuyet, 'approved');
		}
		dongXacNhan();
		setChonTheoHang([]);
	};

	const luuForm = (values: LuuDonPayload) => {
		if (banGhiForm) {
			capNhatDon(banGhiForm.id, values);
		} else {
			themDon(values);
		}
	};

	const soLuongChon = chonTheoHang.length;

	return (
		<div>
			<Space style={{ marginBottom: 16 }} wrap align='center'>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					disabled={danhMucClb.length === 0}
					onClick={moThemMoi}
				>
					Thêm đơn đăng ký
				</Button>
				{danhMucClb.length === 0 && (
					<Typography.Text type='warning'>
						Cần có ít nhất một câu lạc bộ trong tab &quot;Danh mục CLB&quot; mới tạo đơn được.
					</Typography.Text>
				)}
				<Button icon={<HistoryOutlined />} onClick={() => setMoLichSu(true)}>
					Xem lịch sử
				</Button>
				{soLuongChon > 0 && (
					<>
						<Button
							type='primary'
							icon={<CheckCircleOutlined />}
							onClick={() => moXacNhanDuyet(chonTheoHang as string[], 'approved')}
						>
							Duyệt {soLuongChon} đơn đã chọn
						</Button>
						<Button
							danger
							icon={<CloseCircleOutlined />}
							onClick={() => moXacNhanDuyet(chonTheoHang as string[], 'rejected')}
						>
							Từ chối {soLuongChon} đơn đã chọn
						</Button>
					</>
				)}
			</Space>

			<Typography.Paragraph type='secondary' style={{ marginBottom: 12 }}>
				Chọn các dòng bằng checkbox để duyệt hoặc từ chối hàng loạt. Đơn đã duyệt/từ chối vẫn hiển thị để tra cứu;
				chỉ đơn &quot;Chờ duyệt&quot; mới có nút duyệt từng dòng.
			</Typography.Paragraph>

			<Table
				size='small'
				rowKey='id'
				scroll={{ x: 1700 }}
				dataSource={applications}
				columns={cot}
				rowSelection={{
					selectedRowKeys: chonTheoHang,
					onChange: (keys) => setChonTheoHang(keys),
				}}
			/>

			<RegistrationFormModal
				open={moForm}
				danhSachClb={danhMucClb}
				banGhi={banGhiForm}
				tieuDe={banGhiForm ? 'Sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
				onDong={() => setMoForm(false)}
				onLuu={luuForm}
			/>

			<DetailModal open={moChiTiet} banGhi={banGhiForm} onDong={() => setMoChiTiet(false)} />

			<HistoryDrawer open={moLichSu} lichSu={history} onDong={() => setMoLichSu(false)} />

			<Modal
				title={
					xacNhanLoai === 'approved'
						? `Xác nhận duyệt ${idsDangXuLy.length} đơn?`
						: `Xác nhận từ chối ${idsDangXuLy.length} đơn?`
				}
				visible={xacNhanLoai !== null}
				onOk={xacNhanThucHien}
				onCancel={dongXacNhan}
				okText='Xác nhận'
				cancelText='Hủy'
				okButtonProps={{
					disabled: xacNhanLoai === 'rejected' && !lyDoTuChoi.trim(),
				}}
			>
				{xacNhanLoai === 'rejected' && (
					<>
						<Typography.Paragraph>Lý do từ chối (ghi vào cột ghi chú):</Typography.Paragraph>
						<TextArea
							rows={4}
							value={lyDoTuChoi}
							onChange={(e) => setLyDoTuChoi(e.target.value)}
							placeholder='Ví dụ: Đã đủ số lượng thành viên...'
						/>
					</>
				)}
				{xacNhanLoai === 'approved' && <p>Các đơn được chọn sẽ chuyển sang trạng thái đã duyệt.</p>}
			</Modal>
		</div>
	);
};

export default ModDangKyThanhVien;
