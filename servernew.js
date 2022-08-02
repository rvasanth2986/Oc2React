const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const port = 9000;
const router = express.Router();


// Set up the front-end code
// We take a request from root (/) and look in the static sub-folder for the HTML, CSS, and front-end JavaScript files.
app.use(express.static(path.join(__dirname + '/build')));

// Here, we will call this function for every request. It will write to the console for every request made.
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    console.log(`${req.headers['authorization']}`);
    next(); // Add next() to keep going.
});

// Install the router at /api
app.use('/api', router);

// Recoginzes responses as JSON.
router.use(express.json());

// Stores API URLs to AWS for each table.
const PROBES_TABLE_URL = 'https://xnuoz7c495.execute-api.us-east-2.amazonaws.com/probeTable_v_1_0_0';
const REGIONS_TABLE_URL = 'https://ijyfzw78x2.execute-api.us-east-2.amazonaws.com/regions_API_v_2_0_0';
const CUSTOMERS_TABLE_URL = 'https://o97rs2vh5e.execute-api.us-east-2.amazonaws.com/CustomerTableAPI_v_2_0_0';
const METRICS_TABLE_URL = 'https://xw2jihik40.execute-api.us-east-2.amazonaws.com/get_metrics_2_0_0';
const PROBES_POST ="https://of1kc7bes2.execute-api.us-east-2.amazonaws.com/v1_0_0";

// GET all customers.
router.get('/customers', async (req, res) => {
    const url = `${CUSTOMERS_TABLE_URL}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${req.headers['authorization']}`,
                
            },
        })
        const data = await response.json();
        console.log("GEt Cst",data);
        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// POST a new customer to DB.
router.post('/customers', async (req, res) => {
    const url = `${CUSTOMERS_TABLE_URL}`;
    const newCustomerData = req.body;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCustomerData)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// GET all probes for a customer.
router.get('/probes/:customerId', async (req, res) => {
    const customerId = req.params.customerId;
    const url = `${PROBES_TABLE_URL}/?customerId=${customerId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${req.headers['authorization']}`,
                
            },
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// POST a new probe for a customer.
router.post('/probes', async (req, res) => {
    const newProbeData = req.body;
    const url = `${PROBES_POST}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProbeData)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// PUT (Update) an existing probe's data.
router.put('/probes', async (req, res) => {
    const updatedRegionData = req.body;
    const url = `${PROBES_TABLE_URL}`;
    console.log("Put probe Req",JSON.stringify(updatedRegionData));
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRegionData)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// DELETE PROBES Data
router.delete('/probes/:customerId/:probeId', async(req,res)=>{
    const customerId = req.params.customerId;
    const probeId = req.params.probeId;
    console.log(req.params);
    const url = `${PROBES_TABLE_URL}/?customerId=${customerId}&probeId=${probeId}`;
    console.log(url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${req.headers['authorization']}`,
                
            },
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});


// GET all regions for a customer.
router.get('/regions/:customerId', async (req, res) => {
    const customerId = req.params.customerId;
    const url = `${REGIONS_TABLE_URL}/?customerId=${customerId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${req.headers['authorization']}`,
                
            },
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});


// POST a new region for a customer.
router.post('/regions', async (req, res) => {
    const newRegionData = req.body;
    const url = `${REGIONS_TABLE_URL}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRegionData)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// PUT (Update) an existing region's data.
router.put('/regions', async (req, res) => {
    const updatedRegionData = req.body;
    const url = `${REGIONS_TABLE_URL}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRegionData)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// DELETE Region Data
router.delete('/regions/:customerId/:regionId', async(req,res)=>{
    const customerId = req.params.customerId;
    const regionId = req.params.regionId;
    const url = `${REGIONS_TABLE_URL}/?customerId=${customerId}&regionId=${regionId}`;
    console.log(url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${req.headers['authorization']}`,
                
            },
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

// GET filtered metrics for a probe.
router.post('/metrics', async (req, res) => {
    const dataRequestFilters = req.body;
    const url = `${METRICS_TABLE_URL}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '8OPDXlj7ZK5OP3l96G464scmctzx8U96wDujgGA6'
            },
            body: JSON.stringify(dataRequestFilters)
        })
        const data = await response.json();

        res.send(data);
    }
    catch (error) {
        console.log(error.message);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/build', 'index.html'));
});

// Server listens to the port and displays message to console.
const portnew = process.env.port || port;
app.listen(portnew, () => console.log(`Listening on port ${portnew}...`));