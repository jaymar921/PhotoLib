import React, { useEffect, useRef, useState } from 'react'
import Photo, { DisplayPhoto } from './Photo'
import Button from './Button'
import { APIUpdateAlbum, GetMonthYear, LoadPhotosInAlbum, UploadPhotoInAlbum } from '../Utils/DataHelper';
import { IsLoggedIn } from '../Utils/Utility';

function PhotosContainerComponent({currentAlbum, setReadySwitch}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImage, setShowImage] = useState('');
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [updateToggle, setUpdateToggle] = useState(false);
  const [photos, updatePhotos] = useState([])
  const [loading, setIsLoading] = useState(false)
  const photosRef = useRef();

  useEffect(() => {
    updatePhotos([])
    loadUI();
    setHasLoggedIn(IsLoggedIn());
  }, [currentAlbum])

  if(!currentAlbum)
    return; 

  
  function updateAlbumInformation({target:element}){
    if(updateToggle)
      return;
    setUpdateToggle(true)
    const innerHtmlContent = element.innerHTML;
    const elementId = element.id;
    if(innerHtmlContent === ''){
      return;
    }
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.id   = 'update-'+elementId;
    if('album-title' === elementId){
      inputEl.className = "input-special-lg"
      inputEl.oninput = Input_UpdateTitle;
    }else{
      inputEl.className = "input-special-md"
    }
    inputEl.value = innerHtmlContent.split('-')[0].trim();

    const btnSave = document.createElement('button');
    btnSave.id = `update-${elementId}-btn`;
    btnSave.type = 'button';
    btnSave.className = "btn-generic"
    btnSave.textContent = "Save";
    btnSave.onclick = () => {SaveChanges(elementId)};

    element.innerHTML = "";
    element.appendChild(inputEl)
    element.appendChild(btnSave)
  }

  function Input_UpdateTitle(e){
    if(e.target.value.length === 0)
      e.target.value = currentAlbum.title;
  }

  function SaveChanges(option){
    const element = document.getElementById(option)
    console.log(element)
    if(option && element){
      // get the input element value
      const inputEl = document.getElementById('update-'+option);
      const value = inputEl.value;
      if(!value)
        return;
      
      element.innerHTML = value;
      if('album-title' === option)
        APIUpdateAlbum(currentAlbum.guid, value, currentAlbum.description, currentAlbum.albumState.isPublic)
      if('album-desc' === option)
        APIUpdateAlbum(currentAlbum.guid, currentAlbum.title, value, currentAlbum.albumState.isPublic)
    }
  }

  async function loadUI(){
    setReadySwitch(false)
    setIsLoading(true);
    const photoData = await LoadPhotosInAlbum(currentAlbum);
    if(currentAlbum && photoData){
      setShowImage(null)
      setActivePhoto(null)
      updatePhotos(photoData.filter(p => p.albumID === currentAlbum.guid));
    }
    setIsLoading(false);
    setReadySwitch(true)
  }

  async function updateUI(){
    setHasLoggedIn(IsLoggedIn());
    updatePhotos([])
    setTimeout(()=>{
      loadUI();
    }, 200)
  }

  async function removePhotoCallback(photo){
    console.log(photo)
    updatePhotos(photos.filter(p => p.photoId !== photo.photoId));
  }

  function AnimateLoadPhoto (){
    let s = photosRef.current;
    for(let x of s.childNodes){
        if(!x.id.includes('load-more-photos')){
            const arr = [...x.classList]
            if(!arr.includes('showOpacity')){
              x.classList.add('showOpacity');
              x.classList.remove('hidden');
            }
          }
      }
  }


  return (
    <div id='Photos-Container' className='Photos-Container'>
        <DisplayPhoto data={activePhoto} show={showImage} setShow={setShowImage} afterUpdateCallback={updateUI} onRemoveCallback={removePhotoCallback}/>
        <NewPhotoModal showModal={showUploadModal} setShowModal={setShowUploadModal} currentAlbum={currentAlbum}/>
        <div className='Title'>
            <div className='info'>
                <h3 id='album-title' onClick={updateAlbumInformation}>{currentAlbum.title} - Photos</h3>
                <p id='album-desc' onClick={updateAlbumInformation}>{currentAlbum.description}</p>
                
                <div className='date'>
                    <p>{GetMonthYear(currentAlbum.albumState.dateCreated).join(" ")}</p>
                    {hasLoggedIn?(<Button onClick={(e)=> {
                        setShowUploadModal(!showUploadModal);
                      }}>
                        Add Photo
                    </Button>): ""}
                </div>
            </div>
        </div>
        <div ref={photosRef} className='Photos-List'>
        {
          photos.map(photo => {
            /* animation */
            (async()=>{
              setTimeout(()=>{
                AnimateLoadPhoto();
              },20)
            })()
            return <Photo key={photo.photoId} styles={''} src={photo.image} setActive={setActivePhoto} metaData={photo} setShowDisplay={setShowImage}/>
          })
        }
        {/*
        <Photo src={'./assets/IMG_0013.JPG'}/>
        <Photo src={'./assets/IMG_0002.JPG'}/>
        <Photo src={'./assets/IMG_0003.JPG'}/>
        <Photo src={'./assets/IMG_0004.JPG'}/>
        <Photo src={'./assets/IMG_0107.JPG'}/>
        <Photo src={'./assets/IMG_0934.JPG'}/>
        <Photo src={'./assets/IMG_0993.JPG'}/>
        <Photo src={'./assets/IMG_1128.JPG'}/>
        <Photo text={'Load more'} onClick={handleLoadMoreCallback}/>
        */}
        {
          loading?<Photo text={<div className="loader"></div>} styles={'transparent-bg'} onClick={()=>{}}/>:""
        }
        </div>
    </div>
  )
}


export function NewPhotoModal({currentAlbum, showModal, setShowModal}){
  const [showUpload, setShowUpload] = useState(false);
  const [payload, setPayload] = useState(null);

  function handleInput({files}){
    if(files.length === 0)
      return;

    setShowModal(false);
    setShowUpload(true);
    setPayload(files);
  }
  return (
    <>
      <div id='add-photo-modal' className={`modal-container ${showModal?'':'hidden'}`} onClick={(e)=> {
        if(e.target.id === 'add-photo-modal')
          setShowModal(!showModal)
      }}>
        <div className='modal'>
          <h2 className='title nopadmar'>Upload Photos - {currentAlbum.title}</h2>
          <br />
          <div className='drag-photos center pointer' onClick={()=> {document.getElementById('image-files-upload-input').click()}}>
            <div className='center-div'>
              <h2 className='nopadmar'>Select photos to upload</h2>
              <p className='italic nopadmar'>(Multiple files are accepted)</p>
              <input id='image-files-upload-input' type='file' multiple='multiple' accept="image/*" onChange={({target})=> {
                handleInput(target);
              }} hidden/>
            </div>
          </div>
          <br />
          <Button styles={'center'} onClick={(e)=>{document.getElementById('image-files-upload-input').click()}}>
            Upload
          </Button>
          <br />
        </div>
      </div>
      <PreparePhotoUploadModal setShow={setShowUpload} show={showUpload} payload={payload} currentAlbum={currentAlbum}/>
    </>
  )
}

export function PreparePhotoUploadModal({show, setShow, currentAlbum, payload}){
  const [isLoading, setIsLoading] = useState(false);
  const captions = [];
  const [files, setFiles] = useState([]);
  const [waitMessage, setWaitMessage] = useState('')
  
  function setWaiting(msg){
    setWaitMessage(msg);
  }
  async function handleUploadPhotos(){
    if(isLoading) return;
    const _payload = {
      files,
      currentAlbum,
      captions
    }
    setIsLoading(true);
    await UploadPhotoInAlbum(_payload, setWaiting);
    setTimeout(()=>{
        setIsLoading(false)
    }, 1000)
  }

  useEffect(()=>{
    if(!payload)
      return;
    setFiles([...payload]);
  }, [payload])

  

  function handleRemove(_index){
    let toRemove = null;
    files.forEach((item, index)=> {
      if(index===_index){
        toRemove = item;
      }
    })
    setFiles(files.filter(i => i !== toRemove));
    if(files.length-1 === 0){
      console.log('zero')
      setShow(false);
    }
  }
  return(
    <div className={`modal-container ${show?'':'hidden'}`}>
      <div className='modal'>
        <h2 className='title nopadmar'>Upload Photos - {currentAlbum.title}</h2>
        <div className='Albums-List'>
            {
              
              files.map((item, index) => {
                captions.push({caption:""})
                return <PreparePhoto key={Math.floor(Math.random() * 99999)} index={index} src={URL.createObjectURL(item)} dataRef={captions[index]} removeCallback={handleRemove}/>
              })
              
            }
            
        </div>
        <br />
        <p className='center nopadmar'>{waitMessage}</p>
        <p className='photoCounter'>Number of photo(s): {files.length}</p>
        <br />
        <Button styles={'center'} onClick={handleUploadPhotos}>
          {isLoading?'Uploading':'Save'}
        </Button>
        <br />
      </div>
    </div>
  )
}

function PreparePhoto({src, index, dataRef, removeCallback}){
  const [content, setContent] = useState('');
  const [size, setSize] = useState(0);



  return (
    <>
      <div className='Album'>
        <div className='darkbg'></div>
        <div className='Image-Container'>
            <img alt='' src={src} />
        </div>
        <div className='new-info'>
            <textarea className='caption-input center' placeholder='Caption...' maxLength={100} value={content} onInput={(e)=>{
              let str = e.target.value;
              str = str.replace('"','');
              str = str.replace('\'','');
              setContent(str);
              setSize(str.length);
              dataRef.caption = str;
            }}></textarea>
            <p className='max-length'>{size}/100</p>
        </div>
        <Button onClick={()=>{removeCallback(index)}} styles={'btn-small album-TopRight'} title={`Remove Photo`}><i className="fa-solid fa-trash"></i></Button>
      </div>
    </>
  )
}

export default PhotosContainerComponent