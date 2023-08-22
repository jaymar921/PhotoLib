import React, { useEffect, useRef, useState } from 'react'
import { CreateNewAlbum, GetMonthYear, LoadPhotosInAlbum, getAlbumImage } from '../Utils/DataHelper';
import Button, { Radio } from './Button';
import { GetOfflineUserData, IsLoggedIn } from '../Utils/Utility';
import Confirm from './Confirm';
import { config } from '../config';

function AlbumComponent({albums, callback, addAlbumCallback, updatePhotos, active}) {
    const [hasLoggedIn, setHasLoggedIn] = useState(false);
    
    useEffect(()=> {
        setHasLoggedIn(IsLoggedIn());
    }, [])

  return (
    <div className='Album-Container'>
        <h1 className='Title'>Albums</h1>
        <div className='Albums-List'>
            
            {
                albums.map(album => {
                    return <Album key={album.guid} active={active} data={album} callback={callback} updatePhotos={updatePhotos}/>
                })
            }
            
        </div>
        {hasLoggedIn?(
            <Button styles={'top-Right'} onClick={addAlbumCallback}>
                New Album
            </Button>
        ):""}
    </div>
  )
}

export function Album({data, callback, updatePhotos, active}){
    const [img, setImg] = useState(null)
    const [showModal, setShowModal] = useState(false);
    useEffect(()=> {
        async function loadAlbumImage(){
            const imageFile = await getAlbumImage(data.guid);
            setImg(imageFile);
        }

       loadAlbumImage();
    }, [data.guid])

    function toggleDeleteModal(){
        setShowModal(true);
    }

    function cancelDelete(){
        setShowModal(false);
    }

    async function DeleteConfirmed(){
        const userData = GetOfflineUserData();
        fetch(config.SERVER_URL_ALBUM_MICROSERVICE+'/album',{
            method: 'DELETE',
            headers:{
                AuthToken: userData.AuthToken,
                AlbumID: data.guid
            }
        })
        window.location.href = '/'
    }

    return (
        <>
        <Confirm message={`Are you sure you want to delete the Album named "${data.title}"?`} ShowModal={showModal} onCancel={cancelDelete} onConfirm={DeleteConfirmed}/>
        <div className="Album" onClick={(e)=> {
                callback(data);
                (async()=>{
                    const photo = await LoadPhotosInAlbum(data);

                    //updatePhotos(photo);
                })();
            }}>
            
            <div className={`${(active!=='')?(active.guid === data.guid)?"selected":"darkbg":"darkbg"}`}></div>
            <div className='Image-Container'>
                <img alt='' src={img} />
            </div>
            <Button onClick={toggleDeleteModal} styles={'btn-small album-Right'} title={`Delete Album\n[${data.title}]`}><i className="fa-solid fa-trash"></i></Button>
            <div className='info'>
                <h2>{data.title}</h2>
                <p>{GetMonthYear(data.albumState.dateCreated).join(" ")}</p>
                {/* <ViewsComponent views={data.albumState.views} /> */}
            </div>
            
        </div>
        </>
    )
}

export function NewAlbumModal({show, setShow, userData, token}) {
    const [image, setImage] = useState(null);
    const [imageFile, setimageFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const imageRef = useRef();
    const [insertImageP, setInsertImage] = useState('Insert Image');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function uploadImage(){
        document.getElementById('upload-image-modal').click();
    }

    function handleUploadImageChange(e){
        if(!e)
            return;
        //console.log(e)
        setImage(URL.createObjectURL(e));
        setimageFile(e);
        setInsertImage(' ')

        if(image){
            document.getElementById('upload-image-modal').src = e;
        }
            
    }

    async function createButtonClicked () {
        if(isLoading) return;
        console.log(`
            IsPublic:    ${isPublic},
            Title:       ${title},
            Description: ${description},
            image:       ${image},
            image ref:   ${imageRef}
        `)

        if(title === ''){
            setErrorMessage("Title should be provided");
            return;
        }
        if(description === ''){
            setErrorMessage("Description should be provided");
            return;
        }
        if(imageFile === null){
            setErrorMessage("Image should be provided");
            return;
        }
        setIsLoading(true);
        await CreateNewAlbum(userData, token,title, description, isPublic, imageFile);
        setTimeout(()=>{
            setIsLoading(false)
        }, 2000)
    }
  return (
    <div id='modal-container-album' className={`modal-container ${show}`} onClick={(e)=>{
        if(e.target.id === 'modal-container-album'){
            setShow('hidden');
        }
    }}>
        <div className='modal'>
            <h2 className='title'>New Album</h2>
            <div className='flexblock'>
                <div className='flex'>
                    <div className='block'>
                        <label>Title</label>
                        <br />
                        <input type='text' value={title} onInput={({target})=>{setTitle(target.value); setErrorMessage("");}}/>
                        <br />
                        <label>Description</label>
                        <br />
                        <textarea maxLength={150} value={description} onInput={({target})=>{setDescription(target.value); setErrorMessage("");}}></textarea>
                        <br />
                        <br />
                        <div className='pad-top-50px-nmbl' />
                        <Radio getValue={setIsPublic}>
                            Public
                        </Radio>
                        <br />
                    </div>
                </div>
                <div className='flex'>
                    <div className='block'>
                        <img id='upload-img-display' alt={image} className='insert-image' onClick={uploadImage} src={image}/>
                        <input id='upload-image-modal' hidden className='insert-image' type='file' onChange={(e)=> {
                            handleUploadImageChange(imageRef.current.files[0]); setErrorMessage("");
                        }} ref={imageRef} />
                        <p className='insertImageP'>{insertImageP}</p>
                    </div>
                    <div className='block'>
                        <Button onClick={createButtonClicked} styles='btn-center'>
                            {isLoading?"Creating...":"Create"}
                        </Button>
                    </div>
                    <br />
                </div>
            </div>
            <p className='err'>{errorMessage}</p>
            <br />
        </div>
    </div>
  )
}

export default AlbumComponent