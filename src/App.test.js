import React from 'react';
import { createRoot } from "react-dom/client";
import { act } from 'react-dom/test-utils';

import App from './App';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Render the main app', () =>{
    let domContainer = null
    let root = null
    beforeEach(() => {

        // setup a DOM element as a render target
        domContainer = document.createElement("div");
        document.body.appendChild(domContainer);
      });

    afterEach(() => {
        // cleanup on exiting
        act(() => root.unmount());
        domContainer.remove();
        domContainer = null;
        root = null
    });

    it('renders without crashing', () => {
        act(() => {
            // Create a root.
            root = createRoot(domContainer);
            root.render(<App />);
        });
    });

})