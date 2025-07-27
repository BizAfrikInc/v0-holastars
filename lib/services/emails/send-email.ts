import emailjs from '@emailjs/browser';

const publicKey = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY
const serviceID = process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID



export const sendEmail = async (templateParams:Record<string, string> = {}, templateID: string):Promise<boolean>=>{
  try {
    if (!publicKey || !serviceID) {
      throw new Error('EmailJS public key or service ID is not defined');
    }
    const response = await  emailjs.send(serviceID, templateID, templateParams, {
      publicKey: publicKey,
      limitRate:{
        throttle: 10000,
      }
    })
    return response.status === 200
  } catch (e) {
    return false;
  }
}
