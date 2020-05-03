import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {useMessage} from "../hooks/message.hook";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });

    //hook для вывода сообщения M.toast() из файла message.hook.js
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message ,clearError]);

    const changeHandler = event => {
        //оператор spread
        //передаем в форму значения из Input по name в форму
        setForm({ ...form, [event.target.name]:event.target.value })
    };

    const loginHandler = async () => {
        try{
            // отправляем запрос с данными из формы, и если авторизован, получаем в ответ token, userId
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId, data.roleId)
        }catch (e) {}
    };

    const enterLogin = event => {
        if(event.key === 'Enter'){
            loginHandler();
        }
    };

    return(
        <div className="card" style={{ width: '50%', margin: 'auto', marginTop: '25%'}}>
            <div className="card-header bg-primary text-white">
                <h3>Cars Viewer</h3>
            </div>
            <div className="card-body">
                <div>
                    <form>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                aria-describedby="emailHelp"
                                name="email"
                                placeholder="Email"
                                onChange={changeHandler}
                                onKeyPress={enterLogin}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Пароль"
                                name="password"
                                onChange={changeHandler}
                                onKeyPress={enterLogin}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Войти
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};