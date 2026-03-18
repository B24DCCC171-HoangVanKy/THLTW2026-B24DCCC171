import axios from '@/utils/axios';
import { FAKE_API_BASE_URL } from '@/services/fakeApi';
import type { TCreateReview, TReview } from './types';

const base = `${FAKE_API_BASE_URL}/reviews`;

export async function getReviewList() {
	return axios.get<TReview[]>(base);
}

export async function createReview(payload: TCreateReview) {
	return axios.post<TReview>(base, payload);
}

export async function updateReview(id: number, payload: Partial<TCreateReview>) {
	return axios.patch<TReview>(`${base}/${id}`, payload);
}

export async function deleteReview(id: number) {
	return axios.delete(`${base}/${id}`);
}

