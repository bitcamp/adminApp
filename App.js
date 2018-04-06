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
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isVisible: false,
      token: ""
    }
  }

  componentDidMount() {
    this.getToken();
  }

  async getToken(){
      console.log("in get token");
      let token = await AsyncStorage.getItem(TOKEN);
      token = null;
      console.log("got token");
      console.log(JSON.stringify(token));
      if(token == null){
        try {
        let response = await fetch('http://35.174.30.108:3000/auth/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "",
            password: "",
          }),
        });
        let responseJson = await response.json();
        console.log(responseJson);
        let status = unescape(response['ok']);
        if (status === "true") {
          let retrievedToken = unescape(responseJson['token']);
          console.log(retrievedToken);
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

async getData(id){
  console.log("inside get data");
  console.log(this.state.token);
  let url = "http://35.174.30.108:3000/api/users/" + id + "/checkin";
  console.log(url);
  try {
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token,
          },
        });
        let responseJson = await response.json();
        console.log(responseJson);
        this.setState({data: JSON.stringify(responseJson)});
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

  _closeModal = () => {
    this.setState({ isVisible: false, data: null });
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
            fontSize: 27,
            paddingLeft: 5,
            marginBottom: 10,
            color: colors.midnightBlue,
          }}>
          Hacker Information
      </AleoText>
      <AleoText
          style={{
            fontSize: 18,
            paddingLeft: 5,
            marginBottom: 20,
            color: "#808080",
          }}>
        {this.state.data && this.state.data.data}
      </AleoText>
	    <View style={{margin:7}}/>
	    {
        this._renderButton("Close", styles.altBtn, () => this._closeModal())
      }
    </View>
  );

  scanBarcode(data) {
    console.log(data);
    this.setState({ isVisible: true });
    this.getData(data.data);
  }

  renderCamera() {
    return (
      <Camera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        onBarCodeRead={(e) => this.scanBarcode(e)}
        barCodeTypes={[Camera.constants.BarCodeType.qr]}>
      </Camera>
    );
  }

  render() {
    console.log(this.state.isVisible);
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

export default App;
