import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  'window',
)

export const centerMargin = (w) => {
  return Math.round((viewportWidth - w) / 2)
}

export const wp = (percentage) => {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}
export const hp = (percentage) => {
  const value = (percentage * viewportHeight) / 100
  return Math.round(value)
}

export const CStyle = StyleSheet.create({
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  shadow: {
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  textContainer: {
    width: wp(80),
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'black',
    marginBottom: hp(2),
    alignSelf: 'center',
    textAlign: 'center',
  },

  svStyle: { paddingTop: 50, paddingBottom: 50 },
  svCStyle: { justifyContent: 'center', alignItems: 'center' },
  paddedStart: { alignSelf: 'flex-start', paddingLeft: 20 },

  centerModal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    minWidth: wp(80),
    minHeight: wp(80),
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fullModal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  signupInput: {
    alignItems: 'flex-start',
    paddingVertical: hp(1.5),
    borderRadius: 10,
    textAlign: 'left',
  },
  orangeButton: {
    backgroundColor: '#FFC45A',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  orangeButtonText: {
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  modalBigText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  verticalLine: {
    height: 30,
    width: 1,
    backgroundColor: '#909090',
    marginBottom: 5,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#909090',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFC45A',
    // borderColor: '#2196F3',
    // borderColor: 'turquoise',
    backgroundColor: 'transparent',
  },

  checkboxChecked: {
    backgroundColor: '#FFC45A',
    // backgroundColor: '#2196F3',
    // backgroundColor: 'turquoise',
  },
})
