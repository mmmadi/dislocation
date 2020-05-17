import React, {useState} from 'react'
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";

export const WagonTrackingPostPage = ({close}) => {
    const message = useMessage();
    const {loading,request} = useHttp();
    const [carnum, setCarnum] = useState(0);

    const changeHandler = () => {
        const value = document.getElementById("wagon_id").value;
        setCarnum(value);
    };

    const addWagon = async () => {
        try{
            const data = await request('/api/wagon_tracking', 'POST', {wagon_num:carnum});
            message(data);
        }catch (e) {}
    };

    return(
        <div className="card-content my-card-content white-text">
            <div className="input-field myinput-field">
                <input
                    id="wagon_id"
                    name="wagon_num"
                    type="number"
                    className="validate"
                    onChange={changeHandler}
                />
                <label htmlFor="wagon_id">Номер вагона</label>
            </div>
            <div className="modal-footer">
                <button onClick={addWagon} disabled={loading} className="btn waves-effect waves-light w-25 blue darken-2" style={{marginRight:10}}>
                    Добавить
                </button>
                <button className="btn waves-effect waves-light grey lighten-4 z-depth-2 font-weight-bold btn-logout modal-close">
                    Отмена
                </button>
            </div>
        </div>
    )
};