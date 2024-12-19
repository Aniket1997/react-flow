import axios from "axios";

export const generateSchema = async (prompt) => {
  const response = await axios.post("http://localhost:5000/generate-schema", {
    prompt,
  });
  return response.data;
};
