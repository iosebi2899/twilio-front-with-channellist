import React, { useState,useEffect,useRef } from "react";
import { useParams } from 'react-router-dom'
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import axios from "axios";
import ChatItem from "./ChatItem";
const Chat = require("twilio-chat");

const ChatScreen = (props) =>  {
    const { id } = useParams()
    const [chat,setChat] = useState({text:"",messages:[],loading:true ,channel:props.channel})


   const handleMessageAdded = (message) => {
    setChat({
        ...chat,
        messages: [...chat.messages, message],
      },
     //  scrollToBottom()
    );
  };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
      const token = localStorage.getItem('token')
      const client = await Chat.Client.create(token);
       
      try {
        const channel = await client.getChannelBySid(id);
          joinChannel(channel);

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
    
      const sendMessage = () => {
        const { text, channel, } = chat;
        if (text) {
          setChat({...chat, loading: true })
          channel.sendMessage(String(text).trim());
          setChat({...chat, text: "", loading: false});
        }
      };

      const { loading, text, messages } = chat;
      
      return (
        <Container component="main" maxWidth="md">
          <Backdrop open={loading} style={{ zIndex: 99999 }}>
            <CircularProgress style={{ color: "white" }} />
          </Backdrop>
    
          <AppBar elevation={10}>
            <Toolbar>
              <Typography variant="h6">
                {/* {`Room: ${friendlyName}`} */}
              </Typography>
            </Toolbar>
          </AppBar>
    
          <CssBaseline />
    
          <Grid container direction="column" style={styles.mainGrid}>
            <Grid item style={styles.gridItemChatList}>
              <List dense={true}>
                  {messages &&
                    messages.map((message) => 
                      <ChatItem
                        key={message.index}
                        message={message}
                        email='test'/>
                    )}
              </List>
            </Grid>
    
            <Grid item style={styles.gridItemMessage}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item style={styles.textFieldContainer}>
                  <TextField
                    required
                    style={styles.textField}
                    placeholder="Enter message"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={text}
                    // disabled={!channel}
                    onChange={(event) =>
                      setChat({...chat, text: event.target.value })
                    }/>
                </Grid>
                
                <Grid item>
                  <IconButton
                    style={styles.sendButton}
                    onClick={sendMessage}
                    // disabled={!channel}
                    >
                    <Send style={styles.sendIcon} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      );
    
  }
  const styles = {
    textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
    textFieldContainer: { flex: 1, marginRight: 12 },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    gridItemChatList: { overflow: "auto", height: "70vh" },
    gridItemMessage: { marginTop: 12, marginBottom: 12 },
    sendButton: { backgroundColor: "#3f51b5" },
    sendIcon: { color: "white" },
    mainGrid: { paddingTop: 100, borderWidth: 1 },
  };

  export default ChatScreen;