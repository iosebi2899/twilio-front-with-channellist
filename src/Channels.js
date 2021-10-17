import React, { useState,useEffect} from "react";
import {useHistory,useLocation, Link, useParams} from "react-router-dom" ;
import axios from "axios";
import ChatScreen from "./ChatScreen";
import {
    AppBar,
    Toolbar,
    Typography,
  } from "@material-ui/core";

const Chat = require("twilio-chat");


const Channels = (props) => {
    const id = useLocation()
    const { location } = props;
    const { state } = location || {};
    const { email } = state || {};
    const [channel,setChannel] = useState({client:{},channelList:[]})

    // const joinChannel = async (channel) => {
    //     if (channel.channelState.status !== "joined") {
    //      await channel.join();
    //    }
    //    setChannel({channel})
    //   //  scrollToBottom();
      
    //  };
    
    const getToken = async (email) => {
        const response = await axios.get(`http://localhost:5000/token/${email}`);
        const { data } = response;
        return data.token;
      }
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
        
        let token = "";
      
        if (!email) {
          props.history.replace("/");
        }
        

        try {
            token = await getToken(email);
            localStorage.setItem('token',token)
        } catch {
            throw new Error("Unable to get token, please reload this page");
        }
        const client = await Chat.Client.create(token);
        client.on("tokenAboutToExpire", async () => {
            const token = await getToken(email);
            client.updateToken(token);
        });

        client.on("tokenExpired", async () => {
            const token = await getToken(email);
            client.updateToken(token);
        });
        
        try {
          const channelsList = await client.getUserChannelDescriptors();
          setChannel({client , channelList:channelsList.state.items})

        } catch(err) {
            throw new Error('Unablse')
        //   try {
        //     const channel = await client.createChannel({
        //       uniqueName: room,
        //       friendlyName: room,
        //     });
        //     setChannel(channel);
        //   } catch {
        //     throw new Error("Unable to create channel, please reload this page");
        //   }
        } 
      },[])

      const chatLink = id.pathname.replace(/[\/\\]channels\//g,'')
    return (
        <>
            <AppBar style={styles.header} elevation={10}>
                <Toolbar>
                <Typography variant="h6">
                    dope chat :3
                </Typography>
                </Toolbar>
            </AppBar>
            <div style={styles.parent}>
                <ul style={styles.channelUl}>
                    {channel.channelList.map(e =>  <Link to={{ pathname :`/channels/${e.friendlyName}`,state:{email:email}}} style={styles.channelLi}>
                        {e.friendlyName}
                        </Link> )}
                </ul>
                {chatLink !== "/channels" &&
                    (<ChatScreen/>)
                }
            </div>
        </>
    )
}
const styles = {
    parent:{
        display:'flex',
    },
    channelLi: {
        padding:'10px',
        boxSizing: 'border-box',
        margin: '10px 0',
        width:'100%',
        cursor:'pointer',
        color:'white',
        textAlign: 'center',
        borderBottom:'1px solid grey',
    },
    channelUl:{
        backgroundColor:'#3f51b5',
        width:'15%',
        margin:'64px 0 0 0',
        height:'calc(100vh - 64px)',
        display:'flex',
        flexDirection:'column',
    },
};
export default Channels
