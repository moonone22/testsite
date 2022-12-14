import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LogOut, LogOutAll, MemberMe, TimeStampData } from "../apis/api";
import { getCookie, setCookie } from "../apis/cookie";
import Cookies from 'universal-cookie';


const WarpperContainer = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width : 100vw;
  height : 100vh;
  background-color : rgba(0, 0, 0, 0.5);
  z-index: 100000;
`;

const Wrapper = styled.div`
  position : absolute;
  top: 50%;
  left: 50%;
  transform : translate(-50% , -50%);
  width: 500px;
  height: 740px;
  padding: 31px 24px 29px;
  object-fit: contain;
  border-radius: 12px;
  background-color: #202221;
  z-index : 2;
  @media (max-width: 720px) {
    width: calc((640 / 720) * 100vw);
    height: calc((1000 / 1280) * 100vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;
    padding: calc((40 / 720) * 100vw);
  }
`;

const TitleContainer = styled.div`
  height: 21px;
  margin: 0 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 13px;
    height: 12px;
    cursor: pointer;
  }
  @media (max-width: 720px) {
    height: calc((28 / 1280) * 100vh);
    img {
      width: calc((28 / 720) * 100vw);
      height: calc((28 / 1280) * 100vh);
    }
  }
`;

const Title = styled.span`
  height: 17px;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.45px;
  text-align: left;
  color: #fff;
  @media (max-width: 720px) {
    font-size: calc((30 / 720) * 100vw);
    display: flex;
    align-items: center;
  }
`;

const InputContainer = styled.div`
  width: 450px;
  object-fit: contain;
  margin-bottom: 12px;
  @media (max-width: 720px) {
    width: 100%;
  }
`;

const InputTitle = styled.span`
  opacity: 0.7;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.38px;
  text-align: left;
  color: rgba(255, 255, 255, 0.7);
  @media (max-width: 720px) {
    font-size: calc((24 / 720) * 100vw);
  }
`;

const InputWrapper = styled.div`
  width: 450px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #191a1a;
  display: flex;
  align-items: center;
  margin-top: 12px;
  border: ${(props) =>
    Number(props.inputFocus) === Number(props.number)
      ? "solid 1px #099f3c"
      : "none"};
  @media (max-width: 720px) {
    width: 100%;
    height: calc((80 / 1280) * 100vh);
    border: solid 2px #333;
    margin-left: 0;
  }
`;

const Input = styled.input`
  width: 80%;
  height: 80%;
  margin-left: 15px;
  background-color: #191a1a;
  border: none;
  caret-color: #fff;
  color: #fff;

  &:focus::placeholder {
    color: transparent;
  }
  &::placeholder {
    font-family: "Noto Sans KR", sans-serif;
    opacity: 0.4;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 3.93;
    letter-spacing: -0.35px;
    text-align: left;
    color: rgba(255, 255, 255, 0.4);
  }
  cursor: pointer;
  @media (max-width: 720px) {
    width: 100%;
    font-size: calc((24 / 720) * 100vw);
    &::placeholder {
      font-size: calc((24 / 720) * 100vw);
    }
  }
`;

const Rectangle = styled.button`
  width: 450px;
  height: 50px;
  margin: 25px 2px 15px 0;
  padding: 17px 165px 17px 164px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #19793a;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 10px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.4px;
  text-align: left;
  color: #fff;
  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    transform: scale(0.95);
    transition: all 0.1s ease-in-out;
  }
  @media (max-width: 720px) {
    width: 100%;
    padding: calc((27 / 1280) * 100vh) 0;
    height: calc((80 / 1280) * 100vh);
    font-size: calc((28 / 720) * 100vw);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;


const RectangleDisabled = styled.button`
  width: 450px;
  height: 50px;
  margin: 25px 2px 15px 0;
  padding: 17px 165px 17px 164px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #19793a;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 10px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.4px;
  text-align: left;
  color: #fff;
  @media (max-width: 720px) {
    width: 100%;
    padding: calc((27 / 1280) * 100vh) 0;
    height: calc((80 / 1280) * 100vh);
    font-size: calc((28 / 720) * 100vw);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;



const Text = styled.p`
  opacity: 0.5;
  font-family: "Noto Sans KR", sans-serif;
  width : 50%;
  float : left;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.14;
  letter-spacing: -0.35px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
  @media (max-width: 720px) {
    font-size: calc((28 / 720) * 100vw);
  }
`;


//????????? ????????? ??????
const nickName = (memberNick) => {
  //  8 ~ 10??? ??????, ?????? ??????
  // var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/
  let regExpNick =/^[???-???|???-???|a-z|A-Z|0-9|]+$/;
  // ????????? ?????? ?????? true ??????
  return regExpNick.test(memberNick)
}

  //???????????? ????????? ?????? ?????????
const checkPassword = (changeNewPassword) => {
  // let regExp = /\d/
  let regExp =  /^[0-9]*$/;
  // ????????? ?????? ?????? true ??????
  return regExp.test(changeNewPassword)
}

//???????????? ????????? ?????? ?????????
const checkPasswordNumber = (changeNewPassword) => {
  var eng = /^[a-zA-Z]*$/; 
  // ????????? ?????? ?????? true ??????
  return eng.test(changeNewPassword)
}

const ChangeUserInfo = ({setLogin , changeUserToggleModal , setChangeUserToggleModal , setWithdrawal , changeUserToggleData, setChangeUserToggleData}) => {

  const [inputFocus, setInputFocus] = useState(false);
  const [changeUserToggle, setChangeUserToggle] = useState(false)
  // ?????? ?????????
  const [userData, setUserData] = useState()

  // ?????? ?????????
  const [changeNick , setChangeNick] = useState("")
  const [changeOldPassword, setChangeOldPassword] = useState("")
  const [changeNewPassword, setChangeNewPassword] = useState("")
  const [changeNewPasswordConfirm, setChangeNewPasswordConfirm] = useState("")

  // ?????? ??????
  const userChangeButton = async() => {
      if (changeNick === "" ){
        alert("???????????? ??????????????????")
      }else if(!(changeNick.length >= 2 && changeNick.length <= 12)){
        alert("????????? 2?????? ?????? 12?????? ???????????? ?????????.")
      }else if(nickName(changeNick) === false){
        alert("???????????? ??????/??????/????????? ?????? ????????????")
      }else if(!(changeNewPassword === changeNewPasswordConfirm)){
        alert("??????????????? ???????????? ??????????????? ???????????? ????????????")
      }else if (changeOldPassword === "" ){
        alert("?????? ??????????????? ??????????????????")
      }else if(changeNewPassword !== "" ? (!(changeNewPassword.length >= 6 && changeNewPassword.length <= 20) || !(changeNewPasswordConfirm.length >= 6 && changeNewPasswordConfirm.length <= 20)) :  !(changeOldPassword.length >= 6 && changeOldPassword.length <= 20)){
        alert("??????????????? 6?????? ?????? 20?????? ???????????? ?????????")
      }else if(changeNewPassword !== "" && checkPassword(changeNewPassword)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else if(changeNewPassword !== "" &&checkPasswordNumber(changeNewPassword)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else if(checkPassword(changeOldPassword)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else if(checkPasswordNumber(changeOldPassword)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else if(changeNewPasswordConfirm !== "" && checkPassword(changeNewPasswordConfirm)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else if(changeNewPasswordConfirm !== "" && checkPasswordNumber(changeNewPasswordConfirm)){
        alert("??????????????? ?????? 1??? ????????? ????????? ??????????????? ?????????")
      }else {
        changeUserData()
    }
  }
  // ?????? ???????????????
  const [ timeStamp, setTimeStamp] = useState("")

  useEffect(()=>{
    TimeStampData(setTimeStamp)
  },[])
  // ????????????????????? newdate??? ??????
  const dateTime = timeStamp !== "" && Math.floor(new Date().getTime() / 1000)  - timeStamp
  // ????????? ?????? 6?????? ??????
  const timePlus = dateTime + 21600;

  let expires = new Date();
  expires.setSeconds(expires.getSeconds() + timePlus);

  const cookies = new Cookies();

  const changeUserData = async() => {
      setChangeUserToggle(true)
      await axios.post(process.env.REACT_APP_DB_HOST +  '/api/member/edit', {
        nick: changeNick,
        old_password : changeOldPassword,
        new_password : changeNewPassword
      },{
        headers : {
          Authorization : getCookie('cityauth')
        }
      }).then(res => {
        if(res.data.status_code === 400){
          console.log("ssres" , res)
          alert(res.data.msg)
        }
        const token = res.data.data.Authorization 
        const tokenReplace = token && token?.replace("Bearer ", "")
        if((token ===null || token === "") && res.data.status_code === 200 ){
          alert(res.data.data.msg)
          // ???????????? ????????????
          setLogin(true);
          cookies.remove("cityauth")
          setChangeUserToggleModal(false)
          LogOut()
        }else if(!(token ===null || token === "") && res.data.status_code === 200 ){
          alert(res.data.data.msg)
          setCookie('cityauth' , tokenReplace  , {
            path:"/",
            expires,
            // secure:true,
            // sameSite:'none',
          })
          MemberMe()
          setChangeUserToggleData(true)
          setChangeUserToggleModal(false)
        }
    }).catch(function (error) {
      console.log(error)
        // alert(error)
    });
    setChangeUserToggle(false)
  }

  useEffect(()=>{
    MemberMe(setUserData)
  },[])
  console.log(userData)

  const modalClose = () => {
    setChangeUserToggleModal(false)
  }

  useEffect(() => {
    setChangeUserToggleModal(true);
  }, []);

  
  const removeAll = () => {
    LogOutAll()
    cookies.remove("cityauth")
  }

  const [test, setTest] = useState()

  useEffect(()=>{
    if(test === "SECTION"){
      setChangeUserToggleModal(false)
    }
  },[test])

  useEffect(()=>{
    if(userData?.data.nick !== ""){
      setChangeNick(userData?.data.nick)
    }
  },[userData])
  console.log(changeNick)

  return (
    <WarpperContainer onClick={(e) => setTest(e.target.tagName)}>
      <Wrapper>
        <TitleContainer>
          <Title>???????????? ??????</Title>
          <img
            src="/images/common/Close.png"
            alt=""
            onClick={() => modalClose()}
          ></img>
        </TitleContainer>
        <InputContainer>
          <InputTitle>?????????(????????????)</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={1}>
            <Input
              placeholder={userData?.data.member_id}
              onFocus={() => setInputFocus(1)}
              onBlur={() => setInputFocus(0)}
              disabled={1}
            ></Input>
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <InputTitle>????????? ??????(????????????)</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={2}>
            <Input
              placeholder={userData?.data.email}
              onFocus={() => setInputFocus(2)}
              onBlur={() => setInputFocus(0)}
              disabled={1}
            ></Input>
          </InputWrapper>
        </InputContainer>
        <InputContainer>
          <InputTitle>?????????</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={3}>
            <Input
              defaultValue={userData?.data.nick}
              onFocus={() => setInputFocus(3)}
              onBlur={() => setInputFocus(0)}
              onChange={(e) => setChangeNick(e.target.value)}
            ></Input>
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <InputTitle>??? ????????????</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={4}>
            <Input
              placeholder="??? ???????????? ??????"
              type="password"
              onFocus={() => setInputFocus(4)}
              onBlur={() => setInputFocus(0)}
              onChange={(e)=> setChangeNewPassword(e.target.value)}
            ></Input>
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <InputTitle>??? ???????????? ?????????</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={5}>
            <Input
              placeholder="??? ???????????? ?????????"
              type="password"
              onFocus={() => setInputFocus(5)}
              onBlur={() => setInputFocus(0)}
              onChange={(e)=> setChangeNewPasswordConfirm(e.target.value)}
            ></Input>
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <InputTitle>?????? ????????????</InputTitle>
          <InputWrapper inputFocus={inputFocus} number={6}>
            <Input
              placeholder="?????? ???????????? ??????"
              type="password"
              onFocus={() => setInputFocus(6)}
              onBlur={() => setInputFocus(0)}
              onChange={(e)=> setChangeOldPassword(e.target.value)}
            ></Input>
          </InputWrapper>
        </InputContainer>
         {
            changeUserToggle === false && changeUserToggleData === false ?
            <Rectangle onClick={(()=> userChangeButton())}>???????????? ??????</Rectangle>
            :
            (
              changeUserToggle === true && changeUserToggleData === false ?
              <RectangleDisabled disabled>???????????? ?????????</RectangleDisabled>
              :
              changeUserToggle === false && changeUserToggleData === true &&
              <RectangleDisabled disabled>???????????? ?????? ??????</RectangleDisabled>
            )
          }
        <Text
          style={{ cursor: "pointer" }}
          onClick={()=>{
            setWithdrawal(true);
            setChangeUserToggleModal(false)
          }}
        >
          ??????????????? ?????? ?????????
        </Text>
        <Text
          style={{ cursor: "pointer" }}
          onClick={()=> removeAll()}
        >
          ?????? ???????????? ????????????
        </Text>
      </Wrapper>
    </WarpperContainer>
  );
};

export default ChangeUserInfo;
