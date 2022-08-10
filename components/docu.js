
//  This is how each test in the evaluation page should be structured
export const TemplateTest = forwardRef((props, ref) => {

  // This descirbes the state of the test
  // This should be loaded from a redux store
  const [testState, settestState] = useState('initial')
  const [errorMessage, seterrorMessage] = useState({ title: '', error: '' })

  useImperativeHandle(ref, () => ({
    run: run,
    state: testState,
  }))

  useEffect(() => {
    props.updateState(testState)
  }, [testState])

  const run = async () => {
    // Test logic goes here
    return true
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
const parentComponent = () => {
  const test1Ref = userRef(null)
  const test2Ref = userRef(null)
  const test3Ref = userRef(null)

  const testRefs = [test1Ref, test2Ref, test3Ref]

  const autoRun = () => {
    testRefs.forEach(ref => {
        await ref?.current.run()
    });
  }

  return (
    <>
      <Button title="Auto run" onPress={autoRun} />
      <Test1 ref={test1Ref} />,
      <Test2 ref={test2Ref} />,
      <Test3 ref={test3Ref} />,
    </>
  )
}


