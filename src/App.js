import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [on, setOn] = useState(false);
  const [stOn, setStOn] = useState(false);
  const [last, setLast]=useState(0)
  let arr = useMemo(() => [], []);

  useEffect(() => {
    
    function fn(event) {
      if (!stOn) {
        setStOn(true);
      }
 
      arr.push(JSON.parse(event.data));
      setLast(v=>v+1)
    }

    const socket = new WebSocket(
      "wss://trade.trademux.net:8800/?password=1234"
    );

    if (on) {
      socket.addEventListener("message", fn);
    }

    return () => {
      socket.removeEventListener("message", fn);
    };
  }, [on, arr]);



  useEffect(() => {
    let summ = 0;
    let median;
    let arr = [...data];
    arr.sort((a, b) => a.value - b.value);

    arr.forEach((el, i) => {
      summ += el.value;
    });

    if (arr.length > 0) {
      if (arr.length % 2 !== 0) {
        median = arr[(arr.length - 1) / 2].value;
      } else {
        median =
          (arr[arr.length / 2 - 1].value + arr[arr.length / 2].value) / 2;
      }
    }

    let mean = (summ / arr.length).toFixed(2);
    let total = arr.reduce((t, el) => {
      return t + Math.pow(el.value - mean, 2);
    }, 0);
    let otk = Math.sqrt(total / (data.length - 1)).toFixed(2);

    if (summ) {
      setList((list) => [
        ...list,
        {
          id: data[data.length - 1].id,
          mean,
          otk,
          len: data.length,
          median,
          active: false
        },
      ]);
    }
  }, [data]);

  return (
    <div className="App">
      <div className="panel">
        <button
          onClick={(e) => {
            setOn(true);
          }}
          disabled={on}
        >
          Старт
        </button>
        <button
          disabled={!stOn}
          onClick={() => {
            setData([...arr]);
            setStOn(false);
          }}
        >
          Статистика
        </button>
        <button
          disabled={list.length < 1}
          onClick={() => {
            setList([]);
          }}
        >
          Очистит статистику
        </button>
        <span>Количество: {last}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>LAST ID</th>
            <th> Среднее значение</th>
            <th>Отклонение</th>
            <th>Медиана</th>
            <th>Моду</th>
            <th>Количество записей</th>
          </tr>
        </thead>

        <tbody>
          {list.map((el,i) => (
            <tr key={el.id} className={`${el.active?'activeTr': ''}`}
            onClick={()=>{
             let arr=[...list];
             arr.forEach((l,i)=>{
              if(l.id===el.id) arr[i].active=!l.active
             })
             setList(arr)
            }}>
              <td>{el.id}</td>
              <td>{el.mean}</td>
              <td>{el.otk}</td>
              <td>{el.median}</td>
              <td>-</td>
              <td>{el.len}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

// let ch = arr[0].value;
// let c = 0;
// let max = 0;
// if (ch === el.value) {
//   c++;
// } else {
//   max = max > c ? max : c;
//   c = 0;
//   ch = el.value;
// }
// max = max > c ? max : c;
