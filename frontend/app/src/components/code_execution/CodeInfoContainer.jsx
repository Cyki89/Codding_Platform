import { useState, useEffect } from "react";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import CodeTestsInfo from "./CodeTestsInfo";
import CodeTestsResults from "./CodeTestsResults";
import LoadingAnimation from "../annimations/LoadingAnimation";
import AttemptList from "./SolutionList";

const CodeInfoContainer = ({ response, error, loading, description }) => {
  const [passed, setPassed] = useState(null);
  const [currTab, setCurrTab] = useState(() => "description");

  useEffect(() => {
    if (loading) {
      setPassed(null);
      setCurrTab("output");
    }
  }, [loading]);

  useEffect(() => {
    if (response) {
      setPassed(response.passed);
      setCurrTab("output");
    }
  }, [response]);

  return (
    <div
      className={`code-editor-tabs mx-2 ${
        passed === true ? "passed" : passed === false || error ? "failed" : ""
      }`}>
      <Tabs
        activeKey={currTab}
        className="mb-2 px-0"
        onClick={(e) => {
          setCurrTab(e.target.dataset["rrUiEventKey"]);
        }}>
        <Tab eventKey="description" title="Description" className="mx-3">
          {description}
        </Tab>
        <Tab eventKey="output" title="Output" className="mx-3">
          {loading && <LoadingAnimation />}
          {!loading && error && (
            <div className="response-fail response-info mt-5">{`Unexpected error: ${error}`}</div>
          )}
          {!loading && !error && response?.tests && (
            <div>
              <CodeTestsInfo response={response} />
              <CodeTestsResults response={response} />
            </div>
          )}
        </Tab>
        <Tab eventKey="pastSolutions" title="Past Solutions" className="mx-3">
          <AttemptList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CodeInfoContainer;
