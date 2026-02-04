import { useState, useRef, useEffect } from "react"
import { Modal } from "./Modal"
import { useQuery } from "@tanstack/react-query"
import { ResultImage } from "./ResultImage"
import { useContext } from "react"
import { LanguageContext } from "../contexts/LanguageContext"
import { Interweave } from "interweave"

import buscasimpsons from "../assets/buscasimpsons.png"
import frinkiac from "../assets/frinkiac.png"


import useImageCrop from "../hooks/useImageCrop"

export function Imagesearch() {

    const { text, setLanguage } = useContext(LanguageContext);
    const [selectedBackend, setSelectedBackend] = useState("frinkiac")
    const [helpModalOPen, setHelpModalOPen] = useState(false)

    const [isDraggingFile, setIsDraggingFile] = useState(false)

    const crop_container_ref = useRef(null)

    const { loadFile, loadUrl, activeSource, previewImage, baseImage, isCropped, corsError, cropModalOpen, setCropModalOpen,
        imageLoaded, cropArea, applyCrop, resetToOriginal, handleCropMouseMove, handleCropMouseDown, handleCropMouseUp,
        clearImage } = useImageCrop(crop_container_ref)

    const [imageLimit, setImageLimit] = useState(40)

    const input_ref = useRef(null)
    const url = useRef(null)


    async function upload() {
        var formData = new FormData();

        if (activeSource instanceof File){
            formData.append("file", activeSource)
        }
        else{
            formData.append("url", activeSource)
        }


        const response = await fetch(import.meta.env.VITE_BUSCASIMPSONS_API + '/upload-image/', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json()
    }

    const { isLoading, isError, data, isFetching, refetch } = useQuery({
        queryKey: ["Imagequery"],
        queryFn: upload,
        enabled: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30
    });

    function validate() {
        const file = input_ref.current.files?.[0]
        const urlfile = url.current.value

        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                alert('File too big')
                return
            }

            loadFile(file)
            return
        }
        if (urlfile) {
            try {
                new URL(urlfile)
                loadUrl(urlfile)

                return
            } catch {
                alert('Por favor ingresa una URL válida.')
            }
        }
    }

    function dropHandler(event) {
        event.preventDefault();
        setIsDraggingFile(false)

        if (event.dataTransfer.files) {
            input_ref.current.files = event.dataTransfer.files
            validate()
        }
    }

    function scrollHandler(event) {
        let maxScroll = document.body.scrollHeight - window.innerHeight;

        if ((maxScroll - window.scrollY) < 300) {
            setImageLimit(old => old + 40)
        }

        window.sessionStorage.setItem("results_scroll", window.scrollY)
    }



    useEffect(() => {
        if (data) {
            if (window.sessionStorage.getItem("results_limit")) {
                let limit_number = Number(window.sessionStorage.getItem("results_limit"))
                setImageLimit(limit_number)
            }
        }

        window.addEventListener('scrollend', scrollHandler);

        setTimeout(() => {
            if (window.sessionStorage.getItem("results_scroll")) {
                let scrollTO = window.sessionStorage.getItem("results_scroll")
                window.scrollTo(0, scrollTO)
            }
        }, 10);

        return () => {
            window.removeEventListener('scrollend', scrollHandler);
        }
    }, []);

    useEffect(() => {
        window.sessionStorage.setItem("results_limit", imageLimit);
    }, [imageLimit]);

    function dragOverHandler(event) {
        event.preventDefault();
        setIsDraggingFile(true)
    }

    function dragLeaveHandler(event) {
        setIsDraggingFile(false)
    }

    return (
        <div className="image-search-page">
            <div className="container max-1600 center padding-10 ">

                <div className="image-search-header">

                    <div>
                        <h><Interweave content={text("title_description")}></Interweave></h>
                    </div>

                    <button className="help " onClick={() => { setHelpModalOPen(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M10 19h3v3h-3zm2-17c5.35.22 7.68 5.62 4.5 9.67c-.83 1-2.17 1.66-2.83 2.5C13 15 13 16 13 17h-3c0-1.67 0-3.08.67-4.08c.66-1 2-1.59 2.83-2.25C15.92 8.43 15.32 5.26 12 5a3 3 0 0 0-3 3H6a6 6 0 0 1 6-6" />
                        </svg>
                    </button>

                    <div className="flex flex-column align-center" >
                        <div>
                            <label>{text("selectbackend")}</label>
                        </div>

                        <div className="backend-selector flex gap-10">
                            <button className={`backend-button ${selectedBackend == "buscasimpsons" ? "selected" : ""}`} onClick={() => setSelectedBackend("buscasimpsons")}>
                                <div>
                                    <img className="backend-image" src={buscasimpsons}></img>
                                    <p>buscasimpsons</p>
                                </div>
                            </button>
                            <button className={`backend-button ${selectedBackend == "frinkiac" ? "selected" : ""}`} onClick={() => setSelectedBackend("frinkiac")}>
                                <div>
                                    <img className="backend-image" src={frinkiac}></img>
                                    <p>frinkiac</p>
                                </div>
                            </button>
                        </div>

                    </div>
                </div>

                <div className="upload-section">
                    <div
                        onDragOver={dragOverHandler}
                        onDrop={dropHandler}
                        onDragLeave={dragLeaveHandler}
                        className={`upload-dropzone ${isDraggingFile ? 'dragging' : ''} ${previewImage ? 'has-preview' : ''}`}
                    >
                        {!previewImage ? (
                            <>
                                <div className="upload-icon"><img src="icons/bobo.png" height="60" alt="" /></div>

                                <h3>{text("drop")}</h3>
                                <p>{text("click")}</p>
                                <label htmlFor="file-input" className="buttons">
                                    {text("select_file")}
                                </label>
                                <input
                                    onChange={validate}
                                    ref={input_ref}
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="file-input"
                                />

                                <div className="margin-y-20">
                                    <span>{text("file_limit")}</span>
                                </div>
                            </>
                        ) : (
                            <div className="preview-container">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="preview-image"
                                // onClick={() => setShowFullSizeModal(true)}
                                />

                                <div className="preview-actions flex wrap fit center gap-10">
                                    {isCropped && (
                                        <button onClick={resetToOriginal} className="buttons">
                                            {text("use_original")}
                                        </button>
                                    )}

                                    <button onClick={() => setCropModalOpen(true)} className="edit-button buttons">
                                        {text("crop")}
                                    </button>
                                    <button onClick={clearImage} className="clear-button buttons">
                                        {text("delete")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="url-section">
                        <div className={` width-100 ${previewImage ? 'hidden' : ''}`} >

                            <div className="fit center">
                                <span>{text("or")}</span>
                            </div>

                            <div className="width-100">
                                <input
                                    onChange={validate}
                                    ref={url}
                                    type="text"
                                    name="url"
                                    placeholder={text("paste_url")}
                                    className="url-input"
                                />
                            </div>

                        </div>
                        <button className={`buttons upload-button ${previewImage ? 'active' : ''}`}
                            disabled={!previewImage}
                            onClick={() => { refetch() }} >

                            {isLoading || isFetching ? (
                                <>
                                    <span className="button-loader"></span>
                                    {text("searching")}
                                </>
                            ) : (
                                <>
                                    {text("search")}
                                </>
                            )}
                        </button>

                    </div>


                </div>


                {(isLoading || isFetching) && ( //loading
                    <div className='loading-container'>
                        <img style={{ height: 100 }} src="icons/loading.gif" alt="Cargando" />
                        <h3>{text("uploading")}</h3>
                        <p>{text("uploading_info")}</p>
                    </div>
                )}

                {isError && // error
                    <div className='loading-container'>
                        <img style={{ height: 150 }} src="icons/error2.png"></img>
                        <h3>{text("error_header")}</h3>
                        <p>{text("error_message")}</p>
                    </div>}


                {!data && !isLoading && (
                    <>
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon">
                                    <img src="icons/upload.png" height="100px" alt="" />
                                </div>
                                <h3>{text("card_upload_title")}</h3>
                                <p>{text("card_upload_description")}</p>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <img src="icons/api.png" height="100px" alt="" />
                                </div>
                                <h3>{text("card_api_title")}</h3>
                                <p>{text("card_api_description")}</p>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <img src="icons/results.png" height="100px" alt="" />
                                </div>
                                <h3>{text("card_results_title")}</h3>
                                <p>{text("card_results_description")}</p>
                            </div>
                        </div>
                    </>
                )}

                {data && (
                    <>
                        <div className="results-header">

                            <h2><img src="icons/tv.png"></img>{text("results")}</h2>
                            <p>{text("results_images")} {selectedBackend}</p>
                        </div>

                        <div className="results-grid">
                            {data.slice(0, imageLimit).map((item, index) => (

                                <ResultImage key={`${item.episode}-${item.frame}`} episode={item.episode} frame={item.frame} backend={selectedBackend} ></ResultImage>

                            ))}
                        </div>

                        {imageLimit < data.length && (
                            <div className="load-more-container">
                                <p>{text("load_more")}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={cropModalOpen} close={() => setCropModalOpen(false)}>
                <div className="crop-editor-modal">
                    <p>{text("crop_message")}</p>

                    <div
                        ref={crop_container_ref}
                        className="crop-container"
                        onPointerMove={handleCropMouseMove}
                        onPointerUp={handleCropMouseUp}
                        onPointerLeave={handleCropMouseUp}
                    >
                        {imageLoaded && (
                            <>
                                <div className="crop-image-wrapper" style={{
                                    width: `${cropArea.containerWidth}px`,
                                    height: `${cropArea.containerHeight}px`,
                                    position: 'relative'
                                }}>
                                    <img
                                        src={baseImage}
                                        alt="Original"
                                        className="crop-image-preview"
                                        draggable={false}
                                        style={{
                                            width: `${cropArea.containerWidth}px`,
                                            height: `${cropArea.containerHeight}px`,
                                            display: 'block'
                                        }}
                                    />

                                    <div
                                        className="crop-area"
                                        style={{
                                            left: `${cropArea.x}px`,
                                            top: `${cropArea.y}px`,
                                            width: `${cropArea.width}px`,
                                            height: `${cropArea.height}px`,
                                        }}
                                        onPointerDown={(e) => handleCropMouseDown(e)}
                                    >
                                        <div className="crop-handle nw" onPointerDown={(e) => handleCropMouseDown(e, 'nw')} />
                                        <div className="crop-handle ne" onPointerDown={(e) => handleCropMouseDown(e, 'ne')} />
                                        <div className="crop-handle sw" onPointerDown={(e) => handleCropMouseDown(e, 'sw')} />
                                        <div className="crop-handle se" onPointerDown={(e) => handleCropMouseDown(e, 'se')} />

                                        <div className="crop-grid">
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                            <div className="crop-grid-line"></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="crop-actions">
                        {corsError &&
                            (
                                <p>{text("crop_error")}</p>
                            )}
                        <button className="crop-cancel-btn" onClick={() => setCropModalOpen(false)}>
                            {text("crop_cancel")}
                        </button>
                        <button className="crop-apply-btn" onClick={applyCrop}>
                            {text("crop_apply")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={helpModalOPen} close={() => { setHelpModalOPen(false) }}>
                <div className="modal-help">
                    <h2><img src="icons/fox.png" height="35" style={{ marginRight: "10px" }} alt="" />{text("how_main_title")}</h2>

                    <div className="help-section">
                        <h3> {text("how_upload_title")}</h3>
                        <Interweave content={text("how_upload_description")} ></Interweave>
                    </div>

                    <div className="help-section">
                        <h3>{text("how_betterresults_title")}</h3>
                        <Interweave content={text("how_betterresults_description")} ></Interweave>
                    </div>

                    <div className="help-section">
                        <h3>{text("how_cannotfind_title")}</h3>
                        <Interweave content={text("how_cannotfind_description")} ></Interweave>
                    </div>

                    <div className="help-section">
                        <h3>{text("how_tech_title")}</h3>
                        <p>{text("how_tech_description")}</p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}