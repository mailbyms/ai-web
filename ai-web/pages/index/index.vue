<template>
	<view class="index ai-position-fixed w100" >
		<!-- <ai-header title="智灵AI助手"/> -->
		<!-- 
			内容组件
			list:数据列表
			loading:是否展示加在动画
			ctrlPrintLoading:控制打印时是否显示动画
			focusFlag:输入框状态
			listLength:列表长度
			@addContent:添加提问内容到输入框
		 -->
		<ai-content-container 
			:list="list" 
			:loading="loading"
			:ctrlPrintLoading="ctrlPrintLoading"
			:focusFlag="focusFlag"
			:listLength="listLength"
			@addContent="addContent"
		/>
		<!-- 
			输入框组件
			loading:是否展示加在动画
			focusFlag:输入框状态
			addData:列表添加的数据
			@sendMsg:发送信息
			@updateInputStatus:检测输入框状态是focus/blur
		-->
		<ai-input-container  
			:loading="loading" 
			:focusFlag="focusFlag"
			:addData="addData"
			@sendMsg="sendMsg"
			@updateInputStatus="updateInputStatus"
		/>
	</view>
</template>

<script lang="ts" setup>
	import {ref,reactive,onMounted,nextTick} from "vue";
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
	const list = reactive<GenerateTextList[]>([
		{
			prompt:'您好，我想问下这份果冻'
		},
		{
			text:'您好，有什么问题可以直接咨询我哦包括商品规格，储存方式等。'
		},
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
		// {
		// 	text:'您好，有什么问题可以直接咨询我哦包括商品规格，储存方式等。'
		// },
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// },
		// {
		// 	text:'您好，有什么问题可以直接咨询我哦包括商品规格，储存方式等。'
		// },
		// {
		// 	prompt:'您好，我想问下这份果冻橙是可以直接拿勺子吃得那种吗？'
		// }
	])
	const listLength = ref<number>(list.length)
	//控制过渡效果
	const loading = ref<boolean>(false)
	//控制文本是否显示过渡效果
	const ctrlPrintLoading = ref<boolean>(false)
	/**
	 * 发送信息
	 * @param {string} msg  发送的内容
	 */
	const sendMsg = (msg:string) => {
		loading.value = true
		addData.value = ''
		const obj = {
			prompt:msg
		}
		// generateText(obj).then(res => {
		// 	console.log('结果',res)
		// loading.value = false
		// }).catch((err) => {
		// 	console.log('err',err)
		// loading.value = false
		// })
		list.push({
			prompt:msg
		})
		listLength.value ++
		const text = '您好，有什么问题可以直接咨询我哦包括商品规格，储存方式等。';
		const textLen = text.length
		setTimeout(() => {
			ctrlPrint(text,textLen)
		},1000)
	}
	/**
	 * 控制打印
	 * @param {string} text  回复的答案
	 * @param {number} textLen  答案长度
	 */
	const ctrlPrint = (text:string,textLen:number) => {
		ctrlPrintLoading.value = true
		let timer = null
		let index = 1
		list.push({
			text:text.slice(0,index)
		})
		listLength.value ++
		timer = setInterval(() => {
			index ++
			list[list.length - 1].text = text.slice(0,index)
			if(index > textLen){
				clearInterval(timer);
				timer = null
				loading.value = false
				ctrlPrintLoading.value = false
				return
			}
		},100)
	}
	
	const focusFlag = ref<boolean>(false)
	const updateInputStatus = (status:boolean) => {
		focusFlag.value = status
		if(status){
			document.body.addEventListener('touchmove', noScroll, { passive: false })
		}else {
			nextTick(() => {
				document.body.removeEventListener('touchmove', noScroll)
			})
		}
	}
	const noScroll = (e) => {
		e.preventDefault()
	}
	
	const addData = ref<string>('')
	const addContent = (prompt:string) => {
		addData.value += prompt
	}
</script>

<style lang="scss" scoped>
	.index{
		background-color: #fff;
		overflow: hidden;
	}
</style>
