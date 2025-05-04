import axios from "axios";

// Create an Axios instance with a base URL and default configuration
const api = axios.create({
  baseURL: "http://localhost:2345", // Adjust this to your backend API endpoint
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include tokens or other headers if needed
api.interceptors.request.use(
  (config) => {
    // Example: Add authentication token if required
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


// this use to finally send request to create candidate
// => it requre correct createCandidateDto
export const submitApplication = async (data: {
  name: string;
  contact_phone: string;
  contact_email: string;
  role_id: string;
  job_level_id: string;
  resume: string;
}) => {
  // const formData = new FormData();
  // formData.append("name", data.name);
  // formData.append("contact_phone", data.contact_phone);
  // formData.append("contact_email", data.contact_email);
  // formData.append("role_id", data.role_id);
  // formData.append("resume", data.resume);

  // if (data.resume) formData.append("resume", data.resume);

  try {
    const response = await api.post("/candidates", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;
