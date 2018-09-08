import React, { Component } from 'react';
import {
  Alert,
  Platform,
  AsyncStorage,
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';
import {
  Container
} from 'native-base';
import Modal from 'react-native-modal';
import Camera from 'react-native-camera';
import { colors } from './shared/styles';
import aleofy from './shared/aleo';
const TOKEN = '@bitcampapp:token';
const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const styles = StyleSheet.create({
  headerTitle: {
    color:'#FFF',
    width: 300,
    textAlign: (Platform.OS === 'ios') ? 'center' : 'left',
  },
  btn: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.bitcampOrange,
    borderRadius: 2,
  },
  altBtn: {
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: colors.mediumBlue,
    borderRadius: 2,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  row: {
    flexDirection: 'row',
  },
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isVisible: false,
      token: "",
      scanning: true,
      id: ""
    }
  }

  componentDidMount() {
    this.getToken();
  }

 async checkIn(id){
    let url = "https://apply.bit.camp/api/users/" + id + "/checkin";
    try {
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token,
          },
        });
    } catch (error) {
      Alert.alert(
          "Cound not connect.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
  }

  parseData(){
    try{
    if(this.state.data != null){
      console.log(this.state.data);
      let json = JSON.parse(this.state.data);
      let admitted = json['status']['admitted'];
      if(admitted){
        this.checkIn(this.state.id);
        let name = json['profile']['firstName'] + " " + json['profile']['lastName'];
        let dietaryRestrictions = json['profile']['dietaryRestrictions'];

          admitted = (

            <View>
            <View style={styles.row}>
            <AleoText
            style={{
              fontSize: 30,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>Admitted:</AleoText>
            <Text style={{color: "green", fontSize: 30}}> YES </Text>
            </View>
            <View style={styles.row}>
            <AleoText
            style={{
              fontSize: 25,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>Name:</AleoText>

            <Text style={{flex: 1, fontSize: 25, flexWrap: 'wrap'}}> {name} </Text>
            </View>
            <View style={styles.row}>
            <AleoText
            style={{
              fontSize: 18,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>Dietary Restrictions:</AleoText>
            <Text style={{flex: 1, fontSize: 18, flexWrap: 'wrap'}}> {dietaryRestrictions} </Text>
            </View>
          </View>);
        }else{
          admitted = (
              <View>
            <View style={styles.row}>
            <AleoText
            style={{
              fontSize: 30,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>Admitted:</AleoText>
            <Text style={{color: "red", fontSize: 30}}> NO </Text>
            </View>
          </View>);
        }
        return admitted;
    }else{
      return (<Text> Internet Error </Text>);
    }
  }catch(error){
    return (
        <View>
            <View style={styles.row}>
            <AleoText
            style={{
              fontSize: 30,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>Admitted:</AleoText>
            <Text style={{color: "red", fontSize: 30}}> NO </Text>
            </View>
          </View>);
  }
  }

  async getToken(){
      let token = await AsyncStorage.getItem(TOKEN);
      if(token == null){
        try {
        let response = await fetch('https://apply.bit.camp/auth/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "hello@bit.camp",
            password: "Bitcamper_18",
          }),
        });
        let responseJson = await response.json();
        let status = unescape(response['ok']);
        if (status === "true") {
          let retrievedToken = unescape(responseJson['token']);
          this.setState({token: retrievedToken});
          AsyncStorage.setItem(TOKEN, this.state.token, function(error){
            if (error){
              console.log("Error: " + error);
            }
          });
        }else {
        Alert.alert(
          "Incorrect credentials.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log("ERROR:");
      console.log(error);
      Alert.alert(
          "Cound not connect.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
    }else{
      this.setState({token: token});
    }
}

async getData(){
  let url = "https://apply.bit.camp/api/users/" + this.state.id;
  try {
        let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token,
          },
        });
        let responseJson = await response.json();
        this.setState({data: JSON.stringify(responseJson)});

    } catch (error) {
      console.log("ERROR: " + error);
      Alert.alert(
          "Cound not connect.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
}

  _closeModal = () => {
    this.setState({ isVisible: false, data: null, scanning: true, id: "" });
    this.forceUpdate();
  }

  // helper method that renders a button (returns jsx)
  _renderButton = (text, btnStyles, onPress) => (
    <Button
      primary
      style={btnStyles}
      onPress={onPress}
      title="Close"
    >
      <BoldAleoText style={styles.btnText}>{text}</BoldAleoText>
    </Button>
  );

  // this method is called if the user is not logged in.
   _renderModalContent = () => (
    <View style={{padding: 20}}>
      <AleoText
          style={{
            fontSize: 35,
            paddingLeft: 5,
            marginBottom: 10,
            color: colors.midnightBlue,
          }}>
          Hacker Information
      </AleoText>
        {this.parseData()}
	    <View style={{margin:7}}/>
	    {
        this._renderButton("Close", styles.altBtn, () => this._closeModal())
      }
    </View>
  );

  scanBarcode(data) {
    console.log("here");
    this.setState({ isVisible: true, scanning: false, id: data.data});
    this.getData();
  }

  renderCamera() {
    let camera;
    if(this.state.scanning == false){
      camera = (<Camera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}>
      </Camera>);
    }else{
      camera = (<Camera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        onBarCodeRead={(e) => this.scanBarcode(e)}
        barCodeTypes={[Camera.constants.BarCodeType.qr]}>
      </Camera>);
    }
    console.log("camera state: " + this.state.scanning);
    return camera;
  }

  render() {
    if(this.state.scanning){
      return (<Container>
        { this.renderCamera() }
        </Container>);
    }else{
      return (
        <Container>
          { this.renderCamera() }
          <Modal
  	        isVisible={this.state.isVisible}
  	        backdropColor={'white'}
  	        backdropOpacity={0.9}
  	        animationIn="slideInUp"
  	        animationOut="slideOutDown"
  	        animationInTiming={250}
  	        animationOutTiming={250}
  	        backdropTransitionInTiming={250}
  	        backdropTransitionOutTiming={250}
  	        avoidKeyboard={true}
            onBackdropPress={() => this.setState({ isVisible: false})}
            onBackButtonPress={() => this.setState({ isVisible: false})}
          >
            { this._renderModalContent() }
          </Modal>
        </Container>
      );
    }
  }
}

export default App;
