import React, { useState, useEffect, useRef } from 'react'
import {
  FrontCameraTest,
  BackCameraTest,
  VideoTest,
  FlashTest,
  QrTest,
  TemplateTest,
} from './Tests'
import { Button } from 'react-native'
import { TestGroup } from './TestsTemplate'

export const CameraTestGroup = () => {
  // Add value here

  const [groupStatus, setgroupStatus] = useState(false)
  const [autoTest, setautoTest] = useState(false)

  const frontCameraTestRef = useRef(null)
  const [frontCameraState, setfrontCameraState] = useState('')

  const backCameraTestRef = useRef(null)
  const [backCameraState, setbackCameraState] = useState('')

  const videoTestRef = useRef(null)
  const [videoState, setvideoState] = useState('')

  const flashTestRef = useRef(null)
  const [flashState, setflashState] = useState('')

  const qrTestRef = useRef(null)
  const [qrState, setqrState] = useState('')

  const cameraTests = [
    <FrontCameraTest
      ref={frontCameraTestRef}
      updateState={setfrontCameraState}
    />,
    <BackCameraTest ref={backCameraTestRef} updateState={setbackCameraState} />,
    <VideoTest ref={videoTestRef} updateState={setvideoState} />,
    <FlashTest ref={flashTestRef} updateState={setflashState} />,
    <QrTest ref={qrTestRef} updateState={setqrState} />,
  ]

  const cameraStates = [
    { state: frontCameraState, setter: setfrontCameraState },
    { state: backCameraState, setter: setbackCameraState },
    { state: videoState, setter: setvideoState },
    { state: flashState, setter: setflashState },
    { state: qrState, setter: setqrState },
  ]

  const cameraRefs = [
    frontCameraTestRef,
    backCameraTestRef,
    videoTestRef,
    flashTestRef,
    qrTestRef,
  ]

  useEffect(() => {
    // changing this test will start the auto eval chain
    if (autoTest) {
      console.log('in auto test')
      if (cameraStates[0].state === 'complete') {
        //  triger the next test
        cameraStates[0].setter('complete')
      } else {
        cameraRefs[0].current?.run()
      }
    }
  }, [autoTest])

  // if autotesting and frist test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[0].state === 'complete' ||
        cameraStates[0].state === 'failed')
    ) {
      console.log('in back test')
      if (cameraStates[1].state === 'complete') {
        // trigger the next test
        cameraStates[1].setter('complete')
      } else {
        cameraRefs[1].current?.run()
      }
    }
  }, [cameraStates[0].state])

  // if auto testing and second test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[1].state === 'complete' ||
        cameraStates[1].state === 'failed')
    ) {
      console.log('in video test')
      if (cameraStates[2].state === 'complete') {
        // trigger the next test
        cameraStates[2].setter('complete')
      } else {
        cameraRefs[2].current?.run()
      }
    }
  }, [cameraStates[1].state])

  // if auto testing and third test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[2].state === 'complete' ||
        cameraStates[2].state === 'failed')
    ) {
      console.log('in flash test')
      if (cameraStates[3].state === 'complete') {
        // trigger the next test
        // cameraStates[3].setter('initial')
        console.log('in test 3')
        cameraStates[3].setter('complete')
      } else {
        cameraRefs[3].current?.run()
      }
    }
  }),
    [cameraStates[2].state]
  // if auto testing and fourth test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[3].state === 'complete' ||
        cameraStates[3].state === 'failed')
    ) {
      console.log('in qr test')
      if (cameraStates[4].state === 'complete') {
        // trigger the next test
        cameraStates[4].setter('initial')
        cameraStates[4].setter('complete')
      } else {
        cameraRefs[4].current?.run()
      }
    }
  }),
    [cameraStates[3].state]

  // if auto testing and sixth test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[4].state === 'complete' ||
        cameraStates[4].state === 'failed')
    ) {
      setautoTest(false)
    }
  }, [cameraStates[4].state])

  const run = async () => {
    setautoTest(true)
  }

  return (
    <>
      <TestGroup
        label="Camera Test"
        tests={cameraTests}
        groupStatus={groupStatus}
      />
      <Button title="Test" onPress={run} />
    </>
  )
}

export const TemplateGroup = () => {
  // Add value here

  const [groupStatus, setgroupStatus] = useState(false)
  const [autoTest, setautoTest] = useState(false)

  const test1 = useRef(null)
  const [test1State, settest1State] = useState('')

  const sampleTests = [
    <TemplateTest ref={frontCameraTestRef} updateState={setfrontCameraState} />,
  ]

  const testStates = [{ state: test1State, setter: settest1State }]

  const cameraRefs = [test1State]

  useEffect(() => {
    // changing this test will start the auto eval chain
    if (autoTest) {
      if (cameraStates[0].state === 'complete') {
        //  triger the next test
        cameraStates[0].setter('initial')
        cameraStates[0].setter('complete')
      } else {
        cameraRefs[0].current?.run()
      }
    }
  }, [autoTest])

  // if autotesting and frist test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[0].state === 'complete' ||
        cameraStates[0].state === 'failed')
    ) {
      if (cameraStates[1].state === 'complete') {
        // trigger the next test
        cameraStates[1].setter('initial')
        cameraStates[1].setter('complete')
      } else {
        cameraRefs[1].current?.run()
      }
    }
  }, [autoTest, cameraStates[0].state])

  // if auto testing and sixth test is complete
  useEffect(() => {
    if (
      autoTest &&
      (cameraStates[4].state === 'complete' ||
        cameraStates[4].state === 'failed')
    ) {
      setautoTest(false)
    }
  }, [autoTest, cameraStates[4].state])

  const run = async () => {
    setautoTest(true)
  }

  return (
    <>
      <TestGroup
        label="Camera Test"
        tests={cameraTests}
        groupStatus={groupStatus}
      />
      <Button title="Test" onPress={run} />
    </>
  )
}
