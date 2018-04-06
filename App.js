import React, { Component } from 'react';
import {
  Platform,
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

const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
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
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  qr: {
    marginBottom: 80,
    marginTop: 40,
  },
  container: {
      flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isVisible: false
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
      this.setState({ data: data, isVisible: true });
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
