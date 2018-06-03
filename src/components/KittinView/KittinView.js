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
import {Dimensions} from 'react-native';
import {Transition} from 'react-navigation-fluid-transitions';
import styled from 'styled-components';

const KittinContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #000
`;

const KittinImage = styled.Image`
  width: ${props => props.dimensions.width}px;
  height: ${props => props.dimensions.width}px;
`;

class KittinView extends Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      dimensions: {width, height}
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateDimensions);
  }

  updateDimensions = () => {
    const {width, height} = Dimensions.get('window');

    this.setState(prevState => {
      return {
        ...prevState,
        dimensions: {width, height}
      }
    })
  };

  render() {
    const uri = this.props.navigation.getParam('url', '');
    return (
      <KittinContainer>
        <KittinImage resizeMode='cover' dimensions={this.state.dimensions} source={{uri}}/>
      </KittinContainer>
    );
  }
}

export default KittinView;