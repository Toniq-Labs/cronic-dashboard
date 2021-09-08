import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
      '& img' : {
        borderRadius:"35px",
        border:"2px dashed #1e8281",
        width:"100%"
      }
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
}));
export default function Games(props) {
  const classes = useStyles();
  return (
  <>
    <h2 className={classes.banner}>Cronic Minigames</h2>
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.system.error("This game is coming soon...")}>
          <div><img src="battle.png" /></div>
          <p>Cronic Fight</p>
        </a>
      </Grid>
      <Grid item xs={2}>
        <a className={classes.dashButton} onClick={() => props.system.error("This game is coming soon...")}>
          <div><img src="beauty.png" /></div>
          <p>Beauty Tour</p>
        </a>
      </Grid>
    </Grid>
  </>
  );
}