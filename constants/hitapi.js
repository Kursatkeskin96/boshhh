import axios from "axios";
export const getDetails = async () => {
  const { data } = await axios.get(
    "https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Registration/EmailExists/hello@boshhh.com",
    {
      withCredentials: true,
    }
  );
  return data;
};
