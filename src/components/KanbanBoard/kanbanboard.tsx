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
const mauTagCoDinh = 'geekblue';
const mauDoUuTien: Record<string, string> = {
	Cao: 'red',
	'Trung bình': 'blue',
	Thấp: 'green',
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
			<Row gutter={[16, 16]} align='top'>
				{cotKanban.map((cot) => {
					const taskTheoCot = danhSachTask.filter((task) => task.trangThai === cot.tieuDe);
					return (
						<Col xs={24} md={8} key={cot.id}>
							<Card title={`${cot.tieuDe} (${taskTheoCot.length})`} bordered className={`kanban-cot kanban-cot-${cot.id}`}>
								<Droppable droppableId={cot.id}>
									{(provided, snapshot) => (
										<div
											className={`kanban-dropzone ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{taskTheoCot.map((task, index) => (
												<Draggable draggableId={task.id} index={index} key={task.id}>
													{(draggableProvided, draggableSnapshot) => (
														<div
															className='kanban-draggable-wrap'
															ref={draggableProvided.innerRef}
															{...draggableProvided.draggableProps}
															{...draggableProvided.dragHandleProps}
															style={{
																...draggableProvided.draggableProps.style,
															}}
														>
															<Card
																size='small'
																className={`kanban-task-card ${draggableSnapshot.isDragging ? 'is-dragging' : ''}`}
															>
																<Title level={5} className='kanban-task-title'>
																	{task.tenTask}
																</Title>
																<Text>
																	Deadline: {new Date(task.deadline).toLocaleString()}
																</Text>
																<div className='kanban-task-tags'>
																	<Tag color={mauDoUuTien[task.doUuTien]}>{task.doUuTien}</Tag>
																	{task.tags.map((tag) => (
																		<Tag color={mauTagCoDinh} key={`${task.id}-${tag}`}>
																			{tag}
																		</Tag>
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
