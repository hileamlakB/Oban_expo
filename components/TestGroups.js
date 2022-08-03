import React, { useState, useEffect } from 'react'
import { FrontCameraTest, BackCameraTest, VideoTest, FlashTest } from './Tests'
import { TestGroup } from './TestsTemplate'

export const CameraTestGroup = () => {
  const [groupStatus, setgroupStatus] = useState(false)

  // Add refs and values here
  const cameraTests = [
    <FrontCameraTest />,
    <BackCameraTest />,
    <VideoTest />,
    <FlashTest />,
  ]

  const run = async () => {
    // Test logic goes here
    return true
  }

  return (
    <TestGroup
      label="Camera Test"
      tests={cameraTests}
      groupStatus={groupStatus}
    />
  )
}
