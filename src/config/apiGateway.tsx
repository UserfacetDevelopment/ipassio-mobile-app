import axios from 'axios';
import config from './Config';

export default class ApiGateway{
    static post(endpoint: string, body ?: any, headers?:any){
        const url=`${config.BaseURL}/${endpoint}`;
        return axios.post(url, body, headers);
    }

    static get(endpoint: string, excludeBaseUrl?: boolean, headers?: any){
        if(excludeBaseUrl){
            return axios.get(endpoint);
        }
        const url=`${config.BaseURL}/${endpoint}`;
        // console.log(url)

        return axios.get(url, headers);
    }  

    static patch(endpoint: string, body ?: any, auth?: any){
        const url=`${config.BaseURL}/${endpoint}`;
        return axios.patch(url, body, auth);
    }
}