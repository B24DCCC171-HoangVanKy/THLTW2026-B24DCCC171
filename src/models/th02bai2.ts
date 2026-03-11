import { useMemo, useState } from 'react';

export type Difficulty = 'De' | 'TrungBinh' | 'Kho' | 'RatKho';

export interface KnowledgeBlock {
	id: string;
	name: string;
}

export interface Subject {
	id: string;
	code: string;
	name: string;
	credits: number;
}

export interface Question {
	id: string;
	subjectId: string;
	blockId: string;
	difficulty: Difficulty;
	content: string;
}

export interface ExamStructureItem {
	id: string;
	blockId: string;
	difficulty: Difficulty;
	quantity: number;
}

export interface ExamTemplate {
	id: string;
	name: string;
	subjectId: string;
	structure: ExamStructureItem[];
}

export interface Exam {
	id: string;
	name: string;
	subjectId: string;
	createdAt: string;
	structure: ExamStructureItem[];
	questionIds: string[];
}

interface StorageShape {
	blocks: KnowledgeBlock[];
	subjects: Subject[];
	questions: Question[];
	templates: ExamTemplate[];
	exams: Exam[];
}

const STORAGE_KEY = 'th02_bai2';

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const safeParse = (value: string | null): StorageShape | null => {
	if (!value) return null;
	try {
		return JSON.parse(value) as StorageShape;
	} catch {
		return null;
	}
};

const getDefaultData = (): StorageShape => ({
	blocks: [],
	subjects: [],
	questions: [],
	templates: [],
	exams: [],
});

export default () => {
	const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [templates, setTemplates] = useState<ExamTemplate[]>([]);
	const [exams, setExams] = useState<Exam[]>([]);

	const loadAll = () => {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = safeParse(raw) ?? getDefaultData();
		setBlocks(parsed.blocks ?? []);
		setSubjects(parsed.subjects ?? []);
		setQuestions(parsed.questions ?? []);
		setTemplates(parsed.templates ?? []);
		setExams(parsed.exams ?? []);
	};

	const persistAll = (next: StorageShape) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	};

	const snapshot: StorageShape = useMemo(
		() => ({ blocks, subjects, questions, templates, exams }),
		[blocks, subjects, questions, templates, exams],
	);

	const upsertBlock = (input: Omit<KnowledgeBlock, 'id'> & { id?: string }) => {
		const nextItem: KnowledgeBlock = { id: input.id ?? createId(), name: input.name.trim() };
		const nextBlocks = input.id
			? blocks.map((b) => (b.id === input.id ? nextItem : b))
			: [nextItem, ...blocks];
		setBlocks(nextBlocks);
		persistAll({ ...snapshot, blocks: nextBlocks });
	};

	const deleteBlock = (id: string) => {
		const nextBlocks = blocks.filter((b) => b.id !== id);
		setBlocks(nextBlocks);
		persistAll({ ...snapshot, blocks: nextBlocks });
	};

	const upsertSubject = (input: Omit<Subject, 'id'> & { id?: string }) => {
		const nextItem: Subject = {
			id: input.id ?? createId(),
			code: input.code.trim(),
			name: input.name.trim(),
			credits: Number(input.credits),
		};
		const nextSubjects = input.id
			? subjects.map((s) => (s.id === input.id ? nextItem : s))
			: [nextItem, ...subjects];
		setSubjects(nextSubjects);
		persistAll({ ...snapshot, subjects: nextSubjects });
	};

	const deleteSubject = (id: string) => {
		const nextSubjects = subjects.filter((s) => s.id !== id);
		setSubjects(nextSubjects);
		persistAll({ ...snapshot, subjects: nextSubjects });
	};

	const upsertQuestion = (input: Omit<Question, 'id'> & { id?: string }) => {
		const nextItem: Question = {
			id: input.id ?? createId(),
			subjectId: input.subjectId,
			blockId: input.blockId,
			difficulty: input.difficulty,
			content: input.content.trim(),
		};
		const nextQuestions = input.id
			? questions.map((q) => (q.id === input.id ? nextItem : q))
			: [nextItem, ...questions];
		setQuestions(nextQuestions);
		persistAll({ ...snapshot, questions: nextQuestions });
	};

	const deleteQuestion = (id: string) => {
		const nextQuestions = questions.filter((q) => q.id !== id);
		setQuestions(nextQuestions);
		persistAll({ ...snapshot, questions: nextQuestions });
	};

	const upsertTemplate = (input: Omit<ExamTemplate, 'id'> & { id?: string }) => {
		const nextItem: ExamTemplate = {
			id: input.id ?? createId(),
			name: input.name.trim(),
			subjectId: input.subjectId,
			structure: input.structure,
		};
		const nextTemplates = input.id
			? templates.map((t) => (t.id === input.id ? nextItem : t))
			: [nextItem, ...templates];
		setTemplates(nextTemplates);
		persistAll({ ...snapshot, templates: nextTemplates });
	};

	const deleteTemplate = (id: string) => {
		const nextTemplates = templates.filter((t) => t.id !== id);
		setTemplates(nextTemplates);
		persistAll({ ...snapshot, templates: nextTemplates });
	};

	const saveExam = (exam: Omit<Exam, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
		const nextItem: Exam = {
			id: exam.id ?? createId(),
			createdAt: exam.createdAt ?? new Date().toISOString(),
			name: exam.name.trim(),
			subjectId: exam.subjectId,
			structure: exam.structure,
			questionIds: exam.questionIds,
		};
		const nextExams = exam.id
			? exams.map((e) => (e.id === exam.id ? nextItem : e))
			: [nextItem, ...exams];
		setExams(nextExams);
		persistAll({ ...snapshot, exams: nextExams });
	};

	const deleteExam = (id: string) => {
		const nextExams = exams.filter((e) => e.id !== id);
		setExams(nextExams);
		persistAll({ ...snapshot, exams: nextExams });
	};

	return {
		blocks,
		subjects,
		questions,
		templates,
		exams,
		loadAll,
		upsertBlock,
		deleteBlock,
		upsertSubject,
		deleteSubject,
		upsertQuestion,
		deleteQuestion,
		upsertTemplate,
		deleteTemplate,
		saveExam,
		deleteExam,
	};
};

