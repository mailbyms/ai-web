import {post} from "@/config/request";
import { GenerateTextRequest,GenerateTextResponse } from "@/model/pages/ModelIndex"

/**
 * 提问以及获取答案
 */
export const generateText = (data:GenerateTextRequest) => post<GenerateTextResponse>('/api/generate-text',data)

