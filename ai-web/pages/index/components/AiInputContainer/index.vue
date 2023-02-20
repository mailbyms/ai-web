<!-- 
	模块名称：AI输入框组件
	模块作者：tony
-->
<template>
	<!-- ai-position-fixed -->
	<view :class="['ai-input-container w100 ai-display-flex ai-justify-content-space-between border-box ']">
		<view class="question-input border-box question-padding" contenteditable="true"  id="textarea" @focus="focusInput" @blur="blurInput"></view>
		<button class="question-send" @click="sendMsg">发送</button>
	</view>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref,
		onMounted,
		defineEmits,
		nextTick
	} from "vue";
	import {
		GenerateTextRequest
	} from "@/model/pages/ModelIndex"
	let textarea = null;
	onMounted(() => {
			textarea = document.getElementById('textarea');
			textarea.addEventListener('keydown',function(event){
				setTimeout(() => {
					state.prompt = textarea.innerText
				})
				if (event.ctrlKey && event.keyCode === 13) {
					//ctrl+enter
					textareaRange(textarea)
				} else if (event.keyCode === 13) {
					//enter
					event.preventDefault() // 阻止浏览器默认换行操作
					return false
				}
			})
			
	})
	const state = reactive <any>({
		prompt:''
	})
	const emit = defineEmits(['sendMsg'])
	const sendMsg = () => {
		if( state.prompt){
			console.log('发送数据', state.prompt)
			textarea.innerHTML = ''
			emit('sendMsg',state.prompt)
			state.prompt = ''
			return
		}
		
	}
	const textareaRange = (el) => {
		var range = document.createRange();
		//返回用户当前的选区
		var sel = document.getSelection();
		//获取当前光标位置
		var offset = sel.focusOffset
		//div当前内容
		var content = el.innerHTML
		//添加换行符\n
		el.innerHTML = content.slice(0, offset) + '\n' + content.slice(offset)
		//设置光标为当前位置
		range.setStart(el.childNodes[0], offset + 1);
		//使得选区(光标)开始与结束位置重叠
		range.collapse(true);
		//移除现有其他的选区
		sel.removeAllRanges();
		//加入光标的选区
		sel.addRange(range);
	}
	const inputFlag = ref<boolean>(false)
	const focusInput = () => {
		inputFlag.value = true
	}
	const blurInput = () => {
		inputFlag.value = false
	}
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
