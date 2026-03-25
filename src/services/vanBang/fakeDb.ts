import type { RegistryBook } from './types';
import dbJson from './db.json';

const LS_KEY = 'van_bang_fake_db_v1';

export interface VanBangFakeState {
	registryBooks: RegistryBook[];
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
	state.registryBooks = state.registryBooks.filter((r) => r.id !== id);
	persist();
}
