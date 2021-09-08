import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Image from '../components/Image';
import { makeStyles } from '@material-ui/core/styles';
import extjs from '../ic/extjs.js';
import { to32bits} from "../ic/utils.js";

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
  banner: {
    color:"#2bede6",
    padding:10,
    marginLeft:15,
    marginRight:15,
    marginTop:0,
    backgroundColor: "#2bede617",
    borderBottom: "1px solid #2bede6",
  },
  button: {
    color: "#2bede6", 
    borderColor: "#2bede6", 
    marginTop:10
  },
}));
const API = extjs.connect("https://boundary.ic0.app/");
const formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export default function Shop(props) {
  const classes = useStyles();
  const [items, setItems] = React.useState([]);
  const loadItems = async () => {
    var s = await API.canister("tde7l-3qaaa-aaaah-qansa-cai").getShopItems();
    setItems(s.map(a => {
      var link = "";
      for(var name in a[1][0].wearable){
        link = name + "=" + a[1][0].wearable[name];
      }
      return {
        id : a[0],
        price : a[1][0].price,
        title : a[1][0].title,
        link : link,
        limit : (a[1][0].limit.length ? Number(a[1][0].limit[0]) : 0),
        minted : Number(a[1][1])
      };
    }));
  };
  const buy = async item => {
    if (props.account.balance < item.price) return props.system.error("You have an insufficient balance to continue");
    var v = await props.system.confirm("Buying Wearable", "Are you sure you want to buy " + item.title + " for " + formatNumber(Number(item.price)/1000000) + " TCRN?");
    if (v) {
      props.system.loader(true, "Buying " + item.title + "...");
      try {
        var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).token("uqgiq-iaaaa-aaaah-qbiea-cai").transfer(props.account.identity.getPrincipal().toText(), 0, "tde7l-3qaaa-aaaah-qansa-cai", item.price, 0n, [0, ...to32bits(item.id)], true);
        props.system.loader(true, "Reloading shop...");
        await Promise.all([props.account.loadBalance(), props.account.loadWearables(), loadItems()]);
      } catch (e) {
        console.log(e);
        props.system.error(e.Other);
      };
      props.system.loader(false);
      props.system.alert("Congratulations!", "You have bought a new Wearable!");
    };
  };
  React.useEffect(() => {
    loadItems();
  }, []);
  return (
  <>
    <h2 className={classes.banner}>Wearable Store</h2>
    <Grid container spacing={1}>
      {items.length === 0 ?
        <div style={{marginLeft:"20px", color:"white"}}>There are no wearables for sale right now</div>:
        (items.map(item => {
        return (<Grid key={item.id} item xs={2}>
          <a onClick={() => buy(item)} className={classes.dashButton}>
            <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://tde7l-3qaaa-aaaah-qansa-cai.raw.ic0.app/?"+item.link} /></div>
            <p>{item.title}<br /><strong>{formatNumber(Number(item.price)/1000000)} TCRN</strong></p>
          </a>
        </Grid>);
      })) }
      
    </Grid>
  </>
  );
}