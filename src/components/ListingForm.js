/* global BigInt */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ListingForm(props) {
  const [price, setPrice] = React.useState(0);
        
  const error = (e) => {
    props.error(e);
  }
  const save = () => {
    if (price === 0) return props.system.error("Please enter a sale price");
    props.process(BigInt(Math.floor(price*(10**8))));
    handleClose();
  };
  const handleClose = () => {
    setPrice(0);
    props.close()
  };
  React.useEffect(() => {
    setPrice(props.cronic.listing ? Number(props.cronic.listing.price)/100000000 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cronic]);

  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth >
        <DialogTitle id="form-dialog-title" style={{textAlign:'center'}}>Marketplace Listing</DialogTitle>
        <DialogContent>

        {props.cronic.listing && props.cronic.listing.price > 0 ?
        <DialogContentText style={{textAlign:'center',fontWeight:'bold'}}>Please enter a price below to update your marketplace listing. There is a 1.5% commission fee on all sales</DialogContentText> : 
        <DialogContentText style={{textAlign:'center',fontWeight:'bold'}}>Please enter a price below to create a new marketplace listing. Once you save the listing, it becomes available to the public. There is a 1.5% commission fee on all sales</DialogContentText>
        }
          <TextField
            style={{width:'100%'}}
            margin="dense"
            label={"Listing price in ICP"}
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
