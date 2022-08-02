export const DISPLAY_DATA_CHANGE_STATE_VALUE = '[trace action] Display Data Trace State change';
export const DISPLAY_DATA_PUSH_ARRAY_ELEMENT = '[trace action] Trace Push Array Element';
export const LOAD_TRACE_MATRIC_DATA = '[trace action] Load Trace Matrix Data';
export const RESET_TRACE_MATRIC_DATA = '[trace action] Reset Trace Matrix Data';
export const LOAD_TRACE_MATRIC_FILTER_DATA = '[trace action] Load Trace Matrix Filter Data';
export const LOAD_TRACE_MATRIC_FILTER_DATA_CHANGE = '[trace action] Load Trace Matrix Filter Data State Change';

export const SET_RESET_STATE = '[trace action] Reset State';

export function PathResetState(){
    return {
        type: SET_RESET_STATE,
    }
};
export function TraceMatrixLoad(data) {
    return {
        type: LOAD_TRACE_MATRIC_DATA,
        payload: data,
    };
}
export function TraceMatrixReset(data) {
    return {
        type: RESET_TRACE_MATRIC_DATA,
        payload: data,
    };
}
export function DisplayDatasetChange(fieldName, newValue) {
    return {
        type: DISPLAY_DATA_CHANGE_STATE_VALUE,
        payload: { fieldName, newValue },
    };
}
export function DisplayDataPushArray(arrayFieldName, newElement) {
    return {
        type: DISPLAY_DATA_PUSH_ARRAY_ELEMENT,
        payload: { arrayFieldName, newElement },
    };
}

export function DataFilterChange(fieldName, newValue) {
    return {
        type: LOAD_TRACE_MATRIC_FILTER_DATA_CHANGE,
        payload: { fieldName, newValue },
    };
}