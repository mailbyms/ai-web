<!-- 
	模块名称：AI问答内容组件
	模块作者：tony
-->
<template>
	<view class="ai-content-container border-box">
		<view v-for="(item,index) in list" :key="index">
			<view :class="['common-item border-box',item.prompt ? 'question':'answer' ]">
				{{item.prompt ? item.prompt : item.text}}
			</view>
		</view>
		<view class="common-item answer loading" v-show="loading">
			<view class="dot-flashing"></view>
		</view>
		
	</view>
</template>

<script lang="ts" setup>
	import {
		defineProps,
		withDefaults
	} from "vue";
	import {
		GenerateTextList
	} from "@/model/pages/ModelIndex"
	interface Props {
		list:GenerateTextList[]
		loading:boolean
	}
	withDefaults(defineProps<Props>(),{
		list: () => [],
		loading:false
	})
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>