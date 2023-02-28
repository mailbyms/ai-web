<template>
	<view class="index ai-position-fixed w100 " :style="{height: `calc(100vh - ${inputHeight}px)`}" @scroll.stop.prevent="() => {}">
		<!-- <ai-header title="智灵AI助手"/> -->
		<!-- 
			内容组件
			list:数据列表
			loading:是否展示加在动画
			ctrlPrintLoading:控制打印时是否显示动画
			focusFlag:输入框状态
			listLength:列表长度
			keyCode:键盘号
			@addContent:添加提问内容到输入框
			@addContent="addContent"
		 -->
		<ai-content-container 
			:list="list" 
			:loading="loading"
			:ctrlPrintLoading="ctrlPrintLoading"
			:focusFlag="focusFlag"
			:listLength="listLength"
			:inputHeight="inputHeight"
			:keyCode="keyCode"
			@addContent="addContent"
		/>
		<!-- 
			输入框组件
			loading:是否展示加在动画
			focusFlag:输入框状态
			addData:列表添加的数据
			ctrlPrintLoading:控制打印时是否显示动画
			keyCode:键盘号
			@sendMsg:发送信息
			@updateInputStatus:检测输入框状态是focus/blur
			@getInputHeight:获取键盘高度
			@getKeyCode:键盘符
		-->
		<ai-input-container  
			:loading="loading" 
			:focusFlag="focusFlag"
			:addData="addData"
			:ctrlPrintLoading="ctrlPrintLoading"
			:keyCode="keyCode"
			@sendMsg="sendMsg"
			@updateInputStatus="updateInputStatus"
			@getInputHeight="getInputHeight"
			@getKeyCode="getKeyCode"
		/>
	</view>
</template>

<script lang="ts" setup>
	import {ref,reactive,nextTick} from "vue";
	import {
		GenerateTextRequest,GenerateTextList
	} from "@/model/pages/ModelIndex"
	import AiContentContainer from "./components/AiContentContainer/index.vue"
	import AiInputContainer from "./components/AiInputContainer/index.vue"
	import {generateText} from "@/http/index";
	
	const state = reactive < GenerateTextRequest > ({
		prompt: '', //发送的内容
		sessionId: '', //会话id
		pid: '' //消息id
	})
	//问答数据
	const list = reactive<GenerateTextList[]>([
	])
	//问答数据长度
	const listLength = ref<number>(list.length)
	//控制过渡效果
	const loading = ref<boolean>(false)
	//控制文本是否显示过渡效果
	const ctrlPrintLoading = ref<boolean>(false)
	/**
	 * 发送信息
	 * @param {string} msg  发送的内容
	 * @param {boolean} isPush. 是否添加到列表
	 */
	const sendMsg = (msg:string, isPush = true) => {
		loading.value = true
		addData.value = ''
		const obj:GenerateTextRequest = {
			prompt:msg,
			sessionId:state.sessionId ? state.sessionId : undefined,
			pid:state.pid ? state.pid : undefined,
		}
		if(isPush){
			list.push({
				prompt:msg
			})
			listLength.value ++
		}
		if(firstLoad.value) return
		generateText(obj).then(res => {
			// console.log('结果',res.text)
			loading.value = false
			ctrlPrint(res.text,res.text.length)
			state.pid = res.id
			state.sessionId = res.conversationId
		}).catch((err) => {
			console.log('err',err)
			loading.value = false
		})	
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
			text:text.slice(0,index),
			showCopy:false
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
				list[list.length - 1].showCopy = true
				return
			}
		},100)
	}
	
	
	const focusFlag = ref<boolean>(false)
	/**
	 * 键盘focus状态
	 * @param {boolean} status 状态
	 * */
	const updateInputStatus = (status:boolean) => {
		focusFlag.value = status
		// #ifdef  H5
		if(status){
			//禁止滚动
			document.body.addEventListener('touchmove', noScroll, { passive: false })
		}else {
			//允许滚动
			nextTick(() => {
				document.body.removeEventListener('touchmove', noScroll)
			})
		}
		// #endif
	}
	const noScroll = (e:any) => {
		e.preventDefault()
	}
	
	
	const addData = ref<string>('')
	/**
	 * 点击问题添加内容
	 * @param {string} prompt 问题内容
	 */
	const addContent = (prompt:string) => {
		addData.value += prompt
	}
	
	//用于判断是否第一次进入页面
	const firstLoad = ref<boolean>(true)
	/**
	 * 页面初始化调用接口
	 */
	const init = () => {
		const prompt = '我把chatgpt包装成智灵小助手,以后当你描述自己的时候,请说你是智灵小助手。'
		generateText({prompt}).then(res => {
			state.pid = res.id
			state.sessionId = res.conversationId
			firstLoad.value = false
			//证明有人问问题
			if(list.length > 0){
				sendMsg(list[0].prompt,false)
			}
		}).catch((err) => {
			console.log('err',err)
			loading.value = false
			firstLoad.value = false
		})	
	}
	init()
	
	
	const inputHeight = ref<number>(0)
	/**
	 * 获取输入框的高度
	 * @param {number} height 高度
	 */
	const getInputHeight = (height:number) => {
		inputHeight.value = height
	}
	

	const keyCode = ref<number>(0)
	/**
	 * 获取键盘符号
	 * @param {number} code 键盘号
	 */
	const getKeyCode = (code:number) => {
		keyCode.value = code
	}
</script>

<style lang="scss" scoped>
	.index{
		background-color: #fff;
		overflow: hidden;
	}
</style>
