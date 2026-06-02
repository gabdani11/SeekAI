import { tavily } from '@tavily/core';

async function getDataFromInternet({query})
{
    try{
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
        const response = await tvly.search(query,{search_depth:"basic", max_results:5}) //searchdept for control speed and quality,max result for control context size
        console.log("Response from internet service:", response)
        return JSON.stringify(response)
    }catch(error)
    {
        console.error("Error fetching data from the internet:", error)
        throw error
    }

}
export default getDataFromInternet