<!-- 
	模块名称：AI问答内容组件
	模块作者：tony
	,maxHeight: `calc(100% - ${inputHeight}px)`
-->
<template>
	<view 
		:class="['ai-content-container border-box']" 
		id="content-container"
		:style="{paddingTop:paddingTop}"
		@touchmove="changeTouchStatus(true)"
		@touchend="changeTouchStatus(false)"
	>
	<!-- id="content" -->
		<scroll-view class="content"  :scroll-y="scrollY" @scroll="scroll" :scroll-top="scrollTop" @scrolltolower="scrolltolower" :lower-threshold="lowerThreshold"
		:style="{height: `calc(${clientHeight}px - ${inputHeight}px - 20rpx)`}"
		>
			<view id="content">
				<view class="common-item border-box title ai-align-items-center ai-justify-content-center">
					<text class="title-text ai-align-items-center ai-display-flex">我是智灵小助手，欢迎找我聊天呀 </text>
					<img src="@/static/img/index/smile.png" class="title-img"/>
				</view>
				<view v-for="(item,index) in list" 
					:key="index" 
					:class="item.prompt ?'text-align-right':'text-align-left'"
				>
					<view :class="['common-item border-box text-align-left',item.prompt ? 'question':'answer' ]">
						<!-- 问题/答案 -->
						<text>{{item.prompt ? item.prompt : item.text}}</text>
						<!-- 加号 -->
						<view 
							class="add-container ai-display-flex ai-align-items-center ai-justify-content-center"
							@click="addContent(item.prompt)" 
							v-show="item.prompt && !loading"
						>
							<view class="addImg ai-display-flex ai-align-items-center ai-justify-content-center">
								<img src="@/static/img/index/add.png" mode="" class="img" />
							</view>
						</view>
						<!-- 答案复制 -->
						<view 
							class="copy answer-copy ai-display-flex ai-align-items-center" 
							v-show="item.text && item.showCopy"
							@click="copy(item.text)"
						>
							<img src="@/static/img/index/copy.png" class="copy-img">
							<text class="answer-copy-text">复制答案</text>
						</view>
					</view>
				</view>
				<!-- 加载效果 -->
				<view class="common-item answer loading" v-if="loading && !ctrlPrintLoading">
					<view class="dot-flashing"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts" setup>
	import {
		defineProps,
		withDefaults,
		watch,
		ref,
		nextTick,
		defineEmits,
		onMounted
	} from "vue";
	import {
		GenerateTextList
	} from "@/model/pages/ModelIndex"
	import {
		os
	} from "@/utils/validate"
	interface Props {
		list: GenerateTextList[]
		loading: boolean
		ctrlPrintLoading: boolean
		focusFlag: boolean
		listLength: number
		inputHeight:number
	}
	const propsData = withDefaults(defineProps < Props > (), {
		list: () => [], //问题与答案
		loading: false, //控制数据过渡效果
		ctrlPrintLoading: false, //控制打印过渡效果
		focusFlag: false, //输入框是否focus状态
		listLength: 0 ,//问题与答案列表长度
		inputHeight:0 //键盘高度
	})
	
	const scrollTop = ref<number>(0)
	const scrollY = ref<boolean>(true)
	/**
	 * 当输入框是focus状态,滚动到页面底部
	 * 因ios点击输入框会导致整体页面向上移,需要通过内边距移动到指定位置
	 */
	const paddingTop = ref < any > (null);
	watch(
		() => propsData.focusFlag,
		(val) => {
			// #ifdef  H5
			// const contentContainer = document.getElementById('content-container');
			const content = document.getElementById('content');
			scrollToBottom()
			if (val) {
				setTimeout(() => {
					scrollY.value = false
				},50)
			}else {
				scrollY.value = true
			}
			if (val && os()) {
					
				if (document.body.clientHeight > content.clientHeight && content.clientHeight !==
					0) {
					// paddingTop.value = document.body.clientHeight - content.clientHeight   - propsData.inputHeight + 'px'
					if(propsData.list.length){
						paddingTop.value = document.body.clientHeight - content.clientHeight   - propsData.inputHeight + 'px'
					}else {
						paddingTop.value =  document.body.clientHeight - (content.clientHeight * 3)   - (propsData.inputHeight * 2.5) + 'px'
					}
					
					
				}
			} else {
				paddingTop.value = null
			}
			// #endif
		}
	)
	
	/**
	 * 监听列表长度变化,滚动到页面底部
	 */
	watch(
		() => propsData.listLength,
		(newVal, oldVal) => {
			// #ifdef  H5
			if (newVal > oldVal) {
				scrollToBottom()
			}
			// #endif
		}
	)
	/**
	 * 添加内容到输入框
	 * @param {string} prompt
	 */
	const emits = defineEmits(['addContent'])
	const addContent = (prompt: string) => {
		emits('addContent', prompt)
	}
	/**
	 * 复制答案
	 * @param {string} text 答案
	 */
	const copy = (text: string) => {
		 uni.setClipboardData({
		      data: text,
		      success () {
		       uni.showToast({
		        title: "复制成功",
		        icon:'none'
		       })
		    },
			fail() {
				uni.showToast({
				 title: "复制失败",
				 icon:'none'
				})
			}
		})
	}
	
	
	//
	watch(() => propsData.list,(newVal) => {
		// console.log('打印');
		if(newVal[newVal.length - 1].text   && lower.value && !touchStatus.value){
			console.log('打印','scrollToBottom')
			const answerList = document.querySelectorAll('.text-align-left');
			const lastAnswer = answerList[answerList.length - 1]
			// console.log(lastAnswer.clientHeight)
			if(lastAnswer.clientHeight > 50){
					lowerThreshold.value = lastAnswer.clientHeight
			}
			scrollToBottom()
			
		}else if(newVal[newVal.length - 1].prompt){
			scrollToBottom()
		}
	},
	{
		deep:true
	}
	)
	
   /**
	* 滚动到底部
    */
	const scrollToBottom = () => {
		// const scrollContent = document.querySelector('.uni-scroll-view-content');
		const scrollContent = document.querySelector('#content');
		 nextTick(() => {
			scrollTop.value = scrollContent.scrollHeight + 1 + Math.random()
			console.log(scrollTop.value);
		})
	}
	const lower = ref<boolean>(false)
	const scroll = (status:any) => {
		const content = document.getElementById('content');
		if(status.detail.scrollHeight - status.detail.scrollTop - content.offsetHeight > lowerThreshold.value){
			lower.value = false
		}else {
			lower.value = true
			if(propsData.ctrlPrintLoading){
				scrollToBottom()
			}
		}
	}
	const scrolltolower = () => {
		lower.value = true
	}
	const lowerThreshold = ref<number>(50)
	
	watch(() => propsData.ctrlPrintLoading ,(newVal) =>{
		if(!newVal){
			lowerThreshold.value = 50
		}
	})
	const touchStatus = ref<boolean>(false)
	const changeTouchStatus = (flag:boolean) => {
		touchStatus.value = flag
	}
	
	const clientHeight = ref<number>(0)
	onMounted(() => {
		// console.log(document.body.clientHeight)
		clientHeight.value = document.body.clientHeight
	})
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
