import axios from "@/lib/axios";

export const signIn = async (data) => {
  const res = await axios.post("/auth/sign-in", data);
  return res.data;
};

export const signUp = async (data) => {
  const res = await axios.post("/auth/sign-up", data);
  return res.data;
};
