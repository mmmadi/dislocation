import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/Loader";
import {Pagination} from "../../components/Pagination";
import {WagonTrackingPostPage} from './WagonTrakingPostPage';
import {RemoveFromTracking} from './RemoveFromTracking';
import useSortableData from '../../components/Function/userSortableData';
// import mySearchFunction from '../../components/Function/mySearchFunction';
import SearchByColumn from '../../components/Function/SearchByColumn';
// import {CSVLink, CSVDownload} from "react-csv";
import ReactExport from "react-export-excel";

export const DislocationPage = () => {
    const [wagons, setWagons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [wagonsPerPage, setWagonsPerPage] = useState(50);
    const {loading, request} = useHttp();
    const {token,userId, darkMode} = useContext(AuthContext);

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    var date_time = new Date();

    const fetchDislocation = useCallback(async () =>{
        try{
            const fetched = await request('/api/dislocation', 'POST', {userId:userId}, {
                Authorization: `Bearer ${token}`
            });
            setWagons(fetched)
        }catch (e) {}
    }, [token, userId, request]);

    useEffect(() =>{
        fetchDislocation();
    }, [fetchDislocation]);

    const indexOfLastWagon = currentPage * wagonsPerPage;
    const indexOfFirstWagon = indexOfLastWagon - wagonsPerPage;
    const currentWagons = wagons.slice(indexOfFirstWagon, indexOfLastWagon);

    const { items, requestSort, sortConfig} = useSortableData(currentWagons);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const changeWagonsPerPage = selectRowsPerPage => setWagonsPerPage(selectRowsPerPage);

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const getHistory = (carnumber) => {
        window.open(`/history/${carnumber}`,'_blank')
    };

    const getMap = (latitude,longitude) => {
          const url = `https://www.openrailwaymap.org/?lang=null&lat=${latitude}&lon=${longitude}&zoom=14&style=standard`;
          window.open(url,'_blank');
    };

    if(!wagons.length){
        return (
            <div className={darkMode ? "card card-dark" : "card card-light"}>
                <div className="card-header-table">
                    <div className="row ch">
                        <div className="col l3">
                            <div className="table-icon">
                                <div style={{padding:"25px 0", textAlign:"center"}}>
                                    <i className="material-icons" style={{fontSize:36, color:"#fff"}}>directions_transit</i>
                                </div>
                            </div>
                            <span>Дислокация вагонного парка</span>
                        </div>
                    </div>
                </div>
                <div className="table-div">
                    <Loader/>
                </div>
            </div>
        )
    } else {
        if(loading){
            return <Loader/>
        }
        return(
                <div className={darkMode ? "card card-dark" : "card card-light"}>
                <div className="card-header-table">
                    <div className="row ch">
                        <div className="col l4">
                            <div className="table-icon">
                                <div style={{padding:"25px 0", textAlign:"center"}}>
                                    <i className="material-icons" style={{fontSize:36, color:"#fff"}}>directions_transit</i>
                                </div>
                            </div>
                            <span>Дислокация вагонного парка</span>
                        </div>
                        {/* <div className="col l6">
                            <div className="input-field srch myinput-field">
                               <i className="material-icons prefix">search</i>
                               <input type="text" id="myInput" className="srch" onKeyUp={mySearchFunction}/>
                               <label htmlFor="myInput">Поиск</label>
                            </div>
                        </div>*/}
                        <div className="col l8"> 
                            <div className="div-btn-add-user">
                                <button className={darkMode ? "btn-floating waves-effect waves-light btn-add-user-table-dark btn modal-trigger" : "btn-floating waves-effect waves-light btn-add-user btn modal-trigger"}
                                        data-target="modal1">
                                    <i className="material-icons" style={darkMode ? {color:"#fff"} : {color:"#000"}}>add</i>
                                </button>
                                <div id="modal1" className="modal">
                                    <WagonTrackingPostPage/>
                                </div>
                            </div>
                            <div className="div-btn-delete">
                                <button className={darkMode ? "btn-floating waves-effect waves-light btn-add-user-table-dark btn modal-trigger" : "btn-floating waves-effect waves-light btn-add-user btn modal-trigger"}
                                    data-target="modal2"
                                >    
                                    <i className="material-icons" style={darkMode ? {color:"#fff"} : {color:"#000"}}>delete_forever</i>
                                </button>
                                <div id="modal2" className="modal">
                                    <RemoveFromTracking/>
                                </div>
                            </div>
                            <div className="div-btn-excel">
                                <ExcelFile element={
                                        <button className={darkMode ? "btn-floating waves-effect waves-light btn-add-user-table-dark" : "btn-floating waves-effect waves-light btn-add-user"}>
                                            <i className="material-icons">
                                                <img alt="xls" src="https://img.icons8.com/color/24/000000/ms-excel.png"/>
                                            </i>
                                    </button>
                                }>
                                    <ExcelSheet data={wagons} name={date_time.toDateString()}>
                                        <ExcelColumn label="Номер вагона" value="carnumber"/>
                                        <ExcelColumn label="Состояние парка" value="broken"/>
                                        <ExcelColumn label="Станция отправления" value="codestfrom"/>
                                        <ExcelColumn label="Станция назначения" value="codestdest"/>
                                        <ExcelColumn label="Дата отправления" value="codestfrom"/>
                                        <ExcelColumn label="Дата операции" value="departure-date"/>
                                        <ExcelColumn label="Операция" value="oper_date_last"/>
                                        <ExcelColumn label="Груз" value="codecargo"/>
                                        <ExcelColumn label="Вес" value="weight"/>
                                        <ExcelColumn label="Собственник" value="owner_name"/>
                                        <ExcelColumn label="Оператор" value="operator_name"/>
                                        <ExcelColumn label="Грузоотправитель" value="gruz_sender_name"/>
                                        <ExcelColumn label="Грузоотполучатель" value="gruz_receiver_name"/>
                                    </ExcelSheet>
                                </ExcelFile>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-div-first">
                    <div className={darkMode ? "table-div-second table-dark" : "table-div-second"}>
                        <table className="table-wagons centered" id="myTable">
                            <thead>
                                <tr>
                                    <th className="row-number">№</th>
                                    <th className="carnumber"><button onClick={()=>requestSort('carnumber')} className={getClassNamesFor('carnumber')}>Номер вагона</button></th>
                                    <th className="park_state"><button onClick={()=>requestSort('broken')} className={getClassNamesFor('broken')}>Состояние парка</button></th>
                                    <th className="codestfrom"><button onClick={()=>requestSort('codestfrom')} className={getClassNamesFor('codestfrom')}>Станция отправления</button></th>
                                    <th className="codestdest"><button onClick={()=>requestSort('codestdest')} className={getClassNamesFor('codestdest')}>Станция назначения</button></th>
                                    <th className="departure-date"><button onClick={()=>requestSort('departure_date')} className={getClassNamesFor('departure_date')}>Дата отправления</button></th>
                                    <th className="codestcurrent"><button onClick={()=>requestSort('codestcurrent')} className={getClassNamesFor('codestcurrent')}>Станция текущей дислокации</button></th>
                                    <th className="oper_date_last"><button onClick={()=>requestSort('oper_date_last')} className={getClassNamesFor('oper_date_last')}>Дата операции</button></th>
                                    <th className="codeoper"><button onClick={()=>requestSort('codeoper')} className={getClassNamesFor('codeoper')}>Операция</button></th>
                                    <th className="codecargo"><button onClick={()=>requestSort('codecargo')} className={getClassNamesFor('codecargo')}>Груз</button></th>
                                    <th className="weight"><button onClick={()=>requestSort('weight')} className={getClassNamesFor('weight')}>Вес</button></th>
                                    <th className="owner_name"><button onClick={()=>requestSort('owner_name')} className={getClassNamesFor('owner_name')}>Собственник</button></th>
                                    <th className="operator_name"><button onClick={()=>requestSort('operator_name')} className={getClassNamesFor('operator_name')}>Оператор</button></th>
                                    <th className="gruz_sender_name"><button onClick={()=>requestSort('gruz_sender_name')} className={getClassNamesFor('gruz_sender_name')}>Грузоотправитель</button></th>
                                    <th className="gruz_receiver_name"><button onClick={()=>requestSort('gruz_receiver_name')} className={getClassNamesFor('gruz_receiver_name')}>Грузополучатель</button></th>
                                    <th className="date_ins"><button onClick={()=>requestSort('date_ins')} className={getClassNamesFor('date_ins')}>Дата добавления на сервер</button></th>
                                </tr>
                                <tr className="search-tr">
                                    <th/>
                                    <th><input className="search_carnumber" type="text" id="myInput1" onKeyUp={() => SearchByColumn(1)}/></th>
                                    <th><input className="search_park_state" type="text" id="myInput2" onKeyUp={() => SearchByColumn(2)}/></th>
                                    <th><input className="search_codestfrom" type="text" id="myInput3" onKeyUp={() => SearchByColumn(3)}/></th>
                                    <th><input className="search_codestdest" type="text" id="myInput4" onKeyUp={() => SearchByColumn(4)}/></th>
                                    <th><input className="search_departure-date" type="text" id="myInput5" onKeyUp={() => SearchByColumn(5)}/></th>
                                    <th><input className="search_codestcurrent" type="text" id="myInput6" onKeyUp={() => SearchByColumn(6)}/></th>
                                    <th><input className="search_oper_date_last" type="text" id="myInput7" onKeyUp={() => SearchByColumn(7)}/></th>
                                    <th><input className="search_codeoper" type="text" id="myInput8" onKeyUp={() => SearchByColumn(8)}/></th>
                                    <th><input className="search_codecargo" type="text" id="myInput9" onKeyUp={() => SearchByColumn(9)}/></th>
                                    <th><input className="search_weight" type="text" id="myInput10" onKeyUp={() => SearchByColumn(10)}/></th>
                                    <th><input className="search_owner_name" type="text" id="myInput11" onKeyUp={() => SearchByColumn(11)}/></th>
                                    <th><input className="search_operator_name" type="text" id="myInput12" onKeyUp={() => SearchByColumn(12)}/></th>
                                    <th><input className="search_gruz_sender_name" type="text" id="myInput13" onKeyUp={() => SearchByColumn(13)}/></th>
                                    <th><input className="search_gruz_receiver_name" type="text" id="myInput14" onKeyUp={() => SearchByColumn(14)}/></th>
                                    <th><input className="search_date_ins" type="text" id="myInput15" onKeyUp={() => SearchByColumn(15)}/></th>
                                </tr>
                            </thead>
                            <tbody className={darkMode ? "tbody-dark" : "tbody-light"}>
                            {items.map((wagon) => {
                                return(
                                    <tr key={wagon.id}>
                                        <td className="row-number" onClick={() => getHistory(wagon.carnumber)}>{wagon.rownumber}</td>
                                        <td className="carnumber" onClick={() => getHistory(wagon.carnumber)}>{wagon.carnumber}</td>
                                        <td className="park_state" onClick={() => getHistory(wagon.carnumber)}>{wagon.broken}</td>
                                        <td className="codestfrom" onClick={() => getHistory(wagon.carnumber)}>{wagon.codestfrom}</td>
                                        <td className="codestdest" onClick={() => getHistory(wagon.carnumber)}>{wagon.codestdest}</td>
                                        <td className="departure-date" onClick={() => getHistory(wagon.carnumber)}>{wagon.departure_date}</td>
                                        <td className="codestcurrent">
                                            {wagon.codestcurrent}
                                            <button className="current-position-on-map"
                                                    onClick={() => getMap(wagon.latitude,wagon.longitude)}>
                                                <i className="fas fa-globe-asia" style={{fontSize:24}}/>
                                            </button>
                                        </td>
                                        <td className="oper_date_last" onClick={() => getHistory(wagon.carnumber)}>{wagon.oper_date_last}</td>
                                        <td className="codeoper" onClick={() => getHistory(wagon.carnumber)}>{wagon.codeoper}</td>
                                        <td className="codecargo" onClick={() => getHistory(wagon.carnumber)}>{wagon.codecargo}</td>
                                        <td className="weight" onClick={() => getHistory(wagon.carnumber)}>{wagon.weight}</td>
                                        <td className="owner_name" onClick={() => getHistory(wagon.carnumber)}>{wagon.owner_name}</td>
                                        <td className="operator_name" onClick={() => getHistory(wagon.carnumber)}>{wagon.operator_name}</td>
                                        <td className="gruz_sender_name" onClick={() => getHistory(wagon.carnumber)}>{wagon.gruz_sender_name}</td>
                                        <td className="gruz_receiver_name" onClick={() => getHistory(wagon.carnumber)}>{wagon.gruz_receiver_name}</td>
                                        <td className="date_ins" onClick={() => getHistory(wagon.carnumber)}>{wagon.date_ins}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                     rowsPerPage={wagonsPerPage}
                     totalRows={wagons.length}
                     paginate={paginate}
                     selectPerPage={changeWagonsPerPage}
                     currentPage={currentPage}
                />
            </div>
        )
    }
};