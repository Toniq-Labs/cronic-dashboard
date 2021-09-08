import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import extjs from './ic/extjs.js';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Login from './views/Login';
import IconButton from '@material-ui/core/IconButton';
import Dashboard from './views/Dashboard';
import Cronics from './views/Cronics';
import Cronic from './views/Cronic';
import Shop from './views/Shop';
import Games from './views/Games';
import Breeding from './views/Breeding';
import {StoicIdentity} from "ic-stoic-identity";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#2d2d2d",
  }
}));
const routes = {
  'login' : {
    title : "Login",
    view : Login
  },
  'dashboard' : {
    title : "Dashboard",
    view : Dashboard
  },
  'cronics' : {
    title : "Cronics",
    view : Cronics,
    back : 'dashboard',
  },
  'cronic' : {
    title : "Cronic",
    view : Cronic,
    back : 'cronics',
  },
  'shop' : {
    title : "Shop",
    view : Shop,
    back : 'dashboard',
  },
  'games' : {
    title : "Games",
    view : Games,
    back : 'dashboard',
  },
  'breeding' : {
    title : "Breeding",
    view : Breeding,
    back : 'dashboard',
  },
};
//Helpers
const formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const API = extjs.connect("https://boundary.ic0.app/");
export default function CronicApp(props) {
  const classes = useStyles();
  const [route, setRoute] = React.useState('login');
  const [identity, setIdentity] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [wearables, setWearables] = React.useState([]);
  const [cronics, setCronics] = React.useState([]);
  const [passthrough, setPassthrough] = React.useState({});

  const renderView = (r) => {
    switch(r){
      default:
        return React.createElement(routes[r].view, {...props,  ...passthrough, changeRoute, account : {balance, address, login, logout, identity, cronics, wearables, reload, loadCronics, loadWearables, loadBalance}})
    }
  }
  const whitelist = ["e3izy-jiaaa-aaaah-qacbq-cai", "tde7l-3qaaa-aaaah-qansa-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai", "uqgiq-iaaaa-aaaah-qbiea-cai"];
  const login = async (t) => {
    props.system.loader(true, "Connecting your wallet...");
    try {
      var id;
      switch(t) {
        case "stoic":
          id = await StoicIdentity.connect();
          if (id) {
            setIdentity(id);
            localStorage.setItem("_loginType", t);
            changeRoute('dashboard');
          } else {
            throw "Failed to connect to your wallet";
          }
        break;
        case "plug":
          const result = await window.ic.plug.requestConnect({
            whitelist : whitelist
          });
          if (result) {
            id = await window.ic.plug.agent._identity;
          } else {
            throw "Failed to connect to your wallet";
          }
        break;
        default:
          throw "No method selected";
        break;
      };
      if (id) {
        setIdentity(id);
        localStorage.setItem("_loginType", t);
        changeRoute('dashboard');
      } else {
        throw "Failed to login";
      };
    } catch (e) {
      props.system.error(e);
    };
    props.system.loader(false);
  };
  const logout = async () => {
    var t = localStorage.getItem("_loginType");
    if (t){
      localStorage.removeItem("_loginType");
      switch(t){
        case "stoic":
          StoicIdentity.disconnect();
        break;
        case "plug":

        break;
      }
    }
    setIdentity(false);
    changeRoute('login');
  };
  const backButton = () => {
    if (typeof routes[route].back !== 'undefined') {
      return (<IconButton onClick={() => changeRoute(routes[route].back)}><ArrowBackIosIcon style={{color:"white"}} /></IconButton>);
    } else return "";
  }
  const changeRoute = (r, a) => {
    setRoute(r);
    if (a) setPassthrough(a);
  };
  const reload = async() => {
    await Promise.all([loadBalance(), loadCronics(), loadWearables()]);
  };
  const loadBalance = async (_address) => {
    setBalance(await API.token("uqgiq-iaaaa-aaaah-qbiea-cai").getBalance(_address ?? address));
  };
  const loadCronics = async (_address) => {
    var cronics = await API.token("e3izy-jiaaa-aaaah-qacbq-cai").getTokens(_address ?? address);
    setCronics(cronics.map(a => {
      return {
        ...a,
        breedData : a.raw[3][0],
        sireFee : a.raw[3][0].fee.length ? a.raw[3][0].fee[0] : false,
      };
    }));
  };
  const loadWearables = async (_address) => {
    setWearables(await API.token("tde7l-3qaaa-aaaah-qansa-cai").getTokens(_address ?? address));
  };
  useInterval(reload, 30 *1000);
  React.useEffect(() => {
    if (identity) {
      var address = extjs.toAddress(identity.getPrincipal().toText(), 0);
      setAddress(address);
      loadCronics(address);
      loadWearables(address);
      loadBalance(address);
    }
  }, [identity]);
  React.useEffect(() => {
    var t = localStorage.getItem("_loginType");
    if (t) {
      props.system.loader("Connecting...");
      switch(t){
        case "stoic":
          StoicIdentity.load().then(id => {
            if (id !== false) {
              setIdentity(id);
              changeRoute('dashboard');
              props.system.loader(false);
            } else {
              logout();
              props.system.error("You were disconnected");
            };
          })
        break;
        case "plug":
          (async () => {
            const connected = await window.ic.plug.isConnected();
            if (connected){
              if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({
                  whitelist : whitelist
                })
              }
              var id = await window.ic.plug.agent._identity;
              setIdentity(id);
              changeRoute('dashboard');
              props.system.loader(false);
            } else {
              logout();
              props.system.error("You were disconnected");
            }
          })();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <div style={{boxShadow: `0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%) !important`, width:"1200px", margin: "0 auto", height: "780px", border: "solid 1px #121920", marginTop : "20px",backgroundImage:"url('bg.png')", backgroundSize:"cover", backgroundColor:"#121920"}}>
        { route !== "login" ?
          <AppBar position="relative" style={{ border:"none", background: 'linear-gradient(#0d1114, #0e1519)', height: 90}}>
            <Toolbar style={{height:90}}>
              <img onClick={() => changeRoute('dashboard')} alt="Cronic" src="logo.png" style={{height:64, cursor: "pointer", marginRight:"10px"}} />
              {backButton()}
              <h2 style={{color:"white"}}>{routes[route].title}</h2>
              <Button onClick={() => changeRoute('dashboard')} variant="outlined" color="inherit">Logout</Button>
              <div style={{marginLeft:'auto'}}>
                <Button variant="outlined" color={"primary"}>{formatNumber(Number(balance)/1000000)} tCRN</Button>
                <Button style={{marginLeft:10}} onClick={logout} variant="outlined" color={"primary"}>Logout</Button>
              </div>
            </Toolbar>
          </AppBar>
        : "" }
        <div style={{width:"100%", height:"calc(100% - 90px)", padding:"20px 50px 50px", overflowY : "scroll"}}>
        {renderView(route)}
        </div>
      </div>
    </div>
  );
}
