import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ToastAndroid,
  FlatList,
} from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class NomorMeja extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nomormejanow: '',
      idmeja: '',
      makspelanggannow: 0,
      jumlahpelanggan_input: 0,
      pelangganVisible: false,
      nomormeja: [],
      nopesanan: [],
      statusHeader: [],
    };
  }
  getStatusHeader(id) {
    let url_tujuan = CONSTANT.BASE_URL+ '/pesanan/detailStatus?id='+id
    fetch(url_tujuan)
    .then(response => response.json())
    .then(res => {
      console.log('RESULT FETCH ??', res)
      this.setState({
        statusHeader : res
      });
    })
    .catch(error => {
      console.error(error)
    })
  }
  lanjutPesanan() {
    if (this.state.jumlahpelanggan_input > this.state.makspelanggannow) {
      ToastAndroid.show("Jumlah pelanggan melebihi maksimal yang telah ditentukan.", ToastAndroid.SHORT);
    } else {
      this.setPelangganVisible(false)
      RootNavigation.navigate('PesananScreen', {
        type: 'pesananbaru',
        nomormeja: this.state.nomormejanow,
        nomorpesanan: this.state.nopesanan.length + 1,
        jumlahpelanggan: this.state.jumlahpelanggan_input,
        id_nomor_meja: this.state.idmeja,
      });
    }
  }
  getNoPesanan() {
    fetch(CONSTANT.BASE_URL+'/pesanan/noPesananNow')
      .then(response => response.json())
      .then(res => {
        this.setState({
          nopesanan: res,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  getMeja() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+'/nomormeja')
        .then(response => response.json())
        .then(res => {
          this.setState({
            nomormeja: res,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }, 3000);
  }
  setPelangganVisible = visible => {
    this.setState({pelangganVisible: visible});
  };
  componentDidMount() {
    this.getNoPesanan();
    this.getMeja();
  }
  render() {
    const {pelangganVisible} = this.state;
    return (
      <View>
        {/* Pelanggan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={pelangganVisible}
          onRequestClose={() => {
            this.setPelangganVisible(!pelangganVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Jumlah Pelanggan Untuk Nomor Meja {this.state.nomormejanow}
              </Text>
              <Text style={styles.bodyText}>
                <Text>Maksimal pelanggan untuk nomor meja ini: </Text>
                <Text style={{fontWeight: 'bold'}}>
                  {this.state.makspelanggannow}
                </Text>
              </Text>
              <View style={styles.marginTopTen}></View>
              <TextInput
                onChangeText={value => {
                  this.setState({
                    jumlahpelanggan_input: value
                  })
                  console.log(value)
                }}
                keyboardType="numeric"
                style={styles.inputForm}
                placeholder="Masukkan jumlah pelanggan untuk nomor meja ini"
              />
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setPelangganVisible(!pelangganVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    BATAL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => this.lanjutPesanan()}
                  // onPressOut={() => {
                  //   RootNavigation.navigate('PesananScreen', {
                  //     type: 'pesananbaru',
                  //     nomormeja: this.state.nomormejanow,
                  //   });
                  // }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    LANJUT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Pelanggan */}
        <Text
          style={[
            styles.headerTextBold,
            styles.marginTopTen,
            {marginBottom: 10},
          ]}>
          Pilih nomor meja untuk melakukan pesanan
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <FlatList
            nestedScrollEnabled={true}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            numColumns={7}
            keyExtractor={item => item.id_nomor_meja}
            data={this.state.nomormeja}
            renderItem={({item}) => (
              <View key={item.id_nomor_meja}>
                {item.ketersediaan_meja == 'aktif' ? (
                  <View>
                    <TouchableOpacity
                      style={styles.nomorActive}
                      onPressIn={() => this.getStatusHeader(item.id_nomor_meja)}
                      onPress={() => {
                        RootNavigation.navigate('TambahanScreen', {
                          type: 'pesanantambahan',
                          nomormeja: item.nomor_meja,
                          nomorpesanan: this.state.nopesanan.length + 1,
                          jumlahpelanggan: 0,
                          id_nomor_meja: item.id_nomor_meja,
                          statusHeader: this.state.statusHeader
                        });
                      }}>
                      <Text style={styles.nomorTextBoldWhite}>
                        {item.nomor_meja}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.nomorBodyTextBoldActive}>Aktif</Text>
                  </View>
                ) : item.ketersediaan_meja == 'kosong' ? (
                  <View>
                    <TouchableOpacity
                      style={styles.nomorAvail}
                      onPress={() => {
                        this.setState({
                          nomormejanow: item.nomor_meja,
                          makspelanggannow: item.maksimal_pelanggan,
                          idmeja: item.id_nomor_meja,
                        });
                      }}
                      onPressOut={() => this.setPelangganVisible(true)}>
                      <Text style={styles.nomorTextBoldWhite}>
                        {item.nomor_meja}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}>
                      Kosong
                    </Text>
                  </View>
                ) : item.ketersediaan_meja == 'tidak aktif' ? (
                  <View>
                    <TouchableOpacity disabled={true} style={styles.nomorNon}>
                      <Text style={styles.nomorTextBoldWhite}>
                        {item.nomor_meja}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.nomorBodyTextBoldNon}>Tidak Aktif</Text>
                  </View>
                ) : null}
              </View>
            )}></FlatList>
        </View>
      </View>
    );
  }
}

export default NomorMeja;
