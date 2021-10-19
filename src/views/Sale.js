/* global BigInt */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import extjs from '../ic/extjs.js';
import Timestamp from 'react-timestamp';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Image from '../components/Image';
import CronicDetail from '../components/CronicDetail';
import { makeStyles } from '@material-ui/core/styles';
import { to32bits} from "../ic/utils.js";
import getNftv from "../ic/nftv.js";

const useStyles = makeStyles((theme) => ({
  dashButton: {
    position:"relative", 
    cursor:"pointer", 
    width:139, 
    display:"block", 
    margin:"0 auto",
    overflow :"hidden",
    '&>div' : {
      display:"block", 
      width:139,
      height:145,
      background:"url('box-bg.png') 0 0 no-repeat",
    },
    '& p' : {
      color:"white", 
      textAlign:"center"
    },
  },
  smallbanner: {
    color:"#2bede6",
    padding:10,
    marginLeft:15,
    marginRight:15,
    marginTop:0,
    borderBottom: "1px solid #2bede6",
  },
  banner: {
    color:"#2bede6",
    padding:10,
    marginLeft:15,
    marginRight:15,
    marginTop:0,
    backgroundColor: "#2bede617",
    borderBottom: "1px solid #2bede6",
  },
  tabs: {
    margin:"-17px 15px 20px",
    backgroundColor:"#2bede617",
    color: "#2bede6",
    '& button' : {
      minWidth:"120px",
      fontSize:".9em",
    }
  },
  breedParent: {
    '& img' : {
      width:"125px",
    }
  },
  formControl: {
    top:3,
    marginLeft:20,
    '& .MuiSelect-root' : {
      paddingTop:5,
      paddingBottom:5,
    },
  },
  sideDisplay: {
    position:"absolute",
    width:300,
    padding:5,
    textAlign: "center",
    zIndex :0,
    top:110,
    right:70,
    //backgroundColor: "#2bede617",
    //border: "1px solid #2bede6",
    backgroundRepeat: "no-repeat",
    backgroundImage: "linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(to bottom left, transparent calc(50% - 1px), #2bede6 calc(50% - 1px), #2bede6 calc(50% + 1px), transparent calc(50% + 1px)), linear-gradient(transparent, transparent), linear-gradient(transparent, transparent)",
    backgroundSize: "1px 100%, 1px 100%, 100% 1px, 100% 1px, 25px 25px, 100% 100%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 25px, -25px 0%, 0px 100%, 100% 0%, -25px 0%, 100% 25px",
    '&:after' : {
      content: `''`,
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      opacity: 0.08,
      backgroundRepeat: "no-repeat",
      backgroundImage: "linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6), linear-gradient(to bottom left, transparent calc(50% - 1px), #2bede6 calc(50% - 1px), #2bede6 calc(50% + 1px), #2bede6 calc(50% + 1px)), linear-gradient(#2bede6, #2bede6), linear-gradient(#2bede6, #2bede6)",
      backgroundSize: "1px 100%, 1px 100%, 100% 1px, 100% 1px, 25px 25px, 100% 100%, 100% 100%",
      backgroundPosition: "0% 0%, 100% 25px, -25px 0%, 0px 100%, 100% 0%, -25px 0%, 100% 25px",
    },
  },
}));
const API = extjs.connect("https://boundary.ic0.app/");
const formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const getNexPriceDrop = t => {
  var p = getPrice(t);
  var pdiff = 24 - p + 1;
  return Number(t/1000000000n) + (pdiff * 60);
};
const getPrice = t => {
  var diff = Date.now() - Number(t/1000000n);
  return Math.max(Math.min(24, 24 - Math.floor(diff/60000)), 5);
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
const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
export default function Breeding(props) {
  const classes = useStyles();
  const [cronic, setCronic] = React.useState(false);
  const [cronics, setCronics] = React.useState([]);
  const [unsold, setUnsold] = React.useState(5000);
  const [sortBy, setSortBy] = React.useState("price_asc");
  const loadSalesStats = async () => {
    var s = await API.canister("e3izy-jiaaa-aaaah-qacbq-cai").salesStats();
    setUnsold(Number(s[2]));
    var cronics = s[1].map(el => {
      return {
        saleTime : el[1],
        listing : false,
        sireFee : false,
        metadata : el[2].nonfungible.metadata[0],
        id : extjs.encodeTokenId("e3izy-jiaaa-aaaah-qacbq-cai", el[0]),
        index : el[0],
        breedData : {
          canBreed : false,
          generation : 0,
          generation : 0,
        },
        nftv : getNftv(el[0])
      };
    });
    setCronics(cronics);
    setCronic(cronics[0]);
  };
  const buy = async c => {
    var price = (BigInt(getPrice(c.saleTime)) * 100000000n);
    if (props.account.balance < ((BigInt(getPrice(c.saleTime)) * 100000000n) + 10000n)) return props.system.error("You have an insufficient balance to continue (don't foget to add 0.0001ICP fee)");
    var v = await props.system.confirm("Buying Cronic", "Are you sure you want to buy this Cronic for " + formatNumber(getPrice(c.saleTime)) + " ICP?");
    if (v) {
      props.system.loader(true, "Reserving Cronic...");
      try {
        var api = extjs.connect("https://boundary.ic0.app/", props.account.identity);
        var r = await api.canister("e3izy-jiaaa-aaaah-qacbq-cai").reserve(cronic.id, price, props.account.address, _getRandomBytes());
        if (r.hasOwnProperty("err")) throw r.err;
        var paytoaddress = r.ok[0];
        var pricetopay = r.ok[1];
        props.loader(true, "Transferring ICP...");
        await api.token().transfer(props.account.identity.getPrincipal().toText(), 0, paytoaddress, pricetopay, 10000);
        var r3;
        props.loader(true, "Completing purchase...");
        await api.canister("e3izy-jiaaa-aaaah-qacbq-cai").retreive(paytoaddress);
        props.system.loader(true, "Reloading data...");
        await Promise.all([props.account.loadBalance(), props.account.loadCronics(), loadSalesStats()]);
      } catch (e) {
        console.log(e);
        props.system.loader(false);
        props.system.error(e.Other ?? e);
        return;
      };
      props.system.loader(false);
      props.system.alert("Congratulations!", "You have bought a new Cronic!");
    };
  };
  
  useInterval(loadSalesStats, 30 *1000);
  React.useEffect(() => {
    loadSalesStats();
  }, []);
  return (
  <>
    <Grid container spacing={1}>
      <Grid item md={8} sm={7} xs={12}>
        <h2 className={classes.banner}>
          Public Sale
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <MenuItem value={'price_asc'}>Price: Low to High</MenuItem>
              <MenuItem value={'price_desc'}>Price: High to Low</MenuItem>
              <MenuItem value={'mint'}>Minting #</MenuItem>
              <MenuItem value={'type'}>Rare Type</MenuItem>
              <MenuItem value={'nri'}>NFT Rarity Index</MenuItem>
              <MenuItem value={'overall'}>Overall Battle %</MenuItem>
              <MenuItem value={'warrior'}>Warrior Battle %</MenuItem>
              <MenuItem value={'basehigh'}>Base High %</MenuItem>
              <MenuItem value={'baselow'}>Base Low %</MenuItem>
              <MenuItem value={'twin'}>Twin %</MenuItem>
            </Select>
          </FormControl>
          <span style={{float:"right"}}>{unsold} Cronics remaining</span>
        </h2>
        <Grid container spacing={1}>
          {cronics
          .slice()
          .filter(cronic => {
            var diff = Date.now() - (Number(cronic.saleTime/1000000n));
            if (diff > 3600000000) return false;
            return true;
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "price_asc":
                return Number(a.saleTime - b.saleTime);
              case "price_desc":
                return Number(b.saleTime - a.saleTime);
              case "nri":
                return (b.nftv.nri ) - (a.nftv.nri );
              case "mint_number":
                return a.index - b.index;
              case "type":
                var _a, _b, d;
                _a = a.metadata[30] % 41;
                _b = b.metadata[30] % 41;
                if (_a === 2) _a = 1;
                if (_a > 1) _a = 2;
                if (_b === 2) _b = 1;
                if (_b > 1) _b = 2;
                d = _a - _b;
                if (d === 0) {
                  if (Number(a.saleTime) > Number(b.saleTime))
                    return 1;
                  if (Number(a.saleTime) < Number(b.saleTime))
                    return -1;
                }
                return d;
              case "overall":
                return (b.nftv.overall ) - (a.nftv.overall );
              case "warrior":
                return (b.nftv.warrior ) - (a.nftv.warrior );
              case "basehigh":
                return (b.nftv.basehigh ) - (a.nftv.basehigh );
              case "baselow":
                return (b.nftv.baselow ) - (a.nftv.baselow );
              case "twin":
                return (b.nftv.twin ) - (a.nftv.twin );
              default:
                return 0;
            }
          })
          .map(cronic => {
            return (<Grid style={{textAlign:"center"}} key={cronic.id} item md={3} sm={4} xs={6}>
              <a className={classes.dashButton} onClick={() => setCronic(cronic)}>
                <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+cronic.id} /></div>
              </a>
              {Number(cronic.saleTime/1000000n) <= Date.now() ?
              <Button onClick={() => buy(cronic)} style={{marginTop:10, marginBottom: 15}} className={classes.button} variant="outlined" color={"primary"}>Buy @ {getPrice(cronic.saleTime)} ICP</Button> : "" } 
            </Grid>);
          })}
        </Grid>
      </Grid>
    </Grid>
    <div className={classes.sideDisplay}>
      {cronic ?
        <>
          <CronicDetail cronic={cronic} /><br />          
          {Number(cronic.saleTime/1000000n) <= Date.now() ?
          <>
          <hr /><br /> 
          <strong>Price will drop in <Timestamp relative autoUpdate date={getNexPriceDrop(cronic.saleTime)} /></strong><br />
            <Button onClick={() => buy(cronic)} style={{marginTop:10, marginBottom: 15}} className={classes.button} variant="outlined" color={"primary"}>Buy @ {getPrice(cronic.saleTime)} ICP</Button></>: 
            <>
              <hr /><br /> 
              <strong>Sale starts in <Timestamp relative autoUpdate date={Number(cronic.saleTime/1000000000n)} /></strong><br /> 
            </>}
        </>
        : ""
      }<br />
    </div>
  </>
  );
}