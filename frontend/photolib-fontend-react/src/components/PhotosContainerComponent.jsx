import React, { useEffect, useState } from 'react'
import Photo, { DisplayPhoto } from './Photo'
import Button from './Button'
import { GetMonthYear, UploadPhotoInAlbum } from '../Utils/DataHelper';
import { IsLoggedIn } from '../Utils/Utility';

function PhotosContainerComponent({currentAlbum, photos}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImage, setShowImage] = useState('');
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    setHasLoggedIn(IsLoggedIn());
  }, [])

  if(!currentAlbum)
    return; 
  
  return (
    <div className='Photos-Container'>
        <DisplayPhoto data={activePhoto} show={showImage} setShow={setShowImage}/>
        <NewPhotoModal showModal={showUploadModal} setShowModal={setShowUploadModal} currentAlbum={currentAlbum}/>
        <div className='Title'>
            <div className='info'>
                <h3>{currentAlbum.title} - Photos</h3>
                <p>{currentAlbum.description}</p>
                
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
        <div className='Photos-List'>
        {
          photos.map(photo => {
            if(photo.image){
              return <Photo key={Math.floor(Math.random()* 999999)} src={photo.image} setActive={setActivePhoto} metaData={photo} setShowDisplay={setShowImage}/>
            }
            return ""
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
      <PreparePhotoUploadModal show={showUpload} payload={payload} currentAlbum={currentAlbum}/>
    </>
  )
}

export function PreparePhotoUploadModal({show, currentAlbum, payload}){
  const captions = [];
  

  async function handleUploadPhotos(){
    const _payload = {
      files,
      currentAlbum,
      captions
    }
    
    await UploadPhotoInAlbum(_payload);
  }

  if(!payload)
    return;
  const files = [...payload];

  

  return(
    <div className={`modal-container ${show?'':'hidden'}`}>
      <div className='modal'>
        <h2 className='title nopadmar'>Upload Photos - {currentAlbum.title}</h2>
        <div className='Albums-List'>
            {
              
              files.map((item, index) => {
                captions.push({caption:""})
                return <PreparePhoto key={Math.floor(Math.random() * 99999)} src={URL.createObjectURL(item)} dataRef={captions[index]}/>
              })
              
            }
            
        </div>
        <p className='photoCounter'>Number of photo(s): {files.length}</p>
        <Button styles={'center'} onClick={handleUploadPhotos}>
          Save
        </Button>
        <br />
      </div>
    </div>
  )
}

function PreparePhoto({src, dataRef}){
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
      </div>
    </>
  )
}

export default PhotosContainerComponent