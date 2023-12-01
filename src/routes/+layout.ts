import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageLoad = async ({ route }) => {
	const { data } = await supabase.from('appointments').select();
	return {
		booked: data,
		route
	};
};
