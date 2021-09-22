import React from 'react';
import {View, Text, Modal} from 'react-native';
import {TimeNow, NomorMeja} from '../components';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statuslogin: [],
      validation: false,
      nomorhariini: 0,
    };
  }
  getPesananHariIni() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+'/pesanan/noPesananNow')
      .then(response => response.json())
      .then(res => {
        this.setState({
          nomorhariini: res[0],
        });
      })
    }, 5000)
  }
  getStatus() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+'/statuslogin')
        .then(response => response.json())
        .then(res => {
          this.setState({
            statuslogin: res,
          });
        })
        .then(() => {
          if (this.state.statuslogin.find(o => o.isLoggedIn === 'true')) {
            this.setState({
              validation: true,
            });
          } else if (
            this.state.statuslogin.find(o => o.isLoggedIn === 'false')
          ) {
            this.setState({
              validation: false,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }, 3000);
  }
  componentDidMount() {
    this.getPesananHariIni();
    this.getStatus();
  }
  render() {
    return (
      <View style={{backgroundColor: '#FFFFFF', height: '100%'}}>
        {this.state.validation == false ? ( //Nanti return ke false
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 300,
            }}>
            <Text style={styles.headerTextBold}>
              Silahkan login terlebih dahulu pada Aplikasi Pihak Warung Kopi
              untuk menggunakan aplikasi ini.
            </Text>
          </View>
        ) : (
          <View style={{padding: 30}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{justifyContent: 'center'}}>
                <TimeNow />
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: 30,
                    elevation: 5,
                  }}>
                  <Text
                    style={[
                      styles.bodyTextBold,
                      {textAlign: 'center', marginBottom: 5},
                    ]}>
                    Jumlah Pesanan Hari Ini
                  </Text>
                  <Text
                    style={[
                      styles.bodyText,
                      {textAlign: 'center', marginTop: 5},
                    ]}>
                    {this.state.nomorhariini.count}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.horizontalLine, {marginTop: 20}]}></View>
            <View>
              <NomorMeja />
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Home;
