import React from 'react';
import './home.css';
import './addpicture.css';

import { Redirect } from 'react-router-dom';

import IndexedDbRepository from '../db/connection';


class AddPicture extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      desc: null,
      image: false,
      img: [],
      preview: "https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg",
      tags: null,
      collections: []
    };

    this.uploadpicture = this.uploadpicture.bind(this);
    this.handlePicUpload = this.handlePicUpload.bind(this);
    this.colchange = this.colchange.bind(this);

  }


  componentDidMount() {

    document.title = "Добавить картинку";

    this.uploadingPicture =
{
    name: null,
    format: null,
    width: null,
    height: null,
    size: null,
    type: null,
    date: null,
    desc: null,
    collection: null,
    tags: [],
    value: null
};

    this.dbtest = new IndexedDbRepository( 'Storage' );

    if(localStorage.getItem('collections') === null)
    {
      var colls = [null];
      localStorage.setItem("collections", JSON.stringify(colls));
      this.setState({collections: JSON.parse(localStorage.getItem("collections")) });
    }
    else
    {
      this.setState({collections: JSON.parse(localStorage.getItem("collections")) });

    }

    }

  colchange = (e) =>
  {
    this.uploadingPicture.collection = e.target.value;
  }


  handlePicUpload = (e) => {

  var file = e.target.files[0];

  this.state.img = file;

  if (file.type.split('/')[0] !== 'image' )
  {
    this.setState({image: false});
    alert("Неправильный формат файла!!!");
  }

  else {

  this.setState({
  preview: URL.createObjectURL(file)
  });

  this.setState({image: true});

  this.uploadingPicture.type = file.type.split('/')[1];

  var sizeInMB = (file.size / (1024*1024)).toFixed(2);
  this.uploadingPicture.size = sizeInMB;


  var _URL = window.URL || window.webkitURL;

  var img;
  img = new Image();
  var objectUrl = _URL.createObjectURL(file);
  img.src = objectUrl;



  img.onload = () => {

      this.uploadingPicture.width = img.width;
      this.uploadingPicture.height = img.height;

      if(img.height > img.width)
      {
        this.uploadingPicture.format = "portrait";
      }
      else if(img.width > img.height)
      {
        this.uploadingPicture.format = "album";
      }
      else {this.uploadingPicture.format = "square"}
      _URL.revokeObjectURL(objectUrl);
  };
}
}

handleUserInput = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  this.setState({[name]: value});
}






    uploadpicture()
    {

      if(this.state.image === true) {
        if(this.state.name === null) { alert("Введите название картинки!");}
        else{

        this.uploadingPicture.name = this.state.name;
        this.uploadingPicture.desc = this.state.desc;
        this.uploadingPicture.date = new Date();

        if(this.state.tags !== null && this.state.tags !== "")
        {
          this.state.tags = this.state.tags.replace(/\s+/g, ' ').trim();
          if(this.state.tags !== "")
          {
          this.uploadingPicture.tags = this.state.tags.split(" ");
        }
        }

		  	let file = this.state.img;

				var reader = new FileReader();

				reader.readAsBinaryString(file);

				reader.onload = (e) => {

					let bits = e.target.result;
          this.uploadingPicture.value = bits;

          this.dbtest.save( this.uploadingPicture ).then(function(value) {
            alert("Изображение было добавлено!");
            window.location.href = "/addpicture";
              });

				}
      }
}

else {alert("Загрузите, пожалуйста, картинку!");}

    }

    renderRedirect = () => {
    return <Redirect to='/' />
}


  render() {



  return(

<div>

<h1>Добавить картинку</h1>

<div id = "maincontent">

  <div className = "uploadingpicture">
    <label for="picture">
    <img className = "preview" src={this.state.preview} alt = "preview"/>
    </label>
    <br/>
<input id="picture" type="file" accept="image/*" onChange={this.handlePicUpload} />
  </div>


  <div className = "picinfo">
  <div>
  <p className = "field">Название</p>

  <input type="text" required className="textinput" name="name"
    placeholder="Название картинки"
    value={this.state.name}
    onChange={this.handleUserInput}  />
</div>
<br />
<div>
<p className = "field">Описание</p>
  <textarea type="textarea" height="300px" className="textinput" name="desc"
    placeholder="Описание"
    value={this.state.desc}
    onChange={this.handleUserInput}  />
</div>
<br />

<p className = "field">Теги</p>
  <textarea type="textarea" height="300px" className="textinput" name="tags"
  placeholder="Теги (через пробел без #) Минимальная длина тега - три символа"
  value={this.state.tags}
  onChange={this.handleUserInput}  />

  <br/>
  <br/>

  <p className = "field">Коллекция:</p>
<div>
<select className="collectioninput" onChange = {this.colchange}>
  {
    this.state.collections.map((coll) => {
              return(
                <option>{coll}</option>
    )})
  }

</select>
<br/>
<button className = "upload" onClick={this.uploadpicture}> Загрузить картинку! </button>

</div>
</div>



</div>
</div>

);
}

}

export default AddPicture;
