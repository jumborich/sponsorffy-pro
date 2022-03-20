import axios from 'axios';
export const baseURL="http://localhost:3001/api/v1/";

const _useAxios =(method,body={},url) =>{
    let params = {};
    let data = {};
    if(method.toUpperCase()==="GET")params=body
    if(method.toUpperCase()==="POST"||method.toUpperCase()==="PATCH"||method.toUpperCase()==="PUT"||method.toUpperCase()==="DELETE")data=body
    return axios({
        url,
        method,
        baseURL,
        params,
        data,
        withCredentials: true,
    })
};

export default _useAxios; //callAPI