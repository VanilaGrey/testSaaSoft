<template>
	<div class="page">
		<base-header />
		<router-view class="page__main" />
		<base-footer />
	</div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import BaseHeader from './components/BaseHeader.vue';
import BaseFooter from './components/BaseFooter.vue';
</script>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	overflow: hidden auto;
}

.page__main {
	flex-grow: 1;
}
</style>
