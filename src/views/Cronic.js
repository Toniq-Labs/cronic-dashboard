import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CronicDetail from '../components/CronicDetail';
import ListingForm from '../components/ListingForm';
import SireForm from '../components/SireForm';
import Image from '../components/Image';
import extjs from '../ic/extjs.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sideDisplay: {
    position:"absolute",
    width:300,
    padding:5,
    textAlign: "center",
    zIndex :0,
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
    '& img' : {
      maxWidth: "80%",
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
  abutton: {
    color: "#2bede6", 
    borderColor: "#2bede6", 
    marginTop:10
  },
  imgContainer: {
    position: "relative",
    '& #listed' : {
      position: "absolute",
      top:30,
      left:20,
      color: "#2bede6"
    },
    '& #cantBreed' : {
      position: "absolute",
      bottom:30,
      left:20,
      color: "#2bede6"
    },
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
  }
}));
export default function Cronic(props) {
  const classes = useStyles();
  const [cronic, setCronic] = React.useState(props.cronic);
  const [wearableFilter, setWearableFilter] = React.useState(4);
  const [wearables, setWearables] = React.useState([]);
  const [openListingForm, setOpenListingForm] = React.useState(false);
  const [openSireForm, setOpenSireForm] = React.useState(false);
  const [selectedCronic, setSelectedCronic] = React.useState(false);
  const removeWearables = async () => {
    if (cronic.listing) return props.system.error("You can not dress a Cronic that is listed on the marketplace");
    try {
      props.system.loader(true, "Stripping your Cronic...");
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).token(cronic.id).transfer(props.account.identity.getPrincipal().toText(), 0, props.account.address, 1n, 0n, "00", false);
      var el = document.getElementById("selectedCronicImg");     
      el.src = el.src+"?t=" + new Date().getTime(); 
      props.system.loader(true, "Reloading wearables...");
      await props.account.loadWearables();
    } catch (e) {
      console.log(e);
      props.system.error(e.Other);
    };
    props.system.loader(false);
    
  };
  const _list = async p => {
    if (p === 0) props.system.loader(true, "Cancelling listing...");
    else if (p && cronic.listing) props.system.loader(true, "Updating listing...");
    else props.system.loader(true, "Creating listing...");
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).token(cronic.id).list(0, p);
      props.system.loader(true, "Reloading Cronic...");
      await props.account.loadCronics();
    } catch (e) {
      console.log(e);
      props.system.error(e.Other);
    };
    props.system.loader(false);
  };
  const _sire = async p => {
    if (p === 0) props.system.loader(true, "Cancelling sire...");
    else if (p && cronic.sireFee) props.system.loader(true, "Updating sire...");
    else props.system.loader(true, "Creating sire...");
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).canister("e3izy-jiaaa-aaaah-qacbq-cai").sire({
        token : cronic.id,
        from_subaccount : [extjs.toSubaccount(0)],
        price : (p ? [p] : [])
      });
      props.system.loader(true, "Reloading Cronic...");
      await props.account.loadCronics();
    } catch (e) {
      console.log(e);
      props.system.error(e.Other);
    };
    props.system.loader(false);
  }
  const list = async cronic => {
    setSelectedCronic(cronic);
    setOpenListingForm(true);
  }
  const sire = async () => {
    setSelectedCronic(cronic);
    setOpenSireForm(true);
  }
  const closeListingForm = () => {
    setOpenListingForm(false);
    setTimeout(() => setSelectedCronic(false), 300);
  };
  const closeSireForm = () => {
    setOpenSireForm(false);
    setTimeout(() => setSelectedCronic(false), 300);
  };
  const addWearable = async wearable => {
    if (cronic.listing) return props.system.error("You can not dress a Cronic that is listed on the marketplace");
    if (wearable.listing) return props.system.error("Can not send this wearable as it is listed on the marketplace");
    try {
      props.system.loader(true, "Dressing your Cronic...");
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).token(wearable.id).transfer(props.account.identity.getPrincipal().toText(), 0, cronic.id, 1n, 0n, "00", false);
      var el = document.getElementById("selectedCronicImg");     
      el.src = el.src+"?t=" + new Date().getTime(); 
      props.system.loader(true, "Reloading wearables...");
      await props.account.loadWearables();
    } catch (e) {
      console.log(e);
      props.system.error(e.Other);
    };
    props.system.loader(false);
  };
  React.useEffect(() => {
    setWearables(props.account.wearables.filter(w => {
      switch(wearableFilter) {
        case 4:
          return true;
        break;
        default:
          return (w.metadata[0] === wearableFilter)
        break;
      };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account.wearables, wearableFilter]);
  
  React.useEffect(() => {
    setCronic(props.account.cronics.find(a => a.id === cronic.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account.cronics]);

  return (
  <>
    <div className={classes.sideDisplay}>
      <CronicDetail cronic={cronic} />
      { cronic.listing ?
        <>
          <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>{ cronic.listing ? <>Listed @ {Number(cronic.listing.price)/100000000} ICP</> : "" }</span>
          <Button onClick={() => _list(0)} fullWidth style={{color: "#2bede6", borderColor: "#2bede6", marginTop:10}} color={"primary"} variant="outlined">Cancel Listing</Button> 
        </>
      :
        ( cronic.sireFee  ?
          <>
            <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>{ cronic.sireFee ? <>Siring @ {Number(cronic.sireFee/1000000n)} TCRN</> : "" }</span>
            <Button onClick={() => _sire(0)} fullWidth style={{color: "#2bede6", borderColor: "#2bede6", marginTop:10}} color={"primary"} variant="outlined">Cancel Siring</Button> 
          </>
        :
          <>
            <Button onClick={removeWearables} fullWidth className={classes.button} variant="outlined" color={"primary"}>Remove Wearables</Button>
            {cronic.breedData.canBreed ?
            <Button onClick={list} fullWidth className={classes.button} variant="outlined" color={"primary"}>List on Marketplace</Button>  : "" }
              <Button onClick={sire} fullWidth className={classes.button} variant="outlined" color={"primary"}>Sire Cronic</Button>
          </>
        )
      }
    </div>
    <Grid container spacing={1}>
      <Grid item xs={8} style={{marginLeft:"auto"}}>
        <h2 className={classes.banner}>Wearables</h2>
        <Tabs value={wearableFilter} onChange={(e,v) => setWearableFilter(v)} className={classes.tabs}>
          <Tab value={4} label="All" />
          <Tab value={1}label="Hats/Hair" />
          <Tab value={3}label="Pets" />
          <Tab value={0}label="Accessories" />
          <Tab value={2}label="Eyewear" />
        </Tabs>
        <Grid container spacing={1}>
          {wearables.length ?
          (wearables.map(wearable => {
            return (<Grid key={wearable.index} item xs={3}>
              <span className={classes.dashButton}>
                <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://tde7l-3qaaa-aaaah-qansa-cai.raw.ic0.app/?tokenid="+wearable.id} /></div>
                <Button className={classes.button} onClick={() => addWearable(wearable)} color={"primary"} fullWidth variant="outlined">Add</Button>
              </span>
            </Grid>);
          })) :
            <div style={{marginLeft:"20px", color:"white"}}>No wearables</div>
          }
        </Grid>
      </Grid>
    </Grid>
    <ListingForm open={openListingForm} close={closeListingForm} process={_list} system={props.system} cronic={selectedCronic} />
    <SireForm open={openSireForm} close={closeSireForm} process={_sire} system={props.system} cronic={selectedCronic} />
  </>
  );
}