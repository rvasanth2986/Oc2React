import { useContext } from 'react'
import { useDispatch } from 'react-redux';
import { useAuth } from '../contexts/auth';

let useFetch = () => {
    let config = {}
    const {signOut } = useAuth();
    const dispatch = useDispatch();
    let originalRequest = async (url, config)=> {
        url = `${url}`
        let response = await fetch(url, config)
        let data = await response.json()
        console.log('REQUESTING:', data)
        return {response, data}
    }

    // let refreshToken = async (authTokens) => {

    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({'refresh':authTokens.refresh})
    //     })
    //     let data = await response.json()
    //     localStorage.setItem('authTokens', JSON.stringify(data))
    //     setAuthTokens(data)
    //     setUser(jwt_decode(data.access))
    //     return data
    // }

    let callFetch = async (url) => {
        let authTokens = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')) : null

        
        config['headers'] = {
            Authorization:`Bearer ${authTokens?.idToken}`
        }

        let {response, data} = await originalRequest(url, config)
        if (response.status == 401) {
            signOut();
        }
        return {response, data}
    }

    return callFetch
}

export default useFetch;