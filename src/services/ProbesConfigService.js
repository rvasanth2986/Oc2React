export async function sendRequest(token, insertdata, method) {
    // const URL = '/api/regions';
    const URL = 'https://ijyfzw78x2.execute-api.us-east-2.amazonaws.com/regions_API_v_2_0_0';

    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                //'Authorization' :`${token}`,
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

export async function DeleteRequest(token, insertdata, method) {
    // const URL=  `api/regions/${insertdata.customerId}/${insertdata.regionId}`;
    const URL = `https://ijyfzw78x2.execute-api.us-east-2.amazonaws.com/regions_API_v_2_0_0/?customerId=${insertdata.customerId}&regionId=${insertdata.regionId}`;

    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }



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

export async function sendProbesRequest(token, insertdata, method) {
    //const URL = '/api/probes';
    const URL = 'https://xnuoz7c495.execute-api.us-east-2.amazonaws.com/probeTable_v_1_0_0';

    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                // 'Authorization' :`${token}`,
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


export async function DeleteProbesRequest(token, insertdata, method) {
    //  const URL=  `api/probes/${insertdata.customerId}/${insertdata.probeId}`;
    const URL = `https://xnuoz7c495.execute-api.us-east-2.amazonaws.com/probeTable_v_1_0_0/?customerId=${insertdata.customerId}&regionId=${insertdata.probeId}`;

    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                //'Authorization':'eyJraWQiOiIwMjVwRVZ4TWhwMUxyZWhVXC9JVXNaU3h0OHFKWlo5VWJlOGpuSnlqSzVrMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjM2NhMGM4OC02Y2JhLTQ2ZjEtYjIwNy03NTI1YzY4OWI3YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfODRjaVl1c1lTIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QxMjMiLCJvcmlnaW5fanRpIjoiZThiY2E1OGItODk3Yy00OWMxLWEzODktZjA0ZWYyNjE1ZDc5IiwiYXVkIjoiMXRiMm9haHA2aDZsMnRwc3ZuZmxkbWk1OXIiLCJldmVudF9pZCI6IjU2NTYwZWI0LTU2NDktNDI1OS1hMWYzLTY0N2Y0ZmVjNDMyOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0ODQ3MjY2LCJleHAiOjE2NTQ4NTA4NjYsImlhdCI6MTY1NDg0NzI2NiwianRpIjoiMDliZGFmNDktNDYyOC00ZWExLTk4MDMtODk3ZTgyMmM0MzBmIiwiZW1haWwiOiJtYW5pYXNkaUBnbWFpbC5jb20ifQ.Q3lEQCaxPClAe_SJjmUnOMJFpMoEJTrr01w6UMVRyzL9WEnEC0FrssX7gCvcVuVhnOSx9PDyvOFLcrdKSP7o8r2lU0TbwkfNioF88L0LrOtDdUKov1WfChocnk_0G6-Pe6eO46qtbsPmxIgP5gLJR2VMuoHdn-jmE1D5_8D_8JJF2QIYYfU8L54GoMKVu3Ed8InPmLLMONkbS-RbeXMMllBXx-ttLUAzPUAQz3NYNoqQIxH80MBOFRjF7fLlYw8LJf2Cmzg9Js6t0XHmj3F77oZRI2jA4hKkMcgNrEKniNu4U_YFFehzKyqGXvCIsdjkQl7t-ibGzgJw3fAZVqZ7gg', 
                // 'Authorization' :`${token}`,
                'Content-Type': 'application/json'
            }



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

export async function downloadJson(token, data, method) {
    const URL = `https://of1kc7bes2.execute-api.us-east-2.amazonaws.com/v1_0_0?probeId=${data}`;
    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                // 'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        return data;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

export async function InfoJson(token, data, method) {
    const URL = `https://of1kc7bes2.execute-api.us-east-2.amazonaws.com/v1_0_0?probeId=${data}`;
    try {
        const response = await fetch(URL, {
            method: `${method}`,
            headers: {
                // 'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        return data;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}