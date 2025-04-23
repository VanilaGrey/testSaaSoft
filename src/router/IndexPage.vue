<script setup>
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/accountStore';

const store = useAccountStore();
const accounts = ref([]);
const errors = ref([]);
const accountTypes = ['LDAP', 'Локальная'];
const showPasswords = ref([]);

onMounted(() => {
	accounts.value = store.getAccounts();
	showPasswords.value = accounts.value.map(() => false);
	errors.value = new Array(accounts.value.length).fill({});
});

function addAccount() {
	accounts.value.push({
		id: Date.now(),
		labelInput: '',
		label: [],
		type: 'LDAP',
		login: '',
		password: null,
	});
	showPasswords.value.push(false);
	errors.value.push({});
}

function removeAccount(index) {
	accounts.value.splice(index, 1);
	showPasswords.value.splice(index, 1);
	errors.value.splice(index, 1);

	store.saveAccounts(accounts.value);
}

function togglePassword(index) {
	showPasswords.value[index] = !showPasswords.value[index];
}

function validateAndSave(index) {
	const acc = accounts.value[index];
	errors.value[index] = {};

	// Валидация для Логина
	if (!acc.login || acc.login.length > 100) errors.value[index].login = true;

	// Валидация для пароля
	if (acc.type === 'Локальная') {
		if (!acc.password || acc.password.length > 100) {
			errors.value[index].password = true;
		}
	} else {
		acc.password = null;
	}

	// Валидация для метки
	if (acc.labelInput.length > 50) {
		errors.value[index].label = true; // Ошибка, если длина метки больше 50
	} else {
		const labels = acc.labelInput
			.split(';')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '');

		// Проверяем, если есть несколько слов, но нет разделителей ;
		const wordsCount = acc.labelInput.split(' ').length;
		if (wordsCount > 1 && !acc.labelInput.includes(';')) {
			errors.value[index].label = true; // Ошибка, если есть несколько слов, но нет разделителей
		} else {
			acc.label = labels.map((tag) => ({ text: tag })); // Преобразуем в массив объектов
		}
	}
	// проверяю
	console.log('Saving account:', acc);

	// Сохраняем данные в store, если нет ошибок
	if (!Object.keys(errors.value[index]).length) {
		store.saveAccount(acc); // Метод для сохранения данных в Pinia
	}
}
</script>

<template>
	<v-container class="account-form">
		<div class="account-form__header">
			<h2 class="account-form__title">Учетные записи</h2>
			<v-btn icon @click="addAccount" class="account-form__add-btn">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>

		<div class="account-form__info">
			<v-icon size="18">mdi-information-outline</v-icon>
			<span
				>Для указания нескольких меток для одной пары логин/пароль используйте
				разделитель <strong>;</strong></span
			>
		</div>

		<div
			v-for="(account, index) in accounts"
			:key="account.id"
			class="account-form__row"
		>
			<v-text-field
				v-model="account.labelInput"
				class="account-form__input"
				placeholder="Метки"
				:error="errors[index]?.label"
				hide-details
				@blur="validateAndSave(index)"
			/>

			<v-select
				v-model="account.type"
				:items="accountTypes"
				class="account-form__select"
				placeholder="Тип записи"
				hide-details
				@update:modelValue="validateAndSave(index)"
			/>

			<v-text-field
				v-model="account.login"
				class="account-form__input"
				placeholder="Логин"
				:error="errors[index]?.login"
				hide-details
				@blur="validateAndSave(index)"
			/>

			<v-text-field
				v-if="account.type === 'Локальная'"
				v-model="account.password"
				:type="showPasswords[index] ? 'text' : 'password'"
				class="account-form__input"
				placeholder="Пароль"
				:error="errors[index]?.password"
				hide-details
				@blur="validateAndSave(index)"
			>
				<template #append-inner>
					<v-icon class="account-form__icon" @click="togglePassword(index)">
						{{ showPasswords[index] ? "mdi-eye-off" : "mdi-eye" }}
					</v-icon>
				</template>
			</v-text-field>

			<v-btn
				icon
				class="account-form__delete-btn"
				@click="removeAccount(index)"
			>
				<v-icon color="error">mdi-delete-outline</v-icon>
			</v-btn>
		</div>
	</v-container>
</template>

<style scoped lang="scss">
.account-form {
	max-width: 960px;
	margin: 0 auto;
	padding: 24px;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	&__title {
		font-size: 20px;
		font-weight: 600;
	}

	&__info {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #666;
		background: #f5f5f5;
		padding: 8px 12px;
		border-radius: 6px;
		margin-bottom: 16px;
		gap: 8px;
	}

	&__row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}

	&__icon {
		cursor: pointer;
	}

	&__delete-btn {
		flex: 0 0 auto;
	}
}
</style>
