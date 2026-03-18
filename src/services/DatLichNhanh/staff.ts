import axios from '@/utils/axios';
import { FAKE_API_BASE_URL } from '@/services/fakeApi';
import type { TCreateStaff, TStaff } from './types';

const base = `${FAKE_API_BASE_URL}/staff`;

export async function getStaffList() {
	return axios.get<TStaff[]>(base);
}

export async function createStaff(payload: TCreateStaff) {
	return axios.post<TStaff>(base, payload);
}

export async function updateStaff(id: number, payload: Partial<TCreateStaff>) {
	return axios.patch<TStaff>(`${base}/${id}`, payload);
}

export async function deleteStaff(id: number) {
	return axios.delete(`${base}/${id}`);
}

