export type TWorkingHour = {
	dayOfWeek: number; 
	startTime: string;
	endTime: string; 
};

export type TStaff = {
	id: number;
	name: string;
	phone?: string;
	maxBookingsPerDay?: number;
	workingHours?: TWorkingHour[];
};

export type TCreateStaff = Omit<TStaff, 'id'> & Partial<Pick<TStaff, 'id'>>;

export type TService = {
	id: number;
	name: string;
	duration: number; // minutes
	price: number; // VND
	active?: boolean;
};

export type TCreateService = Omit<TService, 'id'> & Partial<Pick<TService, 'id'>>;

