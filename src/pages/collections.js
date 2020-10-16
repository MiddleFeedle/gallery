import React from 'react';
import './home.css';
import './collections.css';

import IndexedDbRepository from '../db/connection';

import saveAs from 'file-saver';

import JSZip from "jszip"

class Collections extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
        pics: [],
        readypics: [],
        colname: null,
        collections: []
    };
  }




  componentDidMount() {

    document.title = "Коллекции";

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
    this.loadpics();
    }



    loadpics()
    {

      var temp = JSON.parse(localStorage.getItem("collections"));

      if(temp.length === 1)
      {
        this.setState( { pics: []});
      }
      else
      {
      this.setState( { pics: []});
      for (var i = 1, len = temp.length; i < len; i++) {
          this.dbtest.findByIndex("collection", temp[i]).then(pictures =>
            this.setState( { pics: this.state.pics.concat([pictures])}));
        }
    }
    }


    handleUserInput = (e) => {
      const value = e.target.value;
      this.setState({colname: value});
    }


    addcoll = () =>
    {
      if(this.state.colname !== "" && this.state.colname !== "null")
      {
        var temp;
        temp = JSON.parse(localStorage.getItem("collections"));

        if(temp.includes(this.state.colname))
        {
          alert("Колекция с таким именем уже существует!");
        }

        else
        {
          temp.push(this.state.colname);
          localStorage.setItem("collections", JSON.stringify(temp));
          this.setState({collections: JSON.parse(localStorage.getItem("collections")) }, () => {
            this.setState( { pics: this.state.pics.concat([[]])});
          });
        }
      }
    }

    delete = (deletecol, index) =>
    {

    var array = JSON.parse(localStorage.getItem("collections"));

    for(var i = array.length - 1; i >= 0; i--) {
     if(array[i] === deletecol) {
         array.splice(i, 1);
     }
      }

    localStorage.setItem("collections", JSON.stringify(array));


      var newarray = this.state.pics[index];

      newarray.forEach((element) => {
          element.collection = null;
          this.dbtest.save(element);
      });

      this.setState({collections: JSON.parse(localStorage.getItem("collections")) }, () => {
        this.loadpics();
      });



    }


    deleteALL = (deletecol, index) =>
    {
    var array = JSON.parse(localStorage.getItem("collections"));

    for(var i = array.length - 1; i >= 0; i--) {
     if(array[i] === deletecol) {
         array.splice(i, 1);
     }
      }
    localStorage.setItem("collections", JSON.stringify(array));

      var newarray = this.state.pics[index];

      newarray.forEach((element) => {
          this.dbtest.deleteById(element.id);
      });

      this.setState({collections: JSON.parse(localStorage.getItem("collections")) }, () => {
        this.loadpics();
      });
    }


    downloadzip = (index) =>
    {
      var newarray = this.state.pics[index];

      if(newarray.length === 0)
      {
        alert("В коллекции пока нет изображений!");
      }

      else {
      var zip = new JSZip();
      var img = zip.folder("images");
      var filename, imgData;
      var zipname = newarray[0].collection + ".zip";

      for(var i = 0; i<newarray.length; i++)  {

      filename = newarray[i].name + '.' + newarray[i].type;
        imgData = btoa(newarray[i].value);
      img.file(filename, imgData, {base64: true});
}

      zip.generateAsync({type:"blob"}).then(function(content) {
          saveAs(content, zipname);
      });
    }
  }


  render() {

    if(!Array.isArray(this.state.pics))
    {
      this.setState({pics: [this.state.pics]})
    }

  return(

<div>

<h1>Коллекции</h1>

<div id = "maincontent">

<div className = "inputfield">
<input type="text" className = "searchinput"  name="colname"
  placeholder="Введите название новой коллекции"
  value={this.state.colname}
  onChange={this.handleUserInput}  />
  <button className = "colbutton" onClick={this.addcoll}> Добавить колекцию! </button>
</div>

<br/>

{
this.state.pics.map((image, index) => {
  return (
    <div className="forcol">
    <h1>{this.state.collections[index+1]}</h1>
    <button className = "colopperations" onClick={() => this.delete(this.state.collections[index+1], index)}> Удалить колекцию </button>
    <button className = "colopperations" onClick={() => this.deleteALL(this.state.collections[index+1], index)}> Удалить колекцию со всеми картинками! </button>
    <button className = "colopperations" onClick={() => this.downloadzip(index)}> Скачать все картинки архивом! </button>
    <br/>

    <div className="gallery">
       <ul>
  {
    image.map((data, index) => {
          return(
      <div className = 'container'>
          <li key = {index.toString()} className = "galli"><a href={'/' + data.id}><img src={'data:image/' + data.type +';base64,' + btoa(data.value)} alt='' /></a>
            <span className='title'>{data.name}</span>
            <span className='text'>{data.desc}</span>
          </li>
      </div>
)})
}
</ul>
</div>
</div>

)})}


</div>
</div>

);
}

}

export default Collections;
