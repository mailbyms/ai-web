<!-- 
	模块名称：AI输入框组件
	模块作者：tony
-->
<template>
	<view 
		:class="['ai-input-container w100 ai-display-flex ai-justify-content-space-between border-box ai-position-fixed']" id="ai-input-container"
		:style="{bottom:`${bottom}px`}"
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
		<!-- @focus="focusInput" @input="focusInput" :auto-height="true"-->
		// #ifdef  H5
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
		// #endif
		// #ifdef  MP-WEIXIN
		 <textarea
		 	class="question-input border-box question-padding question-input-wx" 
			:style="{height:`${textareaHeight}px`}"
		 	v-model="state.prompt" 
		 	placeholder="请输入" 
		 	confirm-type="done" 
		 	:maxlength="-1"
		 	:disable-default-padding="true"
			:adjust-position="false"
			:show-confirm-bar="false"
		 	@focus="focusInput"
		 	@blur="blurInput"
		 	@confirm="sendMsg"
			@linechange="linechangeInput"
		 />
		 // #endif
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
		watch,
		getCurrentInstance
	} from "vue";
	interface Props {
		loading:boolean
		focusFlag:boolean
		addData?:string
		ctrlPrintLoading:boolean
	}
	const emit = defineEmits(['sendMsg','updateInputStatus','getInputHeight','getKeyCode'])
	let defaultHeight = ref<number>(0)
	
	onMounted(() => {
		textareaListen()
	})
	/**
	 *监听输入框状态 
	 */
	const instance = getCurrentInstance();
	const textareaListen = () => { 
		 //小程序方法
		let query = uni.createSelectorQuery().in(instance);
		query.select('#ai-input-container ').
		fields({ size:true,dataset: true, rect: true, id: true,context:true },
		(e:any) => {});
		query.exec(eles => {
			defaultHeight.value = eles[0].height
			emit('getInputHeight',defaultHeight.value)
		})
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
			textareaHeight.value = null
			return
		}
		uni.showToast({
			title:'请输入内容哟~',
			icon:'none'
		})
		state.prompt = null
	}
	
	
	/**
	 * 处理输入框状态
	 */
	// const inputFlag = ref<boolean>(false)
	const bottom = ref<number>(0)
	const focusInput = (e:any) => {
		 // #ifdef  MP-WEIXIN
			// = e.target.height.toString()
			bottom.value = e.target.height
		// #endif		
		 // #ifdef  H5
		let query = uni.createSelectorQuery().in(instance);
		query.select('#ai-input-container ').
		fields({ size:true,dataset: true, rect: true, id: true,context:true },
		(e:any) => {console.log(e)});
		query.exec(eles => {
			defaultHeight.value = eles[0].height
			emit('getInputHeight',defaultHeight.value)
			emit('updateInputStatus',true)
		})
		 // #endif

	}
	const blurInput = () => {
		// #ifdef  H5
		emit('updateInputStatus',false)
		 // #endif
		// #ifdef  MP-WEIXIN
			bottom.value = 0
		// #endif
	}
	const textareaHeight = ref<number>(null)
	const linechangeInput = (event:any) => {
		if(event.detail.lineCount === 1){
			textareaHeight.value = null
			return
		}
		textareaHeight.value = event.detail.lineCount * event.detail.height
	}
	/**
	 * 监听列表中点击点击的按钮,回显到输入框
	 */
	watch(()=> propsData.addData,(val) => {
		if(val){
			state.prompt = state.prompt + val
		} 
	})
	 // #ifdef  MP-WEIXIN
	watch(() => state.prompt,(val) => {
		console.log(val.indexOf('\n') != -1)
		if(val.indexOf('\n') != -1){
			uni.hideKeyboard() //收起软键盘
			sendMsg()
		}
		
	})
	// #endif
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
