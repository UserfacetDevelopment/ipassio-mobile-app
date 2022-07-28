import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {Client} from '@twilio/conversations';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {userState} from '../../reducers/user.slice';

export default function ChatWindow() {

  const {userData} = useSelector(userState);
  useEffect(() => {
    let data = {
      user_identity: `${userData.user_token}:${userData.first_name} ${userData.last_name}`,
      // "room_name": "rohit-sharma-class",
      create_conversation: true,
      // create_room: true,
    };
    axios
      .post('https://neoapis.ipassio.com/api/chat/create-token', data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + userData.token,
        },
      })
      .then(res => {
        console.log(res);
      });
  }, []);

  // useEffect(()=>{
  //   client = new Client(token);
  //   client.on('stateChanged', async (state) => {
  //      if (state === 'initialized') {
  //         // Perform Your Action after client is initialized
  //      }
  //    });
  // },[])
  return (
    <View>
      <Text>Chat Window</Text>
    </View>
  );
}
