import { Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetDefaultWhatsAppByUser from "../../helpers/GetDefaultWhatsAppByUser";
import { getWbot } from "../../libs/wbot";

interface Request {
  body: string;
  number: string;
  userId: number;
}

const SendWhatsAppMessageByNumber = async ({
  body,
  number,
  userId
}: Request): Promise<WbotMessage> => {
  const whatsappByUser = await GetDefaultWhatsAppByUser(userId);
  if (whatsappByUser === null) {
    throw new AppError("ERR_NO_DEF_WAPP_FOUND");
  }

  const wbot = getWbot(whatsappByUser.id);

  try {
    const sentMessage = await wbot.sendMessage(`${number}@c.us`, body);

    return sentMessage;
  } catch (err) {
    console.error(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessageByNumber;
