import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppDataStore = defineStore('appData', () => {
	const data = ref({});

	return { data };
});
