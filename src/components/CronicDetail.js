import React from 'react';
import Grid from '@material-ui/core/Grid';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';
import StorefrontIcon from '@material-ui/icons/Storefront';
import Image from './Image';
import { makeStyles } from '@material-ui/core/styles';
const getGenes = genes => {
  var geneSegments = [
    decodeToSegment([genes[0], genes[1], genes[2]]),
    decodeToSegment([genes[3], genes[4], genes[5]]),
    decodeToSegment([genes[6], genes[7], genes[8]]),
    decodeToSegment([genes[9], genes[10], genes[11]]),
    decodeToSegment([genes[12], genes[13], genes[14]]),
    decodeToSegment([genes[15], genes[16], genes[17]]),
    decodeToSegment([genes[18], genes[19], genes[20]]),
    decodeToSegment([genes[21], genes[22], genes[23]]),
    decodeToSegment([genes[24], genes[25], genes[26]]),
    decodeToSegment([genes[27], genes[28], genes[29]]),
  ];
  return {
    //Temp mapping for old mouth/accessory trait
    legacy : {
      mouth : getGeneOptions(10, geneSegments[3][0], geneSegments[3][1]).dominant,
      accessory : getGeneOptions(7, geneSegments[4][0], geneSegments[4][1]).dominant,
    },
    //Visutal traits
    visual : {
      background : getGeneOptions(6, geneSegments[0][0], geneSegments[0][1]),
      pattern : getGeneOptions(10, geneSegments[1][0], geneSegments[1][1]),
      face : getGeneOptions(10, geneSegments[2][0], geneSegments[2][1]),
      eyes : getGeneOptions(10, geneSegments[5][0], geneSegments[5][1]),
      hair : getGeneOptions(7, geneSegments[4][0], geneSegments[4][1]),
    },
    color : {
      //Colors
      background : getGeneOptions(24, geneSegments[6][0], geneSegments[6][1]),
      pattern : getGeneOptions(24, geneSegments[7][0], geneSegments[7][1]),
      face : getGeneOptions(24, geneSegments[8][0], geneSegments[8][1]),
      eyes : getGeneOptions(24, geneSegments[9][0], geneSegments[9][1]),
      hair : getGeneOptions(24, geneSegments[3][0], geneSegments[3][1]),
    },
    //Animation: 0 = pulse, 1 & 2 = spin
    animation : genes[30] % 41,
    
    //Battle stats TBC, 0-63 representing relative strengths but not end values
    battle : {
      health : getGene(geneSegments[0][2], geneSegments[0][3]),
      speed : getGene(geneSegments[1][2], geneSegments[1][3]),
      attack : getGene(geneSegments[2][2], geneSegments[2][3]),
      range : getGene(geneSegments[3][2], geneSegments[3][3]),
      magic : getGene(geneSegments[4][2], geneSegments[4][3]),
      defense : getGene(geneSegments[5][2], geneSegments[5][3]),
      resistance : getGene(geneSegments[6][2], geneSegments[6][3]),
      basic : getGene(geneSegments[7][2], geneSegments[7][3]),
      special : getGene(geneSegments[8][2], geneSegments[8][3]),
      base : getGene(geneSegments[9][2], geneSegments[9][3]),
    }
  };
};
const getGene = (s1, s2) => {
  return {
    dominant : s1,
    recessive : s2,
  };
};
const getGeneOptions = (options, s1, s2) => {
  return {
    dominant : (s1 % options) + 1,
    recessive : (s2 % options) + 1,
  };
};
const decodeToSegment = x => {
  return [(x[0] >> 2 & 63), (((x[0] & 3) << 4) + (x[1] >> 4 & 15)), (((x[1] & 15 ) << 2) + (x[2] >> 6 & 3)), (x[2] & 63)]
}
const useStyles = makeStyles((theme) => ({
  imgContainer: {
    position: "relative",
    padding:20,
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
}));
export default function CronicDetail(props) {
  const classes = useStyles();
  const [cronic, setCronic] = React.useState(props.cronic);
  const genes = getGenes(props.cronic.metadata);
  const getTime = () => {
    return (Number(cronic.breedData.breedTime[0]/1000000n)-Date.now())/1000;
  };
  React.useEffect(() => {
    setCronic(props.cronic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cronic]);
  return (<>
    <div className={classes.imgContainer}>
      { cronic.listing ? <Tooltip title="This Cronic is listed on the marketplace"><StorefrontIcon id="listed" /></Tooltip> : "" }
      { cronic.sireFee  ? <Tooltip title="This Cronic is listed as a sire"><FavoriteBorderIcon id="listed" /></Tooltip> : "" }
      <Image size={"180px"} id="selectedCronicImg" src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid="+cronic.id} />
      { cronic.breedData.canBreed === false ? <Tooltip title={"This Cronic needs time before it can breed..."}><TimerIcon id="cantBreed" /></Tooltip> : "" }
    </div>
    <Grid style={{color:"white", textAlign:"center"}} container spacing={1}>
      <Grid item xs={4}><strong>Attack</strong><br />{genes.battle.attack.dominant} ({genes.battle.attack.recessive})</Grid>
      <Grid item xs={4}><strong>Magic</strong><br />{genes.battle.magic.dominant} ({genes.battle.magic.recessive})</Grid>
      <Grid item xs={4}><strong>Range</strong><br />{genes.battle.range.dominant} ({genes.battle.range.recessive})</Grid>
      <Grid item xs={4}><strong>Health</strong><br />{genes.battle.health.dominant} ({genes.battle.health.recessive})</Grid>
      <Grid item xs={4}><strong>Defense</strong><br />{genes.battle.defense.dominant} ({genes.battle.defense.recessive})</Grid>
      <Grid item xs={4}><strong>Resistance</strong><br />{genes.battle.resistance.dominant} ({genes.battle.resistance.recessive})</Grid>
      <Grid item xs={4}><strong>Base</strong><br />{genes.battle.base.dominant} ({genes.battle.base.recessive})</Grid>
      <Grid item xs={4}><strong>Speed</strong><br />{genes.battle.speed.dominant} ({genes.battle.speed.recessive})</Grid>
      <Grid item xs={4}><strong>Generation</strong><br />{cronic.breedData.generation}</Grid>
        {/*<Grid item xs={4}><strong>Battle Class</strong><br />TBD</Grid>
      <Grid item xs={4}><strong>Basic</strong><br />TBD</Grid>
        <Grid item xs={4}><strong>Special</strong><br />TBD</Grid>*/}
    </Grid>
  </>);
}

