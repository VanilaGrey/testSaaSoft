import { defineStore } from 'pinia';

export const useAccountStore = defineStore('accountStore', {
	state: () => ({
		accounts: JSON.parse(localStorage.getItem('accounts') || '[]'),
	}),

	actions: {
		saveAccount(account) {
			// Если аккаунт с таким ID уже существует, обновляем его
			const index = this.accounts.findIndex((acc) => acc.id === account.id);
			if (index !== -1) {
				this.accounts[index] = account;
			} else {
				// Если такого аккаунта нет, добавляем новый
				this.accounts.push(account);
			}

			// Сохраняем в localStorage
			this.saveAccounts(this.accounts);
		},

		saveAccounts(accounts) {
			this.accounts = accounts;
			localStorage.setItem('accounts', JSON.stringify(accounts));
		},

		getAccounts() {
			return this.accounts;
		},
	},
});
