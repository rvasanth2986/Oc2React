import { DISPLAY_DATA_CHANGE_STATE_VALUE, DISPLAY_DATA_PUSH_ARRAY_ELEMENT, LOAD_TRACE_MATRIC_DATA, LOAD_TRACE_MATRIC_FILTER_DATA_CHANGE,RESET_TRACE_MATRIC_DATA, SET_RESET_STATE } from "../actions/TraceDiagramAction";

const initialState = {
    MatrixDataSetDisplay: { index: 0, maxDataSetNum: 0, destinationIdsWithNoData: [], visibleDestinationsData: [], gridData: [], gridDataNew: [] },
    MatrixDataRequestFiltersState: { startDate: "", endDate: "",sourceProbeId: "",sourceProbeIdError: false,destinationIds: [],destinationIdsError: false,startDateResults: "", endDateResults: "", sourceProbeIdResults: "", destinationIdsResults: [] },
    MatrixData: []
};

export function TraceDiagramReducer(state = initialState, action) {

    switch (action.type) {
        case SET_RESET_STATE:
            return Object.assign({}, state, {
                MatrixDataSetDisplay: { index: 0, maxDataSetNum: 0, destinationIdsWithNoData: [], visibleDestinationsData: [], gridData: [], gridDataNew: [] },
                MatrixDataRequestFiltersState: { startDate: "", endDate: "",sourceProbeId: "",sourceProbeIdError: false,destinationIds: [],destinationIdsError: false,startDateResults: "", endDateResults: "", sourceProbeIdResults: "", destinationIdsResults: [] },
                MatrixData: []
                });
        case DISPLAY_DATA_CHANGE_STATE_VALUE:
            return {
                ...state,
                MatrixDataSetDisplay: { ...state.MatrixDataSetDisplay, [action.payload.fieldName]: action.payload.newValue }
            }
        case DISPLAY_DATA_PUSH_ARRAY_ELEMENT:
            return {
                ...state,
                MatrixDataSetDisplay: { ...state.MatrixDataSetDisplay, [action.payload.arrayFieldName]: [...state.MatrixDataSetDisplay[action.payload.arrayFieldName], action.payload.newElement] }
            }
        case LOAD_TRACE_MATRIC_DATA:
           return { // returning a copy of orignal state 
            ...state, //copying the original state
            MatrixData: [...state.MatrixData, action.payload] //new todos array 
           }
        case RESET_TRACE_MATRIC_DATA:
            // return [...state.MatrixData, action.payload];
                return Object.assign({}, state, {
                    MatrixData: action.payload
                    });                
        case LOAD_TRACE_MATRIC_FILTER_DATA_CHANGE:
            return {
                ...state,
                MatrixDataRequestFiltersState: { ...state.MatrixDataRequestFiltersState, [action.payload.fieldName]: action.payload.newValue }
            }
        default:
             return state;               

    }

}