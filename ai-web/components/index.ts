import type { App } from 'vue';
import AIHeader from "./AI-Header/index.vue";

export default function Component(app:App){
	app.component('ai-header',AIHeader);
}