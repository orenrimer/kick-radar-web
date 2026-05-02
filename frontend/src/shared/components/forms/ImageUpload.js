import React, { useRef, useState, useEffect } from 'react';

import CustomButton from '../UIComponents/CustomButton';

import './ImageUpload.css';

const ImageUpload = ({ max_files = 5, ...props }) => {
    const previewRef = useRef();
    const [files, setFiles] = useState();
    const [isValid, setIsValid] = useState(true);
    const filePickerRef = useRef();


    useEffect(() => {
        function readAndPreview(file) {

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.className = "preview-image__image"
                image.title = file.name;
                image.src = reader.result;
                previewRef.current.appendChild(image);
            };

            reader.readAsDataURL(file);
        }

        // previewRef.current.replaceChildren()
        if (files) {
            Array.prototype.forEach.call(files, readAndPreview);
        }
    }, [files]);


    const pickedHandler = event => {
        let pickedFile;
        if (event.target.files) {
            if (event.target.files.length > max_files) {
                setIsValid(false);
            } else {
                pickedFile = event.target.files[0];
                pickedFile = props.multiple ? event.target.files : event.target.files[0];
                setIsValid(true);
            }
        } else {
            setIsValid(false);
        }
        setFiles(pickedFile);
        props.onInput(pickedFile);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                multiple={props.multiple}
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />

            <div className='image-picker-btn'>

                <CustomButton type="button" style={props.style} onClick={pickImageHandler}>
                    {props.children}
                </CustomButton>
                {!isValid && <div className='upload-error-msg'>
                    <p>{props.errorText ? props.errorText : "Please provide up to 5 images"}</p>
                </div>}
            </div>

            {props.preview &&
                <div ref={previewRef}
                    className="image-upload__preview">
                </div>
            }

        </div >
    );
};

export default ImageUpload;
