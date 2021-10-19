import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import extjs from '../ic/extjs.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dashButton: {
    position:"relative", 
    cursor:"pointer", 
    width:139, 
    display:"block", 
    margin:"0 auto",
    overflow :"hidden",
    '& div' : {
      display:"block", 
      width:139,
      height:145,
      background:"url('box-bg.png') 0 0 no-repeat",
      '& img' : {
        position:"absolute",
        top:30,
        left:25
      }
    },
    '& p' : {
      color:"white", 
      textAlign:"center"
    },
  }
}));
export default function Dashboard(props) {
  const classes = useStyles();
  const faucet = async () => {
    try {
      props.system.loader(true, "Getting free TCRN...");
      var r = await extjs.connect("https://boundary.ic0.app/", props.account.identity).canister("uqgiq-iaaaa-aaaah-qbiea-cai").faucet();
      if (!r) throw new Error("You have more than enough!"); 
      props.system.loader(true, "Reloading balance...");
      await props.account.loadBalance();
    } catch (e) {
      console.log(e, typeof e);
      if (e instanceof Error) props.system.error(e.message);
      else if (e.hasOwnProperty("Other")) props.system.error(e.Other);
      else props.system.error("Unknown error");
    };
    props.system.loader(false);
  };
  return (
  <>
    <img style={{width:"100%", marginBottom:20}} src="banner.png" />
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.changeRoute('cronics')}>
          <div><img src="icon/cronics.png" /></div>
          <p>My Cronics</p>
        </a>
      </Grid>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.changeRoute('shop')}>
          <div><img src="icon/store.png" /></div>
          <p>Wearable Store</p>
        </a>
      </Grid>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.changeRoute('games')}>
          <div><img src="icon/games.png" /></div>
          <p>Minigames</p>
        </a>
      </Grid>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.changeRoute('breeding')}>
          <div><img src="icon/breed.png" /></div>
          <p>Breeding</p>
        </a>
      </Grid>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.changeRoute('sale')}>
          <div><img src="icon/marketplace.png" /></div>
          <p>Public Sale</p>
        </a>
      </Grid>
    </Grid>
  </>
  );
}