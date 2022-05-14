import React, { FC } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const {width, height} = Dimensions.get('screen')

interface VidoModalProps{
  studentTestimonial: any;
  setStudentTestimonial: any;
  video_url?:string;
}
const VideoModal : FC<VidoModalProps> = ({
  studentTestimonial,
  setStudentTestimonial,
  video_url
}: VidoModalProps) => {

  return (
    <View>
    <Modal
      animationType="fade"
      transparent={true}
      visible={studentTestimonial}
      onRequestClose={() => {
        setStudentTestimonial(!studentTestimonial);
      }}
      presentationStyle="pageSheet"
      // WARNING : Modal with 'formSheet' presentation style and 'transparent' value is not supported. 

      >
        <View style={styles.modal}>
        <TouchableOpacity onPress={()=>setStudentTestimonial(false)} >
        <Text style={styles.closeIcon}>X</Text>
        </TouchableOpacity>
       <View style={styles.video}>
       
        <YoutubePlayer height={220} play={false} videoId="WwcHPmmxM98" />
      {/* <Video 
      source={{uri: "https://www.youtube.com/embed/WwcHPmmxM98?rel=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fwww.ipassio.com&autoplay=1"}}   // Can be a URL or a local file.
       style={styles.backgroundVideo} /> */}
       </View>
       </View>
     
    </Modal>
   </View> 
  );
}

export default VideoModal;

const styles = StyleSheet.create({
 
  modal: {
    backgroundColor:'#FFF',
    maxHeight:220,
    marginVertical: 200,
    marginHorizontal:20,
    paddingHorizontal: 40,
    borderRadius:10,
    paddingBottom:30
  
  },
  review_rating: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  video:{
marginTop:20
  },
  backgroundVideo:{
    height:200,
    width:width*0.8
  },
  closeIcon: {
    fontSize: 17,
    color: 'rgb(44, 54, 65)',
    alignSelf:'flex-end',
    marginTop:10
  },
});
