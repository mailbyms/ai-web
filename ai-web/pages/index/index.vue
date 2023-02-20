<template>
	<view>
		<ai-header title="智灵AI助手"/>
	</view>
</template>

<script lang="ts" setup>
	import {ref} from "vue";
	import { onLoad } from '@dcloudio/uni-app'  
	// const a:string = ref("aabb");
	onLoad((e) => {
		console.log('页面加载完成',e);
	})
	
</script>

<style lang="scss" scoped>
	
</style>
