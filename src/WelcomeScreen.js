import React, {useState} from "react";
import {useHistory} from "react-router-dom" 
import {
  Grid,
  TextField,
  Card,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";

const WelcomeScreen = () => {
    const history = useHistory()
    const [user, setUser] = useState({email:''})
    const { email } = user;
    const login = () => {
        if (email) {
          history.push({pathname:"channels", state:{ email }});
        }
        localStorage.setItem('email',user.email)
      }
    
    const handleChange = (key,val) =>{
        const value = val;
        if (key === "email") {setUser({...user,email:value,})}
    }

    return (
        <>
      <AppBar style={styles.header} elevation={10}>
        <Toolbar>
          <Typography variant="h6">
            dope chat :3
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        style={styles.grid}
        container
        direction="column"
        justify="center"
        alignItems="center">
        <Card style={styles.card} elevation={10}>
          <Grid item style={styles.gridItem}>
            <TextField
              name="email"
              required
              style={styles.textField}
              label="Email address"
              placeholder="Enter email address"
              variant="outlined"
              type="email"
              value={email}
              onChange={ e => handleChange("email",e.target.value)}/>
          </Grid>
          <Grid item style={styles.gridItem}>
            <Button
              color="primary"
              variant="contained"
              style={styles.button}
              onClick={login}>
              Login
            </Button>
          </Grid>
        </Card>
      </Grid>
    </>
    )
}
const styles = {
    header: {},
    grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
    card: { padding: 40 },
    textField: { width: 300 },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    button: { width: 300 },
  };
  


  export default WelcomeScreen;
