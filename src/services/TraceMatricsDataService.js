// Import the unmarshall function which converts the dynamoDB JSON format object to a JavaScript object.
//import { useAuth } from '../contexts/auth';
const { unmarshall } = require("@aws-sdk/util-dynamodb");



// This function GETs the the metrics for a specific probe to destination, within a specificed time range, from the back-end.
async function GetTraceMatricsData(dataRequestFilters, token) {
    //const url = `/api/metrics`;

    const url = `https://xw2jihik40.execute-api.us-east-2.amazonaws.com/get_metrics_2_0_0`;
    const destinationProbeId = dataRequestFilters.destinationProbeId;

    // Add table name here so more hidden from end user instead of in local state.
    const reqBody = { tableName: 'mvp-ingest-metrics2', ...dataRequestFilters };

    console.log("Metrics request",JSON.stringify(reqBody));

    try {
        // Use a POST request so that we can can provide detailed filters (found in body) to get the metrics we want.
        let convertedProbeMetricsArray = [];

        // fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //          'x-api-key': '8OPDXlj7ZK5OP3l96G464scmctzx8U96wDujgGA6'
        //         //'Authorization' :`${token}`,
        //     },
        //     body: JSON.stringify(reqBody)
        // })
        // .then(async response => {
        //     if(response.status === 200)
        //     {
            
        //     const data = await response.json();

        //     console.log(data);
      
        //         if (Object.keys(data)[0] == "message" && data.message == "Unauthorized") 
        //         {
                        
        //         }
        //         else {
        //             if (data.body.Items.length !== 0) {
        //                 // Convert each awsJSON formatted object into a JSON object and push it into a new array.
        //                 for (let probeMetricObj of data.body.Items) {
        //                     let convertedProbeMetricObj = unmarshall(probeMetricObj);
        //                     // Then parse the contents of each object's property from JSON format.
        //                     convertedProbeMetricObj.checkMsgBody = JSON.parse(convertedProbeMetricObj.checkMsgBody);
        //                     // Convert checkTime string into Date object for use in graphs.
        //                     convertedProbeMetricObj.checkTime = new Date(convertedProbeMetricObj.checkTime);
        //                     convertedProbeMetricsArray.push(convertedProbeMetricObj);
        //                 }
        //             } else {
        //                 // If there is no data, then push an object with the destinationId that does not have data to be displayed in the UI.
        //                 // Note: The name "destinationIdWithNoData" should no change because it's used in condition blocks in front to verify that no data available.
        //                 convertedProbeMetricsArray.push({ destinationIdWithNoData: destinationProbeId });
        //             }
        //         }
        //     }
        //     else if (response.status === 401) {
        //         signOut();
        //     }
        // })
        // .catch(error => {
        //     this.setState({ errorMessage: error.toString() });
        //     console.error('There was an error!', error);
        // });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 //'x-api-key': '8OPDXlj7ZK5OP3l96G464scmctzx8U96wDujgGA6'
                'Authorization' :`${token}`,
            },
            body: JSON.stringify(reqBody)
        })
        //const data = await response.json();
        
        return response;

    //     console.log("convertedProbeMetricsArray:", convertedProbeMetricsArray);

    //     // Write to local state.
    //    // readData(convertedProbeMetricsArray);
    //    return convertedProbeMetricsArray;

    }
    catch (e) {
        console.log(e);
        return null;
    }
};

export { GetTraceMatricsData }