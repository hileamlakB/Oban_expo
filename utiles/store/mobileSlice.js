import { createSlice } from '@reduxjs/toolkit'

const initialMobileData = {
  mobileInfo: {
    brand: '',
    model: '',
  },

  mobileEvaluation: {
    status: 'initial',
    appraisedValue: 0,
    price: 0,
    displayEvaluation: {
      status: 'initial',
      appraisedValue: 0,
      touch: {
        state: 'initial',
        appraisedValue: 0,
      },
      dim: {
        state: 'initial',
        appraisedValue: 0,
      },
      pixel: {
        state: 'initial',
        appraisedValue: 0,
      },
      discolor: {
        state: 'initial',
        appraisedValue: 0,
      },
      whiteSpot: {
        state: 'initial',
        appraisedValue: 0,
      },
      proximity: {
        state: 'initial',
        appraisedValue: 0,
      },
      rotation: {
        state: 'initial',
        appraisedValue: 0,
      },
    },
    cameraEvaluation: {
      status: 'initial',
      appraisedValue: 0,
      frontCamera: {
        state: 'initial',
        appraisedValue: 0,
      },
      backCamera: {
        state: 'initial',
        appraisedValue: 0,
      },
      cameraFlash: {
        state: 'initial',
        appraisedValue: 0,
      },
      cameraVideo: {
        state: 'initial',
        appraisedValue: 0,
      },
      qrReader: {
        state: 'initial',
        appraisedValue: 0,
      },
    },
    connectivityEvaluation: {
      status: 'initial',
      appraisedValue: 0,
      wifi: {
        state: 'initial',
        appraisedValue: 0,
      },
      bluetooth: {
        state: 'initial',
        appraisedValue: 0,
      },
      mbdata: {
        state: 'initial',
        appraisedValue: 0,
      },
      simCard: {
        state: 'initial',
        appraisedValue: 0,
      },
      sdCard: {
        state: 'initial',
        appraisedValue: 0,
      },
    },
    audioEvaluation: {
      status: 'initial',
      appraisedValue: 0,
      earPiece: {
        state: 'initial',
        appraisedValue: 0,
      },
      headSet: {
        state: 'initial',
        appraisedValue: 0,
      },
      loudSpeaker: {
        state: 'initial',
        appraisedValue: 0,
      },
      microphone: {
        state: 'initial',
        appraisedValue: 0,
      },
      vibration: {
        state: 'initial',
        appraisedValue: 0,
      },
    },
    batteryEvaluation: {
      status: 'initial',
      appraisedValue: 0,
      charge: {
        state: 'initial',
        appraisedValue: 0,
      },
      volumeButton: {
        state: 'initial',
        appraisedValue: 0,
      },
      powerButton: {
        state: 'initial',
        appraisedValue: 0,
      },
      fingerPrint: {
        state: 'initial',
        appraisedValue: 0,
      },
      faceId: {
        state: 'initial',
        appraisedValue: 0,
      },
    },
  },
}

export const mobileSlice = createSlice({
  name: 'mobile',
  initialState: initialMobileData,
  reducers: {
    // Update Test Data
    updateTest: (state, action) => {
      console.log(
        'updating test',
        state.mobileEvaluation[action.payload.testGroup][
          action.payload.testName
        ].state,
      )
      state.mobileEvaluation[action.payload.testGroup][
        action.payload.testName
      ].state = action.payload.state
      state.mobileEvaluation[action.payload.testGroup][
        action.payload.testName
      ].appraisedValue = action.payload.appraisedValue
    },
    updateAppraisal: (state, action) => {
      state.mobileEvaluation[action.payload.testGroup].status =
        action.payload.status
      state.mobileEvaluation[action.payload.testGroup].appraisedValue =
        action.payload.appraisedValue
    },
  },
})

export const { updateTest, updateAppraisal } = mobileSlice.actions
