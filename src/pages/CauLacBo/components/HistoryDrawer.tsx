import { Drawer, List, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

type Props = {
	open: boolean;
	lichSu: CauLacBo.IHistoryEntry[];
	onDong: () => void;
};

const HistoryDrawer = ({ open, lichSu, onDong }: Props) => (
	<Drawer title='Lịch sử thao tác' placement='right' width={420} onClose={onDong} visible={open}>
		<List
			dataSource={lichSu}
			locale={{ emptyText: 'Chưa có lịch sử' }}
			renderItem={(item) => (
				<List.Item>
					<List.Item.Meta
						title={<Text>{item.message}</Text>}
						description={moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
					/>
				</List.Item>
			)}
		/>
	</Drawer>
);

export default HistoryDrawer;
