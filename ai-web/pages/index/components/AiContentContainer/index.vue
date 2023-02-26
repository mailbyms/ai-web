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
		@touchstart="changeTouchStatus(true)"
		@touchmove="changeTouchStatus(true)"
		@touchend="changeTouchStatus(false)"
	>
			<scroll-view class="content"  :scroll-y="true" :scroll-top="scrollTop"  
			:lower-threshold="lowerThreshold" @scrolltolower="scrolltolower"
			@scroll="scroll"
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
		onMounted,
		getCurrentInstance
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
	const instance = getCurrentInstance();
	/**
	 * 当输入框是focus状态,滚动到页面底部
	 * 因ios点击输入框会导致整体页面向上移,需要通过内边距移动到指定位置
	 */
	const paddingTop = ref < any > (null);
	watch(
		() => propsData.focusFlag,
		(val) => {
			let query = uni.createSelectorQuery().in(instance);
			query.select('#content').
			fields({ size:true,dataset: true, rect: true, id: true,context:true },
			(e:any) => {console.log(e)});
			query.exec(eles => {
				scrollToBottom()
				if (val) {
					setTimeout(() => {
						scrollY.value = false
						// console.log('propsData.focusFlag-true',scrollY.value);
					},50)
				}else {
					scrollY.value = true
					// console.log('propsData.focusFlag-false',scrollY.value);
				}
				if (val && os()) {
					if (uni.getWindowInfo().windowHeight > eles[0].height && eles[0].height !==
						0) {
						if(propsData.list.length){
							paddingTop.value = uni.getWindowInfo().windowHeight - eles[0].height   - propsData.inputHeight + 'px'
						}else {
							paddingTop.value =  uni.getWindowInfo().windowHeight - (eles[0].height * 3)   - (propsData.inputHeight * 2.5) + 'px'
						}	
					}
				} else {
					paddingTop.value = null
				}
			})
		
		}
	)
	
	/**
	 * 监听列表长度变化,滚动到页面底部
	 */
	watch(
		() => propsData.listLength,
		(newVal, oldVal) => {
			if (newVal > oldVal) {
				scrollToBottom()
			}
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
		let query = uni.createSelectorQuery().in(instance);
		
		if(newVal[newVal.length - 1].text  && lower.value && !touchStatus.value){
			query.selectAll('.text-align-left').
			fields({ size:true,dataset: true, rect: true, id: true,context:true },
			(e:any) => {});
			query.exec(eles => {
				const list = eles[0]
				const lastAnswer = list[list.length - 1]
				// console.log('query',lastAnswer.height);
				if(lastAnswer.height > 50){
						lowerThreshold.value = lastAnswer.height
				}else {
					scrollToBottom()
				}
			})
		} else if(newVal[newVal.length - 1].prompt){
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
		let query = uni.createSelectorQuery().in(instance);
		query.select('#content').
		fields({ size:true,dataset: true, rect: true, id: true,context:true,scrollOffset: true },
		(e:any) => {});
		query.exec(eles => {
			nextTick(() => {
				scrollTop.value =  eles[0].height + 1 + Math.random()
			})
		})
		
	}
	const lower = ref<boolean>(false)
	const scroll = (status:any) => {
		let query = uni.createSelectorQuery().in(instance);
		query.select('#content').
		fields({ size:true,dataset: true, rect: true, id: true,context:true },
		(e:any) => {console.log(e)});
		query.exec(ele => {
			
			const result = ele[0]
			if((result.bottom + status.detail.scrollTop -  result.height) < lowerThreshold.value){
				// console.log((result.bottom + status.detail.scrollTop -  result.height) , lowerThreshold.value);
				lower.value = true
				if(propsData.ctrlPrintLoading && !touchStatus.value){
					console.log('!touchStatus.value',!touchStatus.value);
					scrollToBottom()
				}
			}else {
				lower.value = false
			}
		})
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
		console.log('changeTouchStatus',flag)
	}
	
	const clientHeight = ref<number>(0)
	onMounted(() => {
		clientHeight.value = uni.getWindowInfo().windowHeight
	})
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
