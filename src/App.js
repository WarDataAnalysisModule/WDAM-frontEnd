import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";
import styled from "styled-components";
import MainPage from './component/page/MainPage';
import SignUpPage from './component/page/SignUpPage';
import FileUpload from "./component/page/FileUpload";
import MyPage from "./component/page/MyPage";
import Analysis from "./component/page/Analysis";

const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-left: 20px;
    color: #6a772b;
`;

function App(props) {
    return (
        <BrowserRouter>
            {/* <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MainTitleText>WDAM</MainTitleText>
            </Link> */}
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="signup" element={<SignUpPage />} /> 
                <Route path="fileupload" element={<FileUpload />} />
                <Route path="MyPage" element={<MyPage />} />
                <Route path="analysis" element={<Analysis />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;