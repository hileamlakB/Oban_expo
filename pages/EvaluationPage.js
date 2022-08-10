import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native'

import { CStyle, wp } from '../utiles/Styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import EvaluationImage from '../assets/images/phoneEval.svg'
import { CameraTestGroup } from '../components/TestGroups'

export const EvaluationPageGuide = ({ show }) => {
  return <Modal animationType="slide" transparent={true} visible={show}></Modal>
}

export const EvaluationPage = ({ navigation }) => {
  const [cameraTestStat, setcameraTestStat] = useState(true)
  const [usageExplanation, setusageExplanation] = useState(false)

  const autoEval = async () => {
    // a function that auto evals
  }

  return (
    <SafeAreaView
      style={{ flex: 1, maxWidth: 1000, alignSelf: 'center', width: '100%' }}
    >
      <EvaluationPageGuide show={usageExplanation} />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: 10,
            }}
          >
            <TouchableOpacity underlayColor="#2196F3" onPress={() => {}}>
              <Ionicons
                name="md-options-outline"
                size={30}
                color="white"
                style={{
                  backgroundColor: '#2196F3',
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>

            <Text style={[CStyle.titleText]}>Evaluate Phone</Text>
          </View>

          <TouchableOpacity underlayColor="#2196F3" onPress={() => {}}>
            <Ionicons
              name="help-circle-outline"
              size={25}
              color="#2196F3"
              style={{
                borderRadius: 10,
                padding: 10,
                marginRight: 10,
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* This image will break expo web version */}
        <EvaluationImage width={wp(100)} />
        <View style={{ alignSelf: 'center', marginBottom: 20 }}>
          <Button color="#FFC45A" onPress={autoEval} title="Auto Evaluate" />
        </View>

        {/* Camera test */}
        <CameraTestGroup />
      </ScrollView>
    </SafeAreaView>
  )
}

// each test is a component that inherits from the linked check
// Each of this components have a forward ref that allows the parent the
// parent component to run the test at will