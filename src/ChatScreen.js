import React, { useState,useEffect,useRef } from "react";
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
import { useParams } from "react-router";
import { Send } from "@material-ui/icons";
import axios from "axios";
import ChatItem from "./ChatItem";
const Chat = require("twilio-chat");

const ChatScreen = (props) =>  {
    
    // const [chat,setChat] = useState({text:"",messages:[],loading:false ,channel:null})
    const [chat,setChat] = useState({text:"",loading:false ,channel:{}})
    const [items, setItems] = useState([])

    const scrollDiv = useRef();

    const joinChannel = async (channel) => {
        if (channel.channelState.status !== "joined") {
         await channel.join();
       }
       
      //  scrollToBottom();
      channel.on("messageAdded", handleMessageAdded);
     };

     const sendMessage = () => {
      const { text, channel, } = chat;
      if (text) {
        setChat({...chat, loading: true })
        channel.sendMessage(String(text).trim());
        setChat({...chat, text: "", loading: false});
      }
    };
    const {id} = useParams()

     const handleMessageAdded = (message) => {
       setItems(...items,message
        //  scrollToBottom()
       );
     };
     
    //  const scrollToBottom = () => {
    //    const scrollHeight = scrollDiv.current.scrollHeight;
    //    const height = scrollDiv.current.clientHeight;
    //    const maxScrollTop = scrollHeight - height;
    //    scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    //    console.log(scrollDiv.current)
    //  };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(async()=>{
        
        const { location } = props;
        const { state } = location || {};
        const { room } = state || {};
      
        setChat({...chat, loading: true });

        
        const client = await Chat.Client.create(localStorage.getItem('token'));
        const channel = await client.getChannelBySid(id);
        joinChannel(channel)
        
        try {
          
          const messages = await channel.getMessages();
          setItems(...items,messages.items || [])
          setChat({...chat, channel,
            loading: false });
        } catch(err) {
          try {
            console.log('wtf')
            const channel = await client.createChannel({
              uniqueName: room,
              friendlyName: room,
            });
            setChat({...chat, channel})
          } catch {
            throw new Error("Unable to create channel, please reload this page");
          }
        } 
        

      },[])

      const { loading, text } = chat;
      const { location } = props;
      const { state } = location || {};
      const { email } = state || {};
      console.log(chat)
      console.log(items)
      return (
        <Container component="main" maxWidth="md">
          <Backdrop open={loading} style={{ zIndex: 99999 }}>
            <CircularProgress style={{ color: "white" }} />
          </Backdrop>
    
          <AppBar elevation={10}>
            <Toolbar>
              
            </Toolbar>
          </AppBar>
    
          <CssBaseline />
    
          <Grid container direction="column" style={styles.mainGrid}>
            <Grid item style={styles.gridItemChatList} ref={scrollDiv}>
              <List dense={true}>
                  {items &&
                    items.map((message) => 
                      <ChatItem
                        key={message.index}
                        message={message}
                        email={email}/>
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