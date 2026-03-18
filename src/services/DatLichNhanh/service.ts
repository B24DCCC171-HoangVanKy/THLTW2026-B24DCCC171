import axios from '@/utils/axios';
import { FAKE_API_BASE_URL } from '@/services/fakeApi';
import type { TCreateService, TService } from './types';

const base = `${FAKE_API_BASE_URL}/services`;

export async function getServiceList() {
	return axios.get<TService[]>(base);
}

export async function createService(payload: TCreateService) {
	return axios.post<TService>(base, payload);
}

export async function updateService(id: number, payload: Partial<TCreateService>) {
	return axios.patch<TService>(`${base}/${id}`, payload);
}

export async function deleteService(id: number) {
	return axios.delete(`${base}/${id}`);
}

