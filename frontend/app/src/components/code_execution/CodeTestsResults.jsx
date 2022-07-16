import testPassSvg from "./../../assets/test-pass.svg";
import testFailSvg from "./../../assets/test-fail.svg";

const CodeTestsResults = ({ response }) => {
  return (
    <div className="code-editor-response-tests">
      {" "}
      Tests Result:
      {response.tests.map((test, idx) => (
        <div
          key={idx}
          className={test.status === 1 ? "test-pass" : "test-fail"}>
          <img
            src={test.status === 1 ? testPassSvg : testFailSvg}
            width="15"
            height="15"
            className="d-inline-block align-bottom mb-1 mx-1"
            alt=""
          />
          {test.msg}
        </div>
      ))}
      {response.error && (
        <div className="code-editor-response-error">{response.error}</div>
      )}
      {response.passed && (
        <div className="response-pass response-info">
          You code pass all tests !!!
        </div>
      )}
    </div>
  );
};

export default CodeTestsResults;
