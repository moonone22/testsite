import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import Footer from "../../../components/common/Footer";
import GuaranteeCompanySlider from "../../../components/slider/GuaranteeCompanySlider";
import moment from "moment";
import "moment/locale/ko";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BasicData, ScoreCount } from "../../../components/apis/api";
import io from 'socket.io-client'
import LiveScoreMobileFootball from "./LiveScoreMobileFootball";
import { ScheduleDataSoccer} from "../../../components/apis/api"

const socket = io.connect("http://23.227.182.50:8500" , {
  transports : ['websocket']
})

const Wrapper = styled.div`
  width: 100%;
  background-color: #202221;
  padding-top: 16px;
  display: flex;
  justify-content: center;
`;

const ContentsContainer = styled.div`
  width: 100%;
  max-width: 1344px;
  @media (max-width: 1100px) {
    width: 100%;
  }
`;

const AssuranceContainer = styled.div`
  height: fit-content;
  padding: 0 45px 0 43px;
  margin-bottom: 40px;
  @media (max-width: 1100px) {
    padding: 0 30px 0 40px;
    margin-bottom: 40px;
  }
  @media (max-width: 720px) {
    padding: 0;
    margin-bottom: 10px;
    height: max-content;
    .title {
      padding: 0 calc((40 / 720) * 100vw);
    }
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div .icon {
    width: 20px;
    height: auto;
    @media (max-width: 720px) {
      width: calc((35 / 720) * 100vw);
    }
  }
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.5px;
  color: #fff;
  font-family: "Noto Sans KR", sans-serif;
  @media (max-width: 1100px) {
    font-size: 22px;
  }
  @media (max-width: 720px) {
    font-size: calc((28 / 720) * 100vw);
  }
`;

const MoreDetails = styled.span`
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.38px;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  @media (max-width: 1100px) {
    margin-right: 3px;
    font-size: 22px;
  }
  @media (max-width: 720px) {
    margin-right: calc((3 / 720) * 100vw);
    font-size: calc((22 / 720) * 100vw);
  }
`;

const MenuContainer = styled.div`
  height: 77px;
  padding: 0 42px;
  display: flex;
  @media (max-width: 720px) {
    padding: 0 calc((40 / 720) * 100vw);
    overflow: hidden;
    overflow-x: auto;
    height: 50px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MenuContents = styled.div`
  width: 68px;
  height: 77px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  @media (max-width: 720px) {
    padding-top : 10px;
    // width: calc((69 / 720) * 100vw);
    width: 27px;
    margin-right: calc((23 / 720) * 100vw);
  }
`;

const MenuRectangle = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.background};
  border-radius: 10px;
  position: relative;

  :hover {
    filter: brightness(1.2);
  }
  :active {
    transform: scale(0.95);
  }
  img {
    width: 48%;
  }

  @media (max-width: 720px) {
    width: calc((69 / 720) * 100vw);
    height: calc((69 / 1280) * 100vh);
  }
`;

const MenuText = styled.div`
  width: 100%;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.3px;
  text-align: left;
  color: ${(props) => props.color || "#fff"};
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  @media (max-width: 720px) {
    display: none;
  }
`;

const MenuCount = styled.div`
  width: 21px;
  height: 19px;
  object-fit: contain;
  border-radius: 6px;
  background-color: ${(props) =>
    props.background === "active" ? "#156330" : "#3c3e3d"};
  position: absolute;
  top: -15%;
  right: -15%;

  object-fit: contain;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.26px;
  text-align: left;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LiveComponent = styled.div`
  margin-top: 40px;
  padding: 0 50px;
  margin-bottom: 100px;
  @media (max-width: 720px) {
    display: none;
  }
`;

const TopBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 720px) {
    display: none;
  }
`;

const TabContainer = styled.div`
  height: 49px;
  display: flex;
`;

const Tab = styled.div`
  width: 130px;
  height: 49px;
  background-color: ${(props) => (props.active ? "#3b3c3b" : "#303231")};
  border-radius: 12px 12px 0 0;
  margin-right: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TabText = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.3px;
  color: ${(props) => (props.active ? "#099f3c" : "#999")};
`;

const OptionContainer = styled.div`
  width: ${(props) => (props.tab !== 2 && props.tab !== 3 ? "510px" : "680px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  > img {
    width: 35px;
    cursor: pointer;
    &:active {
      transform: scale(0.95);
    }
  }
`;

const SoundContainer = styled.div`
  width: 110px;
  height: 35px;
  display: flex;
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
`;

const Sound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 67px;
  height: 35px;
  background-color: #383a39;
  border-radius: 8px 0 0 8px;
  img {
    width: 16px;
    margin-right: 7px;
  }
  div {
    height: 100%;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 34px;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.28px;
    color: #fff;
  }
`;

const OnoFFButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 43px;
  height: 35px;
  background-color: ${(props) => (props.active ? "#515151" : "#303231")};
  border-radius: 0 8px 8px 0;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.28px;
  color: ${(props) => (props.active ? "#fff" : "#aaa")};
`;

const ScoreContainer = styled.div`
  width: 150px;
  height: 35px;
  display: flex;
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 107px;
  height: 35px;
  background-color: #383a39;
  border-radius: 8px 0 0 8px;
  img {
    width: 18px;
    margin-right: 7px;
  }
  div {
    height: 100%;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 34px;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.28px;
    color: #fff;
  }
`;

const SelectFullContainer = styled.div`
  width: 120px;
  height: max-content;
  object-fit: contain;
  border-radius: 6px;
  border: solid 1px #202221;
  background-color: #383a39;
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: 10000;
  @media (max-width: 720px) {
    right: 0;
    width: 45%;
  }
`;

const SelectFullTop = styled.div`
  background-color: #383a39;
  width: 120px;
  height: 37px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: solid 1px #202221;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
`;

const SelectContentsWrapper = styled.div`
  width: 120px;
  height: 70px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background-color: #383a39;
  border-radius: 0 0 8px 8px;
`;

const SelectText = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1px;
  letter-spacing: -0.35px;
  text-align: left;
  color: #fff;
`;

const SelectContents = styled.div`
  width: 90%;
  height: 26px;
  object-fit: contain;
  border-radius: 5px;
  padding-left: 10px;
  cursor: pointer;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 25px;
  letter-spacing: -0.35px;
  text-align: left;
  color: #fff;

  &:hover {
    background-color: #19793a;
  }
`;

const SelectDefault = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 120px;
  height: 37px;
  border-radius: 6px;
  border: solid 1px #202221;
  background-color: #383a39;
  position: relative;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.28px;
  color: #fff;
  cursor: pointer;
`;

const LiveContents = styled.div`
  margin-top: 1px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const LeagueContainer = styled.div`
  width: 100%;
  height: 50px;
  margin-top: 1px;
  background-color: #303231;
  display: flex;
  align-items: center;
  padding-left: 15px;
  img:first-child {
    width: 20px;
    height: 20px;
    margin-right: 9px;
  }
  img:last-of-type {
    width: 15px;
    height: 15px;
    margin-bottom: 4px;
    cursor: pointer;
  }
  & > div {
    height: 100%;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 15px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.3px;
    color: #ccc;
    line-height: 48px;
    margin-right: 4px;
    span {
      color: #fff;
    }
  }
  .dividendText {
    margin-right: 47px;
  }
`;

const TimeContents = styled.div`
  /* flex: 250px 0 0; */
  max-width: 280px;
  width: 250px;
  min-width: 130px;
  display: flex;
  align-items: center;
`;

const TeamContents = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const LeagueInfoCotainer = styled.div`
  width: 100%;
  height: ${(props) => props.height};
  margin-top: 1px;
  background-color: #3b3c3b;
  display: flex;
  :hover {
    background-color: #424342;
  }
  cursor: pointer;
  ${TeamContents} {
    justify-content: ${(props) => props.type === "soccer" && "center"};
  }
`;

const Time = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  margin-left: 15px;
  margin-right: 9px;
`;


const RankingText = styled.div`
  height: 100%;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.26px;
  color: #ff7200;
  line-height: 48px;
  margin: 0 3.5px;
  white-space: nowrap;
`;


const TeamName = styled.div`
  height: 100%;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 15px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.3px;
  color: #fff;
  display: flex;
  line-height: 48px;
  margin: 0 3.5px;
  white-space: nowrap;
`;

const OptionContents = styled.div`
  /* flex: 0 0 250px; */
  max-width: 250px;
  min-width: 250px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const IconContents = styled.div`
  min-width: 105px;
  width: max-content;
  height: 100%;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  img {
    height: 14px;
    margin-left: 8px;
    cursor: pointer;
  }
  img:last-child {
    margin-left: 16px;
    cursor: pointer;
  }
`;

const TimeButton = styled.div`
  width: 160px;
  height: 35px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #383a39;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: relative;

  & > img {
    height: 12px;
    width: 7px;
    cursor: pointer;
  }
  .date {
    width: 90px;
    display: flex;
    align-items: center;

    font-family: "Roboto", sans-serif;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #fff;
    img {
      height: 17px;
      width: 16px;
      margin-right: 8px;
    }
  }
`;

const CalendarContainer = styled.div`
  width: 323px;
  height: 340px;
  position: absolute;
  right: 80px;
  top: 40px;
  .react-calendar {
    width: 323px;
    border-radius: 6px;
    border: solid 1px #202221;
    background-color: #3b3c3b;
  }
  .react-calendar__tile--active {
    border-radius: 6px;
    background: #07ac40;
  }
  .react-calendar__tile {
    color: #fff;
    font-family: "Roboto", sans-serif;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.24px;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #aaaaaa;
  }
  .react-calendar__month-view__weekdays {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.28px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .react-calendar__navigation {
    margin: 0;
  }
  .react-calendar__navigation {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.32px;
    text-align: center;
    color: #fff;
    * {
      color: #fff;
    }
  }
  abbr[title] {
    text-decoration: none;
  }
  .react-calendar__tile--now {
    background-color: transparent;
    color: #00d349;
    &:focus,
    &:hover {
      color: #fff;
    }
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #07ac40;
    border-radius: 6px;
  }
  .react-calendar__navigation button:disabled {
    background-color: transparent;
  }
`;

const TimeRectangle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 67px;
  height: 26px;
  border-radius: 6px;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.28px;
  color: #fff;
  ${(props) =>
    props.type === "before" &&
    css`
      background-color: #8c8c8c;
    `}
  ${(props) =>
    props.type === "delay" &&
    css`
      background-color: #0c72b9;
    `}
  ${(props) =>
    props.type === "cancel" &&
    css`
      background-color: #a92731;
    `}
  ${(props) =>
    props.type === "live" &&
    css`
      background-color: #19793a;
    `} 
  ${(props) =>
    props.type === "end" &&
    css`
      background-color: #515151;
    `}
`;

const Team1 = styled.div`
  max-width: 344px;
  min-width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  img {
    width: 16px;
  }
  ${(props) =>
    props.goal &&
    css`
      border-radius: 8px;
      background-color: #ffe400;
      ${TeamName} {
        color: #e74c21;
        font-weight: bold;
      }
      ${RankingText} {
        color: #000000;
      }
    `}
`;

const Team2 = styled.div`
  max-width: 344px;
  min-width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  img {
    width: 16px;
  }
  ${(props) =>
    props.goal &&
    css`
      border-radius: 8px;
      background-color: #ffe400;
      ${TeamName} {
        color: #e74c21;
        font-weight: bold;
      }
      ${RankingText} {
        color: #000000;
      }
    `}
`;

const ScoreRectangle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 77px;
  height: 26px;
  border-radius: 6px;
  background: ${(props) => props.type === 8 ?
    "#515151" : ( props.type === 1 || props.type === 9 || props.type === 12 || props.type === 13   ?
        "no-repeat url('/images/common/vs.png') center" :
        "#19793a"
      )};
  margin: 0 10px;
  position: relative;

  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  color: #fff;
  & > .colorText {
    color: #ffcc00;
    width: 13px;
    height: 100%;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    justify-content: ${(props) =>
      props.direction === "left" ? "start" : "end"};
  }
  > .tie {
    color: #fff;
    width: 13px;
    height: 100%;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    justify-content: ${(props) =>
      props.direction === "left" ? "start" : "end"};
  }
  .ScorePopupContainer {
    display: none;
  }
  &:hover {
    .ScorePopupContainer {
      display: block;
      width: 300px;
      height: 425px;
      border-radius: 8px;
      border: solid 1px #0f0f0f;
      background-color: rgba(22, 23, 23, 0.8);
      position: absolute;
      z-index: 1000;
      top: 30px;
      left: 90px;
    }
  }
`;


const ScorePopupTitle = styled.div`
  width: 298px;
  height: 30px;
  background-color: rgba(22, 23, 23, 0.96);
  z-index: 100000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
  padding: 0 20px;
  span {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.26px;
    text-align: center;
    color: #fff;
  }
`;

const ScorePopupGoalContainer = styled.div`
  width: 298px;
  height: 98px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  img {
    width: 12px;
    height: 12px;
  }
`;

const ScorePopupGoal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40px;
  flex-direction:  ${(props) => props.position === 1 ? "row" : "row-reverse"};

`;

const ScorePopupStatsTitle = styled.div`
  width: 298px;
  height: 30px;
  background-color: rgba(22, 23, 23, 0.96);
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  span {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.26px;
    text-align: center;
    color: #fff;
  }
`;

const ScorePopupStatsContainer = styled.div`
  width: 298px;
  height: 264px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.26px;
  text-align: center;
  color: #fff;
`;

const ScorePopupStatsContents = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  div {
    display: flex;
    align-items: center;
  }
  .propgress {
    width: 90px;
    justify-content: space-between;
  }
  .text {
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ProgressBar = styled.div`
  width: 69px;
  height: 4px;
  border-radius: 2px;
  background-color: #000;
  display: flex;
  justify-content: ${(props) =>
    props.type === "left" ? "flex-end" : "flex-start"};
`;
   
const Progress = styled.div`
  width: ${(props) => props.width}%;
  height: 4px;
  object-fit: contain;
  border-radius: 2px;
  background-color: #07ac40;
`;


const IconRectangle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  background-color: #383a39;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  img {
    width: 16px;
  }
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
  .star {
    width: 19px;
  }
  &.star:hover {
    .tooltip {
      display: flex;
    }
  }
  .tooltip {
    display: none;
    width: 324px;
    height: 29px;
    border-radius: 4px;
    background-color: #161717;
    position: absolute;
    bottom: -35px;
    align-items: center;
    justify-content: center;

    font-size: 13.5px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.27px;
    text-align: center;
    color: #fff;
    & > div {
      width: 16px;
      height: 16px;
      object-fit: contain;
      border: solid 1px #000;
      background-color: #ccc;
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 15px;
      margin-right: 4px;
    }
  }
`;

const SearchContainer = styled.div`
  width: 360px;
  height: 45px;
  border-radius: 6px;
  box-shadow: 0px 10px 20px 0 rgba(0, 0, 0, 0.06);
  border: solid 1px #07ac40;
  background-color: #3b3c3b;
  position: absolute;
  top: 55px;
  left: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 0 15px;
  &::after {
    // Our small triangle to fill the space
    content: "";
    border-color: transparent transparent #3b3c3b;
    border-style: solid;
    border-width: 10px;
    width: 0;
    height: 0;
    position: absolute;
    top: -20px;
    left: 8px;
  }

  &::before {
    content: "";
    border-color: transparent transparent #07ac40;
    border-style: solid;
    border-width: 11px;
    width: 0;
    height: 0;
    position: absolute;
    top: -22px;
    left: 7px;
  }

  img {
    width: 18px;
    cursor: pointer;
  }
`;
const TeamRectangle = styled.div`
  width: 14px;
  height: 14px;
  object-fit: contain;
  border-radius: 3px;
  background-color: ${(props) => props.background || "#cba344"};

  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.22px;
  text-align: center;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3.5px;
`;

const SearchInput = styled.input`
  width: 90%;
  height: 90%;
  background-color: transparent;
  border: none;
  color: #fff;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.44px;

  &::placeholder {
    color: #999999;
  }
`;

const OptionInfo = styled.div`
  width: 105px;
  margin-right: 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  object-fit: contain;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.3px;
  text-align: center;
  color: #fff;
  img {
    width: 14px;
    margin-right: 6px;
  }
`;

const HT = styled.div``;

const Flag = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

// function getTimeStringSeconds(seconds){
// 	var hour, min, sec
// 	hour = parseInt(seconds/3600);
// 	min = parseInt((seconds%3600)/60);
// 	sec = seconds%60;

// 	if (hour.toString().length==1) hour = "0" + hour;
// 	if (min.toString().length==1) min = "0" + min;
// 	if (sec.toString().length==1) sec = "0" + sec;

// 	return hour + ":" + min + ":" + sec;
// }

// 타임스탬프 값 받아서 뿌려주기
function getTimeStringSeconds(seconds){
  // const dateFormat = moment(seconds * 1000).format('LT');
  // return JSON.stringify(sampleTimestamp).replace(/\"/g , "")
  var sampleTimestamp = new Date(seconds * 1000); 
  return JSON.stringify(sampleTimestamp).slice(12, 17)
}

const LiveScoreFootballPage = ({ setMobileMenu, mobileMenu , sportsType, setSportsType , pageBasicData , footballData, setFootballData , openSelect, setOpenSelect , tab, setTab , date, setDate , setFootballMatchIdData , footballMatchIdData , order}) => {
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [onOffButton, setOnOffButton] = useState({
    sound: false,
    score: false,
  });
  const [bookmark, setBookmark] = useState(false);

  const [scoreCount , setScoreCount] = useState()

  const plusDate = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
  };

  const minusDate = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };

  const searchRef = useRef();
  const searchIconRef = useRef();

  const handleClickOutside = (event) => {
    if (
      !searchRef?.current?.contains(event.target) &&
      !searchIconRef?.current?.contains(event.target)
    ) {
      setOpenSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  // 스코어 카운터 
  useEffect(()=>{
    ScoreCount(  `/api/main/count/live/5` , setScoreCount)
  },[])

  const [liveCount, setLiveCount] = useState()

  useEffect(()=>{
    // 스포츠 타입에 맞춰 스코어값을 다르게 적용
    if(sportsType === "soccer"){
      setLiveCount(scoreCount?.football)
    }else if(sportsType === "basketball"){
      setLiveCount(scoreCount?.basketball)
    }else if(sportsType === "baseball"){
      setLiveCount(scoreCount?.baseball)
    }else if(sportsType === "volleyball"){
      setLiveCount(scoreCount?.volleyball)
    }else if(sportsType === "tennis"){
      setLiveCount(scoreCount?.tennis)
    }
  },[scoreCount , sportsType])

  const pageBasicImgUrl = pageBasicData?.data?.homepage_info.img_cdn_domain 
  // // pageBasicData

  //   // 소켓
    const [sportsSocket, setSportsSocket] = useState("")

  //   // const sendMessage = () => {
  //   //   // 연결된 서버로 send_message라는 값에 해당 메세지를 보낸다.
  //   //   socket.emit("send_message" , {message})
  //   // }

    const locations = useLocation();
  //   let clientPrivate = io('http://localhost:3001/football_score')

    useEffect(()=>{
      if((locations.pathname === "/score/football") === true){ 
        socket.on("football_stats" , (data)=>{
          setSportsSocket(data)
        })
      }
    },[locations.pathname , socket])
  //   // pageBasicData
  // const [BasicDataImg , setBasicDataImg] = useState()

  // useEffect(()=>{
  //   BasicData( setBasicDataImg)
  // },[])
  // const [footballData, setFootballData] = useState()

  // const [order , setOrder] = useState("competition_oldest")

  // useEffect(()=>{
  //   if(openSelect.text === "리그순"){
  //     setOrder("competition_oldest")
  //   }else if(openSelect.text === "시간순"){
  //     setOrder("match_time_oldest")
  //   }
  // },[openSelect])

  
  // useEffect(()=>{
  //   ScheduleDataSoccer(setFootballData , tab === 1 ? "live" : (tab === 2 ? "end" : tab === 3 && "schedule")  , date.toISOString().substring(0,10).replace(/-/g,'') , order)
  // },[tab ,date ,openSelect])

//   const changeBookmark = (index) => {
//     let tmpData = tmpList;
//     tmpData[index] = { ...tmpData[index], bookmark: !tmpData[index].bookmark };
//     setTmpList([...tmpData]);
//   };
//   const isGameBookmark = (leagueData, gameData) => {
//     const findBookmark = (e) => {
//       return e.bookmark === false;
//     };
//     const result = leagueData?.game.every(findBookmark);

//     if (leagueData.bookmark && result) {
//       return true;
//     } else {
//       return gameData.bookmark;
//     }
//   };  

//   const changeGameBookmark = (listIdx, gameIdx) => {
//     let tmpData = tmpList;
//     tmpData[listIdx].game[gameIdx] = {
//       ...tmpData[listIdx].game[gameIdx],
//       bookmark: !tmpData[listIdx].game[gameIdx].bookmark,
//     };
//     setTmpList([...tmpData]);
//   };

  
// const isLeageBookmark = (data) => {
//   if (data.bookmark) {
//     return true;
//   }}


useEffect(()=>{
  const dateFormat = moment(date).format('L');
  // ScheduleDataSoccer(setFootballData , tab === 1 ? "live" : (tab === 2 ? "end" : tab === 3 && "schedule")  , date.toISOString().substring(0,10).replace(/-/g,'') , order)
  ScheduleDataSoccer(setFootballData , tab === 1 ? "live" : (tab === 2 ? "end" : tab === 3 && "schedule")  , JSON.stringify(dateFormat).replace(/\./g , "").replace(/\"/g , "") , order)
},[tab ,date ,openSelect])

  const dateFormat = moment(date).format('L');
// console.log(footballData && footballData?.data.reduce((acc, v) => {
//   return acc.find(x => x.competition_name === v.competition_name) ? acc : [...acc, v];
// }, []))
// console.log(test)
// console.log(footballData && footballData)
// const test = footballData?.data.reduce(function(acc, current) {
//   if (acc.findIndex(({ competition_name }) => competition_name === current.competition_name) === -1) {
//     acc.push(current);
//   }
//   return acc;
// }, []);

  // var grouped = footballData?.data.reduce(function (obj, product) {
  //   obj[product.data.competition_name] = obj[product.data.competition_name] || [];
  //   obj[product.data.competition_name].push(footballData);
  //   return obj;
  // }, {});

  console.log(sportsSocket)

  return (
    <Wrapper>
      <ContentsContainer>
        <AssuranceContainer>
          <TitleContainer className="title">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                className="icon"
                src="/images/main/Sidebar4.png"
                alt=""
              ></img>
              <Title style={{ marginLeft: "7px" }}>
                스포시티 보증업체 
              </Title>
            </div>
            <MoreDetails>더보기</MoreDetails>
          </TitleContainer>
          <GuaranteeCompanySlider />
        </AssuranceContainer>
        <MenuContainer>
          <MenuContents onClick={() =>{ 
              setSportsType("soccer")
              navigate("/score/football")
            }}>
            <MenuRectangle
              background={sportsType === "soccer" ? "#19793a" : "#3c3e3d"}
            >
              <img src="/images/live/Soccer.png" alt="" />
              <MenuCount background={sportsType === "soccer" && "active"}>
                {scoreCount?.football}
              </MenuCount>
            </MenuRectangle>
            <MenuText>축구</MenuText>
          </MenuContents>

          <MenuContents onClick={() =>{ 
              setSportsType("basketball")
              navigate("/score/basketball")
            }}>
            <MenuRectangle
              background={sportsType === "basketball" ? "#19793a" : "#3c3e3d"}
            >
              <img src="/images/live/Basketball.png" alt="" />
              <MenuCount background={sportsType === "basketball" && "active"}>
                {scoreCount?.basketball}
              </MenuCount>
            </MenuRectangle>
            <MenuText>농구</MenuText>
          </MenuContents>

          <MenuContents onClick={() =>{ 
              setSportsType("baseball")
              navigate("/score/baseball")
            }}>
            <MenuRectangle
              background={sportsType === "baseball" ? "#19793a" : "#3c3e3d"}
            >
              <img src="/images/live/Baseball.png" alt="" />
              <MenuCount background={sportsType === "baseball" && "active"}>
                {scoreCount?.baseball}
              </MenuCount>
            </MenuRectangle>
            <MenuText>야구</MenuText>
          </MenuContents>
          
          <MenuContents onClick={() =>{ 
              setSportsType("volleyball")
              navigate("/score/volleyball")
            }}>
            <MenuRectangle
              background={sportsType === "volleyball" ? "#19793a" : "#3c3e3d"}
            >
              <img src="/images/live/Volleyball.png" alt="" />
              <MenuCount background={sportsType === "volleyball" && "active"}>
                {scoreCount?.volleyball}
              </MenuCount>
            </MenuRectangle>

            <MenuText>배구</MenuText>
          </MenuContents>
          
          <MenuContents onClick={() =>{ 
              setSportsType("tennis")
              navigate("/score/tennis")
            }}>
            <MenuRectangle
              background={sportsType === "tennis" ? "#19793a" : "#3c3e3d"}
            >
              <img src="/images/live/Tennis.png" alt="" />
              <MenuCount background={sportsType === "tennis" && "active"}>
                {scoreCount?.tennis}
              </MenuCount>
            </MenuRectangle>

            <MenuText>테니스</MenuText>
          </MenuContents>
          <MenuContents>
            <MenuRectangle background="rgba(255, 255, 255, 0.1)">
              <img src="/images/live/UFC.png" alt="" />
            </MenuRectangle>

            <MenuText color="rgba(255, 255, 255, 0.4)">UFC</MenuText>
          </MenuContents>
          <MenuContents>
            <MenuRectangle background="rgba(255, 255, 255, 0.1)">
              <img src="/images/live/Football.png" alt="" />
            </MenuRectangle>
            <MenuText color="rgba(255, 255, 255, 0.4)">미식축구</MenuText>
          </MenuContents>
          <MenuContents>
            <MenuRectangle background="rgba(255, 255, 255, 0.1)">
              <img src="/images/live/Hockey.png" alt="" />
            </MenuRectangle>
            <MenuText color="rgba(255, 255, 255, 0.4)">하키</MenuText>
          </MenuContents>
          <MenuContents>
            <MenuRectangle background="rgba(255, 255, 255, 0.1)">
              <img src="/images/live/LOL.png" alt="" />
            </MenuRectangle>
            <MenuText color="rgba(255, 255, 255, 0.4)">
              리그 오브 레전드
            </MenuText>
          </MenuContents>
        </MenuContainer>
        <LiveComponent>
          <TopBarContainer>
            <TabContainer>
              <Tab active={tab === 1} onClick={() => setTab(1)}>
                <TabText active={tab === 1}>라이브</TabText>
                <TabText active={tab === 1}>({liveCount})</TabText>
              </Tab>
              <Tab active={tab === 2} onClick={() => setTab(2)}>
                <TabText>종료</TabText>
              </Tab>
              <Tab active={tab === 3} onClick={() => setTab(3)}>
                <TabText>예정</TabText>
              </Tab>
            </TabContainer>
            <OptionContainer tab={tab}>
              <IconRectangle
                onClick={() => setBookmark(!bookmark)}
                className="star"
              >
                {bookmark ? (
                  <img className="star" src="/images/live/Star-on.png" alt="" />
                ) : (
                  <img
                    className="star"
                    src="/images/live/Star-off.png"
                    alt=""
                  />
                )}
                <div className="tooltip">
                  <div>!</div>즐겨찾기한 리그/경기만 모아보고 알림을 받을수
                  있어요
                </div>
              </IconRectangle>

              {/* 검색 */}
              
              {openSearch && (
                <SearchContainer
                  ref={searchRef}
                  onClick={(e) => e.stopPropagation()}
                >
                  <SearchInput placeholder="리그명 또는 팀 이름을 검색하세요" />
                  <img src="/images/live/Search.png" alt="" />
                </SearchContainer>
              )}
              <IconRectangle
                ref={searchIconRef}
                onClick={() => setOpenSearch(!openSearch)}
              >
                <img src="/images/live/Search.png" alt="" />
              </IconRectangle>
              <img src="/images/live/Refresh.png" alt="" />
              <SoundContainer
                onClick={() =>
                  setOnOffButton({
                    ...onOffButton,
                    sound: !onOffButton.sound,
                  })
                }
              >
                <Sound>
                  <img src="/images/live/Sound.png" alt="" />
                  <div>소리</div>
                </Sound>
                <OnoFFButton active={onOffButton.sound}>
                  {onOffButton.sound ? "ON" : "OFF"}
                </OnoFFButton>
              </SoundContainer>
              <ScoreContainer
                onClick={() =>
                  setOnOffButton({
                    ...onOffButton,
                    score: !onOffButton.score,
                  })
                }
              >
                <Score>
                  <img src="/images/live/Notice.png" alt="" />
                  <div>스코어 알림</div>
                </Score>
                <OnoFFButton active={onOffButton.score}>
                  {onOffButton.score ? "ON" : "OFF"}
                </OnoFFButton>
              </ScoreContainer>

              <SelectDefault
                number={10}
                onClick={() => setOpenSelect({ ...openSelect, open: true })}
              >
                <div placeholder={openSelect.text} disabled={1} select={1}>
                  {openSelect?.text || ""}
                </div>
                <img
                  src="/images/chat/ArrowDown.png"
                  alt=""
                  style={{
                    width: "10px",
                    height: "5px",
                    // transform: `${
                    //   openSelect.open ? "rotate(180deg)" : "rotate(0deg)"
                    // }`,
                    // transition: "transform 0.2s linear",
                  }}
                ></img>
                {/* 시간순 / 리그순  */}
                {openSelect.open === true && (
                  <SelectFullContainer>
                    <SelectFullTop
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSelect({ ...openSelect, open: false });
                      }}
                    >
                      <SelectText>{openSelect.text}</SelectText>
                      <img
                        src="/images/chat/ArrowDown.png"
                        alt=""
                        style={{
                          width: "10px",
                          height: "5px",
                          cursor: "pointer",
                          transform: `${
                            openSelect.open ? "rotate(180deg)" : "rotate(0deg)"
                          }`,
                        }}
                      ></img>
                    </SelectFullTop>
                    <SelectContentsWrapper>
                      <SelectContents
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenSelect({ open: false, text: "시간순" });
                        }}
                      >
                        시간순
                      </SelectContents>
                      <SelectContents
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenSelect({ open: false, text: "리그순" });
                        }}
                      >
                        리그순
                      </SelectContents>
                    </SelectContentsWrapper>
                  </SelectFullContainer>
                )}
              </SelectDefault>

              {(tab === 2 || tab === 3) && (
                <TimeButton>
                  <img
                    src="/images/live/Arrow-left.png"
                    alt=""
                    onClick={minusDate}
                  />
                  <div
                    className="date"
                    onClick={() => setCalendar(!calendar)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/images/live/Calendar.png" alt="" />
                    <span>{moment(date).format("MM/DD dd")}</span>
                  </div>
                  <img
                    src="/images/live/Arrow-right.png"
                    alt=""
                    onClick={plusDate}
                  />
                  {calendar && (
                    <CalendarContainer>
                      <Calendar
                        onChange={(e) => {
                          setDate(e);
                          setCalendar(false);
                        }}
                        value={date}
                        formatDay={(locale, date) =>
                          date.toLocaleString("en", { day: "numeric" })
                        }
                        minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                        maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                        navigationLabel={null}
                      />
                    </CalendarContainer>
                  )}
                </TimeButton>
              )}
            </OptionContainer>
          </TopBarContainer>

     

          {/* 본문 */}
          <LiveContents>
            {footballData?.data?.map((data, index) => {
              return (
                  <>
                    <LeagueContainer>
                      <img src={pageBasicImgUrl+data?.country_logo} alt=""></img>
                      <div>
                        {data.category_name} : <span>{data.competition_name}</span> 리그
                      </div>
                      <img
                          className="star"
                          src="/images/live/Star-on.png"
                          alt=""
                        ></img>
                        {/* <img
                          className="star"
                          src="/images/live/Star-off.png"
                          alt=""
                          onClick={() => changeBookmark(index)}
                        ></img> */}
                    </LeagueContainer>
                    <LeagueInfoCotainer
                      type="soccer"
                      onClick={() =>{
                          navigate(`/live/watch/football/${data?.match_id && data?.match_id}`)
                          // setFootballMatchIdData(data?.match_id)
                        }
                      }
                    >
                      <TimeContents>
                        <Time>{(getTimeStringSeconds(data.match_time))}</Time>
                          {
                            data.status_id === 0 ?
                            ""
                            :
                            (
                              data.status_id === 1 ?
                              <TimeRectangle type="before">
                                경기전
                              </TimeRectangle>
                              :
                              (
                                data.status_id === 2 ?
                                <TimeRectangle type="live">
                                  전반
                                </TimeRectangle>
                                :
                                (
                                  data.status_id === 3 ?
                                  <TimeRectangle type="live">
                                    하프타임
                                  </TimeRectangle>
                                  :
                                  (
                                    data.status_id === 4?
                                    <TimeRectangle type="live">
                                      후반
                                    </TimeRectangle>
                                    :
                                    (
                                      data.status_id === 5?
                                      <TimeRectangle type="live">
                                        연장
                                      </TimeRectangle>
                                      :
                                      (
                                        data.status_id === 6?
                                        ""
                                        :
                                        (
                                          data.status_id === 7?
                                          <TimeRectangle type="live">
                                            승부차기
                                          </TimeRectangle>
                                          :
                                          (
                                            data.status_id === 8?
                                            <TimeRectangle type="end">
                                              경기종료
                                            </TimeRectangle>
                                            :
                                            (
                                              data.status_id === 9?
                                              <TimeRectangle type="delay">
                                                경기연기
                                              </TimeRectangle>
                                              :
                                              (
                                                data.status_id === 10 || data.status_id === 11?
                                                <TimeRectangle type="cancel">
                                                  경기중단
                                                </TimeRectangle>
                                                :
                                                (
                                                  data.status_id === 12?
                                                <TimeRectangle type="cancel">
                                                  경기 취소
                                                </TimeRectangle>
                                                  :
                                                  (
                                                    data.status_id === 13?
                                                    <TimeRectangle type="delay">
                                                      경기미정
                                                    </TimeRectangle>
                                                    :
                                                    ""
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          }
                      </TimeContents>
                      <TeamContents>
                        {/* <Team1 goal={element?.left?.goal}> */}
                        <Team1>
                          
                          {/* 순위 */}
                          {data.home_team_info.rankup !== "" ?
                            <RankingText>
                                ({data.home_team_info.rankup})
                            </RankingText>
                            :
                            ""
                          } 
                          {data.home_team_info.red_cards !== 0 &&
                            <TeamRectangle background="#ce2b37">
                              {data.home_team_info.red_cards}
                            </TeamRectangle>
                          }
                          {data.home_team_info.yellow_cards !== 0 &&
                            <TeamRectangle>
                              {data.home_team_info.yellow_cards}
                            </TeamRectangle>
                          }
                          <TeamName>
                            {data.home_team_info.team_name}
                          </TeamName>
                          <img
                            src={pageBasicImgUrl+data.home_team_info.team_logo}
                            alt=""
                          ></img>
                        </Team1>
                        <ScoreRectangle
                          // type={element?.score?.type}
                          type={data.status_id}
                          direction={"left"}>
                          {
                            data.status_id === 1 || data.status_id === 9 || data.status_id === 12 || data.status_id === 13 ?
                            ""
                            :
                            <>
                              <div className={data.home_team_info.score > data.away_team_info.score ? "colorText" : "tie"}>
                                {data.home_team_info.score}
                              </div>
                              : 
                              <div className={data.home_team_info.score < data.away_team_info.score ? "colorText" : "tie"}>
                                {data.away_team_info.score}
                              </div> 
                            </>
                          }
                          {/* 호버시 모달 */}
                          {/* 데이터 없으면 길이값으로 판단해 안나타나게 */}
                          {
                            data?.stats.length > 0 &&
                          <section className="ScorePopupContainer">
                          <ScorePopupTitle>
                            <span>{data.home_team_info.team_name}</span>
                            <span>{data.away_team_info.team_name}</span>
                          </ScorePopupTitle>
                          <ScorePopupGoalContainer>
                          {data?.incidents?.position  ?
                                <ScorePopupGoal position ={data?.incidents.position}>
                                  <img
                                    src="/images/live/Goal.png"
                                    alt=""
                                  ></img>
                                  <span>
                                    {data?.incidents.player_name}
                                  </span>
                                </ScorePopupGoal> 
                                :
                                ""
                          } 
                          </ScorePopupGoalContainer>
                          <ScorePopupStatsTitle>
                            <span>통계</span>
                          </ScorePopupStatsTitle>
                          <ScorePopupStatsContainer>
                            {/* 모달 정보 */}
                          {data?.stats?.map(data => 
                           {
                            return (
                                <>
                                  <ScorePopupStatsContents>
                                    <div className="propgress">
                                      <span>{data.home}</span>
                                      <ProgressBar type="left">
                                        <Progress width={Math.floor((data.home / (data.away + data.home)) * 100)}></Progress>
                                      </ProgressBar>
                                    </div>
                                    <div className="text">
                                      { 
                                      data.type === 1 ? "골" :
                                      (
                                        data.type === 2 ? "코너킥"
                                        :
                                        (
                                          data.type === 3 ? "옐로우카드"
                                          : 
                                          (
                                            data.type === 4 ? "레드카드"
                                            : 
                                            (
                                              data.type === 5 ? "파울" :
                                              (
                                                data.type === 6 ? "프리킥"
                                                :
                                                (
                                                  data.type === 7 ? "골킥"
                                                  :
                                                  (
                                                    data.type === 8 ? "패널티킥"
                                                    :
                                                    (
                                                      data.type === 9 ? "선수교체"
                                                      :
                                                      (
                                                        data.type === 10 ? "시작"
                                                        :
                                                        (
                                                          data.type === 11 ? "미드필더" 
                                                          :
                                                          (
                                                            data.type === 12 ? "종료" 
                                                            :
                                                            (
                                                              data.type === 13 ? "하프타임 점수" 
                                                              : 
                                                              (
                                                                data.type === 15 ? "레드카드 변경" 
                                                                : 
                                                                (
                                                                  data.type === 16 ? "패널티킥 실패" 
                                                                  :
                                                                  (
                                                                    data.type === 17 ? "자책골" 
                                                                    : 
                                                                    (
                                                                      data.type === 19 ? "부상시간" 
                                                                      : 
                                                                      (
                                                                        data.type === 21 ? "유효슈팅" 
                                                                        : 
                                                                        (
                                                                          data.type === 22 ? "슈팅" 
                                                                          : 
                                                                          (
                                                                            data.type === 23 ? "공격"
                                                                            : 
                                                                            (
                                                                              data.type === 24 ? "위험공격"
                                                                              :
                                                                              (
                                                                                data.type === 25 ? "점유율"
                                                                                :
                                                                                (
                                                                                  data.type === 26 ? "추가시간 초과"
                                                                                  :
                                                                                  (
                                                                                    data.type === 27 ? "패널티킥 종료"
                                                                                    :
                                                                                    (
                                                                                      data.type === 28 ? "VAR"
                                                                                      :
                                                                                      (
                                                                                        data.type === 29 ? "승부차기"
                                                                                        :
                                                                                        (
                                                                                          data.type === 30 ? "승부 실패"
                                                                                          :
                                                                                          ""
                                                                                        )
                                                                                      )
                                                                                    )
                                                                                  )
                                                                                )
                                                                              )
                                                                            )
                                                                          )
                                                                        )
                                                                      )
                                                                    )
                                                                  )
                                                                )
                                                              )
                                                            )
                                                          )
                                                        )
                                                      )
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    }
                                    </div>
                                    <div className="propgress">
                                      <ProgressBar>
                                        <Progress width={Math.floor((data.away / (data.away + data.home)) * 100)}></Progress>
                                      </ProgressBar>
                                      <span>{data.away}</span>
                                    </div>
                                  </ScorePopupStatsContents>
                                </>
                              )}
                            )}
                          </ScorePopupStatsContainer>
                        </section>
                        }
                        </ScoreRectangle>
                        <Team2>
                          <img
                            src={pageBasicImgUrl+data.away_team_info.team_logo}
                            alt=""
                          ></img>
                          <TeamName>
                              {data.away_team_info.team_name}
                          </TeamName>

                          {/* 순위 */}
                          {data.away_team_info.rankup !== "" ?
                            <RankingText>
                                ({data.away_team_info.rankup})
                            </RankingText>
                            :
                            ""
                          } 
                          {/* 옐로카드 */}
                          {data.away_team_info.red_cards !== 0 &&
                            <TeamRectangle background="#ce2b37">
                              {data.away_team_info.red_cards}
                            </TeamRectangle>
                          }
                          {/* 레드카드 */}
                          {data.away_team_info.yellow_cards !== 0 &&
                            <TeamRectangle>
                              {data.away_team_info.yellow_cards}
                            </TeamRectangle>
                          }
                        </Team2>
                      </TeamContents>
                      <OptionContents>
                        <OptionInfo>
                          <HT>HT {data.home_team_info.half_score}-{data.away_team_info.half_score}</HT>
                          <Flag>
                            <img
                              src="/images/live/Flag.png"
                              alt=""
                            />
                             {data.home_team_info.corners}-{data.away_team_info.corners}
                          </Flag>
                        </OptionInfo>
                        <IconContents
                          onClick={(e) => e.stopPropagation()}
                        >
                          {data.live_status === 0 ?
                            ""
                            :
                            (data.live_status === 1 || data.live_status === 2 ?
                            <img
                            src="/images/main/Youtube.png"
                            alt=""
                            />
                            :
                            ""  
                            )
                          }
                          
                          {data.lineup_status === 0 ?
                            ""
                            :
                            (data.lineup_status === 1 || data.lineup_status === 2 ?
                            <img
                            src="/images/main/Uniform.png"
                            alt=""
                            />
                            :
                            ""  
                            )
                          }
                          {data.animation_status === 0 ?
                            ""
                            :
                            (data.animation_status === 1 || data.animation_status === 2 ?
                            <img
                            src="/images/live/Star-on.png"
                            alt=""
                            />
                            :
                            ""  
                            )
                          }
                        </IconContents>
                      </OptionContents>
                    </LeagueInfoCotainer>
                  </>
                )
              })}
          </LiveContents>
        </LiveComponent>
        <LiveScoreMobileFootball sportsType={sportsType} liveCount={liveCount} footballData={footballData} pageBasicImgUrl={pageBasicImgUrl}  tab={tab} setTab={setTab}></LiveScoreMobileFootball>
        <Footer setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </ContentsContainer>
    </Wrapper>
  );
};

export default LiveScoreFootballPage;
