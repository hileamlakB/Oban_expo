import React, { useState, useEffect } from 'react'
import { View, Text, Modal, Pressable } from 'react-native'
import { CStyle } from '../utiles/Styles'
import Ionicons from '@expo/vector-icons/Ionicons'

export const CheckBox = ({ state, style }) => {
  return (
    <View style={[CStyle.checkboxBase, state && CStyle.checkboxChecked, style]}>
      {state && <Ionicons name="checkmark" size={24} color="white" />}
    </View>
  )
}

export const HalfModal = ({ show, setshow, title, children }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <View style={CStyle.centerModal}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <Text>{title}</Text>

            <Pressable
              style={[{ alignSelf: 'flex-end' }]}
              onPress={() => {
                setshow(false)
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#2196F3"
                style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  marginLeft: 10,
                }}
              />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  )
}

export const FullModal = ({ show, setshow, children }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={CStyle.fullModal}>
        <View style={CStyle.centerModal}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <Pressable
              style={[{ alignSelf: 'flex-end' }]}
              onPress={() => {
                setshow(false)
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#2196F3"
                style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  marginLeft: 10,
                }}
              />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  )
}

export const ErrorIndicator = ({ error, message }) => {
  const [showModal, setshowModal] = useState(false)

  return !error ? (
    <></>
  ) : (
    <View>
      <HalfModal show={showModal} setshow={setshowModal} title={message.title}>
        <Text>{message.error}</Text>
      </HalfModal>
      <Pressable onPress={() => setshowModal(true)}>
        <Ionicons
          name="help-circle-outline"
          size={25}
          color="#E04151"
          style={{
            borderRadius: 10,
            marginLeft: 10,
          }}
        />
      </Pressable>
    </View>
  )
}
