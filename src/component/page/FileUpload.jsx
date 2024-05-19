import React, {useEffect, useRef, useState} from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import data from '../../data.json';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png';
import Loading from '../content/Loading';
import { event } from 'jquery';

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //background-color: #f7f7f7;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
    
    //box-shadow: 0 4px 8px rgba(0,0,0,0.1); // 그림자 추가
    padding: 24px;
    border-radius: 8px; // 테두리 둥글게
    //background-color: #fff; // 배경색 변경
    margin-bottom: 24px; // 마진 변경
`;

const Container2 = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex; // Flex 컨테이너로 만듭니다
    justify-content: center; // 수평 중앙 정렬
    align-items: center; // 수직 중앙 정렬
    //padding: 24px;
    border-radius: 8px;
    margin-top: 40px;
`;

const StyledButtonContainer = styled.div`
  display: flex; // Flexbox 레이아웃 사용
  justify-content: center; // 자식 요소들을 수평 중앙으로 정렬
  gap: 16px; // 버튼 사이에 간격 추가
  margin-top: 20px; // 상단 여백 추가
  min-width: 120px;
  padding: 10px 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;

`

const FileButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px; // 버튼 사이의 간격
  margin-top: 20px; // 버튼 상단 여백
`;

function FileUpload(props) {
    const fileRef = useRef(null);
    const navigate = useNavigate();
    const handleButtonClick = () => {
        fileRef.current.click();
    };
    const [files,setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // 파일 분류하기
    const [unitInitFiles, setUnitInitFiles] = useState([]);
    const [eventFiles, setEventFiles] = useState([]);
    const [behaviorFiles, setBehaviorFiles] = useState([]);
    const [unitAttributeFiles, setUnitAttributeFiles] = useState([]);
    const [superiorAttributeFiles, setSuperiorAttributeFiles] = useState([]);

    const classifyFiles = () => {
        const tempUnitInit = [];
        const tempEvent = [];
        const tempBehavior = [];
        const tempUnitAttr = [];
        const tempSuperiorAttr = [];

        files.forEach(file => {
            if (file.name.includes('단위부대init')) {
                tempUnitInit.push(...unitInitFiles, file);
            } else if (file.name.includes('Event')) {
                tempEvent.push(...eventFiles, file);
            } else if (file.name.includes('Behavior')) {
                tempBehavior.push(...behaviorFiles, file);
            } else if (file.name.startsWith('단위부대Attributes')) {
                tempUnitAttr.push(...unitAttributeFiles, file);
            } else if (file.name.startsWith('상급부대Attributes')) {
                tempSuperiorAttr.push(...superiorAttributeFiles, file);
            }
        });
        setUnitInitFiles(tempUnitInit);
        setEventFiles(tempEvent);
        setBehaviorFiles(tempBehavior);
        setUnitAttributeFiles(tempUnitAttr);
        setSuperiorAttributeFiles(tempSuperiorAttr);
    };
    ////



    const renderFileButtons = () => {
        return files.map((file, index) => (
          <Button type="file" key={index} title={file.name} onClick={()=> handleFileButtonClick(index)} />
        ));
    };

    const handleFileButtonClick = (props) => {
        const newFiles = [...files];
        newFiles.splice(props, 1);
        setFiles(newFiles);
    }

    useEffect(() => {
        if (!localStorage.getItem('headerData')) navigate('/');
        if (files.length > 0) classifyFiles();
    }, [navigate, files])

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        console.log(selectedFiles);
        setFiles(Array.from(selectedFiles)); 
        // 비동기적으로 처리되기 때문에 
        // 바로 files로 console을 찍으면 제대로 값이 안나옴
        // 따라서 selectedFiles로 확인하는 것, 값은 결국 같은 값임
        for (let i = 0; i < selectedFiles.length; i++) {
            console.log(`파일 이름: ${selectedFiles[i].name}`);
            console.log(`파일 타입: ${selectedFiles[i].type}`);
            console.log(`파일 크기: ${selectedFiles[i].size}`);
        }
    }
    

    // 데이터베이스로 파일 전송해주는 기능
    const submitFile = async() => {
        setLoading(true);
        try {
            
            const formData = new FormData();

            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
            console.log(headerData);
            // // Append all files to formData with respective keys
            // //console.log(unitAttributeFiles);
            unitInitFiles.forEach(file => formData.append('init', file));
            eventFiles.forEach(file => formData.append('event', file));
            behaviorFiles.forEach(file => formData.append('behavior', file));
            unitAttributeFiles.forEach(file => formData.append('unit', file));
            superiorAttributeFiles.forEach(file => formData.append('upper', file));
            formData.append('accessToken', accessToken);
            formData.append('refreshToken', refreshToken);

            for (let [key, value] of formData) {
                console.log(key, value);
              }
            // Append the current timestamp
            
            // Single fetch request
            const response = await fetch('http://localhost:8080/files', {
                method: 'POST',
                headers: {
                    //'Content-type' : 'application/json',
                    'Authorization' : headerData 
                },
                // body: JSON.stringify({
                //     accessToken: accessToken,
                //     refreshToken: refreshToken,
                //     init: unitInitFiles,
                //     event: eventFiles,
                //     behavior: behaviorFiles,
                //     unit: unitAttributeFiles,
                //     upper: superiorAttributeFiles
                // })
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                
                try {
                    console.log('파일 업로드 성공:', data);
                    navigate('/analysis', { state: {uploadedData: data}});
                    //navigate('/analysis');
                }
                catch (error) {
                    console.error('JSON 파싱 에러:', error);
                    console.log('서버 응답 : ', data);
                    alert('파일 업로드에 문제가 발생');
                }
                
            } else {
                console.error('파일 업로드 실패:', data); // data.json?
            }
            setLoading(false);
        }
        catch (error) {
            console.error('서버 에러:', error);
            setLoading(false);
        }
    }

    const logout = async() => {
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

            const response = await fetch('http://localhost:8080/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            });
            console.log(response);
            const responseData = await response.json();
            
            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") {
                localStorage.setItem('headerData', '');
                localStorage.setItem('accessToken', '');
                localStorage.setItem('refreshToken', '');
                alert("로그아웃 되었습니다.");
                navigate('/');
            } else {
                // 로그아웃 실패
                alert("로그아웃 실패");
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("로그아웃 실패");
        }
    }

    return (
        <div>
            {loading ? <Loading></Loading> : null}
            <ButtonContainer>
                <Button type="tag" title="로그아웃" onClick={logout}/>
                <p style={{fontSize: "15px", color: '#808080', marginLeft: '-12px', marginRight: '-12px'}}>|</p>
                <Button type="tag" title={"마이페이지"} onClick={()=> {
                    navigate('/mypage');
                }}/>
            </ButtonContainer>
        <Wrapper>
            <Link to="/">
                <Container2>
                    <img src={icon} alt="img" style={{maxWidth: '300px', height: 'auto', pointerEvents: 'all'}}/>
                </Container2>
            </Link>
            <br></br>
            <Container>
                <div>
                    <input type="file" ref={fileRef} onChange={handleFileChange}
                    style={{display: 'none'}} multiple accept='.csv'/>
                </div>
                <p style={{fontSize: '30px', display: 'flex', textAlign: 'center', marginLeft: '123px', fontWeight: 'bold'}}>데이터베이스에 파일을 등록하세요.</p>
                {files.length !== 0 && <p style={{fontSize: '30px', display: 'flex', textAlign: 'center', marginLeft: '80px', fontWeight: 'bold', marginTop: '-10px'}}>'분석하기'를 눌러 성공적으로 등록하세요.</p>}
                <StyledButtonContainer>
                    <Button title="파일 선택" onClick={handleButtonClick}/>
                </StyledButtonContainer>
                <FileButtonContainer>
                    {renderFileButtons()}
                </FileButtonContainer>
                <StyledButtonContainer>
                    <Button title="분석하기 →" onClick={()=>submitFile()}/> 
                    {/* /* onClick={submitFile} */}
                </StyledButtonContainer>
                
            </Container>
        </Wrapper>
        </div>
    );
}

export default FileUpload;