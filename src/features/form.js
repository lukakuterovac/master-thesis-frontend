import axios from "@/lib/axios";

export const createForm = async (form) => {
  const res = await axios.post("/form", form);
  return res.data;
};

export const updateForm = async (form) => {
  const res = await axios.put(`/form/${form._id}`, form);
  return res.data;
};

export const deleteForm = async (form) => {
  const res = await axios.delete(`/form/${form._id}`);
  return res.data;
};
