import React, { useEffect, useState } from 'react';
import EvolutionForm from './component/EvolutionForm/EvolutionForm.js';
import ChatInterface from './component/ChatInterface/ChatInterface.js';
import Thread from './component/Thread/Thread.js';
import Account from './component/Account/Account.js';
import './App.css';

function handleNavbarAnimation() {
  var tabsNewAnim = document.getElementById('navbar-animmenu');
  var activeItemNewAnim = tabsNewAnim.querySelector('.active');
  var activeWidthNewAnimWidth = activeItemNewAnim.offsetWidth;
  var itemPosNewAnimLeft = activeItemNewAnim.offsetLeft;

  var horiSelector = document.querySelector('.hori-selector');
  horiSelector.style.left = itemPosNewAnimLeft + "px";
  horiSelector.style.width = activeWidthNewAnimWidth + "px";

  tabsNewAnim.addEventListener("click", function (e) {
    var clickedItem = e.target.closest("li");
    if (clickedItem) {
      tabsNewAnim.querySelectorAll('li').forEach(function (item) {
        item.classList.remove("active");
      });
      clickedItem.classList.add('active');

      var activeWidthNewAnimWidth = clickedItem.offsetWidth;
      var itemPosNewAnimLeft = clickedItem.offsetLeft;
      horiSelector.style.left = itemPosNewAnimLeft + "px";
      horiSelector.style.width = activeWidthNewAnimWidth + "px";
    }
  });
}

function App() {
  useEffect(() => {
    handleNavbarAnimation();
  }, []);

  const [currentComponent, setCurrentComponent] = useState('Dashboard');

  const navigateTo = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div>
      <div id="navbar-animmenu">
        <ul className="show-dropdown main-navbar">
          <div className="hori-selector"><div className="left"></div><div className="right"></div></div>
          <li className={currentComponent === 'Dashboard' ? 'active' : ''} onClick={() => navigateTo('Dashboard')}><a href="javascript:void(0);"><i className="fas fa-tachometer-alt"></i>Dashboard</a></li>
          <li className={currentComponent === 'Account' ? 'active' : ''} onClick={() => navigateTo('Account')}><a href="javascript:void(0);"><i className="far fa-address-book"></i>Account</a></li>
          <li className={currentComponent === 'Thread' ? 'active' : ''} onClick={() => navigateTo('Thread')}><a href="javascript:void(0);"><i className="far fa-clone"></i>Thread</a></li>
          <li className={currentComponent === 'EvolutionForm' ? 'active' : ''} onClick={() => navigateTo('EvolutionForm')}><a href="javascript:void(0);"><i className="far fa-calendar-alt"></i>EvolutionForm</a></li>
        </ul>
      </div>
      <div className="app">
        {currentComponent === 'Dashboard' && <div>Dashboard Content Goes Here</div>}
        {currentComponent === 'Account' && <Account />}
        {currentComponent === 'Thread' && <Thread />}
        {currentComponent === 'EvolutionForm' && (
          <>
            <EvolutionForm />
            <ChatInterface />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
