import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react'

import Voice from '@react-native-community/voice'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
  Modal,
  View,
  Pressable,
  Text,
  TextInput,
  Button,
  Vibration,
  ActivityIndicator,
} from 'react-native'

import { isHeadphonesConnected } from 'react-native-device-info'

import Tts from 'react-native-tts'
import { useDispatch, useSelector } from 'react-redux'

const randomWords = require('random-words')
import { compareStrs, getRandomInt } from '../../../utiles/funcUtils'
import { HalfModal } from '../../BasicComponents'
import { TestGroup, Test } from '../TestsTemplate'
import { CStyle } from '../../../utiles/Styles'
import { updateAppraisal, updateTest } from '../../../utiles/store/mobileSlice'

const audioSelector = (test) => (state) =>
  state.mobileSlice.mobileEvaluation.audioEvaluation[test].state

const AudioTestModal = ({
  show,
  onClose,
  instruction,
  volume,
  setState,
  headset = false,
}) => {
  const [userInput, setuserInput] = useState('')
  const [playing, setplaying] = useState(false)
  const [vericationCode, setvericationCode] = useState('')

  const playPauseSound = async () => {
    if (headset) {
      const headSetState = await isHeadphonesConnected()
      if (!headSetState) {
        alert('You have to connect a headset for this test')
        return
      }
    }
    if (playing) {
      setplaying(false)
      Tts.stop()
      return
    }

    let testWords = randomWords(2).join(' ')
    console.log(testWords)
    setvericationCode(testWords)
    Tts.speak(testWords, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: volume,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    })
  }
  const verifyCode = () => {
    if (
      userInput !== '' &&
      verficationCode !== '' &&
      compareStrs(verficationCode, userInput.toLowerCase()) <
        0.2 * vericationCode.length
    ) {
      testResolveer.current?.resolve('success')
      setState('complete')
    }
  }
  return (
    <HalfModal title="Audio Test" show={show} onClose={onClose}>
      <Text style={CStyle.modalText}>{instruction}</Text>
      <TextInput
        style={[CStyle.shadow, CStyle.textContainer, { textAlign: 'center' }]}
        placeholder="Code from sound"
        value={userInput}
        onChangeText={setuserInput}
      />
      <Button title="Submit" onPress={verifyCode} />
      <Text style={{ marginTop: 10, alignSelf: 'flex-start' }}>
        Sound controls
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pressable style={{ margin: 10 }} onPress={playPauseSound}>
          <Ionicons
            name={playing ? 'pause-outline' : 'play-outline'}
            size={20}
          />
        </Pressable>
      </View>
    </HalfModal>
  )
}

export const EarPieceTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const testResolveer = useRef(null)
  const testState = useSelector(audioSelector('earPiece'))

  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'audioEvaluation',
        testName: 'earPiece',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

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
      <AudioTestModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
          settestState('failed', -props.value)
          testResolveer.current.resolve('failed')
        }}
        instruction={`Write the lettters you hear from the sound!`}
        volume={0.5}
        setState={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
      ></AudioTestModal>
      <Test
        testState={testState}
        testName="Earpiece Test"
        iconName="ear-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const LoudSpeakerTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const testResolveer = useRef(null)
  const testState = useSelector(audioSelector('loudSpeaker'))
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'audioEvaluation',
        testName: 'loudSpeaker',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

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
      <AudioTestModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
          settestState('failed', -props.value)
          testResolveer.current.resolve('failed')
        }}
        instruction={`Write the lettters you hear from the sound!`}
        volume={1}
        setState={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
        headset={true}
      ></AudioTestModal>
      <Test
        testState={testState}
        testName="Loud Speaker Test"
        iconName="volume-high-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const HeadSetTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const testResolveer = useRef(null)
  const testState = useSelector(audioSelector('headSet'))
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'audioEvaluation',
        testName: 'headSet',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

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
      <AudioTestModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
          settestState('failed', -props.value)
          testResolveer.current.resolve('failed')
        }}
        instruction={`Write the lettters you hear from the sound!`}
        volume={1}
        setState={(state) => {
          if (state === 'complete') {
            testResolveer.current.resolve('success')
            settestState(state, props.value)
          } else {
            testResolveer.current.resolve('failed')
            settestState(state, -props.value)
          }
        }}
      ></AudioTestModal>
      <Test
        testState={testState}
        testName="HeadSet Test"
        iconName="headset-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const MicrophoneTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const [audioPermission, setaudioPermission] = useState({
    status: 'undetermined',
    canAskAgain: true,
  })
  const testResolveer = useRef(null)
  const testState = useSelector(audioSelector('headSet'))
  const dispatcher = useDispatch()

  const [recording, setrecording] = useState(false)
  const [sentence, setsentence] = useState('test word')
  const [recordedSentence, setrecordedSentence] = useState('')

  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'audioEvaluation',
        testName: 'microphone',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  // Handle permision
  const requestRecordPermission = async () => {
    const { status, canAskAgain } = await Audio.requestPermissionsAsync()
    setaudioPermission({ status: status, canAskAgain: canAskAgain })
  }
  useImperativeHandle(ref, () => ({
    run: run,
  }))

  useEffect(() => {
    if (showModal) {
      requestRecordPermission()

      Voice.onSpeechResults = (e) => {
        console.log('onSpeechResults', e)

        if (compareStrs(e.value[0], sentence) < 0.2 * sentence.length) {
          settestState('complete', props.value)
          testResolveer.current?.resolve('success')
          setrecordedSentence('')
          setshowModal(false)
        }
      }
      Voice.onSpeechStart = (e) => {
        console.log('started', e)
      }

      Voice.onSpeechEnd = (e) => {
        setrecording(false)
      }
      Voice.onSpeechPartialResults = (e) => {
        setrecordedSentence(e.value[0])
      }
    }
  }, [showModal])

  const run = async () => {
    return new Promise((resolve, reject) => {
      testResolveer.current = { resolve, reject }
      settestState('inprogress')
      setshowModal(true)
    })
  }

  const recordSound = async (e = null) => {
    if (recording) {
      // pause recording and set recording to false
      setrecording(false)
      Voice.stop()
      return
    }

    try {
      await Voice.start('en-US')
      setrecording(true)
    } catch (e) {
      alert('Error, please try again')
      console.error(e)
    }
  }

  return (
    <>
      <HalfModal
        show={showModal && audioPermission.status === 'granted'}
        onClose={() => {
          if (testState !== 'complete') {
            testResolver.current?.resolve('failed')
            seterrorMessage({
              title: 'Test Failed',
              error: 'Test closed by user',
            })
          }
          setshowModal(false)
        }}
      >
        <Text style={CStyle.modalText}>
          Press the record button and read the sentence below!
        </Text>
        <Text
          style={[
            CStyle.modalText,
            { fontSize: 32, backgroundColor: 'lightgray', margin: 10 },
          ]}
        >
          {sentence}
        </Text>
        <Text>Recorded sentence: {recordedSentence}</Text>

        <View style={{ flexDirection: 'row' }}>
          <Pressable style={{ margin: 10 }} onPress={recordSound}>
            <Ionicons
              name={recording ? 'pause-outline' : 'play-outline'}
              size={20}
            />
          </Pressable>
        </View>
      </HalfModal>
      <HalfModal
        show={
          showModal &&
          audioPermission.status !== 'granted' &&
          audioPermission.canAskAgain
        }
        onClose={() => {
          if (testState !== 'complete') {
            testResolver.current?.resolve('failed')
            seterrorMessage({
              title: 'Test Failed',
              error: 'Test closed by user',
            })
          }
          setshowModal(false)
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
            You need to enable Audio recording Permission to perform this test
          </Text>
        </View>
      </HalfModal>
      <HalfModal
        show={
          showModal &&
          audioPermission.status !== 'granted' &&
          !audioPermission.canAskAgain
        }
        onClose={() => {
          if (testState !== 'complete') {
            testResolver.current?.resolve('failed')
            seterrorMessage({
              title: 'Test Failed',
              error: 'Test closed by user',
            })
          }
          setshowModal(false)
        }}
      >
        <View style={{ height: '100%', justifyContent: 'center' }}>
          <Text>
            No access to audio recorder, you need to enable permission in
            settings.
          </Text>
          <Button
            title="Continue"
            onPress={() => {
              Linking.openSettings()
            }}
          />
        </View>
      </HalfModal>

      <Test
        testState={testState}
        testName="Microphone Test"
        iconName="mic-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const VibrationTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
  const [vibrationPattern, setvibrationPattern] = useState([])
  const [vibrationStart, setvibrationStart] = useState(0)
  const [vibrationPatternInput, setvibrationPatternInput] = useState([])

  const [showActivity, setshowActivity] = useState(false)

  const testResolveer = useRef(null)
  const testState = useSelector(audioSelector('vibration'))
  const dispatcher = useDispatch()
  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: 'audioEvaluation',
        testName: 'vibration',
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  useEffect(() => {
    if (vibrationPattern.length === 4) {
      Vibration.vibrate(vibrationPattern)
      setvibrationStart(new Date())
    }
  }, [vibrationPattern])

  useEffect(() => {
    setshowActivity(false)
  }, [showModal])

  useEffect(() => {
    if (testState) {
      setshowModal(false)
    }

    if (
      vibrationPattern.length > 0 &&
      vibrationPattern.length === vibrationPatternInput.length
    ) {
      console.log(vibrationPatternInput, vibrationPattern)
      // Verify
      for (let i = 1; i < vibrationPattern.length; i++) {
        console.log(vibrationPatternInput[i], vibrationPattern[i])
        if (Math.abs(vibrationPattern[i] - vibrationPatternInput[i]) > 300) {
          setshowModal(false)
          alert('Verification pattern is incorrect')
          sertvibrationPattern([])
          settestState('failed', -props.value)
          return
        }
      }

      settestState('complete', props.value)
      setvibrationModal(false)
    }
  }, [vibrationPatternInput, vibrationPattern])

  const generatevibrationPattern = () => {
    const ONE_SECOND_IN_MS = 1000
    const pattern = [
      0.2 * ONE_SECOND_IN_MS, // Initial silence
      getRandomInt(3, 7) * ONE_SECOND_IN_MS, // Vibration
      2 * ONE_SECOND_IN_MS, // Silence
      getRandomInt(3, 7) * ONE_SECOND_IN_MS, // Vibration
    ]

    setvibrationPattern(pattern)
  }

  const vibrationPressHandler = () => {
    setshowAcitvity(true)
    const old = vibrationStart
    const now = new Date()
    setvibrationStart(now)
    const diff = now.getTime() - old.getTime()
    setvibrationPatternInput(vibrationPatternInput.concat([diff]))
  }

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
          Vibration.cancel()
          if (testState !== 'complete') {
            testResolver.current?.resolve('failed')
            seterrorMessage({
              title: 'Test Failed',
              error: 'Test closed by user',
            })
          }
          setshowModal(false)
        }}
      >
        <Text style={CStyle.modalText}>
          Press inside the green box when the vibration starts and stop when it
          does. Don't stop until completed.
        </Text>

        <Button
          title="Start"
          style={{ marginTop: 20 }}
          onPress={() => {
            Vibration.cancel()
            generatevibrationPattern()
          }}
        />

        <Pressable
          onPressIn={() => {
            console.log('press In')
            vibrationPressHandler()
          }}
          onPressOut={() => {
            console.log('press Out')
            vibrationPressHandler()
          }}
        >
          <View
            style={{
              minWidth: 90,
              minHeight: 90,
              marginTop: 30,
              borderColor: 'green',
              borderWidth: 1,
            }}
          />
        </Pressable>
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={showActivity}
        />
      </HalfModal>
      <Test
        testState={testState}
        testName="Viberation Test"
        iconName="alarm-outline"
        message={errorMessage}
        run={run}
      />
    </>
  )
})

export const AudioTestGroup = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const [groupStatus, setgroupStatus] = useState(false)

  //  Child test refs
  const earpieceRef = useRef(null)
  const headSetRef = useRef(null)
  const loudSpeakerRef = useRef(null)
  const microphoneRef = useRef(null)
  const vibrationRef = useRef(null)

  const audioTestSelector = useCallback(
    (testName) => (state) =>
      state.mobileSlice.mobileEvaluation.audioEvaluation[testName],

    [],
  )

  // Child test states
  const earPiece = useSelector(audioTestSelector('earPiece'))
  const headSet = useSelector(audioTestSelector('headSet'))
  const loudSpeaker = useSelector(audioTestSelector('loudSpeaker'))
  const microphone = useSelector(audioTestSelector('microphone'))
  const vibration = useSelector(audioTestSelector('vibration'))

  const dispatcher = useDispatch()

  // upraised value
  const appraisedValue = useSelector(
    (state) =>
      state.mobileSlice.mobileEvaluation.audioEvaluation.appraisedValue,
  )

  // // update appraisal once all the tests are complete
  useEffect(() => {
    const states = [
      earPiece.state,
      headSet.state,
      loudSpeaker.state,
      microphone.state,
      vibration.state,
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
      (earPiece.appraisedValue +
        headSet.appraisedValue +
        loudSpeaker.appraisedValue +
        microphone.appraisedValue +
        vibration.appraisedValue) /
      testWeights.total()

    dispatcher(
      updateAppraisal({
        testGroup: 'audioEvaluation',
        status,
        appraisedValue: value,
      }),
    )

    return () => {}
  }, [earPiece, headSet, loudSpeaker, microphone, vibration])

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
        earpiece: 5,
        headset: 3,
        loudspeaker: 3,
        microphone: 5,
        vibration: 1,
      },
    }
  }, [])

  const audioTests = [
    <EarPieceTest ref={earpieceRef} value={testWeights.test.earpiece} />,
    <HeadSetTest ref={headSetRef} value={testWeights.test.headset} />,
    <LoudSpeakerTest
      ref={loudSpeakerRef}
      value={testWeights.test.loudspeaker}
    />,
    // <MicrophoneTest ref={microphoneRef} value={testWeights.test.microphone} />,
    // <VibrationTest ref={vibrationRef} value={testWeights.test.vibration} />,
  ]

  // const audioRefs = [
  //   // earpieceRef,
  //   // headSetRef,
  //   // loudSpeakerRef,
  //   // microphoneRef,
  //   // vibrationRef,
  // ]

  const run = async () => {
    // for (let i = 0; i < audioRefs.length; i++) {
    //   await audioRefs[i].current?.run()
    // }
  }

  return (
    <>
      <TestGroup
        label="Audio Test"
        tests={audioTests}
        groupStatus={groupStatus}
        score={0}
      />
    </>
  )
})
