import axios from "@/lib/axios";

export const sendEmail = async ({
  email,
  formType,
  title,
  description,
  url,
}) => {
  const res = await axios.post(`/email/send-link`, {
    email,
    formType,
    title,
    description,
    url,
  });
  return res.data;
};
