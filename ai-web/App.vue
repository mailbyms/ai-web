<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style  lang="scss">
	// #app{
	// 	background-color: orange;
	// 	height: 600rpx;
	// 	position: fixed;
	// 	// top: 0;
	// 	bottom: 0;
	// 	overflow: hidden;
	// }
	/*每个页面公共css */

	//全局
	@import "@/static/css/index.scss";	
</style>
