/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import React, {Component} from 'react';
import {FlatList, Animated, TouchableOpacity, Dimensions, Alert, View, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {get, resetKittins} from "../../actions/picture";

const Spinner = require('react-native-spinkit');

const colors = [
  '#011f4b',
  '#03396c',
  '#005b96',
  '#6497b1',
  '#b3cde0',
  '#efbbff',
  '#d896ff',
  '#be29ec',
  '#800080',
  '#660066',
  '#a3c1ad',
  '#a0d6b4',
  '#5f9ea0',
  '#317873',
  '#49796b',
];

let lastColors = [];

const getRandomColor = () => {
  if (lastColors.length === colors.length) {
    lastColors = [];
  }
  let index = Math.floor(Math.random() * 100) % colors.length;
  while (lastColors.indexOf(colors[index]) >= 0) {
    index = Math.floor(Math.random() * 100) % colors.length;
  }
  lastColors.push(colors[index]);
  return colors[index]
};
const KittinFlatList = styled(FlatList)`
  height: 100%;
  width: 100%;
  background-color: ${getRandomColor()};
`;

const KittinContainer = styled.View`
  min-width: ${props => props.size}px;
  max-width: ${props => props.size}px;
  height: ${props => props.size}px;
  max-height: ${props => props.size}px;
  flex: 1;
  background-color: ${props => props.color};
`;

const Kittin = styled.Image`
  width: 100%;
  height: 100%;
`;

const KittinLoading = styled(Spinner)`
  width: 100%;
  height: 80px;
  align-content: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: transparent;
  opacity: 0.7;
`;

const KittinTouch = styled(Ripple)`
  width: 100%;
  height: 100%;
  flex: 1;
`;

const generateKittinPlaceholders = (totalKittins = 100) => {
  let kittins = [];
  for (let i = 0; i < totalKittins; i++) {
    kittins.push({url: null, key: `${i}`, color: getRandomColor()});
  }
  return kittins;
};

class KittinList extends Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    const columns = width > height ? 5 : 3;

    this.state = {
      columns: columns,
      size: Math.floor(width / columns),
      orientation: width > height ? 'l' : 'p',
      data: generateKittinPlaceholders(),
      firstLoad: true,
      opacity: new Animated.Value(0)
    }
  }

  handleWindowChange = ({window}) => {
    let {width, height} = window;
    const columns = width > height ? 5 : 3;
    const orientation = width > height ? 'l' : 'h';
    const size = Math.floor(window.width / columns);
    this.setState(prevState => {
      if (prevState.orientation === orientation) {
        return {
          size, columns
        }
      } else {
        return {
          size, columns, orientation
        }
      }
    });
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleWindowChange);
    this.props.getKittins(45);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleWindowChange);
  }

  static getDerivedStateFromProps(props, state) {
    let {kittinURLs} = props;
    let {data} = state;
    let firstLoad = true;
    if (kittinURLs.length > 0) {
      data = kittinURLs.reduce((accum, url, index) => {
        accum.push({
          color: (data[index] || {}).color || getRandomColor(),
          url,
          key: index,
        });
        return accum;
      }, []);
      firstLoad = false;
    }

    return {
      ...state,
      data,
      firstLoad
    }
  }

  renderKittin = ({item}) => {
    let kittin = (
      <KittinTouch
        rippleColor={item.color}
        onPress={() => {
        this.props.navigation.navigate('Kittin', {url: item.url});
      }}>
        <Kittin fadeDuration={100} source={{uri: item.url}}/>
      </KittinTouch>
    );
    return (
      <KittinContainer
        color={item.color}
        size={this.state.size}>
        {item.url ? kittin : null}
      </KittinContainer>
    );
  };

  getKittins = () => {
    this.props.resetKittins();
    this.props.getKittins(40);
  };

  getMoreKittins = () => {
    this.props.getMoreKittins(40, this.props.pageNumber);
  };

  render() {
    const {columns, data} = this.state;
    const {height, width} = Dimensions.get('window');

    if (this.props.kittinURLs.length > 0 && this.state.opacity.__getAnimatedValue() === 0) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }

    return (
      <KittinFlatList
        keyExtractor={(_, i) => `${i}`}
        key={(height > width ? 'v' : 'h')}
        refreshing={this.props.refreshing && !this.state.firstLoad}
        onRefresh={this.getKittins}
        numColumns={columns}
        data={data}
        removeClippedSubviews={false}
        renderItem={this.renderKittin}
        onEndReached={this.getMoreKittins}
        onEndThreshold={0.5}
        ListFooterComponent={() => (<KittinLoading isVisible={true} type={'9CubeGrid'} color="white"/>)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    kittinURLs: state.kittins.urls,
    refreshing: state.kittins.isLoading,
    pageNumber: state.kittins.pageNumber,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getKittins: (totalKittins, page) => dispatch(get(totalKittins, page)),
    resetKittins: () => dispatch(resetKittins()),
    getMoreKittins: (totalKittins, page) => dispatch(get(totalKittins, page, true))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(KittinList);