<!-- 
	模块名称：AI问答内容组件
	模块作者：tony
-->
<template>
	<view :class="['ai-content-container border-box',!os() ? 'ai-content-container-android':'']"  id="content-container" :style="{paddingTop:paddingTop}">
		<view class="content" id="content">
			<view v-for="(item,index) in list" :key="index" :class="item.prompt ?'text-align-right':'text-align-left'">
				<view :class="['common-item border-box text-align-left',item.prompt ? 'question':'answer' ]">
					<!-- 问题/答案 -->
					<text>{{item.prompt ? item.prompt : item.text}}</text>
					<!-- 加号 -->
					<view class="add-container  ai-display-flex ai-align-items-center ai-justify-content-center" @click="addContent(item.prompt)" v-show="item.prompt && !loading">
						<view class="addImg ai-display-flex ai-align-items-center ai-justify-content-center" >
							<image src="@/static/img/index/add@2x.png" mode="" class="img"></image>
						</view>
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
	import { os } from "@/utils/validate"
	interface Props {
		list:GenerateTextList[]
		loading:boolean
		ctrlPrintLoading:boolean
		focusFlag:boolean
		listLength:number
	}
	const propsData = withDefaults(defineProps<Props>(),{
		list: () => [],
		loading:false,
		ctrlPrintLoading:false,
		focusFlag:false,
		listLength:0
	})
	const emits = defineEmits(['addContent'])
	const paddingTop = ref<any>(null);
	watch(
	      () => propsData.focusFlag,
	      (val) => {
			const content = document.getElementById('content');
			const contentContainer = document.getElementById('content-container');
			console.log(os(),document.body.clientHeight,contentContainer.clientHeight);
	        if (val) {
				nextTick(() => {
					contentContainer.scrollTo({
						top: content.offsetHeight,
						behavior: "smooth", //  smooth(平滑滚动),instant(瞬间滚动),默认auto
					});
				})
	        }
			if(val && os()){
				if(document.body.clientHeight > contentContainer.clientHeight && contentContainer.clientHeight !== 0){
					paddingTop.value = document.body.clientHeight - contentContainer.clientHeight + 'px'
				}
			}else {
				paddingTop.value = null
			}
	      }
	)
		
	watch(
	  () => propsData.listLength,
	  (newVal,oldVal) => {
		const content = document.getElementById('content');
		const contentContainer = document.getElementById('content-container');
		if(newVal > oldVal){
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
	const addContent = (prompt:string) => {
		emits('addContent',prompt)
	}
</script>

<style lang="scss" scoped>
	@import "index.scss";
</style>