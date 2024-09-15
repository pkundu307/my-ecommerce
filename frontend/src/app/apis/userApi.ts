import axios from 'axios';

const fetchUserProfile = async () => {
  try {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    // Make a GET request to the API with the token in the headers
    const response = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in Authorization header
      },
    });

    // Handle the response (e.g., log user details)
    console.log('User profile:', response.data);
    return response.data; // Return the user data if needed

  } catch (error) {
    console.error('Error fetching profile:', error);
    // Handle error (e.g., show message to user)
  }
};
