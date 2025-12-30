import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/company`, // dynamically set from .env //Change this to your backend URL in .env
  timeout: 10000, // 10 seconds timeout
});

/**
 * Submit new company details
 */
export const submitCompanyDetails = async (data: any) => {
  try {
    const response = await apiClient.post('/submit-details', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting company details:', error);
    throw error;
  }
};

/**
 * Get existing company details
 */
export const getCompanyDetails = async () => {
  try {
    const response = await apiClient.get('/details');
    return response.data;
  } catch (error) {
    console.error('Error fetching company details:', error);
    return null;
  }
};

/**
 * Update existing company details
 */
export const updateCompanyDetails = async (data: any) => {
  try {
    const response = await apiClient.put('/update-details', data);
    return response.data;
  } catch (error) {
    console.error('Error updating company details:', error);
    throw error;
  }
};