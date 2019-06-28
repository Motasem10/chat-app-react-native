import React, { Component } from "react";
import bg from "../../../img/bg.png";
import {
  View,
  Text,
  Container,
  Badge,
  Card,
  CardItem,
  Textarea,
  ActionSheet,
} from "native-base";
import imagePicker from "react-native-image-picker";
import {  ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  ImageBackground,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import { connect } from "react-redux";
import {
  sendMsg,
  prepareSenderReciverChat,
  choosePhoto
} from "../../../action/chatAction";


class Chat extends Component {
  constructor(props) {
 
    super(props);
    this.state = {
      msg: "",
      oldMsg: "",
    
    };
  }
componentWillUnmount(){

  
}
  handelChoosePhoto = () => {
    ActionSheet.show(
      {
        options: [
          { text: "camira", icon: "camera", iconColor: "green" },
          { text: "Galary", icon: "image", iconColor: "green" },
          { text: "cancl", icon: "exit", iconColor: "green" }
        ],
        cancelButtonIndex: 2
      },
      ButtonIndex => {
        if (ButtonIndex == 0) {
          imagePicker.launchCamera({}, res => {
            this.setState({ image: res.uri });
          });
        } else if (ButtonIndex == 1) {
          imagePicker.launchImageLibrary({}, res => {
            if (res.fileSize > 1024 * 1024) {
              return alert("the maxmum size of image is 1MB");
            }

          res.uri && this.props.navigation.navigate("Model", {
              data: {
                choosePhoto: this.choosePhoto.bind(this),
                source: res.uri,
                onChangeText: msg => this.setState({ msg })
              }
            }) 
          });
        }
      }
    );
  };

  choosePhoto = uri => {
    choosePhoto(uri, this.state.msg).then(msg=>{
   //SEND MSG TAKE Object
   this.props.sendMsg(msg).then(msg=>{
    
  //set last msg t uunderstandt it look at home.js 
    this.props.navigation.getParam('lastMsg')(this.props.reciverUid,msg)
      this.setState({msg:''}) 

     });
      
    });
    this.setState({ msg: "" });
  };


     
  
  
 
  componentDidMount = async () => {
    //get uid from home.js 
    const reciverUid = this.props.navigation.getParam("data").uid;
    //get old MSg 
    await this.props.prepareSenderReciverChat(reciverUid);
  
  };

  handelSendMsg = () => {
    const msg =this.state.msg;
 if(msg.length<1) return
 this.setState({msg:''})
  this.props.sendMsg({msg}).then(msg => {
     this.props.navigation.getParam('lastMsg')(this.props.reciverUid,msg)
    });
  };
  render() {

    const oldMsg =
      this.props.oldMsg && this.props.oldMsg.length > 0 ? (
        this.props.oldMsg.map(item => {
          if (item.mine) {
            return (
              <View key={Math.random()} style={item.uri?styles.Image:styles.sendMsg} >
                {item.uri && (
                  <Card >
                    <CardItem  cardBody >
                     
                        <Image
                         style={{ height:200, width:null,flex:1,resizeMode:'cover' }}
                         resizeMode={'cover'}
                          source={{
                            uri: item.uri
                          }}
                        />
                    
                    </CardItem>
                  </Card>
                )}
                {item.msg ? (
                  <Text style={{ alignSelf: "flex-start" }}>{item.msg}</Text>
                ) : null}
                <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>
                  {item.time}
                </Text>
              </View>
            );
          } else {
            return (
              <View key={Math.random()} style={item.uri?styles.Imagerecived:styles.resevedMsg} >
                {item.url && (//if msg content image 
                  <Card >
                    <CardItem  cardBody >
                        <Image
                         style={{ height:200, width:null,flex:1,resizeMode:'cover' }}
                         resizeMode={'cover'}
                          source={{
                            uri: item.url
                          }}
                        />
                    
                    </CardItem>
                  </Card>
                )}
                {item.msg ? (
                  <Text style={{ alignSelf: "flex-start" }}>{item.msg}</Text>
                ) : null}
                <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>
                  {item.time}
                </Text>
              </View>
            );
            
          }
        })
      ) : (
        <Text />
      );

    return (
      <Container>
        <ImageBackground source={bg} style={{flex:1, width: "100%", height: "100%" }}>
          <ScrollView
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={() => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            <View style={{ flex: 10  }}>
              {oldMsg}

           
            
            </View>

         
            
          </ScrollView>
          <View style={{ flexDirection: "row", margin: 10, }}>
              <View style={{ flex: 15 }}>
                <TouchableWithoutFeedback onPress={(e)=>this.handelSendMsg(e)}>
                  <Badge style={styles.senIconView}>
                    <Icon
                      size={30}
                      name={this.state.msg ? "send" : "mic"}
                      color="white"
                      style={this.state.msg ? styles.sendIcon : {}}
                    />
                  </Badge>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.textAreaView}>
                <TouchableWithoutFeedback onPress={this.handelChoosePhoto}>
                  <Badge style={styles.cameraIcon}>
                    <Icon size={30} name="camera-alt" color="black" />
                  </Badge>
                </TouchableWithoutFeedback>
                <Textarea
                  multiline={true}
                  maxLength={100}
                  onChangeText={msg => this.setState({ msg })}
                  style={styles.textArea}
                  value={this.state.msg}
                />
              </View>
              </View> 
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  sendMsg:{
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "rgb(226, 255, 201);",
    borderRadius: 20,
    padding: 10,
    paddingLeft:15,
    minWidth: "40%"
  },
  resevedMsg: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    paddingLeft:15,
    minWidth: "40%"
  },

  sendIcon: {
    // color: "white",
    transform: [{ rotate: "180deg" }]
  },
  Image:{
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "rgb(226, 255, 201);",
    borderRadius: 10,
   padding: 3,
  width: "60%"
  },
  Imagerecived:{
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
   padding: 3,
  width: "60%"
  },
  senIconView: {
    width: 50,
    height: 50,
    backgroundColor: "#00897b",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },

  cameraIcon: {
    flex: 1,
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  textAreaView: {
    flex: 80,
    flexDirection: "row",
    borderRadius: 30,
    backgroundColor: "white",

    minHeight: 40
  },
  textArea: { flex: 9, width: "95%", height: "100%" }
});

mapStateToProps = state => {
  return {
    auth: state.auth,
    msg: "",
    oldMsg: state.chat.oldMsg,
    url: state.chat.url,
    uri: state.chat.uri,
    path: state.chat.path,
    senderUid: state.chat.senderUid,
    reciverUid: state.chat.reciverUid,
    friends:state.chat.friends,
  };
};
export default connect(
  mapStateToProps,
  { prepareSenderReciverChat,sendMsg }
)(Chat);