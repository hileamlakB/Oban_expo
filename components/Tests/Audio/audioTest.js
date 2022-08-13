import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
// /* eslint-disable no-catch-shadow */
// /* eslint-disable no-shadow */
// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */

// import Voice from '@react-native-community/voice'
// import { EvaluationPage } from './evaluationPage'
// import { CStyle } from '../utiles/customStyles'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {
  Modal,
  View,
  Pressable,
  Text,
  TextInput,
  Button,
  Vibration,
} from 'react-native'
// import {
//   check,
//   PERMISSIONS,
//   requestMultiple,
//   RESULTS,
// } from 'react-native-permissions'
// import { isHeadphonesConnected } from 'react-native-device-info'
// import {
//   updateAudioAppraisal,
//   updateEarPiece,
//   updateHeadSet,
//   updateLoudSpeaker,
//   updateMicrophone,
//   updateVibration,
// } from '../utiles/userContext'

// import Tts from 'react-native-tts'
// import { useDispatch, useSelector } from 'react-redux'

import * as randomWords from 'random-words'

const AudioTestModal = ({ show, onClose, instruction, onSubmit, volume }) => {
  const [userInput, setuserInput] = useState('')
  const [playing, setplaying] = useState(false)
  const [vericationCode, setvericationCode] = useState('')

  const playPauseSound = () => {
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
  const verifyCode = () => {}
  return (
    <HalfModal title="Audio Test" show={show} onClose={onClose}>
      <Text style={CStyle.modalText}>{instruction}</Text>
      <TextInput
        style={[CStyle.shadow, CStyle.textContainer, { textAlign: 'center' }]}
        placeholder="Code from sound"
        value={userInput}
        onChangeText={setuserInput}
      />
      <Button title="Submit" onPress={onSubmit} />
      <Text style={{ marginTop: 10, alignSelf: 'flex-start' }}>
        Sound controls
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable style={{ margin: 10 }} onPress={playSound}>
          <FontAwesome name={playing ? 'pause' : 'play'} size={20} />
        </Pressable>
      </View>
    </HalfModal>
  )
}

export const EearPieceTest = forwardRef((props, ref) => {
  const [showModal, setshowModal] = useState(false)
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
      <AudioTestModal
        show={showModal}
        onClose={() => {
          setshowModal(false)
          settestState('faild', -props.value)
          testResolveer.current.resolve('failed')
        }}
        instruction={`Write the lettters you hear from the sound!`}
      ></AudioTestModal>
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

// export const AudioEvaluation = forwardRef(({ fullPage = true, audioref }) => {

//   useEffect(() => {
//     requestRecordPermission()

//     Voice.onSpeechResults = (e) => {
//       console.log('onSpeechResults', e)
//       // setrecordedSentence(e.value[0]);

//       if (compareStrs(e.value[0], sentence) < 0.2 * sentence.length) {
//         dispatcher(updateMicrophone([true, testWeights.test.microphone]))
//         setmicrophone(true)
//         setrecordedSentence('')
//         setrecordModal(false)
//       }
//     }
//     Voice.onSpeechStart = (e) => {
//       console.log('started', e)
//     }

//     Voice.onSpeechEnd = (e) => {
//       setrecording(false)
//     }
//     Voice.onSpeechPartialResults = (e) => {
//       setrecordedSentence(e.value[0])
//     }
//     setearpiece(audioEvaluation.earPiece[0])
//     setheadset(audioEvaluation.headSet[0])
//     setloudspeaker(audioEvaluation.loudSpeaker[0])
//     setmicrophone(audioEvaluation.microphone[0])
//     setvibration(audioEvaluation.vibration[0])
//   }, [])

//   useEffect(() => {
//     dispatcher(
//       updateAudioAppraisal(
//         (audioEvaluation.earPiece[1] +
//           audioEvaluation.headSet[1] +
//           audioEvaluation.loudSpeaker[1] +
//           audioEvaluation.microphone[1] +
//           audioEvaluation.vibration[1]) /
//           testWeights.total(),
//       ),
//     )

//     setfinalStat(earpiece && headset && loudspeaker && microphone && vibration)
//   }, [earpiece, headset, loudspeaker, microphone, audioEvaluation, vibration])

//   useEffect(() => {
//     if (
//       soundTestType === 'loudspeaker' ||
//       soundTestType === 'headset' ||
//       soundTestType === 'earpiece'
//     ) {
//       setsoundModal(true)
//     }
//   }, [soundTestType])

//   const requestRecordPermission = async () => {
//     requestMultiple([
//       PERMISSIONS.ANDROID.RECORD_AUDIO,
//       PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
//       PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
//     ]).then((status) => {
//       if (
//         status[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED &&
//         status[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
//           RESULTS.GRANTED &&
//         status[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED
//       ) {
//         setcanRecord(true)
//       }
//     })
//   }

//   const verifyCode = () => {
//     if (
//       soundVerfication !== '' &&
//       soundVerficationInput !== '' &&
//       compareStrs(soundVerfication, soundVerficationInput.toLowerCase()) <
//         0.2 * soundVerfication.length
//     ) {
//       closeSoundModal()
//       if (soundTestType === 'earpiece') {
//         dispatcher(updateEarPiece([true, testWeights.test.earpiece]))
//         setearpiece(true)
//       }
//       if (soundTestType === 'headset') {
//         dispatcher(updateHeadSet([true, testWeights.test.headset]))
//         setheadset(true)
//       }
//       if (soundTestType === 'loudspeaker') {
//         dispatcher(updateLoudSpeaker([true, testWeights.test.loudspeaker]))
//         setloudspeaker(true)
//       }
//     } else {
//       if (soundTestType === 'earpiece') {
//         // index 0 shouldn't be true if test fails
//         // This is true for other cases two
//         dispatcher(updateEarPiece([false, -testWeights.test.earpiece]))
//       }
//       if (soundTestType === 'headset') {
//         dispatcher(updateHeadSet([false, -testWeights.test.headset]))
//       }
//       if (soundTestType === 'loudspeaker') {
//         dispatcher(updateLoudSpeaker([false, -testWeights.test.loudspeaker]))
//       }

//       alert('Verification code is incorrect')
//     }

//     setsoundVerficationInput('')
//   }

//   const closeSoundModal = () => {
//     setsoundTestType('')
//     setsoundModal(false)
//     setplaying(false)
//   }

//   const playSound = () => {
//     if (playing) {
//       setplaying(false)
//       Tts.stop()
//       return
//     }

//     let testWords = randomWords(2).join(' ')
//     console.log(testWords)
//     setsoundVerfication(testWords)
//     isHeadphonesConnected().then((enabled) => {
//       let volume = 0
//       if (enabled) {
//         if (soundTestType === 'earpiece' || soundTestType === 'loudspeaker') {
//           alert('Please remove headphones')
//           return
//         } else if (soundTestType === 'headset') {
//           volume = 1
//         }
//       } else {
//         if (soundTestType === 'headphone') {
//           alert('Please connect headphones')
//           return
//         } else if (soundTestType === 'loudspeaker') {
//           volume = 1
//         } else if (soundTestType === 'earpiece') {
//           volume = 0.5
//         }
//       }
//       Tts.speak(testWords, {
//         androidParams: {
//           KEY_PARAM_PAN: -1,
//           KEY_PARAM_VOLUME: volume,
//           KEY_PARAM_STREAM: 'STREAM_MUSIC',
//         },
//       })
//     })
//   }

//   const recordSound = async (e = null) => {
//     if (recording) {
//       // pause recording and set recording to false
//       setrecording(false)
//       Voice.stop()
//       return
//     }

//     try {
//       await Voice.start('en-US')
//       setrecording(true)
//     } catch (e) {
//       alert('Error, please try again')
//       console.error(e)
//     }
//   }

//   const compareStrs = (s1, s2) => {
//     if (s1.length === 0 || s2.length === 0) {
//       return Math.max(s2.length, s1.length)
//     }

//     let opt = Math.max(s1.length, s2.length)

//     if (s1[0] === s2[0]) {
//       opt = compareStrs(s1.slice(1), s2.slice(1))
//     }

//     return Math.min(opt, 1 + compareStrs(s1.slice(1), s2))
//   }

//   const stoprecordSound = (e = null) => {
//     Voice.stop()

//     setrecording(false)
//     setrecordModal(false)
//     // setrecordTime(0);
//   }

//   function getRandomInt(min, max) {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min) + min)
//   }

//   useEffect(() => {
//     if (viberationPattern.length === 4) {
//       Vibration.vibrate(viberationPattern)
//       setvibrationStart(new Date())
//     }
//   }, [viberationPattern])
//   const generateViberationPattern = () => {
//     const ONE_SECOND_IN_MS = 1000

//     const pattern = [
//       0.2 * ONE_SECOND_IN_MS, // Initial silence
//       getRandomInt(3, 7) * ONE_SECOND_IN_MS, // Vibration
//       2 * ONE_SECOND_IN_MS, // Silence
//       getRandomInt(3, 7) * ONE_SECOND_IN_MS, // Vibration
//     ]

//     sertviberationPattern(pattern)
//   }

//   useEffect(() => {
//     if (audioEvaluation.vibration[0]) {
//       setviberationModal(false)
//     }
//     if (
//       viberationPattern.length > 0 &&
//       viberationPattern.length === vibrationPatternInput.length
//     ) {
//       console.log(vibrationPatternInput, viberationPattern)
//       // Verify
//       for (let i = 1; i < viberationPattern.length; i++) {
//         console.log(vibrationPatternInput[i], viberationPattern[i])
//         if (Math.abs(viberationPattern[i] - vibrationPatternInput[i]) > 300) {
//           setviberationModal(false)
//           alert('Verification pattern is incorrect')
//           sertviberationPattern([])
//           dispatcher(updateVibration([false, -testWeights.test.vibration]))

//           return
//         }
//       }
//       dispatcher(updateVibration([true, testWeights.test.vibration]))

//       setvibration(true)
//       setviberationModal(false)
//     }
//   }, [vibrationPatternInput, viberationPattern])

//   const viberationPressHandler = () => {
//     const old = vibrationStart
//     const now = new Date()
//     setvibrationStart(now)
//     const diff = now.getTime() - old.getTime()
//     setvibrationPatternInput(vibrationPatternInput.concat([diff]))
//   }

//   let audioCheckList = [
//     [
//       'Earpiece Test',
//       earpiece,
//       setearpiece,
//       () => {
//         setsoundTestType('earpiece')
//       },
//     ],
//     [
//       'Headset Test',
//       headset,
//       setheadset,
//       () => {
//         setsoundTestType('headset')
//       },
//     ],
//     [
//       'Loudspeaker Test',
//       loudspeaker,
//       setloudspeaker,
//       () => {
//         setsoundTestType('loudspeaker')
//       },
//     ],
//     [
//       'Microphone Test',
//       microphone,
//       setmicrophone,
//       () => {
//         if (!canRecord) {
//           alert(
//             'To test microphone, you need to allow the app to access your microphone',
//           )
//           requestRecordPermission()
//           return
//         }
//         // generate a new testing sentence
//         // setsentence(Math.random().toString(36).substring(2, 15));
//         setrecordModal(true)
//       },
//     ],
//     [
//       'Vibration Test',
//       vibration,
//       setvibration,
//       () => {
//         setvibrationPatternInput([])
//         setviberationModal(true)
//       },
//     ],
//   ]

//   return (
//     <>
//       <AudioTestModal
//         soundModal={soundModal}
//         setsoundModal={setsoundModal}
//         instruction={`For headset test connect a headset.Write the lettters you hear from the sound!`}
//         closeSoundModal={closeSoundModal}
//         userInput={soundVerficationInput}
//         setuserInput={setsoundVerficationInput}
//         submitAction={verifyCode}
//       >
//         <Pressable style={{ margin: 10 }} onPress={playSound}>
//           <FontAwesome name={playing ? 'pause' : 'play'} size={20} />
//         </Pressable>
//       </AudioTestModal>

//       <Modal animationType="slide" transparent={true} visible={recordModal}>
//         <View style={CStyle.centeredView}>
//           <View style={CStyle.modalView}>
//             <Pressable
//               style={[{ alignSelf: 'flex-end', margin: 15 }]}
//               onPress={stoprecordSound}
//             >
//               <FontAwesome name="close" size={20} />
//             </Pressable>
//             <Text style={CStyle.modalText}>
//               Press the record button and read the sentence below!
//             </Text>
//             <Text
//               style={[
//                 CStyle.modalText,
//                 { fontSize: 32, backgroundColor: 'lightgray', margin: 10 },
//               ]}
//             >
//               {sentence}
//             </Text>
//             <Text>Recorded sentence: {recordedSentence}</Text>
//             {/* <Text style={[CStyle.modalText, {alignSelf: 'flex-start'}]}>
//                 Sound controls
//               </Text> */}

//             <View style={{ flexDirection: 'row' }}>
//               <Pressable style={{ margin: 10 }} onPress={recordSound}>
//                 <FontAwesome name={recording ? 'pause' : 'play'} size={20} />
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal animationType="slide" transparent={true} visible={viberationModal}>
//         <View style={CStyle.centeredView}>
//           <View style={CStyle.modalView}>
//             <Pressable
//               style={[{ alignSelf: 'flex-end', margin: 15 }]}
//               onPress={() => {
//                 Vibration.cancel()
//                 setviberationModal(false)
//               }}
//             >
//               <FontAwesome name="close" size={20} />
//             </Pressable>
//             <Text style={CStyle.modalText}>
//               Press inside the green box when the viberation starts and stop
//               when it does. Don't stop until completed.
//             </Text>

//             <Button
//               title="Start"
//               style={{ marginTop: 20 }}
//               onPress={() => {
//                 Vibration.cancel()
//                 generateViberationPattern()
//               }}
//             />

//             <Pressable
//               onPressIn={() => {
//                 console.log('press In')
//                 viberationPressHandler()
//               }}
//               onPressOut={() => {
//                 console.log('press Out')
//                 viberationPressHandler()
//               }}
//             >
//               <View
//                 style={{
//                   minWidth: 90,
//                   minHeight: 90,
//                   marginTop: 30,
//                   borderColor: 'green',
//                   borderWidth: 1,
//                 }}
//               />
//             </Pressable>
//             <Text>Started</Text>
//           </View>
//         </View>
//       </Modal>

//       <EvaluationPage
//         evalObject="Audio"
//         evalDetial="Does the audio work"
//         testList={audioCheckList}
//         fullPage={fullPage}
//         finalStat={finalStat}
//       />
//     </>
//   )
// })

export const AudioTestGroup = () => {
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

  return <></>
}
