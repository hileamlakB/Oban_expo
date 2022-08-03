import React, { useState, useEffect } from 'react'
import { FullModal } from './BasicComponents'
import { Test } from './TestsTemplate'
import { Camera, CameraType } from 'expo-camera'

const CameraModal = ({ show, setshow, cameraType }) => {
  const [hasPermission, setHasPermission] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return (
      <FullModal show={show} setshow={setshow}>
        <Text>You need to enable permission to perform this test</Text>
      </FullModal>
    )
  }
  if (hasPermission === false) {
    return (
      <FullModal show={show} setshow={setshow}>
        <Text>No access to camera, you need to enable access in settings.</Text>
      </FullModal>
    )
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back,
              )
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

export const FrontCameraTest = () => {
  // This should be a global redux state instead of a local one

  const [testState, settestState] = useState('failed')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const run = async () => {
    // Test logic goes here
    return true
  }

  return (
    <Test
      testState={testState}
      testName="Front Camera"
      iconName="camera-outline"
      run={run}
      message={errorMessage}
    />
  )
}

export const BackCameraTest = () => {
  const [testState, settestState] = useState('complete')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const run = async () => {
    // Test logic goes here
    return true
  }

  return (
    <Test
      testState={testState}
      testName="Back Camera"
      iconName="camera-reverse-outline"
      run={run}
      message={errorMessage}
    />
  )
}

export const FlashTest = () => {
  const [testState, settestState] = useState('inprogress')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const run = async () => {
    // Test logic goes here
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
}

export const VideoTest = () => {
  const [testState, settestState] = useState('initial')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  const run = async () => {
    // Test logic goes here
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
}
