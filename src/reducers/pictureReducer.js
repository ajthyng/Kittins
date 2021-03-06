/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import {actions as pictureActions} from '../actions/picture';
const {REQUEST_PICTURE, PICTURE_SUCCESS, PICTURE_FAILURE, RESET_KITTINS} = pictureActions;

const initialState = {
  isLoading: false,
  urls: [],
  errorMessage: null,
  pageNumber: 1,
};

const requestPicture = (state, action) => {
  return {
    ...state,
    isLoading: action.isLoading,
    errorMessage: null
  }
};

const pictureSuccess = (state, action) => {
  const onlyOnePage = state.pageNumber === 1;
  let urls = [];
  if (onlyOnePage) {
    urls = [...action.urls];
  } else {
    urls = [...state.urls, ...action.urls];
  }
  return {
    ...state,
    isLoading: false,
    urls,
    errorMessage: null,
    pageNumber: state.pageNumber + 1,
  }
};

const pictureFailure = (state, action) => {
  return {
    ...state,
    isLoading: false,
    errorMessage: `Failed to load picture with search term ${action.search || "blank search"}.`
  }
};

export function pictureReducer(state = initialState, action) {
  switch(action.type) {
    case REQUEST_PICTURE: return requestPicture(state, action);
    case PICTURE_SUCCESS: return pictureSuccess(state, action);
    case PICTURE_FAILURE: return pictureFailure(state, action);
    case RESET_KITTINS: return initialState;
    default: return state;
  }
}