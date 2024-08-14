import { SafeArea, NavBar, TabBar } from 'antd-mobile';
import './App.css'
import styles from './header.module.less';

function App() {
    const back = () =>{

    }

    const tabs = [
        {
            key: '/home',
            title: 'Home',
        },
        {
            key: '/todo',
            title: 'Todo',
        },
        {
            key: '/message',
            title: 'Message',
        },
        {
            key: '/me',
            title: 'Me'
        },
    ]

    const Bottom = () => {
        return (
            <TabBar>
                {tabs.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                ))}
            </TabBar>
        )
    }

  return (
      <div className={styles.app}>
          <div style={{background: '#ace0ff'}}>
              <SafeArea position='top'/>
          </div>
          <div className={styles.top}>
              <NavBar>Navbar</NavBar>
          </div>
          <div className={styles.body}>
              body
          </div>
          <div className={styles.bottom}>
              <Bottom/>
          </div>

          <div style={{background: '#ffffff'}}>
              <SafeArea position='bottom'/>
          </div>
      </div>
  )
}

export default App
