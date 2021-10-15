import React, { useState,useEffect} from "react";
import {useHistory, Link} from "react-router-dom" ;
import { Send } from "@material-ui/icons";
import axios from "axios";
import ChatScreen from "./ChatScreen";
const Chat = require("twilio-chat");


const Channels = (props) => {

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

    
    return (
        <div>
            <ul>
                {channel.channelList.map(e =>  <Link to={{ pathname :`/channels/${e.friendlyName}`}} style={{padding:'20px 50px',width:'250px',cursor:'pointer', backgroundColor:'lightgrey',color:'white',textAlign: 'center'}}>
                    {e.friendlyName}
                    </Link> )}
            </ul>
        </div>
    )
}

export default Channels
