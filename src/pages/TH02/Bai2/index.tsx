import { Card, Space, Tabs, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BlocksTab from './BlocksTab';
import SubjectsTab from './SubjectsTab';
import QuestionsTab from './QuestionsTab';
import TemplatesTab from './TemplatesTab';
import GenerateExamTab from './GenerateExamTab';

const Bai2: React.FC = () => {
	const { loadAll } = useModel('th02bai2');

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<div style={{ padding: 16 }}>
			<Card
				title='TH02 - Bài 2: Ngân hàng câu hỏi & Tạo đề thi'
				extra={
					<Space>
						<Button onClick={loadAll}>Tải lại dữ liệu</Button>
					</Space>
				}
			>
				<Tabs defaultActiveKey='blocks'>
					<Tabs.TabPane tab='Khối kiến thức' key='blocks'>
						<BlocksTab />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Môn học' key='subjects'>
						<SubjectsTab />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Câu hỏi' key='questions'>
						<QuestionsTab />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Cấu trúc đề' key='templates'>
						<TemplatesTab />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Tạo đề thi' key='generate'>
						<GenerateExamTab />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default Bai2;

