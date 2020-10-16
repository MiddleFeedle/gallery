import React from 'react';
import './home.css';
import IndexedDbRepository from '../db/connection';


class Home extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
        pics: [],
        readypics: [],
        search: this.props.search,
        searchtype: this.props.searchingtype,
        searchtagbool: this.props.tagbool,
        searchcolbool: this.props.colbool,
    };
  }




  componentDidMount() {

    document.title = "Галерея";


    this.dbtest = new IndexedDbRepository( 'Storage' );
    this.dbtest.findAll().then( pictures => this.setState( { pics: pictures } ) );

  if(this.state.searchtype === "tags" || this.state.searchtype === "collection")
  {
    this.search();
  }
    }



  handleUserInput = (e) => {
      const value = e.target.value;
      this.setState({search: value});
    }


  search = () =>
    {
    if(this.state.search === "")
      {
        this.dbtest.findAll().then( pictures => this.setState( { pics: pictures } ) );
      }

    else {
      this.dbtest.findByIndex(this.state.searchtype, this.state.search).then( pictures => this.setState( { pics: pictures } ) );
    }
    }


      colchange = (e) =>
      {
        this.setState({searchtype: e.target.value});
      }





  render() {

    if(!Array.isArray(this.state.pics))
    {
      this.setState({pics: [this.state.pics]})
    }



  return(

<div>

<h1>Чудо-галерея</h1>

<div id = "maincontent">

<div className = "inputfield">
<input type="text"  className="searchinput" name="name"
  placeholder="Начать поиск"
  value={this.state.search}
  onChange={this.handleUserInput}  />

  <select onChange = {this.colchange} className = "selectinput">
        <option value = "name">По названию</option>
        <option value = "tags" selected = {this.state.searchtagbool}>По тегу</option>
        <option value = "collection" selected = {this.state.searchcolbool}>По коллекции</option>
  </select>


</div>

  <div className = "inputfield">
  <button className = "searchbutton" onClick={this.search}> Поиск! </button>
  </div>

<br/>


<div className="gallery">
   <ul>

{
this.state.pics.map((pics, index) => {

          return(
      <div className = 'container'>
      <li key = {index} className = "galli"><a href={'/' + pics.id}><img src={'data:image/' + pics.type +';base64,' + btoa(pics.value)} alt='' /></a>
      <span className='title'>{pics.name}</span>
      <span className='text'>{pics.desc}</span>
</li>
</div>

)})
}

</ul>
</div>



</div>
</div>

);
}

}

export default Home;
