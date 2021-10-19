import React from 'react';
import Button from '@material-ui/core/Button';

export default function Login(props) {
  return (
  <div style={{textAlign:"center", marginTop:100}}>
    <img style={{display:"block", margin:"0 auto"}} src={"login.png"} />
    <Button style={{maxWidth:250, marginTop:40}} fullWidth variant={"outlined"} color={"primary"} onClick={() => props.account.login("stoic")}>Connect Stoic Wallet</Button><br />
    <Button style={{maxWidth:250, marginTop:40}} fullWidth variant={"outlined"} color={"primary"} onClick={() => props.account.login("plug")}>Connect Plug Wallet</Button>
  </div>
  );
}