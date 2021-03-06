import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import Crypto from '../crypto/Crypto'
import Currency from '../currency/Currency'
import './Dashboard.css'
import News from '../news/News'

import ProgressBar from 'react-bootstrap/ProgressBar'
import Logout from './Logout';
import Spinner from 'react-bootstrap/Spinner'
import Scrollbar from '../scrollbar/Scrollbar'

function Dashboard(props) {

  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [cryptodata, setCryptodata] = useState({})
  const [data, setData] = useState({})
  const [cryp, setCryp] = useState({
    crypto: null,
  })
  const [bar, setBar] = useState(0)
  const [modalShow, setModalShow] = useState(false)

  var styles = {
    red: { color: "red"},
    green: {color: "green"}
  }

  const showModal = () => {
    setModalShow(true)
  }

  const logout = () => {
    history.push('/login')
    setModalShow(false)
    setLoading(true)
  }

  const getCrypto = (crypto) => {
    setSelectedCrypto(crypto)
  }


  const getCurrency = (currency) => {
    setSelectedCurrency(currency)
  }

  const displayData = () => {
    Object.keys(cryptodata).map(item => (setData(cryptodata[item])))
    Object.keys(cryptodata).map(item => setCryp({crypto: item}))
  }

  useEffect (() => {
    let highday = 0;
    let lowday = 0;
    let percent = 0;
    Object.keys(data).map(crypto => ((
      highday = data[crypto].HIGHDAY,
      lowday = data[crypto].LOWDAY,
      percent = (lowday-highday)/lowday,
      percent = percent * -1000,
      setBar(percent)
    )))
  })
  
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${selectedCrypto}&tsyms=${selectedCurrency}`
  useEffect (() => {
    fetch(url)
    .then(response => response.json())
    .then(res => {
      setCryptodata(res.RAW)
    })
    setLoading(false)
  }, [url])

  if(loading) {
    return (
      <div>
        <Spinner animation="border"/>
        <hr/>
        <h4>Loading</h4>
      </div>
    ) 
  }
  else
  {
    return (
      <div className="dashboard">
        <div className="dashboard-lock">
          <div className="dashboard-header">
            <Crypto getCrypto={getCrypto} />
          </div>
          <div className="dashboard-header">
            <Currency getCurrency={getCurrency} />
          </div>
          <div className="dashboard-header">
            <button type="button" onClick={displayData}>Show</button>
          </div>
          <div className="logout">
            <button onClick={showModal}>Logout</button>
          </div>
        </div>
        <div>
          <Scrollbar />
        </div>
        <div>
          <News/>
        </div>
        <div className="info_widget">
            {
              Object.keys(data).map(crypto => (
                <div>
                  <div className="table-header">
                    <h2>{cryp.crypto}</h2>
                    <h1 
                    style={data[crypto].PRICE >= data[crypto].OPENDAY ? styles.green : styles.red}
                    >{data[crypto].PRICE.toFixed(4)}</h1>
                    <p className="currency">{crypto}</p>
                  </div>
                  <div className="bar">
                  <p className="p_left">Low: {data[crypto].LOWDAY.toFixed(4)}</p>
                  <p className="p_right">High: {data[crypto].HIGHDAY.toFixed(4)}</p>
                  <ProgressBar className="progress"
                  variant={data[crypto].PRICE >= data[crypto].OPENDAY ? "success" : "danger"}
                  now={bar}
                  />
                  </div>
                <table>
                  <tbody>
                  <tr>
                    <td>Crypto: </td>
                    <td>{data[crypto].FROMSYMBOL}</td>
                  </tr>
                  <tr>
                    <td>Currency: </td>
                    <td>{crypto}</td>
                  </tr>
                  <tr>
                    <td>Supply: </td>
                    <td>{data[crypto].FROMSYMBOL} {data[crypto].SUPPLY.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Market Cap: </td>
                    <td>{crypto} {data[crypto].MKTCAP.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Change Day: </td>
                    <td>{crypto} {data[crypto].CHANGEDAY.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Change Hour: </td>
                    <td>{crypto} {data[crypto].CHANGEHOUR.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Open: </td>
                    <td>{crypto} {data[crypto].OPENDAY.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Volume: </td>
                    <td>{data[crypto].FROMSYMBOL} {data[crypto].VOLUMEDAY.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Circulating Supply: </td>
                    <td>{crypto} {data[crypto].CIRCULATINGSUPPLYMKTCAP.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              </div>
              ))
              }  
        </div>
        <div>
         <Logout show={modalShow} 
                logout={logout} 
                onHide={() => setModalShow(false)}/>
        </div>
      </div>
  )}
}

export default Dashboard