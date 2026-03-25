import type {
	Diploma,
	DiplomaFieldDefinition,
	DiplomaFieldType,
	DiplomaLookupLog,
	DynamicValues,
	GraduationDecision,
	RegistryBook,
} from './types';
import dbJson from './db.json';

const LS_KEY = 'van_bang_fake_db_v1';

export interface VanBangFakeState {
	registryBooks: RegistryBook[];
	graduationDecisions: GraduationDecision[];
	fieldDefinitions: DiplomaFieldDefinition[];
	diplomas: Diploma[];
	lookupLogs: DiplomaLookupLog[];
}

function cloneInitial(): VanBangFakeState {
	return JSON.parse(JSON.stringify(dbJson)) as VanBangFakeState;
}

function load(): VanBangFakeState {
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return cloneInitial();
		return JSON.parse(raw) as VanBangFakeState;
	} catch {
		return cloneInitial();
	}
}

let state: VanBangFakeState = load();

function persist() {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(state));
	} catch {}
}

function uid(prefix: string) {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getState(): VanBangFakeState {
	return state;
}

export function resetFakeDb() {
	state = cloneInitial();
	persist();
}

export function listRegistryBooks(): RegistryBook[] {
	return [...state.registryBooks].sort((a, b) => b.year - a.year);
}

export function getRegistryByYear(year: number): RegistryBook | undefined {
	return state.registryBooks.find((r) => r.year === year);
}

export function createRegistryBook(year: number): RegistryBook {
	if (!Number.isInteger(year) || year < 1900 || year > 3000) {
		throw new Error('Năm không hợp lệ');
	}
	if (state.registryBooks.some((r) => r.year === year)) {
		throw new Error(`Năm ${year} đã có sổ văn bằng`);
	}
	const item: RegistryBook = {
		id: uid('rb'),
		year,
		lastEntryNumber: 0,
	};
	state.registryBooks.push(item);
	persist();
	return item;
}

export function deleteRegistryBook(id: string): void {
	const hasDecision = state.graduationDecisions.some((d) => d.registryBookId === id);
	if (hasDecision) throw new Error('Không thể xóa sổ đã có quyết định tốt nghiệp');
	const hasDiploma = state.diplomas.some((d) => d.registryBookId === id);
	if (hasDiploma) throw new Error('Không thể xóa sổ đã có văn bằng');
	state.registryBooks = state.registryBooks.filter((r) => r.id !== id);
	persist();
}

export function allocateEntryNumber(registryBookId: string): number {
	const rb = state.registryBooks.find((r) => r.id === registryBookId);
	if (!rb) throw new Error('Không tìm thấy sổ văn bằng');
	rb.lastEntryNumber += 1;
	const n = rb.lastEntryNumber;
	persist();
	return n;
}

export function listGraduationDecisions(): GraduationDecision[] {
	return [...state.graduationDecisions].sort((a, b) => {
		if (a.issueDate === b.issueDate) return a.decisionNumber.localeCompare(b.decisionNumber);
		return a.issueDate < b.issueDate ? 1 : -1;
	});
}

export function createGraduationDecision(payload: {
	registryBookId: string;
	decisionNumber: string;
	issueDate: string;
	summary: string;
}): GraduationDecision {
	const registry = state.registryBooks.find((r) => r.id === payload.registryBookId);
	if (!registry) throw new Error('Sổ văn bằng không tồn tại');
	const decisionNumber = payload.decisionNumber.trim();
	if (!decisionNumber) throw new Error('Số quyết định không hợp lệ');
	if (state.graduationDecisions.some((d) => d.registryBookId === payload.registryBookId && d.decisionNumber === decisionNumber)) {
		throw new Error('Số quyết định đã tồn tại trong sổ này');
	}
	if (Number.isNaN(Date.parse(payload.issueDate))) throw new Error('Ngày ban hành không hợp lệ');
	const item: GraduationDecision = {
		id: uid('qd'),
		registryBookId: payload.registryBookId,
		decisionNumber,
		issueDate: payload.issueDate,
		summary: payload.summary.trim(),
		searchCount: 0,
	};
	state.graduationDecisions.push(item);
	persist();
	return item;
}

export function deleteGraduationDecision(id: string): void {
	const hasDiploma = state.diplomas.some((d) => d.graduationDecisionId === id);
	if (hasDiploma) throw new Error('Không thể xóa quyết định đã có văn bằng');
	state.graduationDecisions = state.graduationDecisions.filter((d) => d.id !== id);
	persist();
}

export function listFieldDefinitions(): DiplomaFieldDefinition[] {
	return [...state.fieldDefinitions].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}

export function createFieldDefinition(payload: { key: string; label: string; fieldType: DiplomaFieldType; sortOrder?: number }): DiplomaFieldDefinition {
	const key = payload.key.trim().replace(/\s+/g, '_');
	if (!/^[a-zA-Z0-9_]+$/.test(key)) throw new Error('Mã trường chỉ gồm chữ, số, gạch dưới');
	if (state.fieldDefinitions.some((f) => f.key === key)) throw new Error('Mã trường đã tồn tại');
	const label = payload.label.trim();
	if (!label) throw new Error('Tên hiển thị không hợp lệ');
	const sortOrder =
		payload.sortOrder !== undefined
			? payload.sortOrder
			: Math.max(0, ...state.fieldDefinitions.map((f) => f.sortOrder)) + 1;
	const item: DiplomaFieldDefinition = {
		id: uid('fd'),
		key,
		label,
		fieldType: payload.fieldType,
		sortOrder,
		isActive: true,
	};
	state.fieldDefinitions.push(item);
	persist();
	return item;
}

export function updateFieldDefinition(
	id: string,
	payload: Partial<Pick<DiplomaFieldDefinition, 'label' | 'fieldType' | 'sortOrder' | 'isActive'>>,
): void {
	const def = state.fieldDefinitions.find((f) => f.id === id);
	if (!def) throw new Error('Không tìm thấy trường');
	if (payload.label !== undefined) {
		const label = payload.label.trim();
		if (!label) throw new Error('Tên hiển thị không hợp lệ');
		def.label = label;
	}
	if (payload.fieldType !== undefined) def.fieldType = payload.fieldType;
	if (payload.sortOrder !== undefined) def.sortOrder = payload.sortOrder;
	if (payload.isActive !== undefined) def.isActive = payload.isActive;
	persist();
}

export function deleteFieldDefinition(id: string): void {
	const def = state.fieldDefinitions.find((f) => f.id === id);
	if (!def) throw new Error('Không tìm thấy trường');
	const used = state.diplomas.some((d) => Object.prototype.hasOwnProperty.call(d.dynamicValues, def.key));
	if (used) throw new Error('Không thể xóa trường đã có dữ liệu trên văn bằng');
	state.fieldDefinitions = state.fieldDefinitions.filter((f) => f.id !== id);
	persist();
}

export function listDiplomas(): Diploma[] {
	return [...state.diplomas].sort((a, b) => {
		if (a.registryBookId !== b.registryBookId) return a.registryBookId.localeCompare(b.registryBookId);
		if (a.entryNumber !== b.entryNumber) return a.entryNumber - b.entryNumber;
		return a.id.localeCompare(b.id);
	});
}

export function validateDynamicValues(
	values: DynamicValues,
): { ok: true } | { ok: false; field: string; message: string } {
	const defs = state.fieldDefinitions;
	for (const def of defs) {
		if (def.isActive === false) continue;
		const v = values[def.key];
		if (v === undefined || v === null || v === '') continue;
		if (def.fieldType === 'NUMBER' && typeof v !== 'number' && typeof v !== 'string') {
			return { ok: false, field: def.key, message: `${def.label}: phải là số` };
		}
		if (def.fieldType === 'NUMBER') {
			const num = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
			if (Number.isNaN(num)) return { ok: false, field: def.key, message: `${def.label}: không phải số hợp lệ` };
		}
		if (def.fieldType === 'DATE' && typeof v === 'string' && Number.isNaN(Date.parse(v))) {
			return { ok: false, field: def.key, message: `${def.label}: ngày không hợp lệ` };
		}
	}
	return { ok: true };
}

export function createDiploma(payload: {
	graduationDecisionId: string;
	diplomaSerialNumber: string;
	studentId: string;
	fullName: string;
	birthDate: string;
	dynamicValues: DynamicValues;
}): Diploma {
	const gd = state.graduationDecisions.find((d) => d.id === payload.graduationDecisionId);
	if (!gd) throw new Error('Quyết định không tồn tại');
	const diplomaSerialNumber = payload.diplomaSerialNumber.trim();
	if (!diplomaSerialNumber) throw new Error('Số hiệu văn bằng không hợp lệ');
	if (state.diplomas.some((d) => d.diplomaSerialNumber === diplomaSerialNumber)) {
		throw new Error('Số hiệu văn bằng đã tồn tại');
	}
	const studentId = payload.studentId.trim();
	if (!studentId) throw new Error('Mã sinh viên không hợp lệ');
	const fullName = payload.fullName.trim();
	if (!fullName) throw new Error('Họ tên không hợp lệ');
	if (Number.isNaN(Date.parse(payload.birthDate))) throw new Error('Ngày sinh không hợp lệ');
	const dynCheck = validateDynamicValues(payload.dynamicValues);
	if (!dynCheck.ok) throw new Error(dynCheck.message);
	const entryNumber = allocateEntryNumber(gd.registryBookId);
	const item: Diploma = {
		id: uid('dip'),
		graduationDecisionId: payload.graduationDecisionId,
		registryBookId: gd.registryBookId,
		entryNumber,
		diplomaSerialNumber,
		studentId,
		fullName,
		birthDate: payload.birthDate,
		dynamicValues: { ...payload.dynamicValues },
	};
	state.diplomas.push(item);
	persist();
	return item;
}

export function deleteDiploma(id: string): void {
	const dip = state.diplomas.find((d) => d.id === id);
	if (!dip) return;
	state.diplomas = state.diplomas.filter((d) => d.id !== id);
	const sameBook = state.diplomas.filter((d) => d.registryBookId === dip.registryBookId);
	const maxN = sameBook.length ? Math.max(...sameBook.map((d) => d.entryNumber)) : 0;
	const rb = state.registryBooks.find((r) => r.id === dip.registryBookId);
	if (rb) rb.lastEntryNumber = maxN;
	persist();
}

export function searchDiplomas(params: {
	diplomaSerialNumber?: string;
	entryNumber?: number;
	studentId?: string;
	fullName?: string;
	birthDate?: string;
}): { ok: true; items: Diploma[] } | { ok: false; reason: string } {
	const keys = ['diplomaSerialNumber', 'entryNumber', 'studentId', 'fullName', 'birthDate'] as const;
	let filled = 0;
	for (const k of keys) {
		const v = params[k];
		if (v !== undefined && v !== null && String(v).trim() !== '') filled += 1;
	}
	if (filled < 2) return { ok: false, reason: 'Cần ít nhất 2 thông tin để tra cứu.' };

	const items = state.diplomas.filter((d) => {
		if (params.diplomaSerialNumber && d.diplomaSerialNumber !== params.diplomaSerialNumber.trim()) return false;
		if (params.entryNumber !== undefined && params.entryNumber !== d.entryNumber) return false;
		if (params.studentId && d.studentId !== params.studentId.trim()) return false;
		if (params.fullName && d.fullName.toLowerCase() !== params.fullName.trim().toLowerCase()) return false;
		if (params.birthDate && d.birthDate !== params.birthDate) return false;
		return true;
	});

	for (const d of items) {
		const gd = state.graduationDecisions.find((x) => x.id === d.graduationDecisionId);
		if (gd) gd.searchCount += 1;
		state.lookupLogs.push({
			id: uid('log'),
			graduationDecisionId: d.graduationDecisionId,
			createdAt: new Date().toISOString(),
		});
	}
	persist();

	return { ok: true, items };
}
