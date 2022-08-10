import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import { FullModal } from './BasicComponents'
import { Test } from './TestsTemplate'
import { Camera, CameraType } from 'expo-camera'
import * as Linking from 'expo-linking'
import {
  Button,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CStyle } from '../utiles/Styles'
import * as FaceDetector from 'expo-face-detector'

// A Camera Modal that takes pictures updates status
// based on picture taken
// This components logs error using the set errorMessag function
const CameraModal = ({ title, show, cameraType, setTest, onClose }) => {
  const [CameraPermision, setCameraPermision] = useState({
    status: 'undetermined',
    canAskAgain: true,
  })
  const [showActivity, setshowActivity] = useState(true)

  useEffect(() => {
    setshowActivity(true)
  }, [])

  const handleFacesDetected = ({ faces }) => {
    // TODO
    // Include timer incase users don't do it in time

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
      <FullModal show={show} onClose={onClose}>
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
      <FullModal show={show} onClose={onClose}>
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
    <FullModal show={show} onClose={onClose}>
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
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.accurate,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
              minDetectionInterval: 1000,
            }}
          ></Camera>
        </View>
        <Text style={{ width: '90%', textAlign: 'center' }}>
          Make sure your face fits in the box and wait for a second.
        </Text>
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={showActivity}
        />
        {!showActivity && (
          <Ionicons name="checkmark" size={40} color="turquoise" />
        )}
      </View>
    </FullModal>
  )
}

export const FrontCameraTest = forwardRef((props, ref) => {
  // This should be a global redux state instead of a local one
  const [testState, settestState] = useState('initial')
  const [openCamera, setopenCamera] = useState(false)
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    settestState('inprogress')
    setopenCamera(true)
  }

  return (
    <>
      <CameraModal
        title="Front Camera Test"
        show={openCamera}
        cameraType={CameraType.front}
        setTest={settestState}
        onClose={() => {
          if (testState !== 'complete') {
            settestState('failed')
          }
          setopenCamera(false)
        }}
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
  // This should be a global redux state instead of a local one
  const [testState, settestState] = useState('initial')
  const [openCamera, setopenCamera] = useState(false)
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    settestState('inprogress')
    setopenCamera(true)
  }

  return (
    <>
      <CameraModal
        title="Back Camera Test"
        show={openCamera}
        cameraType={CameraType.back}
        setTest={settestState}
        onClose={() => {
          if (testState !== 'complete') {
            settestState('failed')
            seterrorMessage({
              title: 'Back camera modal closed',
              error:
                'Camera model was unexcpectedly closed. Open again to revaluate',
            })
          }
          setopenCamera(false)
        }}
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
  const [testState, settestState] = useState('inprogress')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    // Test logic goes here

    settestState('complete')
    return true
  }

  return (
    <Test
      testState={testState}
      testName="Flash"
      iconName="flashlight-outline"
      run={run}
      message={errorMessage}
    />
  )
})

export const VideoTest = forwardRef((props, ref) => {
  const [testState, settestState] = useState('initial')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    // Test logic goes here
    settestState('complete')
    return true
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
  const [testState, settestState] = useState('initial')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    // Test logic goes here
    settestState('complete')
    return true
  }

  return (
    <Test
      testState={testState}
      testName="QR code"
      iconName="qr-code-outline"
      run={run}
      message={errorMessage}
    />
  )
})
// sample test
export const TemplateTest = forwardRef((props, ref) => {
  const [testState, settestState] = useState('initial')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    // Test logic goes here
    return true
  }

  return (
    <Test
      testState={testState}
      testName="QR code"
      iconName="qr-code-outline"
      run={run}
      message={errorMessage}
    />
  )
})
