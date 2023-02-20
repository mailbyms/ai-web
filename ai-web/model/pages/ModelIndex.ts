// 
export interface GenerateTextRequest{
	prompt:string
}

export interface GenerateTextResponse{
	conversationId:string //
	text:string //内容
	id:string //消息id
}
