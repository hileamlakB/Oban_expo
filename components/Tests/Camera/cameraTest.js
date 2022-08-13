import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react'
import { FullModal } from '../../BasicComponents'
import { Test, TestGroup } from '../TestsTemplate'
import { Camera, CameraType } from 'expo-camera'
import * as Linking from 'expo-linking'
import { Button, Text, View, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as FaceDetector from 'expo-face-detector'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useDispatch, useSelector } from 'react-redux'
import { updateTest, updateAppraisal } from '../../../utiles/store/mobileSlice'
import * as Brightness from 'expo-brightness'

// A Camera Modal that takes pictures updates status
// based on picture taken
// This components logs error using the set errorMessag function
export const CameraModal = ({
  title,
  show,
  instruction,
  cameraType,
  setTest,
  onClose,
  flashTest = false,
  setErr = () => {},
}) => {
  const [CameraPermision, setCameraPermision] = useState({
    status: 'undetermined',
    canAskAgain: true,
  })
  const [showActivity, setshowActivity] = useState(!flashTest)

  const [cameraReady, setcameraReady] = useState(false)

  const [flashMode, setflashMode] = useState(Camera.Constants.FlashMode.off)

  const cameraRef = useRef(null)

  useEffect(() => {
    setshowActivity(!flashTest)
  }, [show])

  const compareFlashImages = async () => {
    if (!cameraReady) {
      alert('Wait for the camera to initalize and click the start button again')
      return
    }

    setshowActivity(true)
    const flashOff = await cameraRef.current.takePictureAsync()
    setflashMode(Camera.Constants.FlashMode.on)
    const flashOn = await cameraRef.current.takePictureAsync()
    setflashMode(Camera.Constants.FlashMode.off)
    const flashOff2 = await cameraRef.current.takePictureAsync()

    let form = new FormData()
    form.append('image', {
      uri: 'file://' + flashOff.uri,
      type: 'image/jpg',
      name: 'initImage.jpg',
    })
    form.append('image', {
      uri: 'file://' + flashOn.uri,
      type: 'image/jpg',
      name: 'flash.jpg',
    })
    form.append('image', {
      uri: 'file://' + flashOff2.uri,
      type: 'image/jpg',
      name: 'flashOff.jpg',
    })

    fetch('http://188.166.104.97:5000/checkImage/', {
      method: 'POST',
      body: form,
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        // console.log(data, data.status, data.verfication)
        if (data.status !== 'success') {
          setErr({ title: 'Server Error', error: data.message })
          setTest('failed')
        } else if (data.verfication !== 'True') {
          setErr({ title: 'Image Check failed', error: data.message })
          setTest('failed')
        } else {
          setTest('complete')
        }
        onClose()
      })
      .catch((err) => {
        // if there is a network error, show a message
        // show indicator messages
        setTest('failed')
        setErr({
          title: 'Image Check failed',
          error:
            'Something related to image checker Failed! please connect to the internate and try again!',
        })
        alert(
          'Something related to image checker Failed! please connect to the internate and try again!',
        )
        setTest('failed')
        onClose()
      })
  }

  const handleFacesDetected = ({ faces }) => {
    // TODO
    // Include timer incase users don't do it in time

    // face detection isn't usefull for flash test
    if (flashTest) {
      return
    }

    if (faces.length > 0) {
      setTest('complete')
      setshowActivity(false)

      setTimeout(() => {
        onClose()
      }, 100)
    }
  }

  // Handle permision
  const requestCameraPermision = async () => {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync()
    setCameraPermision({ status: status, canAskAgain: canAskAgain })
  }

  if (!show) {
    return <></>
  }
  if (CameraPermision.status !== 'granted' && CameraPermision.canAskAgain) {
    requestCameraPermision()
    return (
      <FullModal
        show={show}
        onClose={() => {
          setTest('failed')
          onClose()
        }}
      >
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>You need to enable Camera Permission to perform this test</Text>
        </View>
      </FullModal>
    )
  }
  if (CameraPermision.status !== 'granted' && !CameraPermision.canAskAgain) {
    return (
      <FullModal
        show={show}
        onClose={() => {
          setTest('failed')
          onClose()
        }}
      >
        <View style={{ height: '100%', justifyContent: 'center' }}>
          <Text>
            No access to camera, you need to enable permission in settings.
          </Text>
          <Button
            title="Continue"
            onPress={() => {
              Linking.openSettings()
            }}
          />
        </View>
      </FullModal>
    )
  }

  return (
    <FullModal
      show={show}
      onClose={() => {
        setTest('failed')
        onClose()
      }}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{title}</Text>
        <View
          style={{
            width: 220,
            height: 270,
            borderRadius: 270,
            overflow: 'hidden',
            margin: 10,
          }}
        >
          <Camera
            style={{ flex: 1 }}
            type={cameraType}
            flashMode={flashMode}
            onCameraReady={() => setcameraReady(true)}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.accurate,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
              minDetectionInterval: 1000,
            }}
            ref={cameraRef}
          ></Camera>
        </View>
        <Text style={{ width: '90%', textAlign: 'center' }}>{instruction}</Text>
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={showActivity}
        />
        {!showActivity && flashTest && (
          <Button title="Start" onPress={compareFlashImages} />
        )}
        {!showActivity && !flashTest && (
          <Ionicons name="checkmark" size={40} color="turquoise" />
        )}
      </View>
    </FullModal>
  )
}

const BarCodeModal = ({
  title,
  show,
  instruction,
  setTest,
  onClose,
  setErr = () => {},
}) => {
  const [scannerPermission, setscannerPermision] = useState({
    status: 'undetermined',
    canAskAgain: true,
  })
  const [showActivity, setshowActivity] = useState(true)

  useEffect(() => {
    setshowActivity(true)
  }, [show])

  const handleBarCodeScanned = ({ type, data }) => {
    setTest('complete')
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    onClose()
  }

  // Handle permision
  const requestScannerPermision = async () => {
    const {
      status,
      canAskAgain,
    } = await BarCodeScanner.requestPermissionsAsync()
    setscannerPermision({ status: status, canAskAgain: canAskAgain })
  }

  if (!show) {
    return <></>
  }
  if (scannerPermission.status !== 'granted' && scannerPermission.canAskAgain) {
    requestScannerPermision()
    return (
      <FullModal
        show={show}
        onClose={() => {
          setTest('failed')
          onClose()
        }}
      >
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>
            You need to enable scanner Permission to perform this test
          </Text>
        </View>
      </FullModal>
    )
  }
  if (
    scannerPermission.status !== 'granted' &&
    !scannerPermission.canAskAgain
  ) {
    return (
      <FullModal
        show={show}
        onClose={() => {
          setTest('failed')
          onClose()
        }}
      >
        <View style={{ height: '100%', justifyContent: 'center' }}>
          <Text>
            No access to camera, you need to enable permission in settings.
          </Text>
          <Button
            title="Continue"
            onPress={() => {
              Linking.openSettings()
            }}
          />
        </View>
      </FullModal>
    )
  }

  return (
    <FullModal
      show={show}
      onClose={() => {
        setTest('failed')
        onClose()
      }}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{title}</Text>
        <View
          style={{
            width: 220,
            height: 270,
            borderRadius: 270,
            overflow: 'hidden',
            margin: 10,
          }}
        >
          <BarCodeScanner
            style={{
              flex: 1,
            }}
            onBarCodeScanned={handleBarCodeScanned}
          />
        </View>
        <Text style={{ width: '90%', textAlign: 'center' }}>{instruction}</Text>
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={showActivity}
        />
        {!showActivity && flashTest && (
          <Button title="Start" onPress={compareFlashImages} />
        )}
        {!showActivity && !flashTest && (
          <Ionicons name="checkmark" size={40} color="turquoise" />
        )}
      </View>
    </FullModal>
  )
}

export const FrontCameraTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.frontCamera.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'cameraEvaluation',
        testName: 'frontCamera',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })

  const [openCamera, setopenCamera] = useState(false)
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setopenCamera(true)
    })
  }

  return (
    <>
      <CameraModal
        title="Front Camera Test"
        show={openCamera}
        cameraType={CameraType.front}
        setTest={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
        onClose={() => {
          if (testState !== 'complete') {
            testResolveer.current?.resolve('failed')
            seterrorMessage({
              title: 'Test Failed',
              error: 'Test closed by user',
            })
          }
          setopenCamera(false)
        }}
        instruction={
          'Make sure your face fits in the box and wait for a second.'
        }
      />

      <Test
        testState={testState}
        testName="Front Camera"
        iconName="camera-outline"
        run={() => run(false)}
        message={errorMessage}
      />
    </>
  )
})

export const BackCameraTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  // This should be a global redux state instead of a local one
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.backCamera.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'cameraEvaluation',
        testName: 'backCamera',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [openCamera, setopenCamera] = useState(false)
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setopenCamera(true)
    })
  }

  return (
    <>
      <CameraModal
        title="Back Camera Test"
        show={openCamera}
        cameraType={CameraType.back}
        setTest={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
        onClose={() => {
          if (testState !== 'complete') {
            testResolveer.current?.resolve('failed')
          }
          setopenCamera(false)
        }}
        instruction={
          'Make sure your face fits in the box and wait for a second.'
        }
      />

      <Test
        testState={testState}
        testName="Back Camera"
        iconName="camera-reverse-outline"
        run={run}
        message={errorMessage}
      />
    </>
  )
})

export const FlashTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.cameraFlash.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'cameraEvaluation',
        testName: 'cameraFlash',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const [showModal, setshowModal] = useState(false)

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setshowModal(true)
      return true
    })
  }

  return (
    <>
      <CameraModal
        title="Flash Camera Test"
        show={showModal}
        instruction={
          'Block the camera with your hand and press the button below to test the flash.'
        }
        cameraType={CameraType.back}
        setTest={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
        flashTest={true}
        onClose={() => {
          if (testState !== 'complete') {
            testResolveer.current?.resolve('failed')
          }
          setshowModal(false)
        }}
        setErr={seterrorMessage}
      />
      <Test
        testState={testState}
        testName="Flash"
        iconName="flashlight-outline"
        run={run}
        message={errorMessage}
      />
    </>
  )
})

export const VideoTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.cameraVideo.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'cameraEvaluation',
        testName: 'cameraVideo',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const backCameraTest = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.backCamera.state,
  )
  const cameraFlashTest = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.cameraFlash.state,
  )

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }

      if (backCameraTest === 'complete' && cameraFlashTest === 'complete') {
        settestState('complete', props.value)
        resolve('success')
      } else {
        seterrorMessage({
          title: 'Video Test Failed',
          error:
            'Please make sure your back camera and flash are working properly.',
        })
        settestState('failed', -props.value)
        resolve('failed')
      }

      // Exansions for the videotest
      // 1. Take a video and see if it is possible
      // 2. Take a video of a person front and back and compare
      // 3. Make sure video is playable and passes some checks
    })
  }

  return (
    <Test
      testState={testState}
      testName="Video"
      iconName="videocam-outline"
      run={run}
      message={errorMessage}
    />
  )
})

export const QrTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.qrReader.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'cameraEvaluation',
        testName: 'qrReader',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({
    title: 'ERROR',
    error: 'RUN TEST AGAIN TO GET THE LATEST ERROR',
  })
  const [showModal, setshowModal] = useState(false)

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      setshowModal(true)
    })
  }

  return (
    <>
      <BarCodeModal
        title="QR Code Test"
        instruction={'Scan any QR code to test the QR Reader.'}
        show={showModal}
        onClose={() => {
          if (testState !== 'complete') {
            testResolveer.current?.resolve('failed')
          }
          setshowModal(false)
        }}
        setTest={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
        setErr={seterrorMessage}
      />

      <Test
        testState={testState}
        testName="QR code"
        iconName="qr-code-outline"
        run={run}
        message={errorMessage}
      />
    </>
  )
})

export const CameraTestGroup = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const [groupStatus, setgroupStatus] = useState(false)

  //  Child test refs
  const frontCameraTestRef = useRef(null)
  const backCameraTestRef = useRef(null)
  const videoTestRef = useRef(null)
  const flashTestRef = useRef(null)
  const qrTestRef = useRef(null)

  // child test states
  const frontCameraTest = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.cameraEvaluation.frontCamera,
  )
  const backCameraTest = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.cameraEvaluation.backCamera,
  )
  const flashTest = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.cameraEvaluation.cameraFlash,
  )
  const videoTest = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.cameraEvaluation.cameraVideo,
  )
  const qrTest = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.cameraEvaluation.qrReader,
  )

  // upraised value
  const appraisedValue = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.cameraEvaluation.appraisedValue,
  )

  // Test weights
  const testWeights = useMemo(() => {
    return {
      total: function () {
        let sum = 0
        for (const [_, value] of Object.entries(this.test)) {
          sum += value
        }
        return sum
      },
      test: {
        frontCamera: 2,
        backCamera: 4,
        cameraFlash: 2,
        video: 1,
        qrReader: 4,
      },
    }
  }, [])

  // dispatcher
  const dispatcher = useDispatch()

  // update appraisal once all the tests are complete
  useEffect(() => {
    const states = [
      frontCameraTest.state,
      backCameraTest.state,
      flashTest.state,
      videoTest.state,
      qrTest.state,
    ]

    let status = 'initial'
    if (states.every((state) => state === 'complete')) {
      status = 'complete'
      setgroupStatus(true)
    } else {
      setgroupStatus(false)
    }

    if (states.some((state) => state === 'failed')) {
      status = 'failed'
      setgroupStatus(false)
    }

    let value =
      (frontCameraTest.appraisedValue +
        backCameraTest.appraisedValue +
        flashTest.appraisedValue +
        videoTest.appraisedValue +
        qrTest.appraisedValue) /
      testWeights.total()

    dispatcher(
      updateAppraisal({
        testGroup: 'cameraEvaluation',
        status,
        appraisedValue: value,
      }),
    )

    return () => {}
  }, [frontCameraTest, backCameraTest, flashTest, videoTest, qrTest])

  const cameraTests = [
    <FrontCameraTest
      ref={frontCameraTestRef}
      value={testWeights.test.frontCamera}
    />,
    <BackCameraTest
      ref={backCameraTestRef}
      value={testWeights.test.backCamera}
    />,
    <VideoTest ref={videoTestRef} value={testWeights.test.video} />,
    <FlashTest ref={flashTestRef} value={testWeights.test.cameraFlash} />,
    <QrTest ref={qrTestRef} value={testWeights.test.qrReader} />,
  ]

  const cameraRefs = [
    frontCameraTestRef,
    backCameraTestRef,
    flashTestRef,
    videoTestRef,
    qrTestRef,
  ]

  const run = async () => {
    for (let i = 0; i < cameraRefs.length; i++) {
      await cameraRefs[i].current?.run()
    }
  }

  return (
    <>
      <TestGroup
        label="Camera Test"
        tests={cameraTests}
        groupStatus={groupStatus}
        score={appraisedValue}
      />
    </>
  )
})
