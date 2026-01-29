
import { GoogleGenAI } from "@google/genai";

export const suggestReply = async (feedbackContent: string, department: string): Promise<string> => {
  try {
    // Khởi tạo instance mới mỗi lần gọi để đảm bảo lấy đúng API_KEY từ môi trường Vercel/Vite
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    if (!process.env.API_KEY) {
      console.warn("Cảnh báo: Thiếu API_KEY cho Gemini.");
      return "Cảm ơn quý khách đã gửi phản ánh về " + department + ". Chúng tôi chân thành ghi nhận và sẽ phản hồi trong thời gian sớm nhất.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bạn là quản lý chất lượng chuyên nghiệp tại Bệnh viện Đa khoa Ninh Thuận. 
      Viết phản hồi cho bệnh nhân tại khoa: ${department}.
      Nội dung họ phản ánh: "${feedbackContent}".
      Yêu cầu: Lịch sự, thấu cảm, cam kết chấn chỉnh. Trả lời bằng tiếng Việt.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Chúng tôi đã tiếp nhận phản ánh của quý khách và đang xử lý.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bệnh viện Đa khoa Ninh Thuận chân thành cảm ơn ý kiến của quý khách. Chúng tôi sẽ làm việc với khoa " + department + " để nâng cao chất lượng dịch vụ.";
  }
};
