import React, { useCallback, useEffect, useState } from 'react';
import { Controller, Button, Labels, Label, NumberField } from '../components';
import { useToast } from '../hook/useToast';
import { useWorker } from '../hook/useWorker';
import { ReactComponent as GithubSvg } from '../assets/github.svg'
import {
  Play,
  Pause,
  Cursor as CursorIcon,
  CaretRight,
  CaretLeft,
  ArrowsOutCardinal,
  PlusCircle,
  Plus,
  Minus,
  ArrowsOut,
  ArrowsIn,
  ArrowClockwise,
  Trash
} from "phosphor-react";
import { useData } from '../hook/useData';
import styled from 'styled-components';
import { MainCanvas } from '../components/canvas/MainCanvas';
import { LabelController } from '../components/components/labels';
import { ControlController } from '../components/components/control';
import { ResultController } from '../components/components/result';

const GithubIcon = styled(GithubSvg)`
    position: fixed;
    width: 24px;
    height: 24px;
    top: 36px;
    left: 36px;   
    user-select: none;
    fill: #ffffff;
`

function App() {
  const toast = useToast()
  const worker = useWorker()
  const data = useData()

  const [ isPlay, setIsPlay ] = useState(true)

  const togglePlay = () => {
    worker.requestWorker(isPlay ? 'pause' : 'play')
    setIsPlay(!isPlay)
  }

  useEffect(() => {
    const resize = () => {
      worker.requestWorker('screenSize', { width: window.innerWidth, height: window.innerHeight })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [worker])

  const reset = useCallback(() => {
    worker.requestWorker('reset')
  }, [worker])

  return (
    <div className="App">
      <MainCanvas />

      <LabelController />

      <a href="https://github.com/HyunsDev/circular-motion" target={"_blank"} rel="noreferrer">
        <GithubIcon /> 
      </a>

      <ControlController />
      <ResultController />

      <Controller left={20} bottom={20}>
        <Button content={<ArrowClockwise />} tooltip='초기화' onClick={() => reset()} />
        <Button content={isPlay ? <Pause /> : <Play />} tooltip={isPlay ? '일시정지' : '재생'} onClick={() => togglePlay()} />
      </Controller>
    </div>
  );
}

export default App;
