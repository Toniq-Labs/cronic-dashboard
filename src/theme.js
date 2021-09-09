import { red } from '@material-ui/core/colors';
import { createTheme  } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createTheme ({
  typography: {
    //fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    type : "dark",
    primary: {
      main: '#2bede6',
    },
    secondary: {
      main: '#00b894',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fafafa',
    },
  },
  butto : {
    
  },
  overrides: {
    MuiButton: {
      root : {
        borderColor: "#2bede6", 
        marginTop:10
      }
    },
    MuiPaper: {
      root : {
        backgroundColor: "#0c2124", 
        border: "1px solid #2bede6",
        color:"#2bede6",
        '& label' : {
          color:"#fff",          
        },
        '& p' : {
          color:"#fff",          
        },
        '& input' : {
          color:"#fff",          
        },
        '& .MuiInput-underline:before' : {
          borderBottomColor:"#fff"
        }
      }
    },

  },
});

export default theme;