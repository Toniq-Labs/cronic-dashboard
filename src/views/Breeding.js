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
    '& img' : {
      maxWidth: "80%",
    },
  },
}));
const API = extjs.connect("https://boundary.ic0.app/");
const formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export default function Breeding(props) {
  const classes = useStyles();
  const [cronic, setCronic] = React.useState(false);
  const [parent1, setParent1] = React.useState(false);
  const [parent2, setParent2] = React.useState(false);
  const [display, setDisplay] = React.useState(0);
  const [filterFertile, setFilterFertile] = React.useState(false);
  const [filterGeneration, setFilterGeneration] = React.useState(false);
  const [sires, setSires] = React.useState([]);
  const loadSires = async () => {
    var s = await API.canister("e3izy-jiaaa-aaaah-qacbq-cai").sires();
    setSires(s.map(a => {
      return {
        breedData : a.breedData,
        canister : "e3izy-jiaaa-aaaah-qacbq-cai",
        id : extjs.encodeTokenId("e3izy-jiaaa-aaaah-qacbq-cai", a.index),
        index : a.index,
        listing : false,
        metadata : a.metadata[0],
        sireFee : a.breedData.fee[0]
      };
    }));
  };
  const breed = async () => {
    if (!parent1 || !parent2) return props.system.error("Please select two parents to breed");
    var cost = totalCost();
    if (props.account.balance < cost) return props.system.error("You have an insufficient balance to continue");
    props.system.loader(true, "Breeding Cronics...");
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).token("uqgiq-iaaaa-aaaah-qbiea-cai").transfer(props.account.identity.getPrincipal().toText(), 0, "e3izy-jiaaa-aaaah-qacbq-cai", cost, 0n, [0, ...to32bits(parent1.index), ...to32bits(parent2.index)], true);
      setParent1(false);
      setParent2(false);
      props.system.loader(true, "Reloading your Cronics...");
      await Promise.all([props.account.loadCronics(), props.account.loadBalance(), loadSires()]);
    } catch (e) {
      console.log(e);
      props.system.error(e.Other);
    };
    props.system.loader(false);
    props.system.alert("Congratulations!", "You have bred a new Cronic!");
  };
  const nextGen = () => Math.max(parent1.breedData.generation, parent2.breedData.generation)+1;
  const totalCost = () => {
    var cost = 0;
    cost += Number(parent1.breedData.cost);
    cost += Number(parent2.breedData.cost);
    if (!isMyCronic(parent1)) cost += Number(parent1.sireFee);
    if (!isMyCronic(parent2)) cost += Number(parent2.sireFee);
    return BigInt(cost);
  }
  const parent = t => {
    if (t === 1) setParent1(cronic);
    else setParent2(cronic);
    setCronic(false);
  };
  const isMyCronic = cronic => props.account.cronics.find(c => c.id === cronic.id);
  React.useEffect(() => {
    loadSires();
  }, []);
  return (
  <>
    <Grid container spacing={1}>
      <Grid item xs={8}>
        <h2 className={classes.banner}>
          Breeding
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={filterFertile}
              onChange={e => setFilterFertile(e.target.value)}
            >
              <MenuItem value={false}>Show All</MenuItem>
              <MenuItem value={true}>Fertile Only</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={filterGeneration}
              onChange={e => setFilterGeneration(e.target.value)}
            >
              <MenuItem value={false}>All Gens</MenuItem>
              <MenuItem value={0}>Gen0</MenuItem>
              <MenuItem value={1}>Gen1</MenuItem>
              <MenuItem value={2}>Gen2</MenuItem>
              <MenuItem value={3}>Gen3</MenuItem>
              <MenuItem value={4}>Gen4</MenuItem>
              <MenuItem value={5}>Gen5</MenuItem>
            </Select>
          </FormControl>
        </h2>
        <Tabs value={display} onChange={(e,v) => setDisplay(v)} className={classes.tabs}>
          <Tab value={0} label="My Cronics" />
          <Tab value={1} label="Sires" />
        </Tabs>
        <Grid container spacing={1}>
          {display === 0 ? 
            <>
              {props.account.cronics.length === 0 ?
              <div style={{marginLeft:"20px", color:"white"}}>You don't have any Cronics</div>:
              (props.account.cronics.filter(cronic => {
                if (filterFertile && cronic.breedData.canBreed === false) return false;
                else if (filterGeneration !== false && cronic.breedData.generation !== filterGeneration) return false;
                else return true;
              }).map(cronic => {
                return (<Grid key={cronic.id} item xs={3}>
                  <a onClick={() => setCronic(cronic)} className={classes.dashButton}>
                    <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+cronic.id} /></div>
                  </a>
                </Grid>);
              })) }
            </>: 
            <>
              {sires.filter(cronic => {
                if (filterFertile && cronic.breedData.canBreed === false) return false;
                else if (filterGeneration !== false && cronic.breedData.generation !== filterGeneration) return false;
                else return true;
              }).length === 0 ?
              <div style={{marginLeft:"20px", color:"white"}}>There are no sires right now</div>:
              (sires.map(cronic => {
              return (<Grid key={cronic.index} item xs={3}>
                <a onClick={() => setCronic(cronic)} className={classes.dashButton}>
                  <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+cronic.id} /></div>
                  <p><strong>Fee: {formatNumber(Number(cronic.sireFee)/1000000)} TCRN</strong></p>
                </a>
              </Grid>);
            })) }
            </>
          }
        </Grid>
      </Grid>
    </Grid>
    <div className={classes.sideDisplay}>
      {cronic ?
      <>
        <CronicDetail cronic={cronic} />
        {!cronic.listing ?
          <>
            {cronic.breedData.canBreed ?
              <>
                {cronic.id === parent1.id ? 
                  <Button fullWidth onClick={() => {setParent1(false); setCronic(false)}} className={classes.button} variant="outlined" color={"primary"}>Remove as Parent 1</Button> 
                : ""}
                {cronic.id === parent2.id ? 
                  <Button fullWidth onClick={() => {setParent2(false); setCronic(false)}} className={classes.button} variant="outlined" color={"primary"}>Remove as Parent 2</Button> 
                : ""}
                {cronic.id !== parent1.id && cronic.id !== parent2.id ? 
                  <>
                    <Button fullWidth onClick={() => parent(1)} className={classes.button} variant="outlined" color={"primary"}>Set as Parent 1</Button> 
                    <Button fullWidth onClick={() => parent(2)} className={classes.button} variant="outlined" color={"primary"}>Set as Parent 2</Button> 
                  </>
                : ""}
                <Button fullWidth onClick={() => setCronic(false)} className={classes.button} variant="outlined" color={"primary"}>Back</Button> 
              </> : 
              <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>Can breed <Timestamp relative autoUpdate date={Math.floor(Number(cronic.breedData.breedTime[0])/1000000000)} /></span>
              
            }
          </> :
          <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>Can't breed if listed on the Marketplace</span>
        }
      </> : 
      <>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <h3 className={classes.smallbanner}>Parent 1</h3>
            <div className={classes.breedParent}>{ parent1 ? <a style={{cursor:"pointer"}} onClick={() => setCronic(parent1)}><Image size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+parent1.id} /></a> : <img src={"selectCronic.png"} />}</div>
            { parent1 ?
              <Grid style={{color:"white", textAlign:"left", fontSize:"0.9em", padding:10}} container spacing={1}>
                {!isMyCronic(parent1) ?
                <>
                  <Grid item xs={3}><strong>Fee</strong></Grid>
                  <Grid item xs={9}>{Number(parent1.sireFee)/1000000} <small>TCRN</small></Grid>
                </> : ""}
                <Grid item xs={3}><strong>Cost</strong></Grid>
                <Grid item xs={9}>{Math.floor(Number(parent1.breedData.cost)/1000000)} <small>TCRN</small></Grid>
              </Grid>
            : "" }
          </Grid>
          <Grid item xs={6}>
            <h3 className={classes.smallbanner}>Parent 2</h3>
            <div className={classes.breedParent}>{ parent2 ? <a style={{cursor:"pointer"}} onClick={() => setCronic(parent2)}><Image size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+parent2.id} /></a> : <img src={"selectCronic.png"} />}</div>
            { parent2 ?
              <Grid style={{color:"white", textAlign:"left", fontSize:"0.9em", padding:10}} container spacing={1}>
                {!isMyCronic(parent2) ?
                <>
                  <Grid item xs={3}><strong>Fee</strong></Grid>
                  <Grid item xs={9}>{Number(parent2.sireFee)/1000000} <small>TCRN</small></Grid>
                </> : ""}
                <Grid item xs={3}><strong>Cost</strong></Grid>
                <Grid item xs={9}>{Math.floor(Number(parent2.breedData.cost)/1000000)} <small>TCRN</small></Grid>
              </Grid>
            : "" }
          </Grid>
        </Grid>
        { parent1 && parent2  ?
          <>
            <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>Total Cost: {Number(totalCost())/1000000} TCRN</span>
            <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:-5}}>Offspring Generation: {nextGen()}</span>
            <Button  fullWidth onClick={breed} style={{color: "#2bede6", borderColor: "#2bede6", marginTop:10}} color={"primary"} variant="outlined">Start Breeding</Button> 
          </>
      : <span style={{color:"white", display:"block", fontWeight:"bold", color: "#2bede6", padding:8, marginTop:10}}>Please select two parents</span>}
      </>
      }
    </div>
  </>
  );
}