// sample test
export const TemplateTest = forwardRef((props, ref) => {
  const testResolveer = useRef(null)
  const testState = useSelector(
    (state) => state.mobileSlice.mobileEvaluation.testGroup.testName,
  )
  const [errorMessage, seterrorMessage] = useState({
    title: 'ERROR',
    error: 'RUN TEST AGAIN TO GET LATEST ERROR',
  })
  const dispatcher = useDispatch()

  useImperativeHandle(ref, () => ({
    run: run,
  }))

  const settestState = useCallback((state, appraisedValue = 0) => {
    dispatcher(
      updateTest({
        testGroup: testGroup,
        testName: testName,
        state: state,
        appraisedValue: appraisedValue,
      }),
    )
  })

  const run = async () => {
    return new Promise((resolve, reject) => {
      // At some point the resolve function should be called by the test logic
      testResolveer.current = { resolve, reject }

      // test logic goes here
      settestState('complete')
      resolve('success')
    })
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
