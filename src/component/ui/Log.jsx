import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledLog = styled.div`
    font-size: 13px;
    text-align: left;
    margin-bottom: 15px;
    margin-left: 10px;
    width: 200px;

`



function Log(props) {
    const navigate = useNavigate();

    return (
        <StyledLog>
            시뮬레이션 시간
            {/* {LogList()} */}
        </StyledLog>
    );
}

export default Log;