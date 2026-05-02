import React, { useState, useEffect } from "react";

import "./Slider.css"

const RangeSlider = (props) => {
    const [sliderVal, setSliderVal] = useState(0);
    const [mouseState, setMouseState] = useState(null);

    useEffect(() => {
        setSliderVal(props.value);
    }, [props.value]);

    const changeCallback = e => {
        setSliderVal(e.target.value);
    };

    useEffect(() => {
        if (mouseState === "up") {
            props.onChange(sliderVal);
        }
    }, [mouseState, props.onChange, sliderVal]);

    return (
        <React.Fragment>
            <div className="slider-container">
                {props.label && <label>{props.label}</label>}
                <input
                    type="range"
                    min={props.min}
                    max={props.max}
                    value={sliderVal}
                    className="slider"
                    style={{ backgroundSize: `${((sliderVal - props.min) / (props.max - props.min)) * 100}% 100%` }}
                    onChange={changeCallback}
                    onMouseDown={() => setMouseState("down")}
                    onMouseUp={() => setMouseState("up")}
                />
                <div
                    className="slider-thumb-value"
                    style={{ left: `calc(${((sliderVal - props.min) / (props.max - props.min)) * 100}% - ${(sliderVal / props.max) * 40}px)` }}
                >
                    {sliderVal}
                </div>
            </div>
        </React.Fragment>

        // <div className="slider-container">
        //     <label>{props.label}</label>
        //     <input
        //         className="slider"
        //         type="range"
        //         value={sliderVal}
        //         min={props.min}
        //         max={props.max}
        //         step={props.step}
        //         id="myRange"
        //         style={props.style}
        //         onChange={changeCallback}
        //         onMouseDown={() => setMouseState("down")}
        //         onMouseUp={() => setMouseState("up")}
        //     />
        // </div>
    );
}

export default RangeSlider;