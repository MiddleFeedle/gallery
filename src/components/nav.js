import React from 'react';
import './nav.css';


function Nav()
{
  return  (
    <div className = "NavDiv">

    <ul className = "navul">
    	<li className = "navli"><a href="/">Home</a></li>
    	<li className = "navli"><a href="/collections">Collections</a></li>
    	<li className = "navli"><a href="/addpicture">Upload</a></li>
      <li className = "navli"><a href="/stats">Statistics</a></li>
    </ul>

    </div>
  );

}

export default Nav;
