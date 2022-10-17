import {
    CUSTOMER_LOAD_ACTION, CUSTOMER_SELECT_ACTION, CUSTOMER_REGIONANDDEST_LOAD, SAVING_SUCCESS, UPDATE_SUCCESS,
    DELETE_SUCCESS, SAVING_PROBES_SUCCESS, UPDATE_PROBES_SUCCESS, DELETE_PROBES_SUCCESS, SET_RESET_STATE, ADD_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER
} from "../actions/CustomerAction";


const initialState = {
    customer: [],
    selectedCustomer: '',
    regions: [],
    destinations: [],
    probes: []
};
export function CustomerReducer(state = initialState, action) {

    switch (action.type) {
        case SET_RESET_STATE:
            return Object.assign({}, state, {
                customer: [],
                selectedCustomer: '',
                regions: [],
                destinations: [],
                probes: []
            });
        case CUSTOMER_LOAD_ACTION:
            return Object.assign({}, state, {
                customer: action.payload
            });
        case CUSTOMER_SELECT_ACTION:
            return Object.assign({}, state, {
                selectedCustomer: action.payload
            });

        case CUSTOMER_REGIONANDDEST_LOAD:
            return Object.assign({}, state, {
                regions: action.payload.regions,
                destinations: action.payload.destinations,
                probes: action.payload.probes
            });
        case SAVING_SUCCESS:
            return Object.assign({}, state, {
                regions: [...state.regions, action.payload]
            });
        case SAVING_PROBES_SUCCESS:
            return Object.assign({}, state, {
                probes: [...state.probes, action.payload]
            });
        case UPDATE_PROBES_SUCCESS:
            let pindex = state.probes.findIndex(x => x.probeId === action.payload.probeId);
            const updatedarry = [...state.probes];
            updatedarry[pindex].customerId = action.payload.customerId;
            updatedarry[pindex].probeId = action.payload.probeId;
            updatedarry[pindex].probeName = action.payload.probeName;
            updatedarry[pindex].natIP = action.payload.natIP;
            updatedarry[pindex].localIP = action.payload.localIP;
            updatedarry[pindex].ptype = action.payload.ptype;
            updatedarry[pindex].pregion = action.payload.pregion;
            return Object.assign({}, state, {
                //probes: [...state.probes, updatedarry]
                probes: updatedarry
            });
        case UPDATE_SUCCESS:
            let index = state.regions.findIndex(x => x.region === action.payload.pregion_old);
            state.regions[index].region = action.payload.pregion_new;
            state.regions[index].description = action.payload.description;
            return state;
        case DELETE_SUCCESS:
            let delindex = state.regions.findIndex(x => x.regionId === action.payload.regionId);
            //let regionslist = state.regions.filter(x=> x.regionId !== action.payload.regionId);
            var Regionarray = [...state.regions];
            Regionarray.splice(delindex, 1);
            return Object.assign({}, state, {
                regions: Regionarray
            });
        case DELETE_PROBES_SUCCESS:
            let dindex = state.probes.findIndex(x => x.probeId === action.payload.probeId);
            var ProbesArray = [...state.probes];
            ProbesArray.splice(dindex, 1);
            return Object.assign({}, state, {
                probes: ProbesArray
            });
        case ADD_CUSTOMER:
            return Object.assign({}, state, {
                customer: [...state.customer, action.payload]
            });
        case UPDATE_CUSTOMER:
            let cIndex = state.customer.findIndex(x => x.customerId === action.payload.customerId);
            var UpdatedCusArry = [...state.customer];
            UpdatedCusArry[cIndex].customerId = action.payload.customerId;
            UpdatedCusArry[cIndex].customerName = action.payload.customerName;
            UpdatedCusArry[cIndex].customerEmail = action.payload.customerEmail;
            return Object.assign({}, state, {
                customer: UpdatedCusArry
            });
        case DELETE_CUSTOMER:
            let Cusindex = state.customer.findIndex(x => x.customerId === action.payload.customerId);
            var CusArry = [...state.customer];
            CusArry.splice(Cusindex, 1);
            return Object.assign({}, state, {
                customer: CusArry
            });
        default:
            return state;

    }
}