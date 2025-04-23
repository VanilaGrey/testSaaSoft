<template>
	<svg focusable="false">
		<use :href="`/images/icons/${id}.svg`" />
	</svg>
</template>

<script setup>
defineProps({
	id: {
		type: String,
		required: true,
	},
});
</script>

<style lang="scss" scoped>
svg {
	fill: currentColor;
}
</style>
