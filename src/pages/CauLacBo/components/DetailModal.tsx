import { TRANG_THAI_LABEL } from '@/services/CauLacBo/constants';
import { Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';

type Props = {
	open: boolean;
	banGhi?: CauLacBo.IApplication;
	onDong: () => void;
};

const mauTrangThai: Record<CauLacBo.TrangThaiDon, string> = {
	pending: 'gold',
	approved: 'green',
	rejected: 'red',
};

const DetailModal = ({ open, banGhi, onDong }: Props) => {
	if (!banGhi) return null;
	return (
		<Modal title='Chi tiết đơn đăng ký' visible={open} onCancel={onDong} onOk={onDong} width={720}>
			<Descriptions bordered column={1} size='small'>
				<Descriptions.Item label='Họ tên'>{banGhi.hoTen}</Descriptions.Item>
				<Descriptions.Item label='Email'>{banGhi.email}</Descriptions.Item>
				<Descriptions.Item label='SĐT'>{banGhi.sdt}</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{banGhi.gioiTinh}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ'>{banGhi.diaChi}</Descriptions.Item>
				<Descriptions.Item label='Sở trường'>{banGhi.soTruong}</Descriptions.Item>
				<Descriptions.Item label='Câu lạc bộ'>{banGhi.cauLacBo}</Descriptions.Item>
				<Descriptions.Item label='Lý do đăng ký'>{banGhi.lyDoDangKy}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Tag color={mauTrangThai[banGhi.trangThai]}>{TRANG_THAI_LABEL[banGhi.trangThai]}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Ghi chú'>{banGhi.ghiChu || '—'}</Descriptions.Item>
				<Descriptions.Item label='Cập nhật'>
					{moment(banGhi.updatedAt).format('HH:mm DD/MM/YYYY')}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default DetailModal;
