<!-- 
 模块名称：全局公共头部组件
 模块作者：tony
-->
<template>
	<view class="ai-header ai-display-flex ai-align-items-center ai-justify-content-center">{{title}}</view>
</template>

<script lang="ts" setup>

import { defineProps,withDefaults } from "vue"
interface Props {
	title:string //标题
}
 withDefaults(defineProps<Props>(),{
	title:'智灵AI助手'
})
</script>

<style lang="scss" scoped>
	.ai-header{
		height: 88rpx;
		background: rgba(0,0,0,0);
	}
</style>