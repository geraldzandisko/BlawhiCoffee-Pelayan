import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Modal,
  FlatList,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  LogBox
} from 'react-native';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import 'moment/locale/id';
import * as RootNavigation from '../../RootNavigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

LogBox.ignoreLogs([
  'Each child in a list should have',
]);

class RincianItem extends React.Component {
  render() {
    const {item} = this.props;
    return (
      <View>
        {item.nama_menu != 'Kopi Spesial' && item.nama_menu != 'Kopi Gratis' ? (
          <View
            style={[
              styles.tableRowBox,
              {backgroundColor: '#FFFFFF', elevation: 5, padding: 30},
            ]}>
            <View style={styles.tableRowEach}>
              <Text style={styles.bodyText}>{item.nama_menu}</Text>
              <NumberFormat
                renderText={value => (
                  <Text style={[styles.bodyText, styles.textGrey]}>
                    {value}
                  </Text>
                )}
                value={item.harga_menu - item.harga_menu * (item.diskon / 100)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'Rp'}
              />
            </View>
            <View style={styles.tableRowEach}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    padding: 10,
                  }}
                  onPress={this.props.onSubtract}>
                  <MaterialIcons name="remove" size={22} color="#000000" />
                </TouchableOpacity>
                <View
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    justifyContent: 'center',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    backgroundColor: '#000000',
                  }}>
                  <Text style={[styles.bodyTextBold, {color: '#FFFFFF'}]}>
                    {item.jumlah}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    padding: 10,
                  }}
                  onPress={this.props.onAdd}>
                  <MaterialIcons name="add" size={22} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.tableRowEach}>
              <NumberFormat
                renderText={value => (
                  <Text style={[styles.bodyText, styles.flexEndText]}>
                    {value}
                  </Text>
                )}
                value={
                  item.jumlah *
                  (item.harga_menu - item.harga_menu * (item.diskon / 100))
                }
                displayType={'text'}
                thousandSeparator={true}
                prefix={'Rp'}
              />
            </View>
            <View style={[styles.tableRowEach, {alignItems: 'flex-end'}]}>
              <TouchableOpacity
                style={[styles.deleteButton, {right: 0}]}
                onPress={this.props.onRemove}>
                <MaterialIcons
                  name="delete"
                  size={28}
                  style={{color: '#FFFFFF'}}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

class Pesanan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HeadTable: ['PESANAN', 'QTY', 'HARGA', 'AKSI'],
      rincianshow: true,
      semuaactive: true,
      hidanganshow: false,
      gratisshow: false,
      makananactive: false,
      minumanactive: false,
      fitur_kopigratis: [],
      menu: [],
      minimalhidangan: [],
      PesananHead: [
        {
          "tanggal": new Date(),
        }
      ],
      kopiGratisVisible: false,
      hidanganVisible: false,
      konfirmasiVisible: false,
      selesaiVisible: false,
      // Dingin Panas
      menunow: '',
      rincian: [],
      catatan: '',
      kopispesial: {
        nama_menu: 'Kopi Spesial',
        harga_menu: 0,
        jumlah: 1,
        diskon: 0,
        id_menu: 9990,
        id_kategori: 9999,
      },
      kopigratis: {
        nama_menu: 'Kopi Gratis',
        harga_menu: 0,
        jumlah: 1,
        diskon: 0,
        id_menu: 9998,
        id_kategori: 9999,
      },
      sudahPilihKopiGratis: false,
    };
  }
  monitorNominalHidangan() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/getHidanganNominal')
      .then(response => response.json())
      .then(res => {
        this.setState({
          minimalhidangan: res[0]
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  monitorKopiGratis() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/kopi/get')
      .then(response => response.json())
      .then(res => {
        this.setState({
          fitur_kopigratis: res[0]
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  tambahKopiGratis() {
    if (this.state.fitur_kopigratis.perhitungan_layanan < this.state.fitur_kopigratis.layanan_maksimal) {
      this.setState({
        gratisshow: true,
      });
    } else {
      ToastAndroid.show("Layanan kopi gratis telah mencapai batas maksimal untuk hari ini.", ToastAndroid.SHORT);
    }
  }
  hidanganTrigger() {
    let hargaFinal = this.state.rincian.reduce(function (result, item) {
      return (
        result + item.jumlah * (item.harga_menu * ((100 - item.diskon) / 100))
      );
    }, 0);
    if (
      this.state.minimalhidangan.status_fitur == 'aktif' &&
      hargaFinal >= this.state.minimalhidangan.minimal_total
    ) {
      if (!this.state.sudahPilihKopiGratis) {
        this.setHidanganVisible(true);
        this.setState({sudahPilihKopiGratis: true});
      }
    }
  }
  getMenu() {
    fetch(CONSTANT.BASE_URL+'/daftarmenu')
      .then(response => response.json())
      .then(res => {
        this.setState({
          menu: res,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  getMinuman() {
    fetch(CONSTANT.BASE_URL+'/daftarminuman')
      .then(response => response.json())
      .then(res => {
        this.setState({
          menu: res,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  getMakanan() {
    fetch(CONSTANT.BASE_URL+'/daftarmakanan')
      .then(response => response.json())
      .then(res => {
        console.log(res)
        this.setState({
          menu: res,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  setKopiGratisVisible = visible => {
    this.setState({kopiGratisVisible: visible});
  };
  setHidanganVisible = visible => {
    this.setState({hidanganVisible: visible});
  };
  setKonfirmasiVisible = visible => {
    this.setState({konfirmasiVisible: visible});
  };
  setSelesaiVisible = visible => {
    this.setState({selesaiVisible: visible});
  };
  addToCart = item => {
    let temp = this.state.rincian;
    item['jumlah'] = 1;
    // Cari apakah item dengan id ini sudah ada di cart
    let ind = this.state.rincian.findIndex(x => x.id_menu == item.id_menu);
    // Jika tidak ada maka tambahkan ke array (Jika tidak ada return akan -1)
    if (ind < 0) {
      temp.push(item);
    }
    // Jika sudah ada maka tambahkan quantity
    else {
      temp[ind]['jumlah'] += 1;
    }
    // Set kembali statenya
    this.setState({
      rincian: temp,
    });
    console.log(this.state.rincian)
    this.hidanganTrigger();
  };

  addToCartPanasDingin = param => {
    let temp = this.state.rincian;
    let item = param;
    item['jumlah'] = 1;
    // Cari apakah item dengan id ini sudah ada di cart
    let ind = this.state.rincian.findIndex(x => x.id_menu == item.id_menu);
    // Jika tidak ada maka tambahkan ke array (Jika tidak ada return akan -1)
    if (ind < 0) {
      temp.push(item);
    }
    // Jika sudah ada maka tambahkan quantity
    else {
      if (item.nama_menu == temp[ind].nama_menu) {
        temp[ind]['jumlah'] += 1;
      } else {
        temp.push(item);
      }
    }

    // Set kembali statenya
    this.setState({
      rincian: temp,
    });
  };
  prosesOrder() {
    let bodyjson = {
      jumlah_pelanggan: this.props.route.params.jumlahpelanggan,
      id_nomor_meja: this.props.route.params.id_nomor_meja,
      keluhan: "",
      total_harga: this.state.rincian.reduce(function (
        result,
        item,
      ) {
        return (
          result +
          item.jumlah *
            (item.harga_menu * ((100 - item.diskon) / 100))
        );
      },
      0),
      catatan_pesanan: this.state.catatan,
      menus: [],
    }
    let daftarMenu = [];
    for (let elemen in this.state.rincian){
      let temp = this.state.rincian[elemen];
      let newObj = {
        id_menu: temp.id_menu,
        nama_menu: temp.nama_menu,
        harga_menu: temp.harga_menu * ((100 - temp.diskon)/100),
        jumlah_menu: temp.jumlah,
      }
      daftarMenu.push(newObj);
    }
    bodyjson.menus = daftarMenu;
    let statusBaru = this.props.route.params.type == 'pesananbaru'
    console.log(bodyjson)
    fetch(CONSTANT.BASE_URL+'/pesanan/tambah' + (statusBaru ? '?baru=true' : ''), {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyjson)
		})
  }
  removeHidanganKopiSpesial() {
    let ind = this.state.rincian.findIndex(x => x.id_menu == 9990);
    let temp = this.state.rincian;
    temp.splice(ind, 1);
    this.setState({
      rincian: temp,
    });
  }
  removeKopiGratis() {
    let ind = this.state.rincian.findIndex(x => x.id_menu == 9998);
    let temp = this.state.rincian;
    temp.splice(ind, 1);
    this.setState({
      rincian: temp,
    });
  }
  onRemove = itemId => {
    let ind = this.state.rincian.findIndex(x => x.id_menu == itemId);
    let temp = this.state.rincian;
    temp.splice(ind, 1);
    this.setState({
      rincian: temp,
    });
    this.hidanganTrigger();
  };
  onSubstract = (item, itemId) => {
    let ind = this.state.rincian.findIndex(x => x.id_menu == itemId);
    let temp = this.state.rincian;
    temp[ind].jumlah -= 1;
    if (temp[ind].jumlah < 0) {
      temp[ind].jumlah = 0;
    }
    this.setState({
      rincian: temp,
    });
    this.hidanganTrigger();
  };
  onAdd = (item, itemId) => {
    let ind = this.state.rincian.findIndex(x => x.id_menu == itemId);
    let temp = this.state.rincian;
    temp[ind].jumlah += 1;
    if (temp[ind].jumlah < 0) {
      temp[ind].jumlah = 0;
    }
    this.setState({
      rincian: temp,
    });
    this.hidanganTrigger();
  };
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
  componentDidMount() {
    this.monitorKopiGratis();
    this.monitorNominalHidangan();
    this.getMenu();
    this.hidanganTrigger();
  }
  render() {
    const printPDF = async () => {
      const receipthead = this.state.PesananHead.map((data, i) => {
        return `<p style="font-size: 2em">Pesanan Baru</p>
          <p style="font-size: 2em">${moment(new Date()).format(
            'MMMM Do YYYY, HH:mm:ss')}</p>
					<p style="font-size: 2em">Meja ${this.props.route.params.nomormeja}</p>
					<hr>
					`;
      });
      const receipt = this.state.rincian.map((data, i) => {
        return `<tr>
					<td>${data.nama_menu}</td>
					<td>${data.jumlah}</td>
					</tr>`;
      });
      const results = await RNHTMLtoPDF.convert({
        html: `<html>
				<style>
					table {
            font-size: 2em;
						font-family: arial, sans-serif;
						border-collapse: collapse;
						width: 100%;
					}
					td, th {
						text-align: left;
						padding: 8px;
					}
					</style>
					${receipthead}
					<table style="width:100%">
						<tr>
							<th>Nama Pesanan</th>
							<th>QTY</th>
						</tr>
						${receipt}
					</table>
					<hr>
				</html>`,
        fileName: 'test',
        base64: true,
      });

      await RNPrint.print({filePath: results.filePath});
    };
    const {
      kopiGratisVisible,
      hidanganVisible,
      konfirmasiVisible,
      selesaiVisible,
    } = this.state;
    const {route} = this.props;
    const {type} = route.params;
    const {nomorpesanan} = route.params;
    const {nomormeja} = route.params;
    const {statusHeader} = route.params;
    return (
      <View>
        {/* Kopi Gratis */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={kopiGratisVisible}
          onRequestClose={() => {
            this.setKopiGratisVisible(!kopiGratisVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>Kopi Gratis</Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Apakah Anda ingin menambahkan kopi gratis dalam pesanan?
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setKopiGratisVisible(!kopiGratisVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TIDAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => {
                    this.setKopiGratisVisible(false);
                  }}
                  onPressIn={() => this.tambahKopiGratis()}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    IYA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Kopi Gratis */}
        {/* Hidangan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={hidanganVisible}
          onRequestClose={() => {
            this.setHidanganVisible(!hidanganVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>Hidangan Kopi Spesial</Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Apakah Anda ingin menambahkan kopi spesial dalam pesanan?
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setHidanganVisible(!hidanganVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TIDAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => {
                    this.setHidanganVisible(!hidanganVisible);
                    // this.addToCart(this.state.kopispesial);
                  }}
                  onPressOut={() => {
                    this.setState({
                      hidanganshow: true,
                    });
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    IYA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Hidangan */}
        {/* Konfirmasi */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={konfirmasiVisible}
          onRequestClose={() => {
            this.setKonfirmasiVisible(!konfirmasiVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              {type == 'pesanantambahan' ? (
                <Text style={styles.headerTextModal}>
                  Konfirmasi Pesanan Tambahan
                </Text>
              ) : (
                <Text style={styles.headerTextModal}>Konfirmasi Pesanan</Text>
              )}
              <View style={styles.marginTopTen}></View>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.bodyText}>Meja {nomormeja}</Text>
              </View>
              <Text style={styles.bodyText}>Rincian Pesanan</Text>
              <View style={styles.horizontalLine}></View>
              {this.state.rincian.map((data, i) => {
                return (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}
                    key={i}>
                    {data.nama_menu == 'Kopi Gratis' ?
                    <Text style={[styles.bodyText, styles.TextDanger]}>{data.nama_menu}</Text>
                    : data.nama_menu == 'Kopi Spesial' ?
                    <Text style={[styles.bodyText, styles.TextDanger]}>{data.nama_menu}</Text>
                    :
                    <Text style={[styles.bodyText, {color: '#000000'}]}>{data.nama_menu}</Text>
                    }
                    <Text style={[styles.bodyText, {color: '#000000'}]}>{data.jumlah}x</Text>
                  </View>
                );
              })}
              <View style={styles.marginTopTen}></View>
              {type == 'pesanantambahan' ? (
                <Text style={styles.bodyTextBold}>
                  Apakah Anda sudah yakin dengan pesanan tambahan ini?
                </Text>
              ) : (
                <Text style={styles.bodyTextBold}>
                  Apakah Anda sudah yakin dengan pesanan ini?
                </Text>
              )}
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPressIn={() => {
                    if (this.state.hidanganshow) {
                      this.removeHidanganKopiSpesial();
                    }
                    if (this.state.gratisshow) {
                      this.removeKopiGratis();
                    }
                  }}
                  onPress={() => this.setKonfirmasiVisible(!konfirmasiVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TIDAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => this.setKonfirmasiVisible(!konfirmasiVisible)}
                  onPressOut={() => {
                    this.prosesOrder();
                    this.setSelesaiVisible(true);
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    IYA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Konfirmasi */}
        {/* Selesai */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={selesaiVisible}
          onRequestClose={() => {
            this.setSelesaiVisible(!selesaiVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              {type == 'pesanantambahan' ? (
                <Text style={styles.headerTextModal}>
                  Pesanan Tambahan Berhasil Dimasukkan
                </Text>
              ) : (
                <Text style={styles.headerTextModal}>
                  Pesanan Berhasil Dimasukkan
                </Text>
              )}
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>Silahkan cetak kertas orderan apabila diperlukan.</Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.editButton, styles.buttonSpaceRight]}
                  onPress={printPDF}
                  // onPress={() => this.setSelesaiVisible(!selesaiVisible)}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    CETAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => this.setSelesaiVisible(!selesaiVisible)}
                  onPressOut={() => RootNavigation.navigate('HomeScreen')}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    SELESAI
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Selesai */}
        <View style={{flexDirection: 'row', height: '100%'}}>
          {/* Rincian Pesanan */}
          <View style={{width: '50%', backgroundColor: '#FFFFFF'}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                elevation: 5,
              }}>
              {/* Button */}
              {this.state.semuaactive == true ? (
                <TouchableOpacity style={{padding: 20, borderBottomWidth: 3}}>
                  <Text style={[styles.bodyText, styles.TextBlack]}>SEMUA</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{padding: 20}}
                  onPressIn={() => this.getMenu()}
                  onPress={() => {
                    this.setState({
                      semuaactive: true,
                      makananactive: false,
                      minumanactive: false,
                    });
                  }}>
                  <Text style={[styles.bodyText, styles.textGrey]}>SEMUA</Text>
                </TouchableOpacity>
              )}
              {this.state.makananactive == true ? (
                <TouchableOpacity
                  style={{padding: 20, borderBottomWidth: 3}}
                >
                  <Text style={[styles.bodyText, styles.TextBlack]}>
                    MAKANAN
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{padding: 20}}
                  onPressIn={() => this.getMakanan()}
                  onPress={() => {
                    this.setState({
                      semuaactive: false,
                      makananactive: true,
                      minumanactive: false,
                    });
                  }}>
                  <Text style={[styles.bodyText, styles.textGrey]}>
                    MAKANAN
                  </Text>
                </TouchableOpacity>
              )}
              {this.state.minumanactive == true ? (
                <TouchableOpacity
                  style={{padding: 20, borderBottomWidth: 3}}
                >
                  <Text style={[styles.bodyText, styles.TextBlack]}>
                    MINUMAN
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPressIn={() => this.getMinuman()}
                  style={{padding: 20}}
                  onPress={() => {
                    this.setState({
                      semuaactive: false,
                      makananactive: false,
                      minumanactive: true,
                    });
                  }}>
                  <Text style={[styles.bodyText, styles.textGrey]}>
                    MINUMAN
                  </Text>
                </TouchableOpacity>
              )}
              {/* Button */}
            </View>
            <View style={{padding: 20}}>
              {/* Search */}
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <TextInput
                  style={{
                    backgroundColor: '#FFFFFF',
                    elevation: 5,
                    borderRadius: 5,
                    paddingLeft: 20,
                  }}
                  placeholder="Cari menu pesanan..."
                />
              </View>
              {/* Search */}
              {/* Daftar Menu */}
              <View>
                <FlatList
                  // nestedScrollEnabled={true}
                  keyExtractor={item => item.id_menu}
                  numColumns={3}
                  showsVerticalScrollIndicator={true}
                  data={this.state.menu}
                  renderItem={({item}) => (
                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        elevation: 5,
                        width: '30%',
                        justifyContent: 'space-between',
                        marginRight: '1.5%',
                        marginLeft: '1.5%',
                        marginTop: 20,
                        marginBottom: 20,
                      }}>
                      <View style={{height: 150}}>
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: '#FFFFFF',
                            padding: 10,
                            borderRadius: 5,
                            elevation: 5,
                            marginTop: 10,
                            marginLeft: 10,
                          }}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item.nama_kategori}
                          </Text>
                        </View>
                        <Image
                          source={{
                            uri:
                            CONSTANT.BASE_URL+'/image/' +
                              item.gambar_menu,
                          }}
                          style={{height: '100%', width: '100%'}}
                        />
                      </View>
                      <View>
                        <View style={{padding: 20}}>
                          <Text style={styles.bodyTextBold}>
                            {item.nama_menu}
                          </Text>
                          {item.diskon <= 0 ? (
                            <NumberFormat
                              renderText={value => (
                                <Text
                                  style={[styles.bodyText, styles.textGrey]}>
                                  {value}
                                </Text>
                              )}
                              value={item.harga_menu}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'Rp'}
                            />
                          ) : (
                            <View>
                              <NumberFormat
                                renderText={value => (
                                  <Text
                                    style={[
                                      styles.bodyText,
                                      styles.textGrey,
                                      {textDecorationLine: 'line-through'},
                                    ]}>
                                    {value}
                                  </Text>
                                )}
                                value={item.harga_menu}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp'}
                              />
                              <NumberFormat
                                renderText={value => (
                                  <Text
                                    style={[
                                      styles.bodyTextBold,
                                      styles.TextDanger,
                                    ]}>
                                    {value} ({item.diskon}%)
                                  </Text>
                                )}
                                value={
                                  item.harga_menu -
                                  (item.harga_menu * item.diskon) / 100
                                }
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp'}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                      <View>
                        {item.ketersediaan_menu == 'tersedia' ? (
                          <TouchableOpacity
                            style={[styles.addButton, {borderRadius: 0}]}
                            onPress={() => {
                              this.addToCart(item);
                            }}>
                            <Text style={styles.buttonText}>TAMBAHKAN</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            disabled={true}
                            style={[styles.greyButton, {borderRadius: 0}]}>
                            <Text style={styles.buttonText}>KOSONG</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}></FlatList>
              </View>
              {/* Daftar Menu */}
            </View>
            {/* Fitur Kopi Gratis */}
            <View style={{paddingLeft: 30, paddingRight: 30}}>
              {this.state.fitur_kopigratis.status_fitur == 'aktif' && this.state.fitur_kopigratis.perhitungan_layanan < this.state.fitur_kopigratis.layanan_maksimal ?
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => this.setKopiGratisVisible(true)}>
                <Text style={styles.buttonText}>
                  TAMBAHKAN KOPI GRATIS DALAM PESANAN
                </Text>
              </TouchableOpacity>
              : this.state.fitur_kopigratis.status_fitur == 'aktif' && this.state.fitur_kopigratis.perhitungan_layanan <= this.state.fitur_kopigratis.layanan_maksimal ?
              <TouchableOpacity
                style={styles.greyButton}
                disabled={true}
                onPress={() => this.setKopiGratisVisible(true)}>
                <Text style={styles.buttonText}>
                  TAMBAHKAN KOPI GRATIS DALAM PESANAN
                </Text>
              </TouchableOpacity>
              : null }
            </View>
            {/* Fitur Kopi Gratis */}
          </View>
          {/* Rincian Pesanan Container */}
          <View
            style={{
              width: '50%',
              backgroundColor: '#000000',
              padding: 20,
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                padding: 20,
                borderRadius: 5,
                height: '100%',
              }}>
              {type == 'pesanantambahan' ? (
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    elevation: 5,
                    marginBottom: 20,
                  }}>
                  <Text style={styles.bodyTextBold}>
                    Seluruh Pesanan Meja {nomormeja}
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  {this.props.route.params.statusHeader.map((data , i) => {
                    return(
                      <View key={i}>
                        {data.orderan.map((item, i) => {
                          return(
                            <View key={i}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <Text style={[styles.bodyTextBold, {color: '#000000'}]}>Orderan {item.nomor_orderan}</Text>
                                {item.status_orderan == 'sedang diproses' ?
                                  <Text style={[styles.bodyTextBold, {color: '#FEEB75'}]}>
                                    {this.capitalizeFirstLetter(item.status_orderan)}
                                  </Text>
                                : item.status_orderan == 'selesai' ?
                                  <Text style={[styles.bodyTextBold, {color: '#68E396'}]}>
                                    {this.capitalizeFirstLetter(item.status_orderan)}
                                  </Text>
                                : null
                                }
                              </View>
                              {item.menus.map((menus, i) => {
                                return(
                                  <View
                                    key={i}
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginTop: 10,
                                      marginBottom: 10,
                                    }}>
                                    {menus.nama_menu == 'Kopi Gratis' ?
                                    <Text style={[styles.bodyText, styles.TextDanger]}>
                                      {menus.nama_menu}
                                    </Text>
                                    : menus.nama_menu == 'Kopi Spesial' ?
                                    <Text style={[styles.bodyText, styles.TextDanger]}>
                                      {menus.nama_menu}
                                    </Text>
                                    :
                                    <Text style={[styles.bodyText, styles.textGrey]}>
                                      {menus.nama_menu}
                                    </Text>
                                    }
                                    <Text style={[styles.bodyText, styles.textGrey]}>{menus.jumlah_menu}x</Text>
                                  </View>
                                );
                              })}
                            </View>
                          );
                        })}
                    </View>
                    );
                  })}
                </View>
              ) : null}
              {type == 'pesananbaru' ? (
                <Text style={styles.headerTextBold}>Rincian Pesanan</Text>
              ) : type == 'pesanantambahan' ? (
                <Text style={styles.headerTextBold}>
                  Rincian Pesanan Tambahan
                </Text>
              ) : null}
              <View style={styles.horizontalLine}></View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.bodyText}>Meja {nomormeja}</Text>
                </View>
              </View>
              {this.state.rincianshow == true ? (
                <View style={{marginTop: 20}}>
                  {/* Table Header */}
                  <View
                    style={[
                      styles.tableHeaderContainer,
                      styles.marginTopTwenty,
                      {paddingLeft: 30, paddingRight: 30},
                    ]}>
                    {this.state.HeadTable.map((item, i) => {
                      return (
                        <View style={styles.tableHeaderBox} key={i}>
                          {item == 'HARGA' ? (
                            <Text
                              style={[styles.bodyTextBold, styles.flexEndText]}>
                              {item}
                            </Text>
                          ) : item == 'AKSI' ? (
                            <Text
                              style={[styles.bodyTextBold, styles.flexEndText]}>
                              {item}
                            </Text>
                          ) : (
                            <Text style={styles.bodyTextBold}>{item}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  {/* Table Header */}
                  <View
                    style={[styles.tableRowContainer, styles.marginTopTwenty]}>
                    <FlatList
                      keyExtractor={item => item.id_menu}
                      data={this.state.rincian}
                      renderItem={({item, i}) => (
                        <RincianItem
                          item={item}
                          onSubtract={() =>
                            this.onSubstract(item, item.id_menu)
                          }
                          onAdd={() => this.onAdd(item, item.id_menu)}
                          onRemove={() => this.onRemove(item.id_menu)}
                        />
                      )}
                    />
                  </View>
                  {this.state.gratisshow == true ? (
                    <View
                      style={[
                        styles.tableRowContainer,
                        styles.marginTopTwenty,
                      ]}>
                      <View
                        style={[
                          styles.tableRowBox,
                          {
                            backgroundColor: '#FFFFFF',
                            elevation: 5,
                            padding: 30,
                          },
                        ]}>
                        <View style={styles.tableRowEach}>
                          <Text style={[styles.bodyText, styles.TextDanger]}>
                            Kopi Gratis
                          </Text>
                        </View>
                        <View style={styles.tableRowEach}></View>
                        <View style={styles.tableRowEach}></View>
                        <View
                          style={[
                            styles.tableRowEach,
                            {alignItems: 'flex-end'},
                          ]}></View>
                      </View>
                    </View>
                  ) : null}
                  {this.state.hidanganshow == true ? (
                    <View
                      style={[
                        styles.tableRowContainer,
                        styles.marginTopTwenty,
                      ]}>
                      <View
                        style={[
                          styles.tableRowBox,
                          {
                            backgroundColor: '#FFFFFF',
                            elevation: 5,
                            padding: 30,
                          },
                        ]}>
                        <View style={styles.tableRowEach}>
                          <Text style={[styles.bodyText, styles.TextDanger]}>
                            Kopi Spesial
                          </Text>
                        </View>
                        <View style={styles.tableRowEach}></View>
                        <View style={styles.tableRowEach}></View>
                        <View
                          style={[
                            styles.tableRowEach,
                            {alignItems: 'flex-end'},
                          ]}></View>
                      </View>
                    </View>
                  ) : null}
                  <View style={styles.marginTopThirty}>
                    <Text style={styles.bodyTextBold}>Catatan</Text>
                    <TextInput
                      multiline
                      onChangeText={value => {
                        this.setState({
                          catatan: value
                        })
                      }}
                      textAlignVertical="top"
                      numberOfLines={5}
                      placeholder="Catatan pesanan"
                      style={{borderWidth: 1, paddingLeft: 10, marginTop: 20}}
                    />
                  </View>
                  <View style={{marginTop: 30, alignItems: 'flex-end'}}>
                    <Text style={styles.headerTextBold}>
                      <Text>TOTAL:</Text>
                      <NumberFormat
                        renderText={value => <Text> {value}</Text>}
                        value={this.state.rincian.reduce(function (
                          result,
                          item,
                        ) {
                          return (
                            result +
                            item.jumlah *
                              (item.harga_menu * ((100 - item.diskon) / 100))
                          );
                        },
                        0)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    </Text>
                  </View>
                  <View style={{marginTop: 30}}>
                    
                    <TouchableOpacity
                      style={[styles.addButton, {marginBottom: 10}]}
                      onPress={() => {
                        if (this.state.hidanganshow) {
                          let temp = this.state.rincian;
                          temp.push(this.state.kopispesial);
                          this.setState({rincian: temp});
                        }
                        if (this.state.gratisshow) {
                          let temp = this.state.rincian;
                          temp.push(this.state.kopigratis);
                          this.setState({rincian: temp});
                        }
                        if (this.state.rincian == '') {
                          ToastAndroid.show(
                            'Tambahkan pesanan sebelum konfirmasi pesanan!',
                            ToastAndroid.SHORT,
                          );
                        } else {
                          this.setKonfirmasiVisible(true);
                        }
                        console.log('RINCIAN FINAL ??', this.state.rincian);
                      }}>
                      {type == 'pesananbaru' ?
                      <Text style={styles.buttonText}>KONFIRMASI PESANAN</Text>
                      :
                      <Text style={styles.buttonText}>KONFIRMASI PESANAN TAMBAHAN</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        RootNavigation.navigate('HomeScreen');
                      }}>
                      {type == 'pesananbaru' ?
                      <Text style={styles.buttonText}>BATALKAN PESANAN</Text>
                      :
                      <Text style={styles.buttonText}>BATALKAN PESANAN TAMBAHAN</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const route = useRoute();

  return <Pesanan {...props} route={route} />;
}
