import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,SafeAreaView,Button,Alert,TouchableHighlight} from 'react-native';
import react,{useState,useEffect} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  // for face Detection
  useEffect(() => {
    (async () => {
      const compatiable = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatiable);
    })();
  });

  const fallBackToDefaultAuth = () => {
    Alert.alert("Fallback to default auth");
  };

  const alertComponent = (title,mess,btntxt,btnfunc) => {
    return Alert.alert(title,mess,[{text:btntxt, onPress:btnfunc}]);
  };

  const TwoButtonAlert = () => {
    Alert.alert("Welcome to Two Button Alert","This is a Two Button Alert",[
    {
      text:"Cancel",
      onPress:()=>alert("Cancel Pressed"),
      style:"cancel"
    },
    {
      text: 'OK', onPress: () => alert('OK Pressed')
    }
    ]);
  };
  
  const handleBiometricAuth = async () => {
    const isBiometricAvailiable = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricAvailiable) {
      return alertComponent("Biometric Not Available","Your Device does not support Biometric Authentication","OK",fallBackToDefaultAuth);
    };
    let supportedBiometric;
    if(isBiometricAvailiable)
    {
      supportedBiometric = await LocalAuthentication.supportedAuthenticationTypesAsync();
    };
    const savedBioMetric = await LocalAuthentication.isEnrolledAsync();
    if(!savedBioMetric)
    {
      return alertComponent("Biometric Not Available","You have not saved any Biometric Authentication","OK",fallBackToDefaultAuth);
    };
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage:"Please Authenticate to Login",
      cancelLabel:"Cancel",
      fallbackLabel:"Fallback to default auth",
      disableDeviceFallback:true,
    });
    if(biometricAuth.success){
      TwoButtonAlert()
    }
    else{
      alertComponent("Biometric Not Available","Your Device does not support Biometric Authentication","OK",fallBackToDefaultAuth)
    }
    console.log({isBiometricAvailiable})
    console.log({supportedBiometric})
    console.log({savedBioMetric})
    console.log(biometricAuth.success)
  };
  handleBiometricAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>
          {isBiometricSupported ? "Your Device is Biometric Compatible" : "Your Device is not Biometric Compatible"}
        </Text>
        <TouchableHighlight
          style={{
            height:60,
            width:200
          }}
        >  
        <Button
          title="Biometric Authentication"
          color = 'black'
          onPress={handleBiometricAuth}
        >
        </Button>
        </TouchableHighlight>
        <StatusBar style = 'auto'/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
