import React, { useEffect, useState } from 'react'
import '../Components.css'
import { config } from '../config';
import { GetOfflineUserData } from '../Utils/Utility';
import Button from './Button';
import Confirm from './Confirm';

function Photo({src, text, onClick, metaData, setActive, setShowDisplay, id, styles}) {
  const {photoId} = metaData??{photoId:false}
  return (
    <div id={!photoId?id:photoId} className={`Photo ${styles}`} onClick={(e)=>{
      if(onClick){
        onClick({
          metaData,
          imageSrc: src,
          event:e
        });
      }
      if(setActive){
        setActive({metaData,
          imageSrc: src,
          event:e});
      }
      if(setShowDisplay){
        setShowDisplay('');
      }
    }}>
        <div className='Image-Container'>
            <img alt={src} src={src} />    
            {text}
        </div>
    </div>
  )
}


export function DisplayPhoto({data, show, setShow, afterUpdateCallback, onRemoveCallback}){
  const [focus, setFocus] = useState(false);
  const [modalShow, setShowModal] = useState(false);

  if(!data)
    return;

  let image = data;
    
  const toggleCaptionEdit = () => {
    if(focus)
      return;
    const parentElement = document.getElementById('image-caption');
    // create an input element
    const inputEl = document.createElement('input');
    inputEl.id = 'update-caption';
    inputEl.className = "input-special-md  w300 bld"
    inputEl.value = parentElement.innerHTML;
    

    parentElement.innerHTML = ''
    parentElement.appendChild(inputEl);
    setFocus(true)
    inputEl.focus();
  }

  const toggleCaptionUpdate = async () => {
    if(!focus)
      return;
    const parentElement = document.getElementById('image-caption');

    const inputEl = document.getElementById('update-caption');

    if(!inputEl)
      return;
    if(inputEl.value === '')
      return;

    // api call async
    {
      const userData = GetOfflineUserData();
      fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo",{
        method: 'PATCH',
        headers:{
          AuthToken: userData.AuthToken,
          ImageID: data.metaData.photoId,
          Caption: inputEl.value
        }
      })
    }

    parentElement.innerHTML = inputEl.value;
    setFocus(false)
    afterUpdateCallback();
  }
  const captureCaptionClick = (e) => {
    if(e){
      if(e.target.id === 'image-caption' && !focus)
        toggleCaptionEdit(e);
      else if(e.target.id !== 'update-caption' && focus){
        toggleCaptionUpdate();
      }
    }
  }

  const toggleDeletePhoto = () => {
    setShowModal(true);
  }

  const cancelDelete = () => {
    setShowModal(false);
  }

  const deletePhoto = () => {
    const photoId = data.metaData.photoId;
    const userData = GetOfflineUserData();
    
    if(!photoId)
      return;

    fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo",{
      method: 'delete',
      headers:{
        AuthToken: userData.AuthToken,
        ImageID: photoId,
        Path: data.metaData.albumID
      }
    })
    .then(r => r.json())
    .then(d => {
      setShowModal(false)
      setShow('hidden');
    })
    setTimeout(() => {
      if(onRemoveCallback)
        onRemoveCallback(data.metaData)
    }, 1000)
    document.getElementById(photoId).classList.add('hidden');
  }

  return (
    <div id='show-image-modal' className={`photo-modal ${show}`} onClick={(e)=> {
      if(e.target.id === 'show-image-modal'){
        setShow('hidden');
        toggleCaptionUpdate()
      }
    }}>
      <div className='photo' onClick={captureCaptionClick}>
        <Confirm ShowModal={modalShow} onCancel={cancelDelete} message={`Are you sure you want to delete this photo?`} onConfirm={deletePhoto}/>
        <div className='photo-container'>
          <img alt={image?.imageSrc} src={image?.imageSrc}/>
        </div>
        <div id='image-caption' className='caption'>{image?.metaData?.caption}</div>
        <Button onClick={toggleDeletePhoto} styles={'btn-small photo-delete-btn'} title={`delete ${image?.metaData?.caption}`}><i className="fa-solid fa-trash"></i></Button>
      </div>

    </div>
  )
}

export default Photo