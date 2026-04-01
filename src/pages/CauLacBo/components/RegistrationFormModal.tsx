import { GIOI_TINH_OPTIONS } from '@/services/CauLacBo/constants';
import { Button, Form, Input, Modal, Select } from 'antd';

const { TextArea } = Input;

export type LuuDonPayload = Pick<
	CauLacBo.IApplication,
	'hoTen' | 'email' | 'sdt' | 'gioiTinh' | 'diaChi' | 'soTruong' | 'cauLacBo' | 'lyDoDangKy' | 'ghiChu'
>;

type Props = {
	open: boolean;
	danhSachClb: string[];
	banGhi?: CauLacBo.IApplication;
	tieuDe: string;
	onDong: () => void;
	onLuu: (values: LuuDonPayload) => void;
};

const RegistrationFormModal = ({ open, danhSachClb, banGhi, tieuDe, onDong, onLuu }: Props) => {
	const clbMacDinh = danhSachClb[0];
	return (
		<Modal destroyOnClose title={tieuDe} visible={open} onCancel={onDong} footer={null} width={640}>
			<Form
				layout='vertical'
				key={banGhi?.id || 'new'}
				initialValues={
					banGhi
						? {
								hoTen: banGhi.hoTen,
								email: banGhi.email,
								sdt: banGhi.sdt,
								gioiTinh: banGhi.gioiTinh,
								diaChi: banGhi.diaChi,
								soTruong: banGhi.soTruong,
								cauLacBo: banGhi.cauLacBo,
								lyDoDangKy: banGhi.lyDoDangKy,
								ghiChu: banGhi.ghiChu,
						  }
						: { gioiTinh: 'Nam', ...(clbMacDinh ? { cauLacBo: clbMacDinh } : {}) }
				}
				onFinish={(values) => {
					onLuu(values as LuuDonPayload);
					onDong();
				}}
			>
				<Form.Item name='hoTen' label='Họ tên' rules={[{ required: true, message: 'Nhập họ tên' }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='email'
					label='Email'
					rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item name='sdt' label='SĐT' rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='gioiTinh' label='Giới tính' rules={[{ required: true }]}>
					<Select options={GIOI_TINH_OPTIONS} />
				</Form.Item>
				<Form.Item name='diaChi' label='Địa chỉ' rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='soTruong' label='Sở trường' rules={[{ required: true }]}>
					<Input placeholder='VD: Lập trình, thể thao...' />
				</Form.Item>
				<Form.Item name='cauLacBo' label='Câu lạc bộ' rules={[{ required: true }]}>
					<Select
						placeholder={danhSachClb.length ? undefined : 'Hãy thêm CLB trong Danh mục CLB'}
						disabled={danhSachClb.length === 0}
						options={danhSachClb.map((c) => ({ value: c, label: c }))}
					/>
				</Form.Item>
				<Form.Item name='lyDoDangKy' label='Lý do đăng ký' rules={[{ required: true }]}>
					<TextArea rows={3} />
				</Form.Item>
				<Form.Item name='ghiChu' label='Ghi chú (tùy chọn)'>
					<TextArea rows={2} />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					<Button type='primary' htmlType='submit' style={{ marginRight: 8 }}>
						Lưu
					</Button>
					<Button onClick={onDong}>Hủy</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default RegistrationFormModal;
