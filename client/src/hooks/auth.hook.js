import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData';

export const useAth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [username, setUsername] = useState(null);

    //функция логин
    const login = useCallback( (jwtToken, id, role_id, username) => {
        setToken(jwtToken);
        setUserId(id);
        setRoleId(role_id);
        setUsername(username);

        localStorage.setItem(storageName, JSON.stringify({
            userId:id, token:jwtToken, roleId: role_id
        }))
    }, []);

    //функция логаут
    const logout = useCallback( () => {
        setToken(null);
        setUserId(null);
        setRoleId(null);
        setUsername(null);
        localStorage.removeItem(storageName);
    }, []);

    // проверка есть ли данные в localstorage
    // если есть, то токен и userId берем из localStorage
    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem(storageName));

        if(data && data.token){
            login(data.token, data.userId, data.roleId, data.username);
        }
    },[login]);

    return {login, logout, token, userId, roleId, username}
};