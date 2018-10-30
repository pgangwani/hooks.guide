import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useLayoutEffect,
  Suspense
} from "react";
import { Flex } from "reflexbox";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { createCache, createResource } from "react-cache";

import { execute } from "./executor";
import { fetchDoc } from "./fetcher";
import { parse } from "./md-parser";
import Editor from "./editor";
import ErrorBoundry from "./error-boundry";

window.React = React;
const cache = createCache();
const docsResource = createResource(fetchDoc);

const Name = styled.div`
  font-size: 25px;
  font-weight: 700;
`;

const Reference = styled.a`
  font-size: 15px;
`;

const SubTitle = styled.div`
  font-size: 20px;
  margin-top: 25px;
  margin-bottom: 10px;
`;

export default function Preview(props) {
  const doc = docsResource.read(cache, props.item.path);
  const { name, reference, hook = null, usage } = parse(doc);
  console.log(name);

  const [nameValue] = useState(name);
  const [hookValue, setHook] = useState(hook);
  const [usageValue, setUsage] = useState(usage);

  useEffect(() => {
    const codeToExecute = `${hookValue ? hookValue : ""}${usageValue}`;

    execute(codeToExecute, {
      useState,
      ReactDOM,
      useCallback,
      useEffect,
      useReducer,
      useRef,
      useLayoutEffect
    });
  });

  return (
    <Flex column pr={4} pl={4} pt={1} auto>
      <Name>{nameValue}</Name>
      <Reference href={reference}>{reference}</Reference>
      {hookValue && (
        <React.Fragment>
          <SubTitle>Hook implementation</SubTitle>
          <Editor code={hookValue} onChange={setHook} />
        </React.Fragment>
      )}
      <SubTitle>Usage</SubTitle>
      <Editor code={usageValue} onChange={setUsage} />
      <SubTitle>Live preview</SubTitle>

      <div id="preview-root" />
    </Flex>
  );
}