//add the imports
import React, { useState, useEffect } from "react";

import { getHistoryWeatherDataApi } from "../../util/ApiUtil";

import DisplayWeatherData from "../CurrentWeatherData/DisplayWeatherData";

import NoHistoryWeatherPresent from "./NoHistoryWeatherPresent";

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

//import toast
import { toast } from "react-hot-toast";

import TokenExpirationPage from "../TokenExpirationPage/TokenExpirationPage";

const HistoryWeatherData = ({ currentUser }) => {

  //result-store the history weather data results into an array
  const [results, setResults] = useState([]);
  //tokenExpired: used to track whether or not the user's authentication token has expired
  const [tokenExpired, setTokenExpired] = useState(false);
  //data: used to track if there is any history weather data available
  const [data, setData] = useState(null);
  //loading: used to show/hide the loading indicator
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResults();
  }, []);


  const getMyResults = async () => {
    setLoading(true);

    const apiResponse = await getHistoryWeatherDataApi(currentUser.token);

    if (apiResponse.status === 1 && apiResponse.payLoad.length > 0) {
      setResults(apiResponse.payLoad);
      setData(true);
      setLoading(false);
    } else if (apiResponse.status === 1 && apiResponse.payLoad.length === 0) {
      setData(false);
      setLoading(false);
    } else if (apiResponse.status === 0 && apiResponse.payLoad === "Token has Expired") {
      // Check for token expiration
      setTokenExpired(true);
      setLoading(false);
    } else {
      // Handle other cases, errors from the API
      toast(apiResponse.payLoad);
    }

  };


  //show the loading indicator if the data is being loaded
  if (loading) {
    return <LoadingIndicator />;
  }

  //if the session has expired render TokenExpirationPage
  if (tokenExpired) {
    return <TokenExpirationPage />;
  }

  //if there is no history weather data available, render the NoHistoryWeatherPresent component
  if (data === false) {
    return (
      <div className="flex items-center justify-center">
        <NoHistoryWeatherPresent />;
      </div>
    );
  }
  //if there is history weather data available, render the DisplayWeatherData component for each result
  else {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="bg-black/20  text-purple-900 backdrop-blur-[80px] py-12 px-6 rounded-lg overflow-hidden"
          >
            <DisplayWeatherData apiResponse={item} />
          </div>
        ))}
      </div>
    );
  }
};

export default HistoryWeatherData;