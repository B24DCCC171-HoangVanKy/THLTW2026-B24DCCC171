import { Card, Button, Divider, Space, Typography, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

type Choice = 'keo' | 'bua' | 'bao';
type Result = 'win' | 'lose' | 'draw';

interface Round {
	key: number;
	playerChoice: Choice;
	computerChoice: Choice;
	result: Result;
}

const choiceLabel: Record<Choice, string> = {
	keo: 'Kéo',
	bua: 'Búa',
	bao: 'Bao',
};

const resultLabel: Record<Result, string> = {
	win: 'Thắng',
	lose: 'Thua',
	draw: 'Hòa',
};

const resultColor: Record<Result, string> = {
	win: 'green',
	lose: 'red',
	draw: 'blue',
};

const getComputerChoice = (): Choice => {
	const choices: Choice[] = ['keo', 'bua', 'bao'];
	const index = Math.floor(Math.random() * choices.length);
	return choices[index];
};

const getResult = (player: Choice, computer: Choice): Result => {
	if (player === computer) {
		return 'draw';
	}

	if (
		(player === 'keo' && computer === 'bao') ||
		(player === 'bua' && computer === 'keo') ||
		(player === 'bao' && computer === 'bua')
	) {
		return 'win';
	}

	return 'lose';
};

const OanTuTiPage: React.FC = () => {
	const [history, setHistory] = useState<Round[]>([]);

	const handlePlay = (playerChoice: Choice) => {
		const computerChoice = getComputerChoice();
		const result = getResult(playerChoice, computerChoice);

		setHistory((prev) => [
			{
				key: prev.length + 1,
				playerChoice,
				computerChoice,
				result,
			},
			...prev,
		]);
	};

	const latestRound = history[0];

	const summary = useMemo(() => {
		const init = { win: 0, lose: 0, draw: 0 };
		return history.reduce(
			(acc, item) => {
				acc[item.result] += 1;
				return acc;
			},
			{ ...init },
		);
	}, [history]);

	const columns: ColumnsType<Round> = [
		{
			title: 'Ván',
			dataIndex: 'key',
			align: 'center',
			width: 80,
		},
		{
			title: 'Người chơi',
			dataIndex: 'playerChoice',
			render: (value: Choice) => choiceLabel[value],
			align: 'center',
		},
		{
			title: 'Máy tính',
			dataIndex: 'computerChoice',
			render: (value: Choice) => choiceLabel[value],
			align: 'center',
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			align: 'center',
			render: (value: Result) => (
				<Tag color={resultColor[value]}>{resultLabel[value]}</Tag>
			),
		},
	];

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				padding: 16,
				paddingTop: 64,
			}}
		>
			<div style={{ maxWidth: 800, width: '100%' }}>
				<Card title='Bài 1: Trò chơi Oẳn Tù Tì'>
					<Space direction='vertical' style={{ width: '100%' }} size='middle'>
						<div style={{ textAlign: 'center' }}>
							<Typography.Title level={4} style={{ marginBottom: 8 }}>
								Chọn Kéo, Búa hoặc Bao
							</Typography.Title>
							<Space size='small'>
								<Button type='primary' onClick={() => handlePlay('keo')}>
									Kéo
								</Button>
								<Button type='primary' onClick={() => handlePlay('bua')}>
									Búa
								</Button>
								<Button type='primary' onClick={() => handlePlay('bao')}>
									Bao
								</Button>
							</Space>
						</div>

						<Divider style={{ margin: '8px 0' }} />

						<div>
							<Typography.Title level={5} style={{ marginBottom: 8 }}>
								Kết quả ván gần nhất
							</Typography.Title>
							{latestRound ? (
								<Space direction='vertical' size='small'>
									<Typography.Text>
										<strong>Người chơi:</strong>{' '}
										{choiceLabel[latestRound.playerChoice]}
									</Typography.Text>
									<Typography.Text>
										<strong>Máy tính:</strong>{' '}
										{choiceLabel[latestRound.computerChoice]}
									</Typography.Text>
									<Typography.Text>
										<strong>Kết quả:</strong>{' '}
										<Tag color={resultColor[latestRound.result]}>
											{resultLabel[latestRound.result]}
										</Tag>
									</Typography.Text>
								</Space>
							) : (
								<Typography.Text>
									Chưa có ván chơi nào. Hãy chọn Kéo, Búa hoặc Bao để bắt đầu.
								</Typography.Text>
							)}
						</div>

						<Divider style={{ margin: '8px 0' }} />

						<div>
							<Typography.Title level={5} style={{ marginBottom: 8 }}>
								Thống kê tổng
							</Typography.Title>
							<Space size='middle' wrap>
								<Typography.Text>
									<strong>Thắng:</strong> {summary.win}
								</Typography.Text>
								<Typography.Text>
									<strong>Thua:</strong> {summary.lose}
								</Typography.Text>
								<Typography.Text>
									<strong>Hòa:</strong> {summary.draw}
								</Typography.Text>
							</Space>
						</div>

						<Divider style={{ margin: '8px 0' }} />

						<div>
							<Typography.Title level={5} style={{ marginBottom: 8 }}>
								Lịch sử các ván đấu
							</Typography.Title>
							<Table
								dataSource={history}
								columns={columns}
								pagination={{ pageSize: 5 }}
							/>
						</div>
					</Space>
				</Card>
			</div>
		</div>
	);
};

export default OanTuTiPage;

