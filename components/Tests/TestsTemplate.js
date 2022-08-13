import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { CStyle } from '../../utiles/Styles'
import { ErrorIndicator, CheckBox } from '../BasicComponents'
import Ionicons from '@expo/vector-icons/Ionicons'
import { statusColorMap } from '../../utiles/Styles'

export const Test = ({ testState, iconName, testName, run, message }) => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* THis line makes this component a bit impure */}
        <View style={CStyle.verticalLine} />
        <TouchableOpacity
          style={{
            backgroundColor: statusColorMap[testState],
            borderRadius: 50,
            minWidth: 50,
            minHeight: 50,
            padding: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={run}
        >
          <Ionicons
            name={iconName}
            size={30}
            color="white"
            style={{
              backgroundColor: '#2196F3',
              padding: 10,
              borderRadius: 300,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>{testName}</Text>
        {testState === 'complete' && (
          <Ionicons name="checkmark" size={24} color="turquoise" />
        )}
        <ActivityIndicator
          size="small"
          color="#00ff00"
          animating={testState === 'inprogress'}
          style={{
            display: testState === 'inprogress' ? 'flex' : 'none',
            marginLeft: 10,
          }}
        />
        <ErrorIndicator error={testState === 'failed'} message={message} />
      </View>
    </View>
  )
}

export const TestGroup = ({ label, tests, groupStatus, score = 0 }) => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginBottom: 50,
      }}
    >
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <CheckBox
          state={groupStatus}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{label}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          {' '}
          ({Math.round(score * 100) / 100})
        </Text>
      </View>

      <View style={CStyle.verticalLine} />
      <View style={CStyle.horizontalLine} />
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 0.3,
        }}
      >
        {tests.map((test, index) => (
          <View
            key={`${label}-${index}`}
            style={{
              marginTop: 5,
              minWidth: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {test}
          </View>
        ))}
      </View>
    </View>
  )
}
