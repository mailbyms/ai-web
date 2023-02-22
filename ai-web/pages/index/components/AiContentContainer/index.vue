<!-- 
	模块名称：AI问答内容组件
	模块作者：tony
-->
<template>
	<view 
		:class="['ai-content-container border-box',!os() ? 
		'ai-content-container-android':'']" 
		id="content-container"
		:style="{paddingTop:paddingTop}"
	>
		<view class="content" id="content">
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
	</view>
</template>

<script lang="ts" setup>
	import {
		defineProps,
		withDefaults,
		watch,
		ref,
		nextTick,
		defineEmits
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
	}
	const propsData = withDefaults(defineProps < Props > (), {
		list: () => [], //问题与答案
		loading: false, //控制数据过渡效果
		ctrlPrintLoading: false, //控制打印过渡效果
		focusFlag: false, //输入框是否focus状态
		listLength: 0 //问题与答案列表长度
	})
	
	
	
	/**
	 * 当输入框是focus状态,滚动到页面底部
	 * 因ios点击输入框会导致整体页面向上移,需要通过内边距移动到指定位置
	 */
	const paddingTop = ref < any > (null);
	watch(
		() => propsData.focusFlag,
		(val) => {
			// #ifdef  H5
			const content = document.getElementById('content');
			const contentContainer = document.getElementById('content-container');
			if (val) {
				nextTick(() => {
					contentContainer.scrollTo({
						top: content.offsetHeight,
						behavior: "smooth", //  smooth(平滑滚动),instant(瞬间滚动),默认auto
					});
				})
			}
			if (val && os()) {
				if (document.body.clientHeight > contentContainer.clientHeight && contentContainer.clientHeight !==
					0) {
					paddingTop.value = document.body.clientHeight - contentContainer.clientHeight + 'px'
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
			const content = document.getElementById('content');
			const contentContainer = document.getElementById('content-container');
			if (newVal > oldVal) {
				nextTick(() => {
					contentContainer.scrollTo({
						top: content.offsetHeight,
						behavior: "smooth", //  smooth(平滑滚动),instant(瞬间滚动),默认auto
					});
				})
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
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
