import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react'
import { FullModal, HalfModal } from '../../BasicComponents'
import { Test, TestGroup } from '../TestsTemplate'
import { Camera, CameraType } from 'expo-camera'
import * as Linking from 'expo-linking'
import {
  Button,
  Text,
  View,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useDispatch, useSelector } from 'react-redux'
import { updateTest, updateAppraisal } from '../../../utiles/store/mobileSlice'
import { CStyle, wp } from '../../../utiles/Styles'
import * as Brightness from 'expo-brightness'
import { DeviceMotion } from 'expo-sensors'
import Proximity from 'react-native-proximity'

// sample test
export const TouchTest = forwardRef((props, ref) => {
  const BLOCK_SIZE = useMemo(() => 40, [])
  const [dimenstions, setdimenstions] = useState(null)
  const [blocks, setblocks] = useState([])

  const [screenOrientation, setscreenOrientation] = useState(-1)

  const [showTest, setshowTest] = useState(false)
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.touch.state,
  )

  const [errorMessage, seterrorMessage] = useState({
    title: 'ERROR',
    error: 'RUN TEST AGAIN TO GET LATEST ERROR',
  })

  const dispatcher = useDispatch()

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  useEffect(() => {
    DeviceMotion.addListener((motion) => {
      console.log('change occured', motion.orientation)
      setscreenOrientation(motion.orientation)
    })

    return () => {
      DeviceMotion.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    if (dimenstions) {
      let arr = []
      for (
        let i = 0;
        i <= Math.floor(dimenstions.height / BLOCK_SIZE) * BLOCK_SIZE;
        i += BLOCK_SIZE
      ) {
        let row = []
        for (
          let j = 0;
          j <= Math.floor(dimenstions.width / BLOCK_SIZE) * BLOCK_SIZE;
          j += BLOCK_SIZE
        ) {
          row.push(false)
        }
        arr.push(row)
      }
      console.log(arr[0].length, arr.length)
      setblocks(arr)
    }
  }, [dimenstions])

  useEffect(() => {
    if (blocks.every((element) => element)) {
      settestState('complete', props.value)
      testResolveer.current?.resolve()
    }
  }, [blocks])

  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'displayEvaluation',
        testName: 'touch',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })

  const run = async () => {
    return new Promise((resolve, reject) => {
      // At some point the resolve function should be called by the test logic
      testResolveer.current = { resolve, reject }

      if (testState === 'initial') {
        settestState('inprogress')
      }
      setshowTest(true)
    })
  }

  const handleMove = (evt) => {
    const { pageX, pageY } = evt.nativeEvent

    let r = Math.floor(pageY / BLOCK_SIZE)
    let c = Math.floor(pageX / BLOCK_SIZE)

    if (0 <= r < blocks.length && 0 <= c < blocks[r].length) {
      let bc = [...blocks]
      bc[r][c] = true
      setblocks(bc)
    }
  }

  return (
    <>
      <Modal
        visible={showTest}
        animationType="slide"
        style={CStyle.fullModal}
        onRequestClose={() => setshowTest(false)}
      >
        {screenOrientation === 0 && (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: `100%`,
              height: `100%`,
              justifyContent: 'center',
            }}
          >
            {blocks.map((rowBlock, i) => {
              return (
                <View
                  key={`row-${i}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    // backgroundColor: 'yellow',
                  }}
                >
                  {rowBlock.map((block, j) => {
                    return (
                      <View
                        key={`item-${i + j}`}
                        style={{
                          minWidth: BLOCK_SIZE - 5,
                          maxWidth: BLOCK_SIZE - 5,
                          minHeight: BLOCK_SIZE - 5,
                          maxHeight: BLOCK_SIZE - 5,
                          marginLeft: 2.5,
                          marginRight: 2.5,
                          marginTop: 2.5,
                          marginBottom: 2.5,
                          backgroundColor: block ? 'green' : 'red',
                          borderRadius: 5,
                        }}
                      ></View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        )}
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
          }}
          onStartShouldSetResponder={(evt) => true}
          onResponderMove={handleMove}
          onLayout={(event) => {
            let { width, height } = event.nativeEvent.layout
            console.log(width, height)
            if (dimenstions == null) {
              setdimenstions({ width, height })
            } else if (
              dimenstions.width !== width ||
              dimenstions.height !== height
            ) {
              setdimenstions({ width, height })
            }
          }}
        >
          {screenOrientation !== 0 && (
            <Text>Screen orientation should be portrait for this test</Text>
          )}
        </View>
      </Modal>
      <Test
        testState={testState}
        testName="Touch Screen"
        iconName="phone-portrait-outline"
        run={run}
        message={errorMessage}
      />
    </>
  )
})

export const DimModal = ({ show, setTest, onClose, setErr = () => {} }) => {
  const [dimPermission, setdimPermission] = useState({
    status: 'undetermined',
    canAskAgain: true,
  })
  const [showActivity, setshowActivity] = useState(false)
  const [cameraReady, setcameraReady] = useState(false)

  const cameraRef = useRef(null)

  useEffect(() => {
    setshowActivity(false)
  }, [show])

  const compareFlashImages = async () => {
    if (!cameraReady) {
      alert('Wait for the camera to initalize and click the start button again')
      return
    }

    setshowActivity(true)

    const currntBrightness = await Brightness.getBrightnessAsync()
    await Brightness.setBrightnessAsync(0)
    const flashOff = await cameraRef.current.takePictureAsync()
    await Brightness.setBrightnessAsync(1)
    const flashOn = await cameraRef.current.takePictureAsync()
    await Brightness.setBrightnessAsync(0)
    const flashOff2 = await cameraRef.current.takePictureAsync()
    await Brightness.setBrightnessAsync(currntBrightness)

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

  // Handle permision
  const requestdimPermision = async () => {
    const { status, canAskAgain } = await Brightness.requestPermissionsAsync()
    setdimPermission({ status: status, canAskAgain: canAskAgain })
  }

  if (!show) {
    return <></>
  }
  if (dimPermission.status !== 'granted' && dimPermission.canAskAgain) {
    requestdimPermision()
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
  if (dimPermission.status !== 'granted' && !dimPermission.canAskAgain) {
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
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
          Screen Brightness Test
        </Text>
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
            type={CameraType.front}
            onCameraReady={() => setcameraReady(true)}
            ref={cameraRef}
          ></Camera>
        </View>
        <Text style={{ width: '90%', textAlign: 'center' }}>
          Press the start button and put the phone flat on a flat surface.
        </Text>
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={showActivity}
        />
        {!showActivity && <Button title="Start" onPress={compareFlashImages} />}
      </View>
    </FullModal>
  )
}

export const DimTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.dim.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'displayEvaluation',
        testName: 'dim',
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
      <DimModal
        title="Dim Test"
        show={showModal}
        instruction={
          'Press the start button and put the phone flat on a flat surface.'
        }
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
          setshowModal(false)
        }}
        setErr={seterrorMessage}
      />
      <Test
        testState={testState}
        testName="Dim Test"
        iconName="contrast-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const ProximityTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.displayEvaluation.proximity.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'displayEvaluation',
        testName: 'proximity',
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

  useEffect(() => {
    const proximitySensor = (data) => {
      if (data.proximity) {
        settestState('complete', props.value)
        testResolveer.current.resolve('success')
      }
    }
    Proximity.addListener(proximitySensor)

    return () => {
      Proximity.removeListener(proximitySensor)
    }
  }, [])

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setshowModal(true)
    })
  }

  return (
    <>
      <HalfModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
        }}
      >
        <View>
          <Text>Please bring your hand close to the phone</Text>

          <Image
            source={require('../../../assets/images/proximity.jpg')}
            style={{
              width: wp(50),
              height: wp(50),
              resizeMode: 'contain',
            }}
          />
        </View>
      </HalfModal>
      <Test
        testState={testState}
        testName="Proximity Test"
        iconName="hand-right-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const RotationTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const initalOrientation = useRef(null)
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.displayEvaluation.rotation.state,
  )
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'displayEvaluation',
        testName: 'rotation',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useEffect(() => {
    DeviceMotion.addListener((motion) => {
      if (initalOrientation.current === null) {
        initalOrientation.current = motion.orientation
      } else {
        if (motion.orientation != initalOrientation.current) {
          testResolveer.current.resolve('success')
          settestState('complete')
        }
      }
    })

    return () => {
      DeviceMotion.removeAllListeners()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setshowModal(true)
    })
  }

  return (
    <>
      <HalfModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
        }}
      >
        <View>
          <Text>Please rotate your phone</Text>

          <Image
            source={require('../../../assets/images/rotation.gif')}
            style={{
              width: wp(50),
              height: wp(50),
              resizeMode: 'contain',
            }}
          />
        </View>
      </HalfModal>
      <Test
        testState={testState}
        testName="Rotation Test"
        iconName="compass-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const DisplayTestGroup = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const [groupStatus, setgroupStatus] = useState(false)

  //  Child test refs
  const touchRef = useRef(null)
  const dimRef = useRef(null)
  const proximityRef = useRef(null)
  const rotationRef = useRef(null)

  // child test states
  const touch = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.touch,
  )
  const dim = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.dim,
  )
  const proximity = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.proximity,
  )
  const rotation = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.displayEvaluation.rotation,
  )

  // upraised value
  const appraisedValue = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.displayEvaluation.appraisedValue,
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
        touchStat: 5,
        dimStat: 3,
        pixelTest: 4,
        discolorTest: 3,
        whiteSpotTest: 4,
        proximityTest: 3,
        rotationTest: 2,
      },
    }
  }, [])

  // dispatcher
  const dispatcher = useDispatch()

  // update appraisal once all the tests are complete
  useEffect(() => {
    const states = [touch.state, dim.state]

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

    let value = touch.appraisedValue / testWeights.total()

    dispatcher(
      updateAppraisal({
        testGroup: 'displayEvaluation',
        status,
        appraisedValue: value,
      }),
    )

    return () => {}
  }, [touch, dim, rotation, proximity])

  const cameraTests = [
    <TouchTest ref={touchRef} value={testWeights.test.touchStat} />,
    <DimTest ref={dimRef} value={testWeights.test.dimStat} />,
    <RotationTest ref={rotationRef} value={testWeights.test.rotationTest} />,
    // <ProximityTest ref={proximityRef} value={testWeights.test.proximityTest} />,
  ]

  const displayRefs = [touchRef]

  const run = async () => {
    for (let i = 0; i < cameraRefs.length; i++) {
      await displayRefs[i].current?.run()
    }
  }

  return (
    <>
      <TestGroup
        label="Display Test"
        tests={cameraTests}
        groupStatus={groupStatus}
        score={appraisedValue}
      />
    </>
  )
})
