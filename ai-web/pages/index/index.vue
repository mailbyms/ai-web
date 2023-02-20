<template>
	<view class="index ai-position-fixed w100 h100">
		<!-- <ai-header title="智灵AI助手"/> -->
		<!-- 
			内容组件
			list:数据列表
			loading:是否展示加在动画
		 -->
		<ai-content-container :list="list" :loading="loading"/>
		<!-- 
			输入框组件
			loading:是否展示加在动画
			@sendMsg:发送信息
		-->
		<ai-input-container  :loading="loading" @sendMsg="sendMsg"/>
	</view>
</template>

<script lang="ts" setup>
	import {ref,reactive} from "vue";
	import {
		GenerateTextRequest,GenerateTextList
	} from "@/model/pages/ModelIndex"
	import { onLoad } from '@dcloudio/uni-app'
	import AiContentContainer from "./components/AiContentContainer/index.vue"
	import AiInputContainer from "./components/AiInputContainer/index.vue"
	import {generateText} from "@/api/index.ts"
	// const state = reactive < GenerateTextRequest > ({
	// 	prompt: '',
	// 	sessionId: '', //会话id
	// 	pid: '' //消息id
	// })
	onLoad((e) => {
		console.log('页面加载完成',e);
	})
	const list = reactive<GenerateTextList[]>([
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
		// {
		// 	text:'您好，有什么问题可以直接咨询我哦包括商品规格，储存方式等。'
		// },
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
	])
	const loading = ref<boolean>(false)
	const sendMsg = (msg:string) => {
		const obj = {
			prompt:msg
		}
		generateText(obj).then(res => {
			console.log('结果',res)
		}).catch((err) => {
			console.log('err',err)
		})
		list.push({
			prompt:msg
		})
	}
</script>

<style lang="scss" scoped>
	.index{
		background-color: #fff;
		overflow: hidden;
	}
</style>
