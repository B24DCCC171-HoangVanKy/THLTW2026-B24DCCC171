import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import ModBaoCaoThongKe from './modules/ModBaoCaoThongKe';
import ModDangKyThanhVien from './modules/ModDangKyThanhVien';
import ModQuanLyDanhMucCLB from './modules/ModQuanLyDanhMucCLB';
import ModThanhVienCLB from './modules/ModThanhVienCLB';

const CauLacBoPage = () => {
	return (
		<PageContainer title='Quản lý câu lạc bộ'>
			<Tabs defaultActiveKey='danh-muc-clb' type='card'>
				<Tabs.TabPane tab='Danh mục CLB' key='danh-muc-clb'>
					<ModQuanLyDanhMucCLB />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Đơn đăng ký thành viên' key='dang-ky'>
					<ModDangKyThanhVien />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thành viên CLB' key='thanh-vien'>
					<ModThanhVienCLB />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Báo cáo & thống kê' key='bao-cao'>
					<ModBaoCaoThongKe />
				</Tabs.TabPane>
			</Tabs>
		</PageContainer>
	);
};

export default CauLacBoPage;
