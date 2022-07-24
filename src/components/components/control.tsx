import { useCallback, useState } from "react"
import { useData } from "../../hook/useData"
import { useToast } from "../../hook/useToast"
import { useWorker } from "../../hook/useWorker"
import { Controller } from "../controller"
import { CheckBox, Inputs, NumberField, Divver, InputButton } from "../input"


function ControlController(props: {}) {
    const toast = useToast()
    const worker = useWorker()
    const data = useData()

    const [showOption, setShowOption] = useState(true)

    const [addSpeed, setAddSpeed] = useState(0)

    return (
        <Controller left={20} bottom={60} minWidth={120}>
            <Inputs>
                {
                    showOption && <>

                        <NumberField
                            label="중력가속도"
                            value={data.data.gravity}
                            onChange={(value) => worker.requestWorker('updateGravity', value)}
                            min={0}
                            max={100}
                            step={0.1}
                        />

                        <NumberField
                            label="길이"
                            value={data.data.length}
                            onChange={(value) => worker.requestWorker('updateLength', value)}
                            min={1}
                            max={1000}
                            step={1}
                        />

                        <NumberField
                            label="무게"
                            value={data.data.weight}
                            onChange={(value) => worker.requestWorker('updateWeight', value)}
                            min={1}
                            max={1000}
                            step={1}
                        />

                        <Divver />

                        <NumberField
                            label="속도 추가"
                            value={addSpeed}
                            onChange={(value) => setAddSpeed(value)}
                            min={-100}
                            max={100}
                            step={0.1}
                        />

                        <InputButton label="추가" onClick={() => worker.requestWorker('addSpeed', addSpeed)} />
                        <Divver />
                        <InputButton label="놓기" onClick={() => worker.requestWorker('release', addSpeed)} />
                        <Divver />
                    </>
                }

                <CheckBox label="설정" value={showOption} onClick={() => { setShowOption(!showOption) }} />
            </Inputs>
        </Controller>
    )
}

export {
    ControlController
}