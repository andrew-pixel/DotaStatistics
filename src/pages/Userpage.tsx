import React, { useState } from 'react';
import './Userpage.css';

function Userpage() {
  return (
    <Navbar>
    <NavItem icon="XD"/>
    <NavItem icon="caret">
      <p>"settings"<p/>  
    </NavItem>
    </Navbar>
  );
}

function Navbar(props){
  return (
    <nav className="navbar">
      <ul className="nav">{props.children} </ul>
    </nav>
  );
}

function NavItem(props){

  const [open, setOpen] = useState(false);
  return(
    <li className="navItem">
    <a href="#" className="iconButton" onClick={() => setOpen(!open)}>
      {props.icon}</a>

    {open && props.children}  
    </li>
  );
}

export default Userpage;
