import { Card, Col, Row, Tag, Typography } from 'antd';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';
import { type TaskItem, type TrangThaiTask } from '@/services/TaskLocal/tasklocalservice';

const { Text, Title } = Typography;

interface KanbanBoardProps {
	danhSachTask: TaskItem[];
	onDoiTrangThai: (taskId: string, trangThaiMoi: TrangThaiTask) => void;
}

const cotKanban: { id: string; tieuDe: TrangThaiTask }[] = [
	{ id: 'can-lam', tieuDe: 'Cần làm' },
	{ id: 'dang-lam', tieuDe: 'Đang làm' },
	{ id: 'hoan-thanh', tieuDe: 'Hoàn thành' },
];

const mapCotSangTrangThai: Record<string, TrangThaiTask> = {
	'can-lam': 'Cần làm',
	'dang-lam': 'Đang làm',
	'hoan-thanh': 'Hoàn thành',
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ danhSachTask, onDoiTrangThai }) => {
	const onDragEnd = (result: DropResult): void => {
		if (!result.destination) return;
		const cotDich = result.destination.droppableId;
		const trangThaiMoi = mapCotSangTrangThai[cotDich];
		if (!trangThaiMoi) return;
		onDoiTrangThai(result.draggableId, trangThaiMoi);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={16} align='top'>
				{cotKanban.map((cot) => {
					const taskTheoCot = danhSachTask.filter((task) => task.trangThai === cot.tieuDe);
					return (
						<Col span={8} key={cot.id}>
							<Card title={cot.tieuDe} bordered>
								<Droppable droppableId={cot.id}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											style={{
												minHeight: 420,
												padding: 8,
												background: snapshot.isDraggingOver ? '#f5f5f5' : 'transparent',
											}}
										>
											{taskTheoCot.map((task, index) => (
												<Draggable draggableId={task.id} index={index} key={task.id}>
													{(draggableProvided, draggableSnapshot) => (
														<div
															ref={draggableProvided.innerRef}
															{...draggableProvided.draggableProps}
															{...draggableProvided.dragHandleProps}
															style={{
																marginBottom: 12,
																...draggableProvided.draggableProps.style,
															}}
														>
															<Card
																size='small'
																style={{
																	boxShadow: draggableSnapshot.isDragging
																		? '0 2px 10px rgba(0,0,0,0.12)'
																		: undefined,
																}}
															>
																<Title level={5} style={{ marginBottom: 8 }}>
																	{task.tenTask}
																</Title>
																<Text type='secondary'>
																	Deadline: {new Date(task.deadline).toLocaleString()}
																</Text>
																<div style={{ marginTop: 8 }}>
																	<Tag>{task.doUuTien}</Tag>
																	{task.tags.map((tag) => (
																		<Tag key={`${task.id}-${tag}`}>{tag}</Tag>
																	))}
																</div>
															</Card>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</Card>
						</Col>
					);
				})}
			</Row>
		</DragDropContext>
	);
};

export default KanbanBoard;
