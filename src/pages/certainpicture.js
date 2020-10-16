import React from 'react';
import './home.css';
import './certainpicture.css';

import IndexedDbRepository from '../db/connection';


class AddPicture extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
      image: [],
      date: null
    };

  }

  componentDidMount() {

    document.title = "Просмотр картинки";


    this.dbtest = new IndexedDbRepository( 'id' );

        this.dbtest.findById( parseInt(this.props.match.params.PictureID) ).then( picture => this.setState( { image: picture }, () => {
          this.setState({date: this.state.image.date.toString()})
          })
        );
    }

    delete = () =>
    {
      this.dbtest.deleteById(parseInt(this.props.match.params.PictureID)).then(result => window.location = ("/"));
    }



  render() {

    if(!Array.isArray(this.state.image.tags))
    {
      this.state.image.tags  = [this.state.image.tags];
    }

  return(

<div>

<h1>{this.state.image.name}</h1>

<div className="container-all" id = "maincontent">

  <div className = "showpicture">
  <img className = "image" src={'data:image/' + this.state.image.type +';base64,' + btoa(this.state.image.value)} alt='' />

  <div className = "info">
  <p>Описание: {this.state.image.desc}</p>
  <p>Оригинальный размер: {this.state.image.width + 'x' + this.state.image.height}</p>
  <p>Дата добавления: {this.state.date}</p>
  <p>Коллекция (кликабельно): <a className = "tag" href = {"/home/collection/" + this.state.image.collection}> {this.state.image.collection}</a></p>
  <p>Теги (кликабельно):
  {
    this.state.image.tags.map((tag) => {

              return(

      <a className = "tag" href = {"/home/tag/" + tag}> {tag}</a>
    )})
    }
    </p>
    <button className = "sendbutton" onClick={this.delete}> Удалить! </button>
    <a className = "sendbutton" href = {"/edit/" + this.state.image.id}>Редактировать!</a>
    <a className = "sendbutton" download = {this.state.image.name + "." + this.state.image.type} href = {'data:image/' + this.state.image.type +';base64,' + btoa(this.state.image.value)}>Скачать!</a>

  </div>
</div>
</div>
</div>

);

}
}

export default AddPicture;
