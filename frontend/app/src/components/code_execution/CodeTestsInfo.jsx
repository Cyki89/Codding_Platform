const CodeTestsInfo = ({ response }) => {
  return (
    <div className="code-editor-response-stats pb-2 mb-2">
      <div className="mr-2">Time: {response.execution_time}ms</div>
      <div className="response-pass mx-2">
        {response.tests_passed > 0 && (
          <span>Passed: {response.tests_passed}</span>
        )}
      </div>
      <div className="response-fail mx-2">
        {response.tests_failed > 0 && (
          <span>Failed: {response.tests_failed}</span>
        )}
      </div>
      <div className="response-fail mx-2">
        {response.error && <span>Exited Code: 1</span>}
      </div>
    </div>
  );
};

export default CodeTestsInfo;
