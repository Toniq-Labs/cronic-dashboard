/* global BigInt */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function SireForm(props) {
  const [price, setPrice] = React.useState(0);
        
  const error = (e) => {
    props.error(e);
  }
  const save = () => {
    if (price === 0) return props.system.error("You can't enter a value of 0");
    props.process(BigInt(Math.floor(price*(10**6))));
    handleClose();
  };
  const handleClose = () => {
    setPrice(0);
    props.close()
  };
  React.useEffect(() => {
    setPrice(props.cronic.sireFee ? props.cronic.sireFee : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cronic]);

  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth >
        <DialogTitle id="form-dialog-title" style={{textAlign:'center'}}>Sire Program</DialogTitle>
        <DialogContent>

        {props.cronic.sireFee && props.cronic.sireFee > 0 ?
        <DialogContentText style={{textAlign:'center',fontWeight:'bold'}}>Please enter a fee below to update your Sire listing</DialogContentText> : 
        <DialogContentText style={{textAlign:'center',fontWeight:'bold'}}>Please enter a fee below to create a new Sire listing</DialogContentText>
        }
          <TextField
            style={{width:'100%'}}
            margin="dense"
            label={"Sire fee in TCRN"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Back</Button>
          <Button onClick={save} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
