// 
export interface GenerateTextRequest{
	prompt:string //问题
	sessionId?:string //除第一次后以后问题填入会话id
	pid?:string //除第一次后以后问题填入id
}

export interface GenerateTextResponse{
	conversationId:string //会话id
	text:string //内容/答案
	id:string //消息id
}
/**
 * AI问答列表
 */
export interface GenerateTextList {
	prompt?:string //问题
	text?:string //内容/答案
}
