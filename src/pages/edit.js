import React from 'react';
import './home.css';
import './addpicture.css';


import { Redirect } from 'react-router-dom';

import IndexedDbRepository from '../db/connection';


class Edit extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      desc: null,
      img: [],
      tags: null,
      image: []
    };

    this.editpicture = this.editpicture.bind(this);
  }



handleUserInput = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  this.setState({[name]: value});
}




  componentDidMount() {

    document.title = "Редактировать";


  this.dbtest = new IndexedDbRepository( 'Storage' );
  this.dbtest.findById( parseInt(this.props.match.params.PictureID) ).then( picture => {
    this.setState( { image: picture });
    this.setState( { name: picture.name });
    this.setState( { desc: picture.desc });
    this.setState( { tags: picture.tags.toString().replace(/,/g , ' ')});
}
);

    }

    renderRedirect = () => {
    return <Redirect to='/' />
}


editpicture()
{

    if(this.state.name === null) { alert("Введите название картинки!");}
    else{

    let uploadingPicture = this.state.image;
    uploadingPicture.name = this.state.name;
    uploadingPicture.desc = this.state.desc;

    if(this.state.tags !== null && this.state.tags !== "")
    {
      this.state.tags = this.state.tags.replace(/\s+/g, ' ').trim();
      if(this.state.tags !== "")
      {
      uploadingPicture.tags = this.state.tags.split(" ");
    }
    }

      let id = this.state.image.id;
      this.dbtest.save(uploadingPicture ).then(function(value) {
        alert("Изображение отредактировано!!");
        window.location.href = "/" + id;
          });


  }
}



  render() {

  return(
<div>

<h1>Редактировать</h1>

<div id = "maincontent">

  <div className = "uploadingpicture">
  <img className = "preview" src={'data:image/' + this.state.image.type +';base64,' + btoa(this.state.image.value)} alt='' />
  </div>

  <div className = "picinfo">

  <div>
  <p className = "field">Название</p>
  <input className="textinput" type="text" required  name="name"
    placeholder="Название картинки"
    value={this.state.name}
    onChange={this.handleUserInput}  />
</div>
<br />
<div>
<p className = "field">Описание</p>
  <textarea className="textinput" type="textarea" height="300px"  name="desc"
    placeholder="Описание"
    value={this.state.desc}
    onChange={this.handleUserInput}  />

      <br/>
      <br/>
</div>

<p className = "field">Теги</p>
  <textarea className="textinput" type="textarea" height="300px"  name="tags"
  placeholder="Теги (через пробел без #) Минимальная длина тега - три символа"
  value={this.state.tags}
  onChange={this.handleUserInput}  />

  <br/>
  <button className = "upload" onClick={this.editpicture}> Редактировать! </button>

</div>


</div>
</div>

);
}

}

export default Edit;
