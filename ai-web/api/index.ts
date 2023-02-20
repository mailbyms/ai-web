import {post} from "@/config/request";
import { GenerateTextRequest,GenerateTextResponse } from "@/model/pages/ModelIndex"

/**
 * 提问以及获取答案
 */
const generateText = (data:GenerateTextRequest) => post<GenerateTextResponse>('/api/generate-text',data)
// const obj = {
// 	prompt:''
// }
// generateText(obj).then(res => {
// 	console.log(res)
// })
export {
	generateText
}