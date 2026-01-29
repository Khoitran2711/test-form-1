
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const suggestReply = async (feedbackContent: string, department: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bạn là một quản lý chăm sóc khách hàng tại Bệnh viện Đa khoa Ninh Thuận. 
      Hãy viết một câu trả lời chuyên nghiệp, thấu cảm và lịch sự cho phản ánh sau đây từ bệnh nhân. 
      Phản ánh thuộc khoa: ${department}.
      Nội dung phản ánh: "${feedbackContent}".
      Câu trả lời cần:
      1. Cảm ơn vì sự góp ý.
      2. Xin lỗi nếu có trải nghiệm không tốt.
      3. Khẳng định bệnh viện sẽ xác minh và chấn chỉnh (nếu cần).
      4. Giữ phong thái y đức và chuyên nghiệp.
      Trả lời bằng tiếng Việt.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text || "Xin cảm ơn quý khách đã gửi phản ánh. Chúng tôi đã tiếp nhận thông tin và sẽ sớm phản hồi.";
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return "Chúng tôi chân thành cảm ơn ý kiến đóng góp của quý khách. Bệnh viện đã ghi nhận phản ánh tại khoa " + department + " và đang tiến hành kiểm tra làm rõ.";
  }
};
