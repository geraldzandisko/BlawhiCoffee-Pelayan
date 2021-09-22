import React from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import 'moment/locale/id';
import styles from '../styles/Android.style';

class TimeNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      markedDate: moment(new Date()).format('MMMM Do YYYY, HH:mm:ss'),
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        currentDate: new Date(),
        markedDate: moment(new Date()).format('MMMM Do YYYY, HH:mm:ss'),
      });
    }, 1000);
  }
  render() {
    const day = moment(this.state.currentDate).format('dddd');
    return (
      <View>
        <Text style={styles.headerTextBold}>{day}</Text>
        <Text style={styles.headerText}>{this.state.markedDate}</Text>
      </View>
    );
  }
}

export default TimeNow;
