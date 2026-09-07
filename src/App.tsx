import { useMemo, useState } from 'react'
import { FiActivity, FiBarChart2, FiBell, FiCalendar, FiChevronDown, FiClock, FiGrid, FiHeart, FiMenu, FiPlus, FiSearch, FiSettings, FiShield, FiTarget, FiTrendingUp, FiUsers, FiX, FiZap } from 'react-icons/fi'
import './App.css'

type Athlete = { id:string; name:string; team:'男生隊'|'女生隊'; grade:string; event:string; status:'正常'|'調整'|'重建'; load:number; tags:string[] }
type Session = { day:string; date:string; time:string; title:string; category:string; intensity:'低'|'中'|'高'; duration:number; blocks:string[] }

const athletes:Athlete[] = [
  {id:'A012',name:'林子翔',team:'男生隊',grade:'高二',event:'男單',status:'正常',load:78,tags:['速度型','網前積極']},
  {id:'A018',name:'陳信宇',team:'男生隊',grade:'高一',event:'男雙',status:'調整',load:64,tags:['後場進攻','右肩觀察']},
  {id:'A021',name:'王冠廷',team:'男生隊',grade:'高三',event:'男雙',status:'正常',load:85,tags:['前場封網','隊長']},
  {id:'A026',name:'吳品睿',team:'男生隊',grade:'高二',event:'男單',status:'重建',load:38,tags:['膝關節重建','返場 2/4']},
  {id:'A031',name:'黃宜庭',team:'女生隊',grade:'高二',event:'女單',status:'正常',load:74,tags:['防守反擊','多拍穩定']},
]

const sessions:Session[] = [
  {day:'一',date:'9/7',time:'16:00–18:30',title:'多球步伐 · 加速',category:'技術',intensity:'中',duration:150,blocks:['動態熱身 B','六點步伐 A','多球進攻 C']},
  {day:'二',date:'9/8',time:'16:00–18:00',title:'下肢力量 · 反應',category:'體能',intensity:'高',duration:120,blocks:['迷你頻帶 B','陷阱硬舉 A','燈號反應 C']},
  {day:'三',date:'9/9',time:'主動恢復',title:'恢復與個別課',category:'恢復',intensity:'低',duration:60,blocks:['活動度','呼吸放鬆']},
  {day:'四',date:'9/10',time:'16:00–18:30',title:'攻守轉換 · B 戰術',category:'戰術',intensity:'高',duration:150,blocks:['2 打 1','攻守轉換 B','限制區對抗']},
  {day:'五',date:'9/11',time:'14:00–17:00',title:'敏捷 · 速度 · 技術',category:'混合',intensity:'中',duration:180,blocks:['鬼抓人 C','敏捷階梯 B','10m 加速 A','網前對抗 D']},
]

const library = [
  {key:'熱身',icon:FiActivity,color:'cyan',items:['A 慢跑＋關節活動','B 動態伸展','C 鬼抓人','D 對抽熱身']},
  {key:'敏捷',icon:FiZap,color:'violet',items:['A 六角反應','B 敏捷階梯','C 鏡像移動','D 折返變向']},
  {key:'速度',icon:FiTrendingUp,color:'blue',items:['A 10m 加速','B 羽球步伐衝刺','C 電光起動','D 阻力帶加速']},
  {key:'力量',icon:FiBarChart2,color:'orange',items:['A 陷阱硬舉','B 保加利亞蹲','C 藥球旋轉抛','D 離心弓箭步']},
  {key:'戰術',icon:FiTarget,color:'green',items:['A 拉吊突擊','B 攻守轉換','C 雙打輪轉','D 發接發前三拍']},
  {key:'機能重建',icon:FiHeart,color:'red',items:['A 膝關節控制','B 肩胛穩定','C 踝關節本體感覺','D 返場移動']},
]

const nav = [
  ['dashboard','總覽',FiGrid],['athletes','選手管理',FiUsers],['schedule','訓練課表',FiCalendar],['library','課表資料庫',FiBarChart2],['cycles','週期管理',FiTrendingUp],['rebuild','機能重建',FiHeart],
] as const

function App(){
  const [active,setActive]=useState('dashboard'); const [team,setTeam]=useState<'男生隊'|'女生隊'>('男生隊'); const [query,setQuery]=useState(''); const [builder,setBuilder]=useState(false); const [mobile,setMobile]=useState(false); const [saved,setSaved]=useState(false)
  const [blocks,setBlocks]=useState<string[]>(()=>{const fallback=['C 鬼抓人','B 敏捷階梯','A 10m 加速','D 網前對抗'];const draft=localStorage.getItem('ams-friday-draft');if(!draft)return fallback;try{return JSON.parse(draft)}catch{return fallback}})
  const saveDraft=()=>{localStorage.setItem('ams-friday-draft',JSON.stringify(blocks));setSaved(true)}
  const visible=useMemo(()=>athletes.filter(a=>a.team===team&&`${a.name}${a.event}${a.tags}`.includes(query)),[team,query])
  const add=(item:string)=>{setBlocks(v=>v.includes(item)?v:[...v,item]);setSaved(false)}
  return <div className="shell">
    <aside className={mobile?'sidebar open':'sidebar'}>
      <div className="brand"><b><FiActivity/></b><div><strong>AMS</strong><span>Athletic Intelligence</span></div><button onClick={()=>setMobile(false)}><FiX/></button></div>
      <div className="club"><i>同</i><div><span>目前隊伍</span><strong>大同高中羽球隊</strong></div><FiChevronDown/></div>
      <nav><small>工作台</small>{nav.map(([id,label,Icon])=><button className={active===id?'active':''} key={id} onClick={()=>{setActive(id);setMobile(false)}}><Icon/><span>{label}</span>{id==='rebuild'&&<i>2</i>}</button>)}</nav>
      <div className="side-bottom"><button><FiShield/>健康與權限</button><button><FiSettings/>系統設定</button><div className="coach"><i>張</i><div><strong>張家豪 教練</strong><span>總教練 · 管理員</span></div></div></div>
    </aside>{mobile&&<button className="scrim" onClick={()=>setMobile(false)}/>} 
    <main><header className="top"><button className="menu" onClick={()=>setMobile(true)}><FiMenu/></button><label className="search"><FiSearch/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜尋選手、課表或訓練項目…"/><kbd>⌘ K</kbd></label><button className="bell"><FiBell/><i/></button><span className="sync"><i/>資料已同步</span></header>
      <div className="content"><section className="heading"><div><small>2026 學年度 · 第 3 週</small><h1>早安，張教練 👋</h1><p>本週訓練負荷穩定，有 2 位選手需要關注恢復狀態。</p></div><button className="primary" onClick={()=>setBuilder(true)}><FiPlus/><span>新增訓練課表</span></button></section>
        <section className="metrics">
          <article><i className="purple"><FiUsers/></i><div><span>隊伍選手</span><strong>28</strong><small><b>+2</b> 較上學期</small></div><em>林 陳 王</em></article>
          <article><i className="cyan"><FiActivity/></i><div><span>本週平均負荷</span><strong>72<sup>%</sup></strong><small><b>理想區間</b> 65–80%</small></div><em className="ring">72</em></article>
          <article><i className="orange"><FiClock/></i><div><span>本週訓練量</span><strong>11.5<sup> hr</sup></strong><small><b>+1.5 hr</b> 較上週</small></div><em className="bars">▂▅▃▇▆█</em></article>
          <article><i className="red"><FiHeart/></i><div><span>需關注選手</span><strong>2</strong><small>陳信宇 · 吳品睿</small></div><em>→</em></article>
        </section>
        <div className="dashboard"><section className="panel weekly"><PanelHead title="本週訓練課表" sub="9 月 7 日 — 9 月 13 日"><div className="switch"><button className={team==='男生隊'?'on':''} onClick={()=>setTeam('男生隊')}>男生隊</button><button className={team==='女生隊'?'on':''} onClick={()=>setTeam('女生隊')}>女生隊</button></div><button className="link">完整課表 →</button></PanelHead>
          <div className="week-list">{sessions.map(s=><article key={s.day}><div className={s.day==='四'?'day today':'day'}><small>週{s.day}</small><strong>{s.date.split('/')[1]}</strong></div><div className="session"><div><span className={'cat '+s.category}>{s.category}</span><strong>{s.title}</strong></div><p><FiClock/> {s.time} · {s.duration} 分鐘</p><footer>{s.blocks.map(x=><i key={x}>{x}</i>)}</footer></div><span className={'level '+s.intensity}><i/>{s.intensity}強度</span><button onClick={()=>setBuilder(true)}>⋯</button></article>)}</div>
        </section><aside className="right">
          <section className="panel cycle"><PanelHead title="週期進度" sub="秋季聯賽準備期"/><div className="cycle-main"><div className="cycle-ring"><span><b>3</b>/ 8 週</span></div><div><strong>中週期 1</strong><p>體能建立期</p><small>9/1 — 10/25</small></div></div><div className="phases"><span>適應</span><span>建立</span><span>轉換</span><span>競賽</span></div><div className="focus"><small>本週重點</small><strong>下肢力量 · 加速能力</strong><p>體能 45% / 技戰術 55%</p></div></section>
          <section className="panel recovery"><PanelHead title="恢復追蹤" sub="今日建議"/>{athletes.filter(a=>a.status!=='正常').map(a=><div className="person" key={a.id}><i>{a.name[0]}</i><div><strong>{a.name}</strong><span>{a.tags[1]}</span></div><b className={a.status}>{a.status}</b></div>)}<button className="secondary">開啟機能重建區</button></section>
        </aside></div>
        <section className="panel library"><PanelHead title="訓練模組資料庫" sub="已建立 79 個可重複使用的訓練模組"><button className="link">管理資料庫 →</button></PanelHead><div className="library-grid">{library.map(({key,icon:Icon,color,items})=><button key={key} onClick={()=>setBuilder(true)}><i className={color}><Icon/></i><div><strong>{key}</strong><span>{items.length*3+2} 種訓練方式</span></div><em>↗</em></button>)}</div></section>
        <section className="panel athlete"><PanelHead title={`${team}選手快速概覽`} sub="基本資料、教練標記與本週負荷"><button className="secondary"><FiPlus/>建立選手</button></PanelHead><div className="table"><header><span>選手</span><span>主項</span><span>教練標記</span><span>負荷</span><span>狀態</span></header>{visible.map(a=><div className="row" key={a.id}><div><i>{a.name[0]}</i><span><strong>{a.name}</strong><small>{a.id} · {a.grade}</small></span></div><span>{a.event}</span><div className="tags">{a.tags.map(t=><i key={t}>{t}</i>)}</div><div className="load"><span><i style={{width:a.load+'%'}}/></span><b>{a.load}%</b></div><b className={'status '+a.status}>{a.status}</b></div>)}</div></section>
      </div>
    </main>
    {builder&&<div className="modal"><button className="modal-bg" onClick={()=>setBuilder(false)}/><section role="dialog" aria-modal="true" aria-labelledby="builder-title"><header><div><p>大同高中 · 男生隊</p><h2 id="builder-title">新增訓練課表</h2></div><button onClick={()=>setBuilder(false)}><FiX/></button></header><main><div className="fields"><label>日期<input type="date" defaultValue="2026-09-11"/></label><label>開始<input type="time" defaultValue="14:00"/></label><label>結束<input type="time" defaultValue="17:00"/></label></div><div className="summary"><FiClock/><div><strong>週五訓練 · 180 分鐘</strong><span>熱身 20 分 · 主訓練 135 分 · 整理 25 分</span></div></div><div className="builder-grid"><div className="picker"><h3>1. 從資料庫加入</h3><p>點選項目即可加入訓練流程</p>{library.slice(0,5).map(({key,items,icon:Icon,color})=><details key={key} open={key==='熱身'}><summary><i className={color}><Icon/></i><strong>{key}</strong><FiChevronDown/></summary><div>{items.map(item=><button onClick={()=>add(item)} key={item}><FiPlus/>{item}</button>)}</div></details>)}</div><div className="timeline"><h3>2. 訓練流程</h3><p>訓練模組與時間配置</p>{blocks.map((b,i)=><div className="block" key={b}><i>{i+1}</i><div><strong>{b}</strong><span>{i===0?'熱身 · 20 分鐘':'主訓練 · 30 分鐘'}</span></div><button onClick={()=>setBlocks(v=>v.filter((_,x)=>x!==i))}><FiX/></button></div>)}</div></div></main><footer><span>{saved?'✓ 草稿已儲存在這台裝置':`已安排 ${blocks.length} 個訓練模組`}</span><div><button className="secondary" onClick={saveDraft}>儲存草稿</button><button className="primary" onClick={()=>{saveDraft();setTimeout(()=>setBuilder(false),300)}}>建立課表</button></div></footer></section></div>}
  </div>
}

function PanelHead({title,sub,children}:{title:string;sub:string;children?:React.ReactNode}){return <header className="panel-head"><div><h2>{title}</h2><p>{sub}</p></div>{children}</header>}
export default App
