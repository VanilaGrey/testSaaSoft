import { defineStore } from "pinia";

export const useAccountStore = defineStore("accountStore", {
	state: () => ({
		accounts: JSON.parse(localStorage.getItem("accounts") || "[]"),
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
			const validAccounts = accounts.filter((acc) => {
				if (!acc.login || acc.login.length > 100) return false;

				if (acc.type === "Локальная") {
					if (!acc.password || acc.password.length > 100) return false;
				}

				if (acc.labelInput.length > 50) return false;

				const wordsCount = acc.labelInput.split(" ").length;
				if (wordsCount > 1 && !acc.labelInput.includes(";")) return false;

				return true;
			});

			this.accounts = validAccounts;
			localStorage.setItem("accounts", JSON.stringify(validAccounts));
		},

		getAccounts() {
			return this.accounts;
		},
	},
});
