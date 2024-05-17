import React, {useEffect, useRef, useState} from 'react';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import data from '../../data.json';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png'
import Log from '../ui/Log';
import TextBox from '../ui/TextBox';

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
`

const ButtonContainer2 = styled.div`
  position: absolute;
  left: 240px; // 사이드바의 너비에 맞춰서 조정
`

const Container = styled.div`
    display: flex;
    margin-left: 220px;
    margin-top: 20px;
    position: absolute;
    //position: relative;
    
    padding-left: 20px;
    width: calc(100% - 240px);
`

const PropContainer = styled.div`
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    gap: 10px; // 버튼 사이의 간격
    margin-top: 20px; // 버튼 상단 여백
    margin-left: 220px;
    padding-left: 20px;
`

const Feature = [
    "부대 이동 속도 / 위치 변화",
    "인원/장비 수량 변화",
    "개체 탐지",
    "부대의 전투력",
    "부대의 행동",
    "부대의 피해 상황",
    "부대 정보",
    "부대 상태 및 지원"
]

const ExplainFeature = [
    "- 부대 이동 속도 / 위치 변화 : 출발지, 목적지 위치까지의 거리와 걸린 시간을 이용하여 속도를 계산한다.",
    "- 인원 / 장비 수량 변화 : 사격 이벤트 발생 후 분석 대상의 인원 / 장비 수량을 비율로 비교한다.",
    "- 개체 탐지 : 분석 대상이 감지한 적이 감지된 시점, 거리, 피해량 등을 분석한다.",
    "- 부대의 전투력 : 분석 대상의 피해상태, 화력을 분석한다.",
    "- 부대의 행동 : 분석 대상이 행하고 있는 동작을 출력한다.",
    "- 부대의 피해 상황 : 분석 대상의 인원, 장비 수량 변화와 피해 상태, 화력을 분석한다.",
    "- 부대 정보 : 모든 부대의 이름, 상태, 구성인원, 장비, 무기를 이름별로 출력한다.",
    "- 부대 상태 및 지원 : 피해 상태가 Moderate Damaged인 모든 부대의 시뮬레이션 시간, 부대 이름, 화력을 분석한다."
]

const TestObject = [ // api로 받아오는 걸로 바꿀 예정
    "A-1-1중대",
    "A-1-2중대",
    "A-2-1중대",
    "A-2-2중대",
    "B-1-1중대",
]

const ObjectContainer = styled.div`
margin-left: 240px;
margin-bottom: 200px;
padding: 20px;
//margin: 20px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: #f8f8f8;
color: #333;
font-size: 16px;
//margin-left: 240px;
//margin-top: 20px;
width: calc(50% - 320px);
`

const Container3 = styled.div`
    margin-left: 240px;
    margin-top: -150px;
    margin-bottom: 100px;
`

function Analysis(props) {
    let Allunit = false; // 모든 부대를 대상으로 하는지 안하는지 확인
    // useState를 통해서 다른 요소가 바뀌면 재렌더링될때마다 false로 값이 바뀜
    const location = useLocation();
    const simulationTimeArray = location.state.uploadedData;
    const navigate = useNavigate();
    const [logTime, setLogTime] = useState([]); // 추후에 이 변수를 api로 계속 업데이트
    const [analysisResult, setAnalysisResult] = useState([]);
    const [unitList, setUnitList] = useState([]);
    
    const [showSelected, setShowSelected] = useState(true);
    const selectedTitle = showSelected ? "▼ 분석 특성은 무엇입니까? 아래 메뉴에서 선택해주세요." : "▶ 분석 특성은 무엇입니까? 아래 메뉴에서 선택해주세요.";
    const [showExplain, setShowExplain] = useState(false);
    const explainTitle = showExplain ? "▼ 설명" : "▶ 설명";

    const [chooseExplain, setChooseExplain] = useState(-1);
    const [selectedLog, setSelectedLog] = useState(-1);
    const [selectedFeature, setSelectedFeature] = useState(-1);
    const [selectedArmyUnit, setSelectedArmyUnit] = useState(-1);

    let currentTime = new Date(); // using test 나중에 api 되면 변경 예정
    const [simulTime, setSimulTime] = useState(''); // using test 나중에 api 되면 변경 예정


    const handleSelectedClick = () => {
        setShowSelected(!showSelected);
    }

    const renderContent = () => {
        return (
            <Button title="파일 업로드로" onClick={()=>navigate('/fileupload')} />
        );
    }

    const renderObject = () => {
        if (selectedFeature === 6 || selectedFeature === 7) {
            Allunit = true;
            return <p style={{fontWeight: "bold"}}>모든 부대를 대상으로 하는 특성입니다.</p>
        }
        return unitList.map((obj, index) => ( // 추후에 api로 해당 TestObject를 받아옴
            <Button type="armyunit" isSelected={selectedArmyUnit === index} title={unitList.unitName[index]} 
            key={index} onClick={()=>{setSelectedArmyUnit(index)}}/>
        ))
    }

    const renderResult = () => {
        return analysisResult.map((result, index) => (
            <div>
                <p>로그 ID : {result.logIdx}</p>
                <p>분석 특성 : {result.analysisFeature}</p>
                <p>분석 결과 : {result.result}</p>
                <p>로그 생성 시간 : {result.logCreated}</p>
                <p>생성 시간 : {result.createdAt}</p>
            </div>
        ))
    }

    useEffect(() => {
        if (!localStorage.getItem('userId')) navigate('/');
        if (selectedFeature === 6 || selectedFeature === 7) {
            
        }
    }, [navigate, selectedFeature])

    useEffect(() => {
        if (location.state && location.state.uploadedData) {
            // simulationTimeArray의 첫 번째 값을 simulTime 상태로 설정
            setLogTime(simulationTimeArray);
        }
    }, [location.state]);
    

    const getUnitList = async () => { // api 200
        try {
            const response = await fetch(`http://localhost:8080/log/${logTime[selectedLog]}`, {
                method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                setUnitList(data.data.unitList);
            }
            else {
                console.error('에러');
            }
        }
        catch {
            console.error('에러');
        }
    }


    const LogList = () => {
        return logTime.map((log, index) => (
            <Button type="log" isSelected={selectedLog === index} title={log} key={index} onClick={()=>
            {setSelectedLog(index)
            setSimulTime(log)
            getUnitList()}} />
        ));
    }
    const ExplainList = () => {
        return Feature.map((feat, index) => (
            <Button type="file" isSelected={selectedFeature === index} title={Feature[index]} key={index}
            onClick={()=>{setChooseExplain(index)
            setSelectedFeature(index)}} />
        ));
    }

    const submitAnalysis = async() => {
        try {
            if (selectedLog === -1 || selectedFeature === -1 || selectedArmyUnit === -1) {
                alert("시뮬레이션 날짜, 분석 특성, 분석 대상을 확인해주세요.")
                return;
            }
            const response = await fetch('http://localhost:8080/api/analyze', { // api 300
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    characteristics: Feature[selectedFeature],
                    unit: TestObject[selectedArmyUnit],
                    logCreated: logTime[selectedLog]
                })
            });

            const data = await response.json();

            if (response.ok) {
                const response2 = await fetch('http://localhost:8080/api/analyze/result', { // api 301
                method: 'GET',
                headers: {
                    'Accept' : 'application/json', 
                }
                });

                if (response2.ok) {
                    const analysisData = await response2.json().data;
                    setAnalysisResult(analysisData);
                }
                else {
                    console.error('분석 결과 가져오기 실패');
                }
            }
            else {
                console.error('분석 업로드 실패:', data);
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
        }
    }


    return (
    <div>
        <div style={{position: "fixed", width: "200px", height: "100%", 
        backgroundColor: "#F0F0F0", color: "black",
        fontSize: "17px", overflowY: "auto"}}><div style={{padding: "15px", textAlign: "center", fontWeight: "Bold", 
        marginBottom: "20px"}}>분석 로그</div><Log />{LogList()}</div>
        <ButtonContainer>
            <ButtonContainer2>{renderContent()}</ButtonContainer2>
            <Button type="tag" title="로그아웃" onClick={()=> {
                localStorage.setItem('userId', '');
                navigate('/');
            }}/>
            <p style={{fontSize: "15px", color: '#808080', marginLeft: '-12px', marginRight: '-12px'}}>|</p>
            <Button type="tag" title={"마이페이지"} onClick={()=> {
                navigate('/mypage');
            }}/>
            <Button title="test" type="tag" onClick={()=> {
                setLogTime(logTime => [...logTime, 
                    `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`]) // using test
            }}/>
        </ButtonContainer>
        <Container>
            <Button type="square" title={`파일 업로드 시간 : ${simulTime}`} />
            {/* api로 시간 가져와야함 */}
        </Container>
        <div style={{overflowY: "auto"}}>
        
        <p style={{marginLeft: '240px', marginTop: '120px', cursor: 'pointer'}} onClick={handleSelectedClick}>{selectedTitle}</p>
        {showSelected && (
            <>
                <PropContainer>
                    {ExplainList()}
                </PropContainer>
                <TextBox
                title={explainTitle}
                showExplain={showExplain}
                setShowExplain={setShowExplain}
                text={ExplainFeature}
                />
                <p style={{marginLeft: '240px', marginTop: '120px'}}>분석대상을 선택해주세요.</p>
                <ObjectContainer>
                    {renderObject()}
                </ObjectContainer>
                <Container3><Button title={"분석하기"} onClick={submitAnalysis}></Button></Container3>
            </>
        )}
        
        <p style={{marginLeft: '240px'}}>{`${logTime[selectedLog]}
         ${Feature[selectedFeature]} ${Allunit ? 'All' : TestObject[selectedArmyUnit]}`}</p>
        {/* 테스트용 문구 (api 연결 시 지워야함) */}
        
        <p style={{marginLeft: '240px', marginTop: '0px'}}>분석 결과</p>
        {/*밑의 TextBox에 모듈의 분석 결과를 출력해줌. 그리고 그에 맞는 분석 특성과 대상을 같이 보여줘야함. */}
        {/* <TextBox
        title={Feature[selectedFeature]}
        showExplain={showExplain}
        setShowExplain={setShowExplain}
        text={chooseExplain >= 0 ? ExplainFeature[chooseExplain] : ""}
        /> */}
        {renderResult()}
        
        </div>
    </div>
    );
}

export default Analysis;