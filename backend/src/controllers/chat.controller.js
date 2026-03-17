import {generateResponse} from "../services/ai.service.js";


export const sendMessage = async (req, res) => {
    const { message } = req.body;
    
    const result = await generateResponse(message);

    res.status(200).json({
        success: true,
        message: result
    })
}