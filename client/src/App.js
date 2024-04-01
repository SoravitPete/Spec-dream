import React, { useEffect, useState } from 'react';
import EvolutionForm from './component/EvolutionForm/EvolutionForm.js';
import ChatInterface from './component/ChatInterface/ChatInterface.js';
import Thread from './component/Thread/Thread.js';
import Account from './component/Account/Account.js';
import EvaluateForm from './component/Evaluate/EvaluateForm.js';
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
      horiSelector.style.left = itemPosNewAnimLeft + 4 + "px";
      horiSelector.style.width = activeWidthNewAnimWidth + 4 + "px";
    }
  });
}

function App() {
  useEffect(() => {
    handleNavbarAnimation();
  }, []);

  const [currentComponent, setCurrentComponent] = useState('Dashboard');
  const [evolutionResult, setEvolutionResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const components = {
    CPU: [
        {"name": "CPU1", "base_clock": 3.5, "cores": 4, "multi_threaded": false, "socket": "Socket1", "price": 200, "wattage": 100},
        {"name": "CPU2", "base_clock": 3.0, "cores": 8, "multi_threaded": true, "socket": "Socket2", "price": 300, "wattage": 100}
    ],
    RAM: [
        {"name": "RAM1", "capacity": 8, "rgb": true, "price": 100},
        {"name": "RAM2", "capacity": 16, "rgb": false, "price": 150}
    ],
    GPU: [
        {"name": "GPU1", "core_clock": 1400, "vram": 6, "price": 400},
        {"name": "GPU2", "core_clock": 1200, "vram": 8, "price": 500}
    ],
    Motherboard: [
        {"name": "Motherboard1", "formfactor": "ATX", "socket": "Socket1", "max_memory": 16, "price": 150},
        {"name": "Motherboard2", "formfactor": "Mini-ITX", "socket": "Socket2", "max_memory": 32, "price": 200}
    ],
    Casing: [
        {"name": "Casing1", "formfactor": "ATX", "rgb": true, "price": 80},
        {"name": "Casing2", "formfactor": "Mini-ITX", "rgb": false, "price": 60}
    ],
    PSU: [
        {"name": "PSU1", "wattage": 500, "price": 80},
        {"name": "PSU2", "wattage": 600, "price": 100}
    ]
};

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
        </ul>
      </div>
      <div className="app">
        {currentComponent === 'Dashboard' && <div>Dashboard Content Goes Here</div>}
        {currentComponent === 'Account' && <Account />}
        {currentComponent === 'Thread' && <Thread />}
        {currentComponent === 'EvolutionForm' && (
          <>
            <EvolutionForm onEvolutionResult={handleEvolutionResult} />
            <ChatInterface chatMessages={chatMessages} onChatMessage={handleChatMessage} evolutionResult={evolutionResult} />
          </>
        )}
        {currentComponent === 'EvaluateForm' && < EvaluateForm components={components} />}
      </div>
    </div>
  );
}

export default App;
