import { Modal, Tag, Typography } from 'antd';
import { useModel } from 'umi';

const DetailModal = () => {
	const { visibleDetail, setVisibleDetail, record } = useModel('fitness.exerciseLibrary');
	if (!record) return null;

	return (
		<Modal visible={visibleDetail} onCancel={() => setVisibleDetail(false)} footer={null} title={record.tenBaiTap}>
			<Typography.Paragraph>
				Nhóm cơ: <Tag>{record.nhomCo}</Tag> Mức độ: <Tag color={record.mucDo === 'Khó' ? 'red' : record.mucDo === 'Trung bình' ? 'gold' : 'green'}>{record.mucDo}</Tag>
			</Typography.Paragraph>
			<Typography.Paragraph>{record.moTaNgan}</Typography.Paragraph>
			<Typography.Title level={5}>Hướng dẫn thực hiện</Typography.Title>
			<Typography.Paragraph>{record.huongDanDayDu}</Typography.Paragraph>
			<Typography.Text strong>Calo trung bình/giờ: {record.caloMoiGio}</Typography.Text>
		</Modal>
	);
};

export default DetailModal;
