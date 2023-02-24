<!-- 
	模块名称：AI输入框组件
	模块作者：tony
-->
<template>
	<view 
		:class="['ai-input-container w100 ai-display-flex ai-justify-content-space-between border-box ai-position-fixed']" id="ai-input-container"
	>
		<!-- 文本输入框 -->
		<!-- <view 
			class="question-input border-box question-padding" 
			contenteditable="true" 
			id="textarea" 
			@focus="focusInput" 
			@blur="blurInput"
			type="submit"
		>
		</view> -->
		<!-- adjust-position -->
		<textarea 
			class="question-input border-box question-padding" 
			v-model="state.prompt" 
			placeholder="请输入" 
			confirm-type="done" 
			:maxlength="-1"
			:auto-height="true"
			:disable-default-padding="true"
			@focus="focusInput" 
			@blur="blurInput"
			@confirm="sendMsg"
		/>
		<button 
			class="question-send question-common" 
			@click="sendMsg" 
			v-show="!loading && !ctrlPrintLoading"
		>
			发送
		</button>
		<!-- 过渡效果 -->
		<view 
			class="question-loading question-common ai-display-flex ai-align-items-center ai-justify-content-center" 
			v-show="loading || ctrlPrintLoading"
		>
			<view class="dot-flashing"></view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref,
		onMounted,
		defineEmits,
		defineProps,
		withDefaults,
		watch
	} from "vue";
	// import {
	// 	GenerateTextRequest
	// } from "@/model/pages/ModelIndex"
	interface Props {
		loading:boolean
		focusFlag:boolean
		addData?:string
		ctrlPrintLoading:boolean
	}
	const emit = defineEmits(['sendMsg','updateInputStatus','getInputHeight','getKeyCode'])
	let textarea = null;
	let input = null
	let defaultHeight = ref<number>(0)
	onMounted(() => {
		textareaListen()
	})
	
	/**
	 *监听输入框状态 
	 */
	const textareaListen = () => {
		// textarea = document.getElementById('textarea');
		input = document.getElementById('ai-input-container');
		defaultHeight.value = input.clientHeight
		console.log(input.clientHeight)
		// alert(input.clientHeight)
		emit('getInputHeight',defaultHeight.value)
		// textarea.addEventListener('keydown',function(event){
			// setTimeout(() => {
			// 	state.prompt = textarea.innerText
			// })
			// alert(event.keyCode)
			
			// emit('getKeyCode',event.keyCode)
			// if (event.ctrlKey && event.keyCode === 13) {
			// 	//ctrl+enter
			// } else if (event.keyCode === 13) {
			// 	//enter
			// 	sendMsg()
			// 	event.preventDefault() // 阻止浏览器默认换行操作
				
				
			// 	return false
			// }
			// emit('getInputHeight',defaultHeight.value)
		// })	
	}
	
	const propsData = withDefaults(defineProps<Props>(),{
		loading:false, //过渡效果
		focusFlag:false, //focus状态
		addData:'' ,//添加的数据
		ctrlPrintLoading:false
	})
	const state = reactive <any>({
		prompt:''
	})
	
	
	/*
	* 发送数据
	*/
	const sendMsg = () => {
		if( state.prompt.trim()){
			if(propsData.loading || propsData.ctrlPrintLoading) return
			console.log('发送数据', state.prompt)
			emit('sendMsg',state.prompt)
			state.prompt = ''
			return
		}
		uni.showToast({
			title:'请输入内容哟~',
			icon:'none'
		})
		state.prompt = ''
	}
	/**
	 * 文本框光标状态
	 */
	// const textareaRange = (el) => {
	// 	var range = document.createRange();
	// 	//返回用户当前的选区
	// 	var sel = document.getSelection();
	// 	//获取当前光标位置
	// 	var offset = sel.focusOffset
	// 	//div当前内容
	// 	var content = el.innerHTML
	// 	//添加换行符\n
	// 	el.innerHTML = content.slice(0, offset) + '\n' + content.slice(offset)
	// 	//设置光标为当前位置
	// 	range.setStart(el.childNodes[0], offset + 1);
	// 	//使得选区(光标)开始与结束位置重叠
	// 	range.collapse(true);
	// 	//移除现有其他的选区
	// 	sel.removeAllRanges();
	// 	//加入光标的选区
	// 	sel.addRange(range);
	// }
	
	/**
	 * 处理输入框状态
	 */
	const inputFlag = ref<boolean>(false)
	const focusInput = () => {
		inputFlag.value = true
		input = document.getElementById('ai-input-container');
		defaultHeight.value = input.clientHeight
		emit('updateInputStatus',true)
		emit('getInputHeight',defaultHeight.value)
	}
	const blurInput = () => {
		inputFlag.value = false
		emit('updateInputStatus',false)
	}
	
	/**
	 * 监听列表中点击点击的按钮,回显到输入框
	 */
	watch(()=> propsData.addData,(val) => {
		if(val){
			state.prompt = state.prompt + val
		} 
	})
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
