import { createClient } from '@supabase/supabase-js';
import type { CalendarDate } from '@internationalized/date';

const { VITE_DB_PROJECT_URL, VITE_DB_SECRET_KEY } = import.meta.env;

export const supabase = createClient(VITE_DB_PROJECT_URL, VITE_DB_SECRET_KEY);

enum Times {
    Ten = '10 a.m.',
    Eleven = '11 a.m.',
    Twelve = '12 p.m.',
    One = ` 1 p.m.`,
}

export const dbController = {
	async postAppointment(day: string, time: Times, notes: string) {

		const { data, error } = await supabase.from('appointments').insert({ day, time, notes });

		if (error) {
			console.error('Error inserting data:', error);
			return null;
		}

		return data;
	},

	async checkIfCustomerExists(name, email, phone) {
		const { data, error } = await supabase
			.from('customers')
			.select('id')
			.eq('name', name)
			.eq('email', email)
			.eq('phone', phone);

		if (error) {
			console.error('Error inserting data:', error);
			return null;
		}

		return data[0].id;
	},

	async addCustomerInfo(name, email, phone) {
		const { data, error } = await supabase.from('customers').insert({ name, email, phone }).select('id');

		if (error) {
			console.error('Error inserting data:', error);
			return null;
		}

		return data[0].id;
	},

	async addBooking(datesID,customerID) {
		const { data, error } = await supabase.from('bookings').insert({ datesID, customerID });

		if (error) {
			console.error('Error inserting data:', error);
			return null;
		}

		return data;
	}
};
