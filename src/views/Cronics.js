import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Image from '../components/Image';
import { makeStyles } from '@material-ui/core/styles';

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
}));
export default function Cronics(props) {
  const classes = useStyles();
  return (
  <>
    <h2 className={classes.banner}>My Cronics</h2>
    <Grid container spacing={1}>
      {props.account.cronics.map(cronic => {
        return (<Grid key={cronic.id} item xs={2}>
          <a className={classes.dashButton} onClick={() => props.changeRoute('cronic', {cronic})}>
            <div><Image style={{position:"absolute", top:20, left:0, right:0}} size={110} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+cronic.id} /></div>
          </a>
        </Grid>);
      })}
    </Grid>
  </>
  );
}