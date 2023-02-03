import { unmarshall } from '@aws-sdk/util-dynamodb';
import { useDispatch } from 'react-redux';
import { regionanddestinationAction } from '../store/actions/CustomerAction';
import axios from './customAxios';


const PROBES_TABLE_URL = 'https://xnuoz7c495.execute-api.us-east-2.amazonaws.com/probeTable_v_1_0_0';
const REGIONS_TABLE_URL = 'https://ijyfzw78x2.execute-api.us-east-2.amazonaws.com/regions_API_v_2_0_0';
const CUSTOMERS_TABLE_URL = 'https://o97rs2vh5e.execute-api.us-east-2.amazonaws.com/CustomerTableAPI_v_2_0_0';

export async function sendCustomerRequest(token, insertdata, method) {
    // const URL = '/api/regions';
     const URL = CUSTOMERS_TABLE_URL;
     
     try {
         const response = await fetch(URL, {
             method : `${method}`,
             headers: {
                 //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                 'Authorization' :`${token}`,
                 'Content-Type': 'application/json'
             },
             body: `${JSON.stringify(insertdata)}`
 
             
         })
         const data = await response.json();
         console.log(data);
         return data;
     }
     catch (e) {
         console.log(e);
         return null;
     }
   }


async function getcustNew(token) {
   // const url = `https://27d8cq8ta8.execute-api.ap-south-1.amazonaws.com/v1`;
    // const url = `https://8gbfk1tdn0.execute-api.ap-south-1.amazonaws.com/v2`;
    const url = `https://8u7em4q19l.execute-api.ap-south-1.amazonaws.com/withoutcors`;
    try {
        // axios
        // .get(`${CUSTOMERS_TABLE_URL}`)
        // .then((response) => {
        //   console.log(response);
        //   return response;
        //  // setSuperHeroJSON(response);
        // })
        // .catch((error) => {
        //   console.log(error);
        //   return error;
        // });
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                'Authorization' :`${token}`,
            },
        })
        const data = await response.json();
        console.log(response);

        let convertedCustomersArray = [];
       // Convert each awsJSON formatted object into a JSON object and push it into a new array.
         for (let customerObj of data.body.Items) {
             convertedCustomersArray.push(unmarshall(customerObj));
         }
        //  for (let customerObj of data.body.Items) {
        //     convertedCustomersArray.push(customerObj);
        // }
         return convertedCustomersArray;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
}

async function getCustomers(token) {
   // const url = `/api/customers`;
    const url = `https://o97rs2vh5e.execute-api.us-east-2.amazonaws.com/CustomerTableAPI_v_2_0_0`;

    try {
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                'Authorization' :`${token}`,
            },
        })
        const data = await response.json();
        console.log(response);


          let convertedCustomersArray = [];

          // Convert each awsJSON formatted object into a JSON object and push it into a new array.
           for (let customerObj of data.body.Items) {
               convertedCustomersArray.push(unmarshall(customerObj));
           }
           
           return convertedCustomersArray;

        // Write to context.
       // readData(formattedAccountInfoObject);

    }
    catch (e) {
        console.log(e);
        return null;
    }
};



// export function getCustomerRegionsProbes(electedCustomer) {
//     const tokenDetailsString = localStorage.getItem('userDetails');
//     let tokenDetails = '';
//     if (!tokenDetailsString) {
//         dispatch(logout(history));
//         return;
//     }
//     tokenDetails = JSON.parse(tokenDetailsString);
//     // let expireDate = new Date(tokenDetails.expireDate);
//     // let todaysDate = new Date();

//     // if (todaysDate > expireDate) {
//     //     dispatch(logout(history));
//     //     return;
//     // }
//     dispatch(loginConfirmedAction(tokenDetails));

//     //const timer = expireDate.getTime() - todaysDate.getTime();
//     //runLogoutTimer(dispatch, timer, history);
// }
async function getRegionsProbesByCustomer(selectedCustomer,token,dispatch) {
    
    // regionsArray format:
    /* [
            {
                region: "regionName",
                description: "region description",
                probes: []
            }
        ]
    */
    let regionsArray = [];  // Stores regions data.

    // probesArray and destinationsArray format:
    /* [
            {
                pregion: "",
                localIP: "",
                customerId: "",
                natIP: "",
                probeId: "",
                probeName: ""
            }
        ]
    */
    let probesArray = [];   // Stores probes data.
    let destinationsArray = []; // Stores destinations data.
    let probes=[];
    let regionsResponse = getCustomerRegions(selectedCustomer,token);    // Get the regions data from back-end.

    regionsResponse.then(regionsResult => {
        regionsArray = regionsResult;

        let probesResponse = getCustomerProbes(selectedCustomer,token);  // Get probes data from back-end.

        probesResponse.then(probesResult => {
            probesArray = probesResult.convertedProbesArray;
            destinationsArray = probesResult.convertedDestinationsArray;
            // for (let source of probesArray){
            //     source.ptype="probe";
            // }
            
            // for (let source of destinationsArray){
            //     source.ptype="destination";
            // }
            // combine source probe and destination probe
            for (let source of probesArray){
                probes.push({
                    ptype:"probe",
                    pregion: source.pregion,
                    probeId: source.probeId,
                    probeName: source.probeName,
                    localIP: source.localIP,
                    natIP: source.natIP,
                    customerId: source.customerId
            })
               
            }
            for (let destination of destinationsArray){
                probes.push({
                    ptype:"destination",
                    pregion: destination.pregion,
                    probeId: destination.probeId,
                    probeName: destination.probeName,
                    localIP: destination.localIP,
                    natIP: destination.natIP,
                    customerId: destination.customerId
            })
               
            }
            // Desired format:
            /* {
                regions: [
                    {
                        region: "regionName",
                        description: "region description",
                        probes: [{
                            localIP: "",
                            customer: "",
                            natIP: "",
                            probeId: "",
                            name: "",
                            events: []
                        }]
                    }
                ],
                destinations: [
                    {
                        localIP: "",
                        customer: "",
                        natIP: "",
                        probeId: "",
                        name: ""
                    }
                ]
                 probes: [
                    {
                        pregion: "",
                        natIP: "",
                        probeId: "",
                        probeName: "",
                        localIP: "",
                        customerId: "",
                        ptype: ""
                    }
                ]
            }
            */
            let formattedProbesDataObject = {
                regions: regionsArray,
                destinations: [],
                probes:probes
            }
            
            // Iterate through probes and add the probe (with slightly varied format) to the region.probes array for their corresponding region.
            for (let probe of probesArray) {
                for (let region of formattedProbesDataObject.regions) {
                    if (probe.pregion === region.region) {
                        region.probes.push({
                            probeId: probe.probeId,
                            name: probe.probeName,
                            localIP: probe.localIP,
                            natIP: probe.natIP,
                            customer: probe.customerId,
                            events: []
                        })
                        break;
                    }
                }
            }
             // Iterate through probes and add the probe (with slightly varied format) to the region.probes array for their corresponding region.
            //  for (let probe of probesArray) {
            //     for (let region of formattedProbesDataObject.regions) {
            //         if (probe.pregion === region.region) {
            //             probes.push({
            //                 probeId: probe.probeId,
            //                 name: probe.probeName,
            //                 localIP: probe.localIP,
            //                 natIP: probe.natIP,
            //                 customer: probe.customerId,
            //                 events: []
            //             })
            //             break;
            //         }
            //     }
            // }    
            // Format destination aboject and push into the destinations array property.
            for (let destination of destinationsArray) {
                formattedProbesDataObject.destinations.push({
                    probeId: destination.probeId,
                    name: destination.probeName,
                    localIP: destination.localIP,
                    natIP: destination.natIP,
                    customer: destination.customerId,
                })
            }

            console.log("formattedProbesDataObject:", formattedProbesDataObject)

            // Write to context.
            dispatch(regionanddestinationAction(formattedProbesDataObject));
            return formattedProbesDataObject;
            //readData(formattedProbesDataObject);
        })
            .catch(error => {
                console.log("ERROR: ", error);
            })
    })
        .catch(error => {
            console.log("ERROR:", error)
        })

};
// This function GETs the currently selected customer's probes data (separated as probes and destinations).
async function getCustomerProbes(selectedCustomer,token) {
    //const url = `${PROBES_TABLE_URL}/${selectedCustomer}`;
   // const url =`probeTable_v_1_0_0/${selectedCustomer}`;
  //  const url = `api/probes/${selectedCustomer}`;
    const url = `${PROBES_TABLE_URL}?customerId=${selectedCustomer}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                'Authorization' :`${token}`,
            },
        })
        //const response = await axios.get(url);
        const data = await response.json();

        let convertedProbesArray = [];
        let convertedDestinationsArray = [];

        // Convert each awsJSON formatted object into a JSON object and push it into a new array.
        for (let probeObj of data.body.source.Items) {
            convertedProbesArray.push(unmarshall(probeObj));
        }

        for (let destinationObj of data.body.destination.Items) {
            convertedDestinationsArray.push(unmarshall(destinationObj));
        }
        console.log("convertedProbesArray:", convertedProbesArray);
        console.log("convertedDestinationsArray:", convertedDestinationsArray);
        return { convertedProbesArray, convertedDestinationsArray };
    }
    catch (e) {
        console.log(e);
        return null;
    }
};

// This function GETs the currently selected customer's regions data.
async function getCustomerRegions(selectedCustomer,token) {
    //const url = `api/regions/${selectedCustomer}`;
    const url = `${REGIONS_TABLE_URL}?customerId=${selectedCustomer}`;
  // const url = `${REGIONS_TABLE_URL}/${selectedCustomer}`;
    //const url =`regions_API_v_2_0_0/${selectedCustomer}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                'Authorization' :`${token}`,
            },
        })
       // const response = await axios.get(url);
       // let headers = new Headers();

        // headers.append('Content-Type', 'application/json');
        // headers.append('Accept', 'application/json');
        // headers.append('Authorization', `${token}`);
        // headers.append('Origin','*');
    
        // fetch(url, {
        //     mode: 'cors',
        //     method: 'GET',
        //     headers: headers
        // })
        // .then(response => response.json())
        // .then(json => console.log(json))
        // .catch(error => console.log('Authorization failed: ' + error.message));
        const data = await response.json();

        let convertedRegionsArray = [];

        // Convert each awsJSON formatted object into a JSON object and push it into a new array.
        for (let regionObj of data.body.Items) {
            let unmarshalledObj = unmarshall(regionObj);
            convertedRegionsArray.push({ region: unmarshalledObj.regionName, description: unmarshalledObj.description,regionId : unmarshalledObj.regionId, probes: [] });
        }

        console.log("convertedRegionsArray:", convertedRegionsArray);

        return convertedRegionsArray;

    }
    catch (e) {
        console.log(e);
        return null;
    }
};

export { getCustomers, getRegionsProbesByCustomer, getcustNew }

