import api from '../../src/routes/Enpoint';

export const tokenStatus = async () => {
  const userToken = localStorage.getItem('token');

  if (userToken != null) {
    const headers = {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    };

    try {
      const response = await api.get("verify-token", headers);

      if (response.data.message === "Invalid token.") return { status: false};
      else 
      {
        const userDetails = await api.get("userDetails", headers);

        return {status:true, data: userDetails.data.data};
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return false;
};