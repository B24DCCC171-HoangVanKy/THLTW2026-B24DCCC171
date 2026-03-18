import axios from '@/utils/axios';
import { FAKE_API_BASE_URL } from '@/services/fakeApi';
import type { TBooking, TBookingStatus, TCreateBooking } from './types';

const base = `${FAKE_API_BASE_URL}/bookings`;

export async function getBookingList() {
	return axios.get<TBooking[]>(base);
}

export async function createBooking(payload: TCreateBooking) {
	return axios.post<TBooking>(base, payload);
}

export async function updateBooking(id: number, payload: Partial<TCreateBooking>) {
	return axios.patch<TBooking>(`${base}/${id}`, payload);
}

export async function updateBookingStatus(id: number, status: TBookingStatus) {
	return axios.patch<TBooking>(`${base}/${id}`, { status });
}

export async function deleteBooking(id: number) {
	return axios.delete(`${base}/${id}`);
}

