import React, { useEffect, useState } from 'react';
import EvolutionForm from './component/EvolutionForm/EvolutionForm.js';
import ChatInterface from './component/ChatInterface/ChatInterface.js';
import Thread from './component/Thread/Thread.js';
import Account from './component/Account/Account.js';
import EvaluateForm from './component/Evaluate/EvaluateForm.js';
import Dashboard from './component/Dashboard/Dashboard.js';
import './App.css';
import { components } from './componentData.js';

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
      horiSelector.style.left = itemPosNewAnimLeft + 4 + "px";
      horiSelector.style.width = activeWidthNewAnimWidth + 4 + "px";
    }
  });
}

function App() {
  const [accountName, setUsername] = useState('');

  useEffect(() => {
    handleNavbarAnimation();

    const storedUsername = localStorage.getItem('accountName');

    if (storedUsername) {
      setUsername(storedUsername);
    }

  }, []);

  const [currentComponent, setCurrentComponent] = useState('Dashboard');
  const [evolutionResult, setEvolutionResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateTo = (component) => {
    setCurrentComponent(component);
  };

  const handleEvolutionResult = (result) => {
    setEvolutionResult([...evolutionResult, result]);
  };

  const handleChatMessage = (message) => {
    setChatMessages([...chatMessages, message]);
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
          <li className={currentComponent === 'EvaluateForm' ? 'active' : ''} onClick={() => navigateTo('EvaluateForm')}><a href="javascript:void(0);"><i className="far fa-calendar-alt"></i>EvaluateForm</a></li>
          <li><a href="javascript:void(0);" onClick={() => navigateTo('Account')}>{accountName}</a></li>
        </ul>
      </div>
      <div className="app">
        {currentComponent === 'Dashboard' && <Dashboard />}
        {currentComponent === 'Account' && <Account isLoggedIn={isLoggedIn} />}
        {currentComponent === 'Thread' && <Thread />}
        {currentComponent === 'EvolutionForm' && (
          <>
            <EvolutionForm onEvolutionResult={handleEvolutionResult} />
            <ChatInterface chatMessages={chatMessages} onChatMessage={handleChatMessage} evolutionResult={evolutionResult} />
          </>
        )}
        {currentComponent === 'EvaluateForm' && <EvaluateForm components={components} />}
      </div>
    </div>
  );
}

export default App;
