import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://trade.trademux.net:8800/?password=1234"
    );

    // Соединение открыто
    socket.addEventListener("open", function (event) {
      socket.send("Hello Server!");
    });

    // Наблюдает за сообщениями
    // socket.addEventListener("message", function (event) {
    //   console.log(event);
    // });

    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
      setData((d) => {
        return [...d, JSON.parse(event.data)];
      });
    });
  }, []);

  // const data = [
  //   { year: "1991", value: 3 },
  //   { year: "1992", value: 4 },
  //   { year: "1993", value: 3.5 },
  //   { year: "1994", value: 5 },
  //   { year: "1995", value: 4.9 },
  //   { year: "1996", value: 6 },
  //   { year: "1997", value: 7 },
  //   { year: "1998", value: 9 },
  //   { year: "1999", value: 13 },
  // ];

  const config = {
    data,
    height: 600,
    xField: "id",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };
  return <Line {...config} />;
};
export default Page;

// Создаёт WebSocket - подключение.
