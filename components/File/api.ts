import { api } from "../../utils/axios";

export async function fileUpload(file: File, token?: string) {
  let formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/file/upload", formData, {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-type": "multipart/form-data",
      type: "formData",
    },
  });
  return response;
}
