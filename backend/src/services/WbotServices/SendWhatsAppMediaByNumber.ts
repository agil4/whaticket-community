import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetDefaultWhatsAppByUser from "../../helpers/GetDefaultWhatsAppByUser";
import { getWbot } from "../../libs/wbot";

interface Request {
  media: Express.Multer.File;
  userId: number;
  number: string;
  body?: string;
}

const SendWhatsAppMediaByNumber = async ({
  media,
  userId,
  number,
  body
}: Request): Promise<WbotMessage> => {
  try {
    const whatsappByUser = await GetDefaultWhatsAppByUser(userId);
    if (whatsappByUser === null) {
      throw new AppError("ERR_NO_DEF_WAPP_FOUND");
    }

    const wbot = getWbot(whatsappByUser.id);
    const newMedia = MessageMedia.fromFilePath(media.path);
    const sentMessage = await wbot.sendMessage(`${number}@c.us`, newMedia, {
      caption: `\u2004${body}`,
      sendAudioAsVoice: true
    });

    fs.unlinkSync(media.path);

    return sentMessage;
  } catch (err) {
    console.error(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMediaByNumber;
