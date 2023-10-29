import api from '../../src/routes/Enpoint'

export const tokenStatus = async () => {
    const userToken = localStorage.getItem('token');

    if(userToken != null)
    {
        const headers = {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        };

        const response = await api.get("verify-token",headers);
        
        if( response.data.message == "Invalid token.") return false;
        else return true;
    }
    
    return false;
};