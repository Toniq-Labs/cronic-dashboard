/* global BigInt */
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

export default function Image(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  React.useEffect(() => {
    setImgLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);
  return (
    <div style={props.style}>
      <Skeleton style={{backgroundColor:"rgb(45 232 226 / 33%)", margin: "0 auto", width:props.size, height: props.size, display:(imgLoaded ? "none" : "block")}} variant="circle"  />
      <img onLoad={() => setImgLoaded(true)} style={{margin: "0 auto", width:props.size, height: props.size,display:(imgLoaded ? "block" : "none")}} src={props.src} id={props.id} />
    </div>
  );
}
