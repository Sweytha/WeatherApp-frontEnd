//here we import axios and call all the API's used in the backend
import axios from "axios";
import { API_BASE_URL } from "../common/constants";

const frameToken = (token) => `Bearer ${token}`;

const frameResponse = (
    reqStatus = 0,
    reqPayLoad = "Invalid request. Please try again later."
) => {
    return {
        status: reqStatus,
        payLoad: reqPayLoad,
    };
};

//signUp API from the backend
export const signUpApi = async (
    firstName,
    lastName,
    username,
    phone,
    emailId,
    password
) => {
    let response = frameResponse();
    try {
        const url = `${API_BASE_URL}/user/signup`;
        const apiResponse = await axios.post(url, {
            firstName,
            lastName,
            username,
            phone,
            emailId,
            password,
        });
        if (apiResponse.status === 200) {
            response = frameResponse(1);
        }
    } catch (err) {
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
        console.log(err);
    } finally {
        return response;
    }
};

//verify email API from the backend which requires token(verification code) to be passed to the header
export const verifyEmailApi = async (token) => {
    let response = frameResponse();
    try {
        const url = `${API_BASE_URL}/user/verify/email`;
        const headers = { headers: { Authorization: frameToken(token) } };
        const apiResponse = await axios.get(url, headers);
        if (apiResponse.status === 200) {
            response = frameResponse(1, apiResponse.data);
        }
    } catch (err) {
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
        console.log(err);
    } finally {
        return response;
    }
};

//login API from the backend
export const loginApi = async (username, password) => {
    let response = frameResponse();
    try {
        const url = `${API_BASE_URL}/user/login`;
        const apiResponse = await axios.post(url, { username, password });
        if (apiResponse.status === 200) {
            const payLoad = {
                token: apiResponse.headers.authorization, // the authorization token is present in response headers
                username: apiResponse.data.username,
            };
            response = frameResponse(1, payLoad);
        }
    } catch (err) {
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
    } finally {
        return response;
    }
};

//ResetPasswordEmail API from the backend which requires email to be passed from the front-end
export const resetEmailLinkApi = async (emailId) => {
    let response = frameResponse();
    try {
        const url = `${API_BASE_URL}/user/reset/${emailId}`;
        const apiResponse = await axios.get(url);
        if (apiResponse.status === 200) {
            response = frameResponse(1);
        }
    } catch (err) {
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
        console.log(err);
    } finally {
        return response;
    }
};

//resetPassword API from the backend which requires token and password to be passed
export const resetPasswordApi = async (token, password) => {
    let response = frameResponse();
    try {
        const url = `${API_BASE_URL}/user/reset?password=${password}`; // password is passed as request parameter
        const headers = { headers: { Authorization: frameToken(token) } };
        //in POST the second parameter is body ,since we dont have it, its set to null
        const apiResponse = await axios.post(url, null, headers);

        if (apiResponse.status === 200) {
            response = frameResponse(1);
        }
    } catch (err) {
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
        console.log(err);
    } finally {
        return response;
    }
};

// This function gets weather data from an API using axios and returns the response
// Parameters:
// - token: a string representing the user's authentication token
// - location: a string representing the location to get weather data for
// - save: a boolean indicating whether or not to save the weather data
export const getWeatherDataApi = async (token, location, save) => {
    // Build the URL to the weather API endpoint based on the location and save parameters
    const url = `${API_BASE_URL}/weathers/${location}/${save}`;

    // Set the headers for the HTTP request, including the user's authentication token
    const headers = {
        headers: { Authorization: frameToken(token) },
    };

    // Make a GET request to the API endpoint using axios, passing in the URL and headers
    const apiResponse = await axios.get(url, headers);

    // Return the response from the API
    return apiResponse;
};


// API to fetch all weather data searched by the user
export const getHistoryWeatherDataApi = async (token) => {
    let response = frameResponse(); // Initialize response variable to undefined
    try {
        const url = `${API_BASE_URL}/weathers`; // API endpoint to fetch weather data
        const headers = { headers: { Authorization: frameToken(token) } }; // Pass token in the request headers
        const apiResponse = await axios.get(url, headers); // Make API call to fetch weather data
        if (apiResponse.status === 200) { // Check if response status is success
            // If successful, set the response variable to the data received
            response = frameResponse(1, apiResponse.data);
        }
    } catch (err) { // Catch any errors that may occur during the API call
        if (err.response) {
            response = frameResponse(0, err.response.data.message);
        }
        console.log(err); // Log the error in the console

    } finally { // Regardless of success or failure, return the response variable
        return response;
    }
};
