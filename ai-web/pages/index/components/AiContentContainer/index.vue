<!-- 
	模块名称：AI问答内容组件
	模块作者：tony
-->
<template>
	<view :class="['ai-content-container border-box',!os() ? 'ai-content-container-android':'']" id="content-container"
		:style="{paddingTop:paddingTop}">
		<view class="content" id="content">
			<view v-for="(item,index) in list" :key="index" :class="item.prompt ?'text-align-right':'text-align-left'">
				<view :class="['common-item border-box text-align-left',item.prompt ? 'question':'answer' ]">
					<!-- 问题/答案 -->
					<text>{{item.prompt ? item.prompt : item.text}}</text>
					<!-- 加号 -->
					<view class="add-container  ai-display-flex ai-align-items-center ai-justify-content-center"
						@click="addContent(item.prompt)" v-show="item.prompt && !loading">
						<view class="addImg ai-display-flex ai-align-items-center ai-justify-content-center">
							<image src="@/static/img/index/add@2x.png" mode="" class="img"></image>
						</view>
					</view>
					<!-- 答案复制 -->
					<view class="copy answer-copy ai-display-flex ai-align-items-center" v-show="item.text"
						@click="copy(item.text)">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-fuzhi"></use>
						</svg>
						<text class="answer-copy-text">复制答案</text>
					</view>
				</view>
			</view>
			<!-- 加载效果 -->
			<view class="common-item answer loading" v-show="loading && !ctrlPrintLoading">
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
	import Clipboard from 'clipboard'
	interface Props {
		list: GenerateTextList[]
		loading: boolean
		ctrlPrintLoading: boolean
		focusFlag: boolean
		listLength: number
	}
	const propsData = withDefaults(defineProps < Props > (), {
		list: () => [],
		loading: false,
		ctrlPrintLoading: false,
		focusFlag: false,
		listLength: 0
	})
	const emits = defineEmits(['addContent'])
	const paddingTop = ref < any > (null);
	watch(
		() => propsData.focusFlag,
		(val) => {
			const content = document.getElementById('content');
			const contentContainer = document.getElementById('content-container');
			console.log(os(), document.body.clientHeight, contentContainer.clientHeight);
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
		}
	)

	watch(
		() => propsData.listLength,
		(newVal, oldVal) => {
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
		}
	)
	/**
	 * 添加内容到输入框
	 * @param {string} prompt
	 */
	const addContent = (prompt: string) => {
		emits('addContent', prompt)
	}
	/**
	 * 复制答案
	 * @param {string} text 答案
	 */
	const copy = (text: string) => {
		console.log(text)
		const clipboard = new Clipboard('.copy', {
			text: function() {
				return text
			}
		})
		clipboard.on('success', (e) => {
			// console.log(e)
			uni.showToast({
				title: "复制成功",
				icon: "none"
			})
			// 释放内存
			clipboard.destroy()
		})
		clipboard.on('error', (e) => {
			// console.log(e)
			// 不支持复制
			uni.showToast({
				title: "复制失败",
				icon: "none"
			})
			// 释放内存
			clipboard.destroy()
		})
	}
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>
