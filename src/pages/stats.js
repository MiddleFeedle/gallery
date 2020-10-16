import React from 'react';
import './home.css';
import IndexedDbRepository from '../db/connection';


class Stats extends React.Component

{
  constructor(props) {
    super(props);
    this.state = {
      max: 0,
      current: 0,
      percent: 0,
      totalammount: 0
    };
  }




  componentDidMount() {
    document.title = "Статистика";

    navigator.storage.estimate().then((estimate) => {
      this.setState({max: estimate.quota/1000000000});
      this.setState({current: estimate.usage/1000000000});
  });

  this.dbtest = new IndexedDbRepository( 'Storage' );
  this.dbtest.countALL().then( number => this.setState({totalammount: number}) );
    }

    clear = () =>
    {
      this.dbtest.clear().then( result => { alert("Все изображения были удалены");
      let colls = [null];
      localStorage.setItem("collections", JSON.stringify(colls));
      window.location = "/stats";
     } );
    }



  render() {
  return(

<div>

<h1>Статистика хранилища</h1>
<br/>
<div className = "inputfield">

<h1> Всего доступно {this.state.max} GB. (зависит от браузера)</h1>
<h1>Сейчас используется {this.state.current} GB.</h1>
<h1>В базе хранится {this.state.totalammount} картинок.</h1>

<button className = "searchbutton" onClick={this.clear}> Очистить хранилище! </button>

</div>
</div>

);
}

}

export default Stats;
