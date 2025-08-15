import axios from "@/lib/axios";

// Forms
export const getPublicForms = async () => {
  const res = await axios.get(`/form/public/`);
  return res.data;
};

export const getUserForms = async () => {
  const res = await axios.get(`/form/user/`);
  return res.data;
};

export const getFormByShareId = async (shareId) => {
  const res = await axios.get(`/form/shared/${shareId}`);
  return res.data;
};

export const createForm = async (form) => {
  const res = await axios.post("/form", form);
  return res.data;
};

export const updateForm = async (id, updatedFields) => {
  const res = await axios.put(`/form/${id}`, updatedFields);
  return res.data;
};

export const deleteForm = async (id) => {
  const res = await axios.delete(`/form/${id}`);
  return res.data;
};

// Responses
export const getFormResponses = async () => {
  console.log("getFormResponses not implemented.");
};

export const submitResponse = async (formId, answers) => {
  const res = await axios.post(`/form/${formId}/responses`, answers);
  return res.data;
};
