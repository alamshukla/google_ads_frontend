import React, {useState, useEffect} from 'react';
// import { Link } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import Message from './Message';
// import InfoCard from './InfoCard';





const Campaigns = () => {

    const [token, setToken, removeToken] = useCookies(['mytoken'])
    const [refreshToken, setRefreshToken, removeRefreshToken] = useCookies(['refreshToken'])
    let history = useHistory()
    const [campaignInfo, setCampaignInfo] = useState([])
    const [customerId, setCustomerId, removeCustomerID] = useCookies(['customer_id'])
    const [status, setStatus] = useState("All but removed")
    const [date, setDate] = useState("ALL_TIME")
    const [message, setMessage] = useState(' Fetching your data... It will take a few seconds.')



    // if there is no mytoken in the cookie, redirect user to the home page (denying access)
    useEffect(() => {
        if(!token['mytoken']) {
            // history.push('/')
            window.location.href = '/'
        }
    }, [token])

    // if there is a customer_id in the cookies
    // send it to the backend with the refreshToken
    // where they will be used to get the campaigns info associated with that customer_id and token
    useEffect(() => {
        if(customerId) {

            // tell user you are fetching their data
            setMessage(' Fetching your data... It will take a few seconds.');
            
            // data to send to the backend
            const data = { 'refreshToken': refreshToken['refreshToken'], 'customer_id': customerId['customerID'], 'date_range': date}

            fetch('http://127.0.0.1:8000/api/get-campaigns/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token['mytoken']}`
                },
                body: JSON.stringify(data),
                
            })
            .then(resp => resp.json())
            .then(resp => setCampaignInfo(resp))
            .catch(error => console.log(error))
           
            
        }
    }, [customerId, refreshToken, token, date])

    // if campaignInfo object has data, delete the 'fetching data' message
    useEffect(() => {
        if(campaignInfo.length > 0) {
            setMessage('')
        }
    }, [campaignInfo])

    // const onClick = () => {

    //     history.push('/googleads/accounts/campaigns')

    // }

    // filter campaigns by status
    const onChangeStatus = (e) => {
        setStatus(e.target.value)

    }

    // filter campaigns by date
    const onChangeDate = (e) => {
        setDate(e.target.value);
        setCampaignInfo([])

    }


    return (
        
    <div className="container mt-4" font="gotham-rounded-bold">
        
        <br/>
        <h4 className="display-4 text-center mb-4" font="gotham-rounded-bold" style={{color:'rgb(248,172,6)', fontSize:'40px'}}>
            Campaigns
        </h4> 

        <br/>
        <p>Please select the campaign that you want to see in further detail or want to edit.</p>

        <br/>
        <br/>

        {message ? <Message msg={message} /> : null}

        <div className="container">
            <div className="row">
                <div className="col-sm">
                    <p><i className="fas fa-filter"></i>  Filter by campaign status</p>
            
                    <div className="btn-group">
                        
                        <select className="form-select form-select-sm" onChange={onChangeStatus} value={status} aria-label="Filter table by campaign status">
                            
                            <option value="All">All</option>
                            <option value="All enabled">All enabled</option>
                            <option value="All but removed">All but removed</option>
                        </select>
                    </div>

                </div>

                <div className="col-sm" align='right'>
                    <p><i className="fas fa-filter"></i>  Filter by date</p>
            
                    <div className="btn-group" >
                        
                    <select className="form-select form-select-sm" onChange={onChangeDate} value={date} aria-label="Filter table by date">
                            
                            <option value="TODAY">Today</option>
                            <option value="YESTERDAY">Yesterday</option>
                            <option value="THIS_WEEK_SUN_TODAY">This week (Sun - Today)</option>
                            <option value="LAST_7_DAYS">Last 7 days</option>
                            <option value="LAST_14_DAYS">Last 14 days</option>
                            <option value="THIS_MONTH">This month</option>
                            <option value="LAST_30_DAYS">Last 30 days</option>
                            <option value="LAST_MONTH">Last month</option>
                            <option value="ALL_TIME">All time</option>
                        </select>
                    </div>

                </div>

                {/* <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    
            
                    <div className="btn-group">
                        <p><i className="fas fa-filter"></i>  Filter by date</p>
                        
                        <select className="form-select form-select-sm" onChange={onChangeDate} value={date} aria-label="Filter table by date">
                            
                            <option value="TODAY">Today</option>
                            <option value="YESTERDAY">Yesterday</option>
                            <option value="THIS_WEEK_SUN_TODAY">This week (Sun - Today)</option>
                            <option value="LAST_7_DAYS">Last 7 days</option>
                            <option value="LAST_14_DAYS">Last 14 days</option>
                            <option value="THIS_MONTH">This month</option>
                            <option value="LAST_30_DAYS">Last 30 days</option>
                            <option value="LAST_MONTH">Last month</option>
                            <option value="ALL_TIME">All time</option>
                        </select>
                    </div>

                </div> */}
            </div>
        </div>
        

        <br/>
        <br/>

        <table className="table table-bordered table-hover table-responsive">
            <thead className="thead-light" style={{backgroundColor: 'rgb(248,172,6)'}}>
                <tr key="accounts_table" style={{ textAlign: 'center', verticalAlign: 'top'}}>
                    
                    <th key="campaign_name" scope="col" colSpan={2}>Campaign</th>
                    <th key="budget" scope="col">Budget per day</th>
                    <th key="status" scope="col">Status</th>
                    <th key="campaign_type" scope="col">Campaign type</th>
                    <th key="impressions" scope="col">Impr.</th>
                    <th key="interactions" scope="col">Interactions</th>
                    <th key="interaction_rate" scope="col">Interaction rate</th>
                    <th key="avg_cost" scope="col">Avg. cost</th>
                    <th key="total_cost" scope="col">Cost</th>
                    <th key="conversions" scope="col">Conversions</th>
                    <th key="cost_per_conversion" scope="col">Cost / conv.</th>
                    <th key="conversion_rate" scope="col">Conv. rate</th>
                </tr>
            </thead>
           
            <tbody>
                {campaignInfo.map(item => {
                    if (status === "All enabled") {
                        return(
                    
                            <tr key={item.campaign_id} style={{ textAlign: 'center', cursor: 'pointer', 
                            display: item.status === "Enabled" ? '' : 'none'  }}>
                                
                            
                                <td> <i className="fas fa-circle" style={{ color: 'green', display: item.status==="Enabled" ? '' : 'none'}}></i>
                                <i className="fas fa-pause-circle" style={{ color: '', display: item.status==="Paused" ? '' : 'none'}}></i>
                                <i className="fas fa-times-circle" style={{ color: 'red', display: item.status==="Removed" ? '' : 'none'}}></i></td>
                                <td> {item.campaign_name}</td>
                                <td> ${item.campaign_budget}</td>
                                <td> {item.status}</td>
                                <td> {item.campaign_type}</td>
                                <td> {String(item.impressions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.interactions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {item.interaction_rate}%</td>
                                <td> ${item.cpc}</td>
                                <td> ${String(item.cost).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.conv).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> ${item.cost_per_conv}</td>
                                <td> {item.conv_rate}%</td>
            
                                
                            </tr>
                            
                            )

                    } else if (status === "All but removed") {
                        return(
                    
                            <tr key={item.campaign_id} style={{ textAlign: 'center', cursor: 'pointer', 
                            display: item.status === "Enabled" || item.status === "Paused" ? '' : 'none'  }}>
                                
                            
                                <td> <i className="fas fa-circle" style={{ color: 'green', display: item.status==="Enabled" ? '' : 'none'}}></i>
                                <i className="fas fa-pause-circle" style={{ color: '', display: item.status==="Paused" ? '' : 'none'}}></i>
                                <i className="fas fa-times-circle" style={{ color: 'red', display: item.status==="Removed" ? '' : 'none'}}></i></td>
                                <td> {item.campaign_name}</td>
                                <td> ${item.campaign_budget}</td>
                                <td> {item.status}</td>
                                <td> {item.campaign_type}</td>
                                <td> {String(item.impressions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.interactions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {item.interaction_rate}%</td>
                                <td> ${item.cpc}</td>
                                <td> ${String(item.cost).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.conv).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> ${item.cost_per_conv}</td>
                                <td> {item.conv_rate}%</td>
            
                                
                            </tr>

                            
                            
                            )
                    } else if (status === "All") {
                        return(
                    
                            <tr key={item.campaign_id} style={{ textAlign: 'center', cursor: 'pointer'}}>
                                
                            
                                <td> <i className="fas fa-circle" style={{ color: 'green', display: item.status==="Enabled" ? '' : 'none'}}></i>
                                <i className="fas fa-pause-circle" style={{ color: '', display: item.status==="Paused" ? '' : 'none'}}></i>
                                <i className="fas fa-times-circle" style={{ color: 'red', display: item.status==="Removed" ? '' : 'none'}}></i></td>
                                <td> {item.campaign_name}</td>
                                <td> ${item.campaign_budget}</td>
                                <td> {item.status}</td>
                                <td> {item.campaign_type}</td>
                                <td> {String(item.impressions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.interactions).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {item.interaction_rate}%</td>
                                <td> ${item.cpc}</td>
                                <td> ${String(item.cost).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> {String(item.conv).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                <td> ${item.cost_per_conv}</td>
                                <td> {item.conv_rate}%</td>
            
                                
                            </tr>
                            
                            )
                    }
                
                })}

            </tbody>
        </table>

        <br/>
        
    </div>
)}

export default Campaigns;